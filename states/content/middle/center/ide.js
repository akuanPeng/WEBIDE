export default {
    style: {
        top: 0,
        left: "20%",
        right: 0,
        bottom: 0,
        backgroundImage: `url(${config.imgSrc}logo_big_9.png)`
    },
    tabs: {
        list: [],
        tab_list: [],
        rightMenu: [
            {
                name: "关闭",
                icon: "",
                quick: "",
                class: "merge",
                func: (menu, target) => {
                    let key = parseInt(target.getAttribute('data-key'));
                    // 执行关闭
                    store.funs.tabs.closetab(key);
                }
            },
            {
                name: "关闭其它",
                icon: "",
                quick: "",
                class: "merge",
                func: (menu, target) => {
                    let key = parseInt(target.getAttribute('data-key')),
                        content = store.content,
                        tabs = content.middle.center.ide.tabs,
                        list = [...tabs.list],
                        isExe = true;
                    // 计算出提示
                    for (let i=0; i < list.length; i++) {
                        if (key !== i) {
                            if (list[i].edit) {
                                isExe = false;
                                store.confirmOpen(`文件[${list[i].name}]已改动未保存，是否确定关闭？`, () => {
                                    store.funs.tabs.closetab(i, content);
                                    content.setState(content);
                                });
                                break;
                            }
                        }
                    }
                    // 是否执行其他关闭
                    if (isExe) {
                        // 删除其它标签
                        for (let i=0; i < list.length; i++)
                            if (key !== i) store.funs.tabs.closetab(key <= i ? 1 : 0, content)
                        content.setState(content);
                    }
                }
            },
            {
                name: "关闭所有",
                icon: "",
                quick: "",
                func: (menu, target) => {
                    let content = store.content,
                        tabs = content.middle.center.ide.tabs,
                        list = [...tabs.list],
                        isExe = true;
                    // 计算出提示
                    for (let i=0; i < list.length; i++) {
                        if (list[i].edit) {
                            isExe = false;
                            store.confirmOpen(`文件[${list[i].name}]已改动未保存，是否确定关闭？`, () => {
                                store.funs.tabs.closetab(i, content);
                                content.setState(content);
                            });
                            break;
                        }
                    }
                    // 关闭所有
                    if (isExe) {
                        for (let i=0; i < list.length; i++)
                            store.funs.tabs.closetab(0, content);
                        content.setState(content);
                    }
                }
            },
            {
                name: "展开目录",
                icon: "icon-folder-open",
                quick: "",
                class: "merge",
                func: (menu, target) => {
                    let key = parseInt(target.getAttribute('data-key')),
                        content = store.content,
                        tree = content.middle.center.menus.menus[0].tree,
                        tabs = content.middle.center.ide.tabs,
                        tab = tabs.list[key],
                        paths = tab.paths,
                        arrPaths = [];
                    paths.forEach((item, i) => {
                        arrPaths.push(item);
                        if (i !== (paths.length - 1)) {
                            tree.opens[arrPaths.join('/')] = "open";
                        }
                    });
                    tree.setState(tree);
                }
            },
            {
                name: "复制路径",
                icon: "icon-copy",
                quick: "",
                func: (menu, target) => {
                    let key = parseInt(target.getAttribute('data-key')),
                        content = store.content,
                        tabs = content.middle.center.ide.tabs,
                        tab = tabs.list[key],
                        path = tab.paths.join('/');
                    comm.copy(path);
                    store.errMsgOpen(`路径[${path}]复制成功！`, 'ok');
                }
            }
        ]
    },
    code_editor: {
        tabLen: 0,
        content: "",
        isKey: false,
        rightMenu: [
            {
                name: "展开目录",
                icon: "icon-folder-open",
                quick: "",
                func: (menu, target) => {
                    let content = store.content,
                        tree = content.middle.center.menus.menus[0].tree,
                        tabs = content.middle.center.ide.tabs,
                        key = parseInt(tabs.active),
                        tab = tabs.list[key],
                        paths = tab.paths,
                        arrPaths = [];
                    paths.forEach((item, i) => {
                        arrPaths.push(item);
                        if (i !== (paths.length - 1)) {
                            tree.opens[arrPaths.join('/')] = "open";
                        }
                    });
                    tree.setState(tree);
                }
            },
            {
                name: "撤销",
                icon: "icon-arrow-left",
                quick: "Ctrl+Z",
                class: "merge",
                func: () => {
                    editor.undo();
                }
            },
            {
                name: "重做",
                icon: "icon-arrow-right",
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
                func: () => {
                    CodeMirror.commands.copy(editor);
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
                name: "查找内容",
                icon: "icon-search",
                quick: "Ctrl+F",
                class: "merge",
                func: () => {
                    CodeMirror.commands.find(editor);
                }
            },
            {
                name: "替换内容",
                icon: "icon-exchange",
                quick: "Ctrl+H",
                class: "merge",
                func: () => {
                    CodeMirror.commands.replace(editor);
                }
            },
            {
                name: "保存当前",
                icon: "icon-save",
                quick: "Ctrl+S",
                func: () => {
                    CodeMirror.commands.save(editor);
                }
            },
            {
                name: "属性",
                icon: "",
                key: "attribute",
                quick: "",
                func: (modal) => {
                    let tabs = store.content.middle.center.ide.tabs,
                        tab_active = tabs.list[tabs.active];
                    if (tab_active) {
                        modal.content = [
                            {
                                key: '名称',
                                value: tab_active.name
                            }, {
                                key: '类型',
                                value: '文件'
                            }, {
                                key: '路径',
                                value: tab_active.paths.join('/')
                            }
                        ];
                    }
                }
            }
        ],
        routes: {
            tree: {},
            count: 0,
            rightMenu: {
                dir: [
                    {
                        name: "删除",
                        icon: "icon-trash",
                        quick: "",
                        key: "confirm",
                        options: {
                            key: "routes",
                            msg: "是否删除该路径下的所有路由？",
                            func: () => {
                                let routes = store.content.middle.center.ide.code_editor.routes,
                                    right_active = {...routes.right_active};
                                if (right_active) {
                                    try {
                                        let location = right_active.location,
                                            routes = JSON.parse(editor.getValue()),
                                            newR = [];
                                        for (let i=0; i < routes.length; i++)
                                            if (location.indexOf(i) === -1)
                                                newR.push(routes[i]);
                                        routes = store.content.middle.center.ide.code_editor.routes;
                                        routes.count = newR.length;
                                        routes.tree = store.funs.routes.initTreeData(newR, {});
                                        routes.setState(routes, () => {
                                            editor.setValue(JSON.stringify(newR));
                                            CodeMirror.commands.save(editor);
                                        });
                                    }
                                    catch(e) {}
                                }
                            }
                        }
                    }
                ],
                file: [
                    {
                        name: "预览 (debug)",
                        icon: "icon-globe",
                        class: "merge",
                        quick: "",
                        func: () => {
                            let routes = store.content.middle.center.ide.code_editor.routes,
                                right_active = {...routes.right_active};
                            if (right_active) {
                                right_active.paths = right_active.paths.map((item) => {
                                    item = item.replace(/^z♔/, '');
                                    return item === '/' ? '' : item;
                                })
                                window.open(
                                    window.language === 'node'
                                    ? `/mvcleonid/${window.pid}/${window.user}/${right_active.paths.join('/').split('♛')[0]}`
                                    : `/mvcpluslua/dev/${window.pid}/${window.user}/${right_active.paths.join('/').split('♛')[0]}`);
                            }
                        }
                    },
                    {
                        name: "预览 (无log)",
                        icon: "icon-globe",
                        quick: "",
                        func: () => {
                            let routes = store.content.middle.center.ide.code_editor.routes,
                                right_active = {...routes.right_active};
                            if (right_active) {
                                right_active.paths = right_active.paths.map((item) => {
                                    item = item.replace(/^z♔/, '');
                                    return item === '/' ? '' : item;
                                })
                                if (localStorage['url_prefix_' + pid]) {
                                    window.open(`${localStorage['url_prefix_' + pid]}/${right_active.paths.join('/')}`);
                                } else {
                                    window.open(
                                        window.language === 'node'
                                        ? `${perms.dev}mvcleonid/${window.pid}/${window.user}/${right_active.paths.join('/').split('♛')[0]}`
                                        : `${perms.dev}mvcpluslua/dev/${window.pid}/${window.user}/${right_active.paths.join('/').split('♛')[0]}`
                                    );
                                }
                            }
                        }
                    },
                    {
                        name: "编辑",
                        icon: "icon-edit",
                        class: "merge",
                        key: "addroute",
                        quick: "",
                        func: (modal) => {
                            let _routes = store.content.middle.center.ide.code_editor.routes,
                                right_active = _routes.right_active.children;
                            modal.options = {
                                route: right_active.route,
                                method: right_active.method,
                                sort: _routes.right_active.location[0],
                                isAdd: false,
                                data: right_active
                            }
                            modal.options.data.method = comm.countMethod(right_active.method)
                        }
                    },
                    {
                        name: "删除",
                        icon: "icon-trash",
                        class: "merge",
                        quick: "",
                        key: "confirm",
                        options: {
                            key: "route",
                            msg: "是否删除该路由？",
                            func: () => {
                                let routes = store.content.middle.center.ide.code_editor.routes,
                                    right_active = {...routes.right_active};
                                if (right_active) {
                                    try {
                                        let location = right_active.location,
                                            routes = JSON.parse(editor.getValue()),
                                            newR = [];
                                        for (let i=0; i < routes.length; i++)
                                            if (location.indexOf(i) === -1)
                                                newR.push(routes[i]);
                                        routes = store.content.middle.center.ide.code_editor.routes;
                                        routes.count = newR.length;
                                        routes.tree = store.funs.routes.initTreeData(newR, {});
                                        routes.setState(routes, () => {
                                            editor.setValue(JSON.stringify(newR));
                                            CodeMirror.commands.save(editor);
                                        });
                                    }
                                    catch(e) {}
                                }
                            }
                        }
                    },
                    {
                        name: "找到控制器",
                        icon: "icon-folder-open",
                        quick: "",
                        func: () => {
                            let center = store.content.middle.center,
                                routes = center.ide.code_editor.routes,
                                tree = center.menus.menus[0].tree,
                                right_active = {...routes.right_active},
                                controller_name = `${store.user}/controllers/${right_active.children.controller_name}.${window.language === 'node' ? 'js' :  'lua'}`,
                                paths = controller_name.split('/'),
                                locations = tree.path_location[controller_name] || [],
                                arrPaths = [];
                            paths.forEach((item, i) => {
                                arrPaths.push(item);
                                if (i !== (paths.length - 1)) {
                                    tree.opens[arrPaths.join('/')] = "open";
                                }
                            });
                            tree.setState(tree, () => {
                                let $this = document.getElementById(locations.join(''));
                                $this.click();
                            });
                        }
                    }
                ]
            }
        },
        editor_img:{
            class: "",
            style: {},
            theme: "white",
            src :"http://file.40017.cn/leonidbucket/images/l-white.png"
        }
    }
}
