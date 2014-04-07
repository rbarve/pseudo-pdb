
# simple
simple_code_txt = """
a=5               
for x in range(a):
    print(x)      
print("Happy end")
"""

# if elif else
ifelifelse_code_txt = """
a=5
if a > 8:
    print("good)
elif a >= 5:
    print("not bad")
else:
    print("bad")
print("Happy end")
"""

# result simple
simple_result_txt ="""
_tp(1)
a=5
_tp(2)
for x in range(a):
    _tp(3)
    print(x)
    _tp(2)
_tp(4)    
print("Happy end")
"""

# big
big_code_txt = """
def fun(x):
    s=x*2
    print(x)
    return(s)

a=5
stuff = []
for x in range(a):
    print("loop")
    if x%2==0:
        stuff.append(x)
    else:
        fun(x)
print("Happy end")
print( stuff )
"""

# simple - inner code on same line  -- not done - TODO
innerSameLine_code_txt = """
for x in range(5):    print(x)
"""


########################################################################
#                   Utils
########################################################################
def rchop_by_set( mystr, separators ):
    """ helps to split into 2 parts without using regexp (as not sure if Brython supports re) """
    for i in range(len(mystr)):
        if mystr[i] in separators:
            return mystr[:i] # return only first part


########################################################################
#               The Code parsing and so on            
########################################################################

#~ code_txt = simple_code_txt
code_txt = ifelifelse_code_txt
code_txt = code_txt.replace('\t', '    ') #get rid of tabs :)

DBG = True

# many underscores at beginning helps - original code be seen better 
#~ TRACECALL_NAME = '_'*30*DBG + '_tracepoint'
TRACECALL_NAME =  '_tp'

lines = code_txt.split('\n')

indentation_stack = [ dict(cause='', cause_lineno=0, indent='') ]
tracecalls = [   ]  # dict( when='before|after', place_lineno=, target_lineno=.., indent=.. )

for nr, line in enumerate(lines):
    if not line.strip(' \t\n\r'):  # if empty line
        continue
        
    line_wo_indent = line.lstrip(' \t')    # line without indent
    indent = line[:-len(line_wo_indent)]
    #TODO -- guarantee that it takes first word OK 
    #~ first_word = line and line_wo_indent.split()[0] # was a bug with "else:"
    first_word = rchop_by_set(line, ' \t([{:\'"\\') 

    if indentation_stack[-1]['indent'] == None:  # if it was'nt set/known 
        indentation_stack[-1]['indent'] = indent
        
    if tracecalls and tracecalls[-1]['indent'] is None: # and  tracecalls[-1]['when']=='after' 
        tracecalls[-1]['indent'] = indent
        
    if first_word in 'for while if elif else def class try except finally with'.split():
        
        if first_word in 'else elif except finally'.split():
            when='after'
        else:
            when='before'
            
        tracecalls.append(
            dict(
                when=when,
                place_lineno=nr,
                target_lineno=nr,
                indent=indent if when=='before' else None,
                cause=first_word,
            )
        )

        indentation_stack.append(  dict( cause=first_word, cause_lineno=nr, indent=None )  )


    else:  # for ordinary statements
       tracecalls.append(
            dict(
                when='before',
                place_lineno=nr,
                target_lineno=nr,
                indent=indent 
            )
        )

    # check unindent
    if indentation_stack[-1]['indent']:
        while indent < indentation_stack[-1]['indent']:
            last_indent = indentation_stack.pop()
            if last_indent['cause'] in 'for while'.split():   # TODO: "for" might not be needed here (though in C++ it should)
                tracecalls.append(
                    dict(  # could inject "before current nr" but, less confusion -- "after previous nr"
                        when='after',
                        place_lineno=nr-1,  # might happen to be empty line -- but it's ok
                        target_lineno=last_indent['cause_lineno'],
                        indent=last_indent['indent']
                    )
                )

#~ print ('\n'.join( [ "%s: %s"(nr, line) for (nr, line) in enumerate(lines)])  )
#~ for x in [ "%s: %s" % (nr, line) for nr, line in enumerate(lines)]:
    #~ print(x)

print('\n#--------- Trace Calls -------------')
for x in tracecalls:
    print ("#", x)
    
def construct_result():

    # for each line -- separate, what goes before, what -- after
    restructured_tracecalls = {} 
    
    for tc in tracecalls:
        key = tc['place_lineno']
        if not key in restructured_tracecalls:
            restructured_tracecalls[key] = {'before':[], 'after':[] }
        restructured_tracecalls[key][tc['when']].append( dict(
                indent=tc['indent'],
                target_lineno=tc['target_lineno'])
        )


    def repr_tracepoint( tc ):
        return tc['indent'] + TRACECALL_NAME +  '( %s )'%tc['target_lineno']

         
    result = []
    for nr, line in enumerate(lines):
        # before
        if nr in restructured_tracecalls:  
            for tc in restructured_tracecalls[nr]['before']:
                result.append(  repr_tracepoint( tc ) )

        # the line
        if DBG:
            line += ' '*(20-len(line)) +'# %s'%nr  # add line original numbers
        result.append( line )
        
            

        # after
        if nr in restructured_tracecalls: 
            for tc in restructured_tracecalls[nr]['after']:
                result.append( repr_tracepoint( tc )  )

    return '\n'.join(result)


print ('\n#--------- code with TracePoint calls -------------\n\n')


# doesn't work with pythonjs translator.py...
TRACECALL_CODE = (
"original_code = \"\"\"%s\"\"\"\n\n" % code_txt  +
"original_code_lines = original_code.split('\\n') \n\n" % lines  +
"STEPS = True \n\n" +
"def %s( lineno ): \n" %TRACECALL_NAME  +
"""
    if STEPS:
        # highlight( lineno )
        print ("\\n------------ %s --------------" % lineno)
        for nr, line in enumerate(original_code_lines):
            if nr == lineno:
                prefix = '->   '
            else:
                prefix = '     '
            print ( prefix + line )                
        print ("-----------------------------" )
        
"""
)

print( TRACECALL_CODE )

print('\n#--------- TracePoints Injected  -------------')

print( construct_result() )
