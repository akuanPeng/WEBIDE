import React, { Component } from 'react';
import Routes from './routes.jsx'
import EditorImg from './editor_img.jsx'

class CodeEditor extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.code_editor = store.content.middle.center.ide.code_editor;
        this.isSave = true;
        this.cursor = null;
    }
    render() {
        return (
            <code_editor className={this.code_editor.tabLen ? '' : 'hidden'} onContextMenu={this.handleContextMenu.bind(this)} onDragOver={this.handleDragOver.bind(this)}>
                <textarea ref="codemirror"></textarea>
                <Routes state={ this.code_editor.routes } />
                <EditorImg state={ this.code_editor.editor_img } />
            </code_editor>
        );
    }
    componentDidUpdate() {
        // 获得文件类型
        let tabs = store.content.middle.center.ide.tabs,
            tab_active = tabs.list[tabs.active],
            bottom = store.content.bottom;
        if (tab_active) {
            let file = tab_active.name.split('.'),
                type = file.length > 1 ? file.pop().toUpperCase() : 'AUTO',
                modes = {
                    LUA: 'lua',
                    NODE: 'javascript/nodejs',
                    JS: 'javascript',
                    HTM: 'application/x-htm',
                    CSS: 'css',
                    HTML: 'application/x-html',
                    EJS: 'application/x-ejs',
                    JSON: 'application/json',
                    ESLINTRC: 'application/json'
                };
            const fNode = tab_active.paths[1];
            bottom.active = fNode == 'utils' || fNode == 'controllers' || fNode == 'filters' ? 'NodeJS' : type;
            window.lang = bottom.active;
            bottom.setState(bottom);
            editor.setOption("mode", modes[type] || type.toLowerCase());
            editor.setOption('extraKeys', {
                Tab: function(cm) {
                    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces);
                }
            })
        }
    }
    componentDidMount() {
        // 初始化编辑器
        window.editor = CodeMirror.fromTextArea(this.refs.codemirror, {
            lineNumbers: true,
            mode: "application/x-text",
            indentUnit: 4,
            theme: "skin",
            gutters: [
                "CodeMirror-lint-markers",
                "CodeMirror-linenumbers",
                "CodeMirror-foldgutter"
            ],
            // 按键快捷键
            keyMap: "sublime",
            lint: true,
            foldGutter: true,
            autoCloseTags: true,
            autoCloseBrackets: true
        });
        // 注册编辑内容改变事件
        editor.on("change", this.handleEditorChange.bind(this));
        // 注册键入内容事件
        editor.on("keyup", this.handleEditorKeyUp.bind(this));
        // 注册滚动条滚动事件
        editor.on("scroll", this.handleEditorScroll.bind(this));
        // 注册获取光标事件
        editor.on("cursorActivity", this.handleCursorActivity.bind(this));
        // 注册保存事件
        CodeMirror.commands.save = this.handleSaveFileContent.bind(this);
        CodeMirror.commands.format = this.handleFormat.bind(this);
        CodeMirror.commands.copy = this.handeleCopy.bind(this);
        CodeMirror.commands.cut = this.handeleCut.bind(this);
        CodeMirror.commands.copyPath = this.handeleCopyPath.bind(this);
        CodeMirror.commands.checkAll = this.handeleCheckAll.bind(this);
        CodeMirror.commands.allSave = this.handleAllSaveFileContent.bind(this);
        CodeMirror.commands.goToBracket = (cm) => {
            cm.foldCode(cm.getCursor());
        };
        // 字体放大缩小
        window.addEventListener("mousewheel", function(e){
            if (e.ctrlKey) {
                // 向上
                if (e.wheelDelta > 0) {
                    $(".CodeMirror").css("font-size", parseInt($(".CodeMirror").css("font-size")) + 1);
                } else {
                    $(".CodeMirror").css("font-size", parseInt($(".CodeMirror").css("font-size")) - 1);
                }
                editor.refresh();
                e.preventDefault();
            }
        },  false);
        // 绑定选择事件
        let selector = ".CodeMirror-line > span > .cm-html-open:contains('<%') + .cm-operator:contains('-') + .cm-variable:contains('include') + .cm-string";
        $("code_editor").delegate(selector, 'mousemove', (e) => {
            e = window.event || e;
            let key= e.keyCode || e.which;
            if (e.ctrlKey) {
                $(e.target).attr('title', '点我打开文件').css({"cursor": "pointer", "color": "#9b4dff", "text-decoration": "underline"});
            }
        }).delegate(selector, 'mouseout', (e) => {
            $(e.target).removeAttr('title').removeAttr("style");
        }).delegate(selector, 'click', (e) => {
            e = window.event || e;
            let key= e.keyCode || e.which;
            if (e.ctrlKey) {
                let content = store.content,
                    tree = content.middle.center.menus.menus[0].tree,
                    arr = $(e.target).text().replace(/("|')(.*)\1/, (t1, t2, t3) => `${t3}.${language === 'node' ? 'ejs' : 'html'}`).split('/'),
                    paths = [user, 'views', ...arr],
                    locations = tree.path_location[paths.join('/')],
                    arrPaths = [];
                if (locations) {
                    paths.forEach((item, i) => {
                        arrPaths.push(item);
                        if (i !== (paths.length - 1)) {
                            tree.opens[arrPaths.join('/')] = "open";
                        }
                    });
                    tree.setState(tree, () => {
                        document.getElementById(locations.join('')).click();
                    });
                } else {
                    store.errMsgOpen("项目中不存在该视图！", "err");
                }
            }
        });
    }
    // 移动中事件
    handleDragOver(event) {
        event.preventDefault();
    }
    // 单文件保存
    handleSaveFileContent(cm, cb) {
        if (this.isSave) {
            this.isSave = false;
            if (perms.data.update_file[perms.key]) {
                let tabs = store.content.middle.center.ide.tabs,
                    tab_active = tabs.list[tabs.active],
                    content = tab_active.newcontent !== undefined ? (tab_active.newcontent || ' ') : (tab_active.content || ' ');
                let paths = [...tab_active.paths];
                paths.shift();
                this.handleSaveFile([
                    { file_path: paths.join('/'), file_content: content }
                ], (locations) => {
                    tab_active.edit = undefined;
                    tab_active.content = content;
                    tab_active.newcontent = undefined;
                    tabs.setState(tabs, () => {
                        store.funs.tree.init(() => {
                            this.isSave = true;
                        });
                        store.errMsgOpen("OK", "ok");
                    });
                }, []);
            } else {
                this.isSave = true;
                store.errMsgOpen("您没有保存文件的权限！", "err");
            }
        }
    }
    // 文件批量保存
    handleAllSaveFileContent(cm) {
        if (this.isSave) {
            this.isSave = false;
            if (perms.data.update_file[perms.key]) {
                let tabs = store.content.middle.center.ide.tabs,
                    list = tabs.list,
                    datas = [];
                list.map((item, i) => {
                    let paths = [...item.paths];
                    paths.shift();
                    if (item.edit) datas.push({
                        location: i,
                        file_path: paths.join('/'),
                        file_content: item.newcontent !== undefined ? (item.newcontent || ' ') : (item.content || ' ')
                    });
                    return item;
                });
                // 执行批量保存
                this.handleSaveFile(datas, (locations) => {
                    locations.map((item) => {
                        let tab_active = list[item.location];
                        tab_active.edit = undefined;
                        tab_active.content = item.file_content;
                        tab_active.newcontent = undefined;
                    });
                    tabs.setState(tabs, () => {
                        store.funs.tree.init(() => {
                            this.isSave = true;
                        });
                        store.errMsgOpen("OK", "ok");
                    });
                }, []);
            } else {
                this.isSave = true;
                store.errMsgOpen("您没有保存文件的权限！", "err");
            }
        }
    }
    // 文件内容保存
    handleSaveFile(datas, cb, locations) {
        if (datas.length) {
            // 调用保存api
            api.saveFileContent(datas[0], (res) => {
                if (res.code === 0) {
                    // utils 识别
                    if (language === 'node') {
                        if (/^utils\/utils\.js$/.test(datas[0].file_path)) {
                            let bottom = store.content.bottom;
                            bottom.grammar.nodejs.utils = comm.utilsObj(datas[0].file_content);
                            bottom.setState(this.bottom);
                        } else
                        if (/^\.eslintrc$/.test(datas[0].file_path)) {
                            try {
                                store.cfg = JSON.parse(datas[0].file_content).rules;
                            } catch (e) {
                                store.cfg = "";
                            }
                        }
                    } else {
                        if (/^utils\/utils\.lua$/.test(datas[0].file_path)) {
                            let bottom = store.content.bottom;
                            bottom.grammar.lua.utils = comm.utilsObj(datas[0].file_content);
                            bottom.setState(this.bottom);
                        } else
                        if (/^\.eslintrc$/.test(datas[0].file_path)) {
                            try {
                                store.cfg = JSON.parse(datas[0].file_content).rules;
                            } catch (e) {
                                store.cfg = "";
                            }
                        }
                    }
                    locations.push(datas[0]);
                    datas.shift();
                    this.handleSaveFile(datas, cb, locations);
                } else {
                    store.errMsgOpen(res.msg);
                }
            });
        } else cb(locations);
    }
    // 右击事件层
    handleContextMenu(e) {
        if (store.content.middle.center.ide.code_editor.routes.class) return;
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            this.code_editor.rightMenu,
            () => {
            }, e
        );
    }
    // 编辑器内容改变事件
    handleEditorChange(cm) {
        let tabs = store.content.middle.center.ide.tabs;
        let tab = tabs.active !== undefined ? tabs.list[tabs.active] : '';
        // 添加新内容
        if (tab) {
            // 内容
            tab.newcontent = cm.getValue();
            // 是否改变
            tab.edit = tab.content !== tab.newcontent ? 'active' : undefined;
            // 设置
            tabs.setState(tabs, () => {
                if (tab.scroll) {
                    if (this.code_editor.isKey) {
                        this.code_editor.isKey = false;
                        cm.scrollTo(tab.scroll.left, tab.scroll.top);
                        cm.clearHistory();
                        if (tab.history) cm.setHistory(tab.history);
                    } else {
                        tab.scroll = cm.getScrollInfo();
                        tab.history = cm.getHistory();
                    }
                } else {
                    if (this.code_editor.isKey) {
                        this.code_editor.isKey = false;
                        cm.clearHistory();
                        if (tab.history) cm.setHistory(tab.history);
                    } else {
                        tab.scroll = cm.getScrollInfo();
                        tab.history = cm.getHistory();
                    }
                }
            });
        } else {
            cm.clearHistory();
        }
    }
    // 滚动条滚动事件
    handleEditorScroll(cm) {
        let tabs = store.content.middle.center.ide.tabs;
        let tab = tabs.active !== undefined ? tabs.list[tabs.active] : undefined;
        // 是否有选择
        if (tab) {
            // 滚动条位置
            if (tab.scroll) tab.scroll = cm.getScrollInfo();
        }
    }
    // 键入内容事件
    handleEditorKeyUp(cm, event) {
        // 智能提示
        if (this.keyCode != 16 && this.keyCode != 17 && this.keyCode != 18 && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey && (
            65 <= event.keyCode && 90 >= event.keyCode ||
            event.keyCode == 190 ||
            event.keyCode == 52 ||
            event.keyCode == 48
        )) {
            let globalScope = {},
                bottom = store.content.bottom;
            switch (bottom.active) {
                case "EJS":
                    globalScope = {
                        ...bottom.grammar.nodejs,
                        ...window,
                        ...bottom.grammar.jquery
                    };
                    break;
                case "HTML":
                case "HTM":
                    globalScope = {
                        ...{
                            console: {
                                log: null
                            },
                            lua: bottom.grammar.lua
                        },
                        ...window,
                        ...bottom.grammar.jquery
                    };
                    break;
                case "NodeJS":
                    globalScope = {...bottom.grammar.nodejs};
                    break;
                case "JS":
                    globalScope = {
                        ...{
                            console: {
                                log: null
                            }
                        },
                        ...window,
                        ...bottom.grammar.jquery
                    };
                    break;
                case "LUA":
                    globalScope = {...bottom.grammar.lua};
                    break;
                default:
            }
            CodeMirror.commands.autocomplete(cm, null, {
                viewsScope: {},
                globalScope: globalScope
            });

        }
        // 历史处理
        this.code_editor.isKey = false;
    }
    // 格式化
    handleFormat(cm) {
        let cursor = cm.getCursor();
        let bottom = store.content.bottom,
            isGSH = false,
            tabs = store.content.middle.center.ide.tabs,
            key = tabs.active,
            active = tabs.list[key];
        switch (bottom.active) {
            case "HTML":
            case "HTM":
            case "EJS":
                cm.setValue(style_html(cm.getValue(), 4, " ", null));
                isGSH = true;
                break;
            case "CSS":
                cm.setValue(css_beautify(cm.getValue()));
                isGSH = true;
                break;
            case "JS":
            case "NodeJS":
                let cxt = eslint.verifyAndFix(cm.getValue(), eslint_config);
                cm.setValue(js_beautify(cxt.output, 4, " ", null));
                isGSH = true;
                break;
            case "JSON":
            case "ESLINTRC":
                cm.setValue(js_beautify(cm.getValue(), 4, " ", null));
                isGSH = true;
                break;
            case "LUA":
                cm.setValue(luaBeautifier(cm.getValue(), 4));
                isGSH = true;
                break;
        }
        cm.setCursor(cursor);
        if (isGSH) {
            store.errMsgOpen('已成功格式化！', 'ok');
        } else {
            store.errMsgOpen('未能成功格式化！');
        }
    }
    // 光标事件
    handleCursorActivity(cm) {
        // 显示光标位置
        let cursor = cm.getCursor(),
            footer = store.footer,
            tabs = store.content.middle.center.ide.tabs,
            key = tabs.active,
            active = tabs.list[key];
        // 有标签才触发
        if (active) {
            // 设置提示内容
            footer.msg = `${"●"} ${active.paths.join('/')} ${cursor.line + 1}:${cursor.ch}`;
            // 关闭提示延迟
            if (this.code_editor.cursorTimeout) clearTimeout(this.code_editor.cursorTimeout);
            // 执行设置提示
            footer.setState(footer, () => {
                // 1s后关闭
                this.code_editor.cursorTimeout = setTimeout(() => {
                    footer.msg = "";
                    footer.setState(footer);
                }, 1000);
            });
        }
    }
    //全选
    handeleCheckAll(cm){
        let line = editor.lastLine();
        let ch = editor.getLine(line).length;
        editor.setSelection({line: 0, ch: 0}, {line: line, ch: ch});
    }
    //剪切
    handeleCut(cm) {
        // 删除选择的内容
        let list = cm.listSelections(), text = "";
        for (let i=0, ilen=list.length; i < ilen; i++) {
            if (list[i].anchor.line < list[i].head.line ) {
                text += cm.getRange(list[i].anchor, list[i].head);
            } else
            if (list[i].anchor.line > list[i].head.line) {
                text += cm.getRange(list[i].head, list[i].anchor);
            } else {
                if (list[i].anchor.ch <= list[i].head.ch) {
                    text += cm.getRange(list[i].anchor, list[i].head);
                } else {
                    text += cm.getRange(list[i].head, list[i].anchor);
                }
            }
        }
        comm.copy(text);
        for (let i=0, ilen=list.length; i < ilen; i++) {
            cm.replaceRange("", list[i].anchor, list[i].head);
        }
    }
    //复制
    handeleCopy(cm) {
        // 删除选择的内容
        let list = cm.listSelections(), text = "";
        for (let i=0, ilen=list.length; i < ilen; i++) {
            if (list[i].anchor.line < list[i].head.line ) {
                text += cm.getRange(list[i].anchor, list[i].head);
            } else
            if (list[i].anchor.line > list[i].head.line) {
                text += cm.getRange(list[i].head, list[i].anchor);
            } else {
                if (list[i].anchor.ch <= list[i].head.ch) {
                    text += cm.getRange(list[i].anchor, list[i].head);
                } else {
                    text += cm.getRange(list[i].head, list[i].anchor);
                }
            }
        }
        comm.copy(text);
    }
    //复制路径
    handeleCopyPath(cm) {
        let tabs = store.content.middle.center.ide.tabs,
            list = tabs.list,
            active = list[tabs.active],
            paths = [...active.paths];
        comm.copy(paths.join('/'));
        store.errMsgOpen('路径复制成功！', 'ok');
    }
}
export default CodeEditor;
