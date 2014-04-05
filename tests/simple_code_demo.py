#--------- code with TracePoint calls -------------


original_code = """
a=5               
for x in range(a):
    print(x)      
print("Happy end")
"""

original_code_lines = original_code.split('\n') 

STEPS = True 

def _tp( lineno ): 

    if STEPS:
        # highlight( lineno )
        print("\n–––––––––––– %s ––––––––––––––" % lineno)
        for nr, line in enumerate(original_code_lines):
            if nr == lineno:
                prefix = '->   '
            else:
                prefix = '     '
            print( prefix + line )                
        print("–––––––––––––––––––––––––––––" )
        


#--------- TracePoints Injected  -------------
                    # 0
_tp( 1 )
a=5                 # 1
_tp( 2 )
for x in range(a):  # 2
    _tp( 3 )
    print(x)        # 3
    _tp( 2 )
_tp( 4 )
print("Happy end")  # 4
                    # 5
