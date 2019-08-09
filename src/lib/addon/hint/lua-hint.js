// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
    mod(CodeMirror);
})(function(CodeMirror) {
  var Pos = CodeMirror.Pos;
  function getToken(e, cur) {
      return e.getTokenAt(cur);
  }
  function luaHint(editor, options) {
    let cursor = editor.getCursor();
    let line = editor.getLine(cursor.line);
    let wz = line.lastIndexOf(' ') + 1;
    let lineText = line.substring(wz, cursor.ch);
    if (!(lineText && /[a-zA-Z\.]/.test(lineText[lineText.length - 1]))) return;
    let token = getToken(editor, cursor);
    if (/\b(?:string|comment)\b/.test(token.type)) return;
    let keys = lineText.split("."),
        _ch = keys.length ? keys[keys.length - 1].length : 0,
        ch = cursor.ch - _ch;
    return {
        list: getCompletions_lua(lineText, options),
        from: Pos(cursor.line, ch),
        to: Pos(cursor.line, cursor.ch)
    };
  };
  CodeMirror.registerHelper("hint", "lua", luaHint);

  function getCompletions_lua(strPath, options) {
      let global = options.globalScope.lua || options.globalScope,
          strKeys = strPath.split('.');
      if (strKeys.length > 1) {
          for (let i=0, j=0; i < strKeys.length; i++) {
              if (global[strKeys[i]]) {
                  j = i;
                  global = global[strKeys[i]];
              } else {
                  if ((i - 1) === j) {
                      let obj = {};
                      for (let key in global) {
                          let reg = new RegExp(`^${strKeys[i]}`);
                          if (reg.test(key)) {
                              obj[key] = null;
                          }
                      }
                      global = obj;
                  } else {
                      global = {};
                  }
              }
          }
      } else {
          let obj = {};
          for (let key in global) {
              let reg = new RegExp(`^${strKeys[0]}`);
              if (reg.test(key)) {
                  obj[key] = null;
              }
          }
          global = obj;
      }
      return strKeys.length ? Object.keys(global) : [];
  }
});
