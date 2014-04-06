simple_code_txt = '\na=5               \nfor x in range(a):\n    print(x)      \nprint("Happy end")\n';
ifelifelse_code_txt = '\na=5\nif a > 8:\n    print("good)\nelif a >= 5:\n    print("not bad")\nelse:\n    print("bad")\nprint("Happy end")\n';
simple_result_txt = '\n_tp(1)\na=5\n_tp(2)\nfor x in range(a):\n    _tp(3)\n    print(x)\n    _tp(2)\n_tp(4)    \nprint("Happy end")\n';
big_code_txt = '\ndef fun(x):\n    s=x*2\n    print(x)\n    return(s)\n\na=5\nstuff = []\nfor x in range(a):\n    print("loop")\n    if x%2==0:\n        stuff.append(x)\n    else:\n        fun(x)\nprint("Happy end")\nprint( stuff )\n';
innerSameLine_code_txt = "\nfor x in range(5):    print(x)\n";
rchop_by_set = function(args, kwargs) {
  if (args instanceof Array && {}.toString.call(kwargs) === '[object Object]' && ( arguments.length ) == 2) {
    /*pass*/
  } else {
    args = Array.prototype.slice.call(arguments);
    kwargs = Object();
  }
  var __sig__, __args__;
  __sig__ = { kwargs:Object(),args:__create_array__("mystr", "separators") };
  __args__ = get_arguments(__sig__, args, kwargs);
  var mystr = __args__['mystr'];
  var separators = __args__['separators'];
  " helps to split into 2 parts without using regexp (as not sure if Brython supports re) ";
  var i, __iterator__0;
  ;
  i = 0;
  while (( i ) < __get__(len, "__call__")([mystr], __NULL_OBJECT__)) {
    if (__get__(__get__(separators, "__contains__"), "__call__")([__get__(mystr, "__getitem__")([i], Object())], Object())) {
      return __get__(mystr, "__getslice__")([undefined, i, undefined], Object());
    }
    i += 1;
  }
}

