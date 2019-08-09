export default {
    version: '',
    user: '',
    branch: '',
    key: 0,
    menus: [
        {
            name: "文件",
            quick: "F",
            class: "",
            menus: [
                {
                    name: "新建文件",
                    icon: "icon-file-alt",
                    quick: "Alt+N",
                    key: "newfile",
                    auth: "add_file",
                    class: "merge",
                    func: (menu, modal) => {
                        let tree = store.content.middle.center.menus.menus[0].tree;
                        tree.right_active = undefined;
                    }
                },
                {
                    name: "新建文件夹",
                    icon: "icon-folder-close-alt",
                    quick: "Ctrl+Alt+N",
                    key: "newdir",
                    auth: "add_dir",
                    func: (menu, modal) => {
                        let tree = store.content.middle.center.menus.menus[0].tree;
                        tree.right_active = undefined;
                    }
                },
                {
                    name: "搜索",
                    icon: "icon-search",
                    quick: "Ctrl+P",
                    key: "search",
                    class: "merge",
                    func: (menu, modal) => {
                        let tree = store.content.middle.center.menus.menus[0].tree;
                        modal.files = tree.files;
                    }
                },
                {
                    name: "保存",
                    icon: "icon-save",
                    quick: "Ctrl+Shift+S",
                    auth: "update_file",
                    func: () => {
                        CodeMirror.commands.allSave(editor);
                    }
                },
                {
                    name: "退出",
                    icon: "icon-reply",
                    quick: "Shift+ESC",
                    func: () => {
                        window.close();
                    }
                }
            ]
        },
        {
            name: "编辑",
            quick: "E",
            class: "",
            menus: [
                {
                    name: "撤销",
                    icon: "icon-undo",
                    quick: "Ctrl+Z",
                    class: "merge",
                    func: () => {
                        editor.undo();
                    }
                },
                {
                    name: "重做",
                    icon: "icon-repeat",
                    quick: "Ctrl+Y",
                    func: () => {
                        editor.redo();
                    }
                },
                {
                    name: "全选",
                    icon: "",
                    quick: "Ctrl+A",
                    class: "merge",
                    func: () => {
                        CodeMirror.commands.checkAll(editor);
                    }
                },
                {
                    name: "剪切",
                    icon: "",
                    quick: "Ctrl+X",
                    class: "merge",
                    func: () => {
                        CodeMirror.commands.cut(editor);
                    }
                },
                {
                    name: "复制",
                    icon: "",
                    quick: "Ctrl+C",
                    class: "merge",
                    func: () => {
                        CodeMirror.commands.copy(editor);
                    }
                },
                {
                    name: "复制路径",
                    icon: "",
                    quick: "Ctrl+Shift+C",
                    func: () => {
                        CodeMirror.commands.copyPath(editor);
                    }
                },
                {
                    name: "格式化",
                    icon: "icon-retweet",
                    quick: "Ctrl+K",
                    class: "merge",
                    func: () => {
                        CodeMirror.commands.format(editor);
                    }
                },
                {
                    name: "注释/反注释",
                    icon: "icon-strikethrough",
                    quick: "Ctrl+/",
                    func: () => {
                        CodeMirror.commands.toggleCommentIndented(editor);
                    }
                }
            ]
        },
        {
            name: "查看",
            quick: "V",
            class: "",
            menus: [
                {
                    name: "展开",
                    icon: "icon-plus-sign",
                    quick: "",
                    class: "merge",
                    func: () => {
                        let tree = store.content.middle.center.menus.menus[0].tree;
                        for (let key in tree.opens) tree.opens[key] = 'open';
                        tree.setState(tree);
                    }
                },
                {
                    name: "收起",
                    icon: "icon-minus-sign",
                    quick: "",
                    func: () => {
                        let tree = store.content.middle.center.menus.menus[0].tree;
                        for (let key in tree.opens) tree.opens[key] = 'close';
                        tree.setState(tree);
                    }
                },
                {
                    name: "显示/隐藏目录",
                    icon: "",
                    quick: "",
                    class: "merge",
                    func: () => {
                        document.getElementsByTagName("left")[0].firstChild.click();
                    }
                },
                {
                    name: "显示/隐藏帮助",
                    icon: "",
                    quick: "",
                    class: "merge",
                    func: () => {
                        document.getElementsByTagName("right")[0].firstChild.click();
                    }
                },
                {
                    name: "显示/隐藏日志",
                    icon: "",
                    quick: "",
                    class: "merge",
                    func: () => {
                        document.getElementById("logs").click()
                    }
                },
                {
                    name: "显示/隐藏控制台",
                    icon: "",
                    quick: "",
                    func: () => {
                        document.getElementById("console").click()
                    }
                },
                {
                    name: "码字模式",
                    icon: "icon-desktop",
                    quick: "Ctrl+Alt+T",
                    class: "merge",
                    func: () => {
                        document.getElementById("icon-desktop").click()
                    }
                },
                {
                    name: "默认模式",
                    icon: "icon-laptop",
                    quick: "Ctrl+Alt+D",
                    func: () => {
                        document.getElementById("icon-desktop").click()
                    }
                }
            ]
        },
        {
            name: "查找",
            quick: "I",
            class: "",
            menus: [
                {
                    name: "查找",
                    icon: "icon-search",
                    quick: "Ctrl+F",
                    class: "merge",
                    func: () => {
                        CodeMirror.commands.find(editor);
                    }
                },
                {
                    name: "查找下一个",
                    icon: "icon-arrow-down",
                    quick: "Ctrl+G",
                    class: "merge",
                    func: () => {
                        CodeMirror.commands.findNext(editor);
                    }
                },
                {
                    name: "查找上一个",
                    icon: "icon-arrow-up",
                    quick: "Ctrl+Shift+G",
                    func: () => {
                        CodeMirror.commands.findPrev(editor);
                    }
                },
                {
                    name: "替换",
                    icon: "icon-exchange",
                    quick: "Ctrl+H",
                    class: "merge",
                    func: () => {
                        CodeMirror.commands.replace(editor);
                    }
                },
                {
                    name: "替换全部",
                    icon: "icon-exchange",
                    quick: "Ctrl+Shift+R",
                    func: () => {
                        CodeMirror.commands.replaceAll(editor);
                    }
                }
            ]
        },
        {
            name: "工具",
            quick: "T",
            class: "",
            menus: [
                {
                    name: "Git工具",
                    icon: "icon-briefcase",
                    key: "git",
                    quick: "",
                    auth: "status_project",
                    confirm: (key) => {
                        let dialog = store.dialog,
                            modal = dialog['confirm'];
                        dialog.class = "active";
                        modal.class = "active";
                        modal.options = {
                            key: key,
                            msg: '很抱歉, 本地有文件改变但未保存，请保存它们！'
                        };
                        dialog.setState(dialog);
                    },
                    func: (menu, modal) => {
                        let resource = modal.resource;
                        let files = resource.files;
                        files.isUpdate = true;
                        files.class = "";
                        resource.handleTagClick(0)
                    }
                },
                // {
                //     name: "Git命令行工具",
                //     icon: "icon-briefcase",
                //     key: "command",
                //     quick: ""
                // }
            ]
        },
        {
            name: "帮助",
            quick: "H",
            class: "",
            menus: [
                {
                    name: "文档",
                    icon: "icon-question-sign",
                    quick: "",
                    func: () => {
                        window.open("http://leonidapi.17usoft.com/mvcplus/helper/");
                    }
                },
                {
                    name: "客服",
                    icon: "icon-comments-alt",
                    quick: "",
                    func: () => {
                        window.open("http://wpa.qq.com/msgrd?v=3&uin=2355741628&site=qq&menu=yes");
                    }
                },
                {
                    name: "关于",
                    icon: "icon-home",
                    quick: "",
                    func: () => {
                        window.open("http://leonidapi.17usoft.com/webleonid/admin/leonid/index.html");
                    }
                }
            ]
        }
    ]
}