rchop_by_set.NAME = "rchop_by_set";
rchop_by_set.args_signature = ["mystr", "separators"];
rchop_by_set.kwargs_signature = {  };
rchop_by_set.types_signature = {  };
rchop_by_set.pythonscript_function = true;
code_txt = ifelifelse_code_txt;
code_txt = __replace_method(code_txt, "	", "    ");
DBG = true;
TRACECALL_NAME = "_tp";
lines = __get__(code_txt, "split")("\n");
var __args_0, __kwargs_0;
__args_0 = [];
__kwargs_0 = {"cause": "", "cause_lineno": 0, "indent": ""};
indentation_stack = [__get__(dict, "__call__")(__args_0, {"pointer": __kwargs_0})];
tracecalls = [];
var nr;
nr = 0;
var line, __iterator__1;
__iterator__1 = __get__(__get__(lines, "__iter__"), "__call__")([], Object());
var __next__1;
__next__1 = __get__(__iterator__1, "next");
while (( __iterator__1.index ) < __iterator__1.length) {
  line = __next__1();
  if (! (__get__(__get__(line, "strip"), "__call__")([" 	\n\n"], __NULL_OBJECT__))) {
    continue
  }
  line_wo_indent = __get__(__get__(line, "lstrip"), "__call__")([" 	"], __NULL_OBJECT__);
  indent = __get__(line, "__getslice__")([undefined, - (__get__(len, "__call__")([line_wo_indent], __NULL_OBJECT__)), undefined], Object());
  first_word = rchop_by_set([line, ' 	([{:'"\\'], __NULL_OBJECT__);
  if (( __get__(__get__(indentation_stack, "__getitem__")([-1], Object()), "__getitem__")(["indent"], Object()) ) == null) {
    __get__(__get__(__get__(indentation_stack, "__getitem__")([-1], Object()), "__setitem__"), "__call__")(["indent", indent], Object());
  }
  if (tracecalls && ( __get__(__get__(tracecalls, "__getitem__")([-1], Object()), "__getitem__")(["indent"], Object()) ) === null) {
    __get__(__get__(__get__(tracecalls, "__getitem__")([-1], Object()), "__setitem__"), "__call__")(["indent", indent], Object());
  }
  if (__get__(__get__(__split_method("for while if elif else def class try except with"), "__contains__"), "__call__")([first_word], Object())) {
    if (__get__(__get__(__split_method("else elif"), "__contains__"), "__call__")([first_word], Object())) {
      when = "after";
    } else {
      when = "before";
    }
    var __args_1, __kwargs_1;
    __args_1 = [];
    __kwargs_1 = {"when": when, "place_lineno": nr, "target_lineno": nr, "indent": null, "cause": first_word};
    __get__(__get__(tracecalls, "append"), "__call__")([__get__(dict, "__call__")(__args_1, {"pointer": __kwargs_1})], __NULL_OBJECT__);
    var __args_2, __kwargs_2;
    __args_2 = [];
    __kwargs_2 = {"cause": first_word, "cause_lineno": nr, "indent": null};
    __get__(__get__(indentation_stack, "append"), "__call__")([__get__(dict, "__call__")(__args_2, {"pointer": __kwargs_2})], __NULL_OBJECT__);
  } else {
    var __args_3, __kwargs_3;
    __args_3 = [];
    __kwargs_3 = {"when": "before", "place_lineno": nr, "target_lineno": nr, "indent": indent};
    __get__(__get__(tracecalls, "append"), "__call__")([__get__(dict, "__call__")(__args_3, {"pointer": __kwargs_3})], __NULL_OBJECT__);
  }
  if (__get__(__get__(indentation_stack, "__getitem__")([-1], Object()), "__getitem__")(["indent"], Object())) {
    while (( indent ) < __get__(__get__(indentation_stack, "__getitem__")([-1], Object()), "__getitem__")(["indent"], Object())) {
      last_indent = __jsdict_pop(indentation_stack);
      if (__get__(__get__(__split_method("for while"), "__contains__"), "__call__")([__get__(last_indent, "__getitem__")(["cause"], Object())], Object())) {
        var __args_4, __kwargs_4;
        __args_4 = [];
        __kwargs_4 = {"when": "after", "place_lineno": (nr - 1), "target_lineno": __get__(last_indent, "__getitem__")(["cause_lineno"], Object()), "indent": __get__(last_indent, "__getitem__")(["indent"], Object())};
        __get__(__get__(tracecalls, "append"), "__call__")([__get__(dict, "__call__")(__args_4, {"pointer": __kwargs_4})], __NULL_OBJECT__);
      }
    }
  }
  nr += 1;
}
console.log("\n#--------- Trace Calls -------------");
var x, __iterator__2;
__iterator__2 = __get__(__get__(tracecalls, "__iter__"), "__call__")([], Object());
var __next__2;
__next__2 = __get__(__iterator__2, "next");
while (( __iterator__2.index ) < __iterator__2.length) {
  x = __next__2();
  console.log(["#", x]);
}
construct_result = function(args, kwargs) {
  var restructured_tracecalls, result, key;
  restructured_tracecalls = __get__(dict, "__call__")([[]], Object());
  var tc, __iterator__3;
  __iterator__3 = __get__(__get__(tracecalls, "__iter__"), "__call__")([], Object());
  var __next__3;
  __next__3 = __get__(__iterator__3, "next");
  while (( __iterator__3.index ) < __iterator__3.length) {
    tc = __next__3();
    key = __get__(tc, "__getitem__")(["place_lineno"], Object());
    if (! (__get__(__get__(restructured_tracecalls, "__contains__"), "__call__")([key], Object()))) {
      __get__(__get__(restructured_tracecalls, "__setitem__"), "__call__")([key, __get__(dict, "__call__")([[{"key": "before", "value": []}, {"key": "after", "value": []}]], Object())], Object());
    }
    var __args_5, __kwargs_5;
    __args_5 = [];
    __kwargs_5 = {"indent": __get__(tc, "__getitem__")(["indent"], Object()), "target_lineno": __get__(tc, "__getitem__")(["target_lineno"], Object())};
    __get__(__get__(__get__(__dict___getitem__([restructured_tracecalls, key], Object()), "__getitem__")([__get__(tc, "__getitem__")(["when"], Object())], Object()), "append"), "__call__")([__get__(dict, "__call__")(__args_5, {"pointer": __kwargs_5})], __NULL_OBJECT__);
  }
    var repr_tracepoint = function(args, kwargs) {
    if (args instanceof Array && {}.toString.call(kwargs) === '[object Object]' && ( arguments.length ) == 2) {
      /*pass*/
    } else {
      args = Array.prototype.slice.call(arguments);
      kwargs = Object();
    }
    var __sig__, __args__;
    __sig__ = { kwargs:Object(),args:__create_array__("tc") };
    __args__ = get_arguments(__sig__, args, kwargs);
    var tc = __args__['tc'];
    return __add_op(__add_op(__get__(tc, "__getitem__")(["indent"], Object()), TRACECALL_NAME), __sprintf("( %s )", __get__(tc, "__getitem__")(["target_lineno"], Object())));
  }

  repr_tracepoint.NAME = "repr_tracepoint";
  repr_tracepoint.args_signature = ["tc"];
  repr_tracepoint.kwargs_signature = {  };
  repr_tracepoint.types_signature = {  };
  repr_tracepoint.pythonscript_function = true;
  result = [];
  var nr;
  nr = 0;
  var line, __iterator__4;
  __iterator__4 = __get__(__get__(lines, "__iter__"), "__call__")([], Object());
  var __next__4;
  __next__4 = __get__(__iterator__4, "next");
  while (( __iterator__4.index ) < __iterator__4.length) {
    line = __next__4();
    if (__get__(__get__(restructured_tracecalls, "__contains__"), "__call__")([nr], Object())) {
      var __iterator__5;
      __iterator__5 = __get__(__get__(__get__(__dict___getitem__([restructured_tracecalls, nr], Object()), "__getitem__")(["before"], Object()), "__iter__"), "__call__")([], Object());
      var __next__5;
      __next__5 = __get__(__iterator__5, "next");
      while (( __iterator__5.index ) < __iterator__5.length) {
        tc = __next__5();
        __get__(__get__(result, "append"), "__call__")([__get__(repr_tracepoint, "__call__")([tc], __NULL_OBJECT__)], __NULL_OBJECT__);
      }
    }
    if (__test_if_true__(DBG)) {
      line += __add_op((" " * (20 - __get__(len, "__call__")([line], __NULL_OBJECT__))), __sprintf("# %s", nr));
    }
    __get__(__get__(result, "append"), "__call__")([line], __NULL_OBJECT__);
    if (__get__(__get__(restructured_tracecalls, "__contains__"), "__call__")([nr], Object())) {
      var __iterator__6;
      __iterator__6 = __get__(__get__(__get__(__dict___getitem__([restructured_tracecalls, nr], Object()), "__getitem__")(["after"], Object()), "__iter__"), "__call__")([], Object());
      var __next__6;
      __next__6 = __get__(__iterator__6, "next");
      while (( __iterator__6.index ) < __iterator__6.length) {
        tc = __next__6();
        __get__(__get__(result, "append"), "__call__")([__get__(repr_tracepoint, "__call__")([tc], __NULL_OBJECT__)], __NULL_OBJECT__);
      }
    }
    nr += 1;
  }
  return __get__(__get__("\n", "join"), "__call__")([result], __NULL_OBJECT__);
}

construct_result.NAME = "construct_result";
construct_result.args_signature = [];
construct_result.kwargs_signature = {  };
construct_result.types_signature = {  };
construct_result.pythonscript_function = true;
console.log("\n#--------- code with TracePoint calls -------------\n\n");
TRACECALL_CODE = [];
console.log(TRACECALL_CODE);
console.log("\n#--------- TracePoints Injected  -------------");
console.log(construct_result());
