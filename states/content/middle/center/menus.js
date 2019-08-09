export default {
    isDragAndDrop : false,
    pxThan : 0,
    mouseX : 0,
    style : {
        width: "20%",
        minWidth: "10%",
        maxWidth: "80%",
        top: 0,
        bottom: 0
    },
    menus : [
        {
            title: "项目-目录",
            rightMenu: [
                {
                    name: "展开",
                    icon: "icon-plus-sign",
                    quick: "Ctrl+[",
                    class: "merge",
                    func: (menu, target) => {
                        let tree = store.content.middle.center.menus.menus[0].tree;
                        for (let key in tree.opens)
                            tree.opens[key] = 'open';
                        tree.setState(tree);
                    }
                }, {
                    name: "收起",
                    icon: "icon-minus-sign",
                    quick: "Ctrl+]",
                    func: (menu, target) => {
                        let tree = store.content.middle.center.menus.menus[0].tree;
                        for (let key in tree.opens)
                            tree.opens[key] = 'close';
                        tree.setState(tree);
                    }
                }, {
                    name: "刷新",
                    icon: "icon-refresh",
                    quick: "",
                    func: (menu, target) => {
                        store.spinOpen();
                        store.funs.tree.init(() => {
                            store.spinClose();
                            store.errMsgOpen('OK', 'ok');
                        });
                    }
                }
            ],
            tree: {
                files: [],
                menus: [],
                states: {},
                opens: {},
                file_active: "",
                path_location: {},
                controllers: [],
                filters: [],
                rightMenu: {
                    root: [
                        {
                            name: "新建文件",
                            icon: "icon-file-text-alt",
                            quick: "",
                            key: "newfile",
                            auth: "add_file",
                            class: "merge"
                        }, {
                            name: "新建文件夹",
                            icon: "icon-folder-close-alt",
                            key: "newdir",
                            auth: "add_dir",
                            quick: ""
                        }, {
                            name: "粘贴...",
                            icon: "icon-paste",
                            quick: "",
                            func: (menu, target) => {
                                if (store.clipboard) {
                                    let locations = store.clipboard.split('/'),
                                        tree = store.content.middle.center.menus.menus[0].tree,
                                        active = tree.right_active,
                                        selected = comm.searchLocation(locations, tree.menus);
                                    // 是否是文件夹
                                    if (selected.is_dir) {} else {
                                        // 执行复制
                                        let paths = [...active.paths],
                                            paths_s = selected.paths;
                                        paths.shift();
                                        paths_s.shift();
                                        let path = paths.join('/');
                                        if (paths_s.join('/') !== `${path ? (path + '/') : ''}${selected.name}`) {
                                            api.copy({
                                                file_path: paths_s.join('/'),
                                                new_path: `${path ? (path + '/') : ''}${selected.name}`
                                            }, (res) => {
                                                if (res.code === 0) {
                                                    if (selected.isCut) {
                                                        // 删除文件
                                                        api.del({
                                                            file_path: paths_s.join('/')
                                                        }, (res) => {
                                                            if (res.code === 0) {
                                                                store.funs.tree.init(() => {
                                                                    store.clipboard = undefined;
                                                                    store.errMsgOpen('OK', 'ok');
                                                                });
                                                            } else
                                                                store.errMsgOpen(res.msg);
                                                            }
                                                        )
                                                    } else {
                                                        store.funs.tree.init(() => {
                                                            store.clipboard = undefined;
                                                            store.errMsgOpen('OK', 'ok');
                                                        });
                                                    }
                                                } else
                                                    store.errMsgOpen(res.msg);
                                                }
                                            );
                                        } else {
                                            store.errMsgOpen(`该文件已存在！`);
                                        }
                                    }
                                } else {
                                    store.errMsgOpen(`请先复制文件！`);
                                }
                            }
                        }
                    ],
                    dir: [
                        {
                            name: "新建文件",
                            icon: "icon-file-text-alt",
                            quick: "",
                            key: "newfile",
                            auth: "add_file",
                            class: "merge"
                        }, {
                            name: "新建文件夹",
                            icon: "icon-folder-close-alt",
                            key: "newdir",
                            auth: "add_dir",
                            quick: ""
                        },
                        // {
                        //     name: "剪切...",
                        //     icon: "icon-cut",
                        //     quick: "",
                        //     class: "merge"
                        // },
                        // {
                        //     name: "复制...",
                        //     icon: "icon-copy",
                        //     quick: "",
                        //     class: "merge"
                        // },
                        {
                            name: "粘贴...",
                            icon: "icon-paste",
                            quick: "",
                            auth: "copy_file",
                            func: (menu, target) => {
                                if (store.clipboard) {
                                    let locations = store.clipboard.split('/'),
                                        tree = store.content.middle.center.menus.menus[0].tree,
                                        active = tree.right_active,
                                        selected = comm.searchLocation(locations, tree.menus);
                                    // 是否是文件夹
                                    if (selected.is_dir) {} else {
                                        // 执行复制
                                        let paths = [...active.paths],
                                            paths_s = selected.paths;
                                        paths.shift();
                                        paths_s.shift();
                                        let path = paths.join('/');
                                        if (paths_s.join('/') !== `${path ? (path + '/') : ''}${selected.name}`) {
                                            api.copy({
                                                file_path: paths_s.join('/'),
                                                new_path: `${path ? (path + '/') : ''}${selected.name}`
                                            }, (res) => {
                                                if (res.code === 0) {
                                                    if (selected.isCut) {
                                                        // 删除文件
                                                        api.del({
                                                            file_path: paths_s.join('/')
                                                        }, (res) => {
                                                            if (res.code === 0) {
                                                                store.funs.tree.init(() => {
                                                                    store.clipboard = undefined;
                                                                    store.errMsgOpen('OK', 'ok');
                                                                });
                                                            } else
                                                                store.errMsgOpen(res.msg);
                                                            }
                                                        )
                                                    } else {
                                                        store.funs.tree.init(() => {
                                                            store.clipboard = undefined;
                                                            store.errMsgOpen('OK', 'ok');
                                                        });
                                                    }
                                                } else
                                                    store.errMsgOpen(res.msg);
                                                }
                                            );
                                        } else {
                                            store.errMsgOpen(`该文件已存在！`);
                                        }
                                    }
                                } else {
                                    store.errMsgOpen(`请先复制文件！`);
                                }
                            }
                        }, {
                            name: "重命名",
                            icon: "icon-pencil",
                            quick: "",
                            key: "rename",
                            auth: "rename_file_dir",
                            options: {
                                title: "重命名一个文件夹",
                                lable: "新文件夹名"
                            },
                            class: "merge"
                        }, {
                            name: "删除...",
                            icon: "icon-trash",
                            quick: "",
                            key: "confirm",
                            auth: "del_file_dir",
                            options: {
                                type: '文件夹'
                            }
                        }, {
                            name: "属性",
                            icon: "",
                            key: "attribute",
                            quick: "",
                            func: (modal) => {
                                let tree = store.content.middle.center.menus.menus[0].tree,
                                    right_active = tree.right_active;
                                modal.content = [
                                    {
                                        key: '名称',
                                        value: right_active.name
                                    }, {
                                        key: '类型',
                                        value: '文件夹'
                                    }, {
                                        key: '路径',
                                        value: right_active.paths.join('/')
                                    }
                                ];
                            }
                        }
                    ],
                    file: [
                        {
                            name: "打开",
                            icon: "",
                            quick: "",
                            func: (menu, target) => {
                                let tree = store.content.middle.center.menus.menus[0].tree,
                                    locations = tree.right_active
                                        ? tree.right_active.locations
                                        : [];
                                document.getElementById(locations.join("")).click();
                            }
                        }, {
                            name: "剪切...",
                            icon: "icon-cut",
                            quick: "",
                            class: "merge",
                            func: (menu, target) => {
                                let content = store.content,
                                    tree = content.middle.center.menus.menus[0].tree,
                                    active = tree.right_active,
                                    path = active.paths.join('/');
                                // 清理之前剪切
                                if (store.clipboard) {
                                    let locations = store.clipboard.split('/'),
                                        selected = comm.searchLocation(locations, tree.menus);
                                    selected.isCut = false;
                                }
                                active.isCut = true;
                                comm.copy(active.locations.join("/"), true);
                                tree.setState(tree, () => {
                                    store.errMsgOpen(`文件[${path}]剪切成功！`, 'ok');
                                })
                            }
                        }, {
                            name: "复制...",
                            icon: "icon-copy",
                            quick: "",
                            func: (menu, target) => {
                                let content = store.content,
                                    tree = content.middle.center.menus.menus[0].tree,
                                    active = tree.right_active,
                                    path = active.paths.join('/');
                                // 清理之前剪切
                                if (store.clipboard) {
                                    let locations = store.clipboard.split('/'),
                                        selected = comm.searchLocation(locations, tree.menus);
                                    selected.isCut = false;
                                }
                                active.isCut = false;
                                comm.copy(active.locations.join("/"), true);
                                tree.setState(tree, () => {
                                    store.errMsgOpen(`文件[${path}]复制成功！`, 'ok');
                                })
                            }
                        }, {
                            name: "重命名",
                            icon: "icon-pencil",
                            quick: "",
                            key: "rename",
                            auth: "rename_file_dir",
                            options: {
                                title: "重命名一个文件",
                                lable: "新文件名"
                            },
                            class: "merge"
                        }, {
                            name: "删除...",
                            icon: "icon-trash",
                            quick: "",
                            key: "confirm",
                            auth: "del_file_dir",
                            options: {
                                type: '文件'
                            }
                        }, {
                            name: "丢弃...",
                            icon: "icon-reply",
                            quick: "",
                            key: "confirm",
                            auth: ["reset_git_file", "checkout_git_file"],
                            options: {
                                key: "discard",
                                msg: "是否立即丢弃该文件?",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree,
                                        right_active = tree.right_active,
                                        tabs = store.content.middle.center.ide.tabs,
                                        paths = [...right_active.paths];
                                    store.spinOpen();
                                    // 查找目标
                                    paths.shift();
                                    const index = tabs.tab_list.indexOf(paths.join('/'));
                                    if (right_active.states.indexOf('store') !== -1) {
                                        api.checkoutGitFile({
                                            file_name: paths.join('/')
                                        }, (res) => {
                                            if (res.code === 0) {
                                                store.funs.tree.init(() => {
                                                    if (index !== -1) store.funs.tabs.closetab(index, null, true);
                                                    store.spinClose();
                                                    store.errMsgOpen('OK', 'ok');
                                                });
                                            } else {
                                                store.spinClose();
                                                store.errMsgOpen(res.msg, 'err');
                                            }
                                        });
                                    } else {
                                        api.resetGitFile({
                                            file_path: paths.join('/')
                                        }, (re) => {
                                            if (re.code === 0) {
                                                api.checkoutGitFile({
                                                    file_name: paths.join('/')
                                                }, (res) => {
                                                    if (res.code === 0) {
                                                        store.funs.tree.init(() => {
                                                            if (index !== -1) store.funs.tabs.closetab(index, null, true);
                                                            store.spinClose();
                                                            store.errMsgOpen('OK', 'ok');
                                                        });
                                                    } else {
                                                        store.spinClose();
                                                        store.errMsgOpen(res.msg, 'err');
                                                    }
                                                });
                                            } else {
                                                store.spinClose();
                                                store.errMsgOpen(re.msg, 'err');
                                            }
                                        });
                                    }
                                }
                            },
                            discard: true
                        }, {
                            name: "属性",
                            icon: "",
                            key: "attribute",
                            quick: "",
                            func: (modal) => {
                                let tree = store.content.middle.center.menus.menus[0].tree,
                                    right_active = tree.right_active;
                                modal.content = [
                                    {
                                        key: '名称',
                                        value: right_active.name
                                    }, {
                                        key: '类型',
                                        value: '文件'
                                    }, {
                                        key: '路径',
                                        value: right_active.paths.join('/')
                                    }
                                ];
                            }
                        }
                    ],
                    mysql: [
                        {
                            name: "新建mysql",
                            icon: "",
                            quick: "",
                            key: "db",
                            auth: 'add_dbinfo',
                            options: {
                                title: "创建一个MySql",
                                row: 4,
                                behavior: {
                                    4: []
                                },
                                data: {
                                    db_type: 2,
                                    dsn: "user:pwd@tcp(192.168.1.1:3306)/dbname?param=value",
                                    mode: '1',
                                    speed_Limit: 0,
                                    remark: ""
                                },
                                controls: [
                                    {
                                        name: "dsn",
                                        type: "text",
                                        placeholder: "user:pwd@tcp(192.168.1.1:3306)/dbname?param=value",
                                        title:'提醒: dsn，必填, user:pwd@tcp(192.168.1.1:3306)/dbname?param=value。'
                                    }, {
                                        name: "mode",
                                        type: "select",
                                        placeholder: "模式限制",
                                        options: [
                                            {
                                                value: '1',
                                                label: '只读'
                                            }, {
                                                value: '2',
                                                label: '只写'
                                            }, {
                                                value: '3',
                                                label: '读写'
                                            }
                                        ],
                                        value: '1',
                                        title: '提醒: 模式限制，必填。'
                                    }, {
                                        name: "speed_Limit",
                                        type: "text",
                                        placeholder: "0",
                                        title:'提醒: 频率限制, 正整数, 0或大于等于10, 0表示不限制, 单位: 次/S'
                                    }, {
                                        name: "remark",
                                        type: "text",
                                        placeholder: "备注",
                                        title:'提醒: 备注'
                                    }
                                ]
                            }
                        }
                    ],
                    mssql: [
                        {
                            name: "新建mssql",
                            icon: "",
                            quick: "",
                            key: "db",
                            auth: 'add_dbinfo',
                            options: {
                                title: "创建一个MSSql",
                                row: 4,
                                behavior: {
                                    4: []
                                },
                                data: {
                                    db_type: 4,
                                    dsn: "server=10.100.41.15;user id=test;password=test;database=test;port=1433",
                                    mode: '1',
                                    speed_Limit: 0,
                                    remark: ""
                                },
                                controls: [
                                    {
                                        name: "dsn",
                                        type: "text",
                                        placeholder: "server=10.100.41.15;user id=test;password=test;database=test;port=1433",
                                        title:'提醒: 只支持ADO模式,必填。'
                                    }, {
                                        name: "mode",
                                        type: "select",
                                        placeholder: "模式限制",
                                        options: [
                                            {
                                                value: '1',
                                                label: '只读'
                                            }, {
                                                value: '2',
                                                label: '只写'
                                            }, {
                                                value: '3',
                                                label: '读写'
                                            }
                                        ],
                                        value: "1",
                                        title: '提醒: 模式限制，必填。'
                                    }, {
                                        name: "speed_Limit",
                                        type: "text",
                                        placeholder: "频率限制",
                                        title:'提醒: 频率限制, 正整数, 0或大于等于10, 0表示不限制, 单位: 次/S'
                                    }, {
                                        name: "remark",
                                        type: "text",
                                        placeholder: "备注",
                                        title:'提醒: 备注'
                                    }
                                ]
                            }
                        }
                    ],
                    mongodb: [
                        {
                            name: "新建mongodb",
                            icon: "",
                            quick: "",
                            key: "db",
                            auth: 'add_dbinfo',
                            options: {
                                title: "创建一个MongoDB",
                                row: 5,
                                behavior: {
                                    5: []
                                },
                                data: {
                                    db_type: 3,
                                    dsn: 'mongodb://user:password@192.168.1.1:27017/test',
                                    mode: '1',
                                    conn_timeout: 2000,
                                    read_timeout: 2000,
                                    write_timeout: 2000,
                                    remark: ''
                                },
                                controls: [
                                    {
                                        name: "dsn",
                                        type: "text",
                                        placeholder: "mongodb://user:password@192.168.1.1:27017/test",
                                        title: '提醒: dsn，必填, mongodb://user:password@192.168.1.1:27017/test。'
                                    }, {
                                        name: "mode",
                                        type: "select",
                                        placeholder: "模式限制",
                                        options: [
                                            {
                                                value: '1',
                                                label: '只读'
                                            }, {
                                                value: '2',
                                                label: '只写'
                                            }, {
                                                value: '3',
                                                label: '读写'
                                            }
                                        ],
                                        value:'1',
                                        title: '提醒: 模式限制，必填。'
                                    }, {
                                        name: "conn_timeout",
                                        type: "text",
                                        placeholder: "2000",
                                        title: '提醒: 连接超时，必填, 1000-30000, 单位: ms'
                                    }, {
                                        name: "read_timeout",
                                        type: "text",
                                        placeholder: "2000",
                                        class: "half-width left",
                                        title: '提醒: 读取超时，必填, 500-30000, 单位: ms'
                                    }, {
                                        name: "write_timeout",
                                        type: "text",
                                        placeholder: "2000",
                                        class: "half-width right",
                                        title: '提醒: 写入超时，必填, 500-30000, 单位: ms'
                                    }, {
                                        name: "remark",
                                        type: "text",
                                        placeholder: "备注",
                                        title: '提醒: 备注'
                                    }
                                ]
                            }
                        }
                    ],
                    redis: [
                        {
                            name: "新建redis",
                            icon: "",
                            quick: "",
                            key: "db",
                            auth: 'add_dbinfo',
                            options: {
                                title: "创建一个Redis",
                                row: 6,
                                behavior: {
                                    5: ["config_name", "proj_tag", "proj_name","dsn","auth"],
                                    6: ["config_name", "proj_tag", "proj_name", "skyeye"],
                                    7: ["skyeye"]
                                },
                                data: {
                                    db_type: 1,
                                    env: "test",
                                    redis_type: "0",
                                    skyeye: '',
                                    config_name: "",
                                    proj_tag: "",
                                    proj_name: "",
                                    dsn: "",
                                    auth: "",
                                    mode: '1',
                                    speed_limit: 0,
                                    conn_timeout: 2000,
                                    read_timeout: 2000,
                                    write_timeout: 2000,
                                    remark: ""
                                },
                                controls: [
                                    {
                                        name: "env",
                                        type: "select",
                                        placeholder: "环境类型",
                                        options: [
                                            {
                                                value: 'test',
                                                label: '测试'
                                            },{
                                                value: 'stage',
                                                label: '预发'
                                            }, {
                                                value: 'product',
                                                label: '生产'
                                            }
                                        ],
                                        value: 'test',
                                        title: '提醒: 环境类型 必填'
                                    },
                                    {
                                        name: "redis_type",
                                        type: "select",
                                        placeholder: "redis类型",
                                        options: [
                                            {
                                                value: '-1',
                                                label: '统一缓存'
                                            },{
                                                value: '0',
                                                label: 'redis'
                                            }, {
                                                value: '1',
                                                label: 'redisProxy'
                                            }, {
                                                value: '2',
                                                label: 'redisCluster'
                                            }
                                        ],
                                        value: '0',
                                        title: '提醒: Redis类型，必填。'
                                    }, {
                                        name: "skyeye",
                                        type: "text",
                                        placeholder: "请输入天眼标识...",
                                        title: '提醒: 请输入天眼标识...'
                                    },{
                                        name: "config_name",
                                        type: "text",
                                        placeholder: "configName",
                                        class: "three-width left",
                                        title: '提醒: ConfigName'
                                    }, {
                                        name: "proj_tag",
                                        type: "text",
                                        placeholder: "projTag",
                                        class: "three-width center",
                                        title: '提醒: ProjTag'
                                    }, {
                                        name: "proj_name",
                                        type: "text",
                                        placeholder: "projName",
                                        class: "three-width",
                                        title: '提醒: ProjName'
                                    }, {
                                        name: "dsn",
                                        type: "text",
                                        placeholder: "ipPort",
                                        class: "half-width",
                                        title: '提醒: ipPort，必填, 192.168.1.1:6379，RedisCluster类型支持,分隔多个ipPort。'
                                    }, {
                                        name: "auth",
                                        type: "text",
                                        placeholder: "auth",
                                        class: "half-width right",
                                        title: '提醒: auth'
                                    }, {
                                        name: "mode",
                                        type: "select",
                                        placeholder: "模式限制",
                                        options: [
                                            {
                                                value: '1',
                                                label: '只读'
                                            }, {
                                                value: '2',
                                                label: '只写'
                                            }, {
                                                value: '3',
                                                label: '读写'
                                            }
                                        ],
                                        value: '1',
                                        title:'提醒: 模式限制，必填。'
                                    }, {
                                        name: "speed_limit",
                                        type: "text",
                                        placeholder: "频率限制",
                                        class: "half-width left",
                                        title: '提醒: 频率限制, 正整数, 0或大于等于10, 0表示不限制, 单位: 次/S'
                                    }, {
                                        name: "conn_timeout",
                                        type: "text",
                                        placeholder: "连接超时",
                                        class: "half-width right",
                                        title: '提醒: 连接超时，必填, 1000-30000, 单位: ms'
                                    }, {
                                        name: "read_timeout",
                                        type: "text",
                                        placeholder: "读取超时",
                                        class: "half-width left",
                                        title: '提醒: 读取超时，必填, 500-30000, 单位: ms'
                                    }, {
                                        name: "write_timeout",
                                        type: "text",
                                        placeholder: "写入超时",
                                        class: "half-width right",
                                        title: '提醒: 写入超时，必填, 500-30000, 单位: ms'
                                    }, {
                                        name: "remark",
                                        type: "text",
                                        placeholder: "备注",
                                        title: '提醒: 备注'
                                    }
                                ]
                            }
                        }
                    ],
                    dsf: [
                        {
                            name: "新建dsf",
                            icon: "",
                            quick: "",
                            key: "db",
                            auth: 'add_dbinfo',
                            options: {
                                title: "创建一个DSF",
                                row: 5,
                                behavior: {
                                    5: []
                                },
                                data: {
                                    db_type: 5,
                                    dsf_name: '',
                                    service_name: '',
                                    version: '',
                                    method: '',
                                    rname: '',
                                    rversion: '',
                                    tag: ''
                                },
                                controls: [
                                    {
                                        name: "dsf_name",
                                        type: "text",
                                        placeholder: "名称",
                                        title: '提醒: 名称'
                                    }, {
                                        name: "service_name",
                                        type: "text",
                                        placeholder: "服务器全名",
                                        title: '提醒: 服务器全名'
                                    }, {
                                        name: "version",
                                        type: "text",
                                        placeholder: "版本号",
                                        title: '提醒: 版本号'
                                    }, {
                                        name: "method",
                                        type: "text",
                                        placeholder: "方法",
                                        title: '提醒: 方法'
                                    }, {
                                        name: "rname",
                                        type: "text",
                                        placeholder: "调用方名称",
                                        title: '提醒: 调用方名称'
                                    }, {
                                        name: "rversion",
                                        type: "text",
                                        placeholder: "调用方版本",
                                        title: '提醒: 调用方版本'
                                    }, {
                                        name: "tag",
                                        type: "text",
                                        placeholder: "标签",
                                        title: '提醒: 标签'
                                    }
                                ]
                            }
                        }
                    ],
                    db_mysql: [
                        {
                            name: "Ping",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            options: {
                                key: "db_mysql_ping",
                                msg: "是否Ping当前数据源？",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mysqlData = tree.right_active;
                                    store.spinOpen();
                                    api.pingDbserver({
                                        db_type: 2,
                                        _id: mysqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            });
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'redis_push',
                            options: {
                                key : "db_mysql_push",
                                msg : "是否确认推送当前数据源？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mysqlData = tree.right_active;
                                    store.spinOpen();
                                    api.redisPushOne({
                                        db_type: 2,
                                        _id: mysqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送Mode",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'mode_push',
                            options: {
                                key : "db_mysql_push",
                                msg : "是否确认推送当前数据源的模式？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mysqlData = tree.right_active;
                                    store.spinOpen();
                                    api.pushMode({
                                        db_type: 2,
                                        _id: mysqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送频率",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'speed_push',
                            options: {
                                key : "db_mysql_push",
                                msg : "是否确认推送当前数据源的频率？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mysqlData = tree.right_active;
                                    store.spinOpen();
                                    api.pushSpeed({
                                        db_type: 2,
                                        _id: mysqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "编辑...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "db",
                            auth: 'edit_dbinfo',
                            func: (modal, menu) => {
                                const tree = store.content.middle.center.menus.menus[0].tree;
                                menu.options.data.db_type = 2
                                menu.options.data.dsn = tree.right_active.details.dsn
                                menu.options.data.mode = tree.right_active.details.mode.toString()
                                menu.options.data.speed_Limit = tree.right_active.details.speed_Limit
                                menu.options.data.remark = tree.right_active.details.remark
                                menu.options.data._id = tree.right_active.details._id
                            },
                            options: {
                                title: "编辑一个MySql",
                                row: 4,
                                behavior: {
                                    4: []
                                },
                                data: {
                                    db_type: 2,
                                    dsn: "",
                                    mode: '1',
                                    speed_Limit: '0',
                                    remark: ""
                                },
                                controls: [
                                    {
                                        name: "dsn",
                                        type: "text",
                                        placeholder: "user:pwd@tcp(192.168.1.1:3306)/dbname?param=value",
                                        title:'提醒: dsn，必填, user:pwd@tcp(192.168.1.1:3306)/dbname?param=value。'
                                    }, {
                                        name: "mode",
                                        type: "select",
                                        placeholder: "模式限制",
                                        options: [
                                            {
                                                value: '1',
                                                label: '只读'
                                            }, {
                                                value: '2',
                                                label: '只写'
                                            }, {
                                                value: '3',
                                                label: '读写'
                                            }
                                        ],
                                        value: '1',
                                        title: '提醒: 模式限制，必填。'
                                    }, {
                                        name: "speed_Limit",
                                        type: "text",
                                        placeholder: "频率限制",
                                        title:'提醒: 频率限制, 正整数, 0或大于等于10, 0表示不限制, 单位: 次/S'
                                    }, {
                                        name: "remark",
                                        type: "text",
                                        placeholder: "备注",
                                        title:'提醒: 备注'
                                    }
                                ]
                            }
                        }, {
                            name: "禁用...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'del_db',
                            options: {
                                key : "db_mysql_ping",
                                msg : "是否确认禁用当前MySQL？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mysqlData = tree.right_active;
                                    store.spinOpen();
                                    api.trueDelDbserver({
                                        db_type: 2,
                                        _id: mysqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.funs.tree.init(() => {
                                                    store.spinClose();
                                                    store.errMsgOpen('OK', 'ok');
                                                });
                                            })
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "失效...",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            auth: "clear_redispish",
                            options: {
                                key: "db_mysql_ping",
                                msg: "是否确认失效当前MySQL？",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mysqlData = tree.right_active;
                                    store.spinOpen();
                                    api.clearDbserver({
                                        db_type: 2,
                                        _id: mysqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            });
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "属性",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "attribute",
                            quick: "",
                            func: (modal) => {
                                let tree = store.content.middle.center.menus.menus[0].tree;
                                let dsfData = tree.right_active.details;
                                modal.row = 7;
                                modal.content = [
                                    {
                                        key: 'ID',
                                        value: dsfData._id
                                    }, {
                                        key: '类型',
                                        value: "MySql"
                                    }, {
                                        key: 'DSN',
                                        value: dsfData.dsn
                                    }, {
                                        key: '模式限制',
                                        value:comm.modeType(dsfData.mode)
                                    }, {
                                        key: '频率限制',
                                        value: `${dsfData.speed_Limit} 次/s`
                                    }, {
                                        key: 'Ping',
                                        value: comm.isPing(dsfData.is_ping)
                                    }, {
                                        key: '备注',
                                        value: dsfData.remark
                                    }
                                ];
                            }
                        }
                    ],
                    db_redis: [
                        {
                            name: "Ping",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            auth: "ping_db",
                            options: {
                                key: "db_redis_ping",
                                msg: "是否Ping当前数据源？",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let redisData = tree.right_active;
                                    store.spinOpen();
                                    api.pingDbserver({
                                        db_type: 1,
                                        _id: redisData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            });
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'redis_push',
                            options: {
                                key : "db_redis_push",
                                msg : "是否确认推送当前Redis？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let redisData = tree.right_active;
                                    store.spinOpen();
                                    api.redisPushOne({
                                        db_type: 1,
                                        _id: redisData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送Mode",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'mode_push',
                            options: {
                                key : "db_redis_push",
                                msg : "是否确认推送当前MySQL的mode？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let redisData = tree.right_active;
                                    store.spinOpen();
                                    api.pushMode({
                                        db_type: 1,
                                        _id: redisData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送频率",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'speed_push',
                            options: {
                                key : "db_redis_push",
                                msg : "是否确认推送当前MySQL的频率？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let redisData = tree.right_active;
                                    store.spinOpen();
                                    api.pushSpeed({
                                        db_type: 1,
                                        _id: redisData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "编辑...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "db",
                            auth: 'edit_dbinfo',
                            func: (modal, menu) => {
                                const tree = store.content.middle.center.menus.menus[0].tree;
                                menu.options.data.db_type = 1
                                menu.options.data.redis_type = tree.right_active.details.redis_type.toString()
                                menu.options.data.env = tree.right_active.details.env
                                menu.options.data.skyeye = tree.right_active.details.skyeye
                                if (menu.options.data.skyeye === '') {
                                    if(menu.options.data.redis_type === '1') menu.options.row = 7
                                    if(menu.options.data.redis_type === '0') menu.options.row = 6
                                    if(menu.options.data.redis_type === '2') menu.options.row = 6
                                } else {
                                    console.log(111,menu.options)
                                    if(menu.options.data.redis_type === '2') {
                                        menu.options.data.redis_type = '-1'
                                        menu.options.row = 5
                                    }
                                }
                                menu.options.data.config_name = tree.right_active.details.config_name
                                menu.options.data.proj_tag = tree.right_active.details.proj_tag
                                menu.options.data.proj_name = tree.right_active.details.proj_name
                                menu.options.data.dsn = tree.right_active.details.dsn
                                menu.options.data.auth = tree.right_active.details.auth
                                menu.options.data.mode = tree.right_active.details.mode.toString()
                                menu.options.data.speed_limit = tree.right_active.details.speed_limit
                                menu.options.data.conn_timeout = tree.right_active.details.conn_timeout
                                menu.options.data.read_timeout = tree.right_active.details.read_timeout
                                menu.options.data.write_timeout = tree.right_active.details.write_timeout
                                menu.options.data.remark = tree.right_active.details.remark
                                menu.options.data._id = tree.right_active.details._id
                            },
                            options: {
                                title: "编辑一个Redis",
                                row: 6,
                                behavior: {
                                    5: ["config_name", "proj_tag", "proj_name","dsn","auth"],
                                    6: ["config_name", "proj_tag", "proj_name", "skyeye"],
                                    7: ["skyeye"]
                                },
                                data: {
                                    db_type: 1,
                                    redis_type: '0',
                                    config_name: "",
                                    proj_tag: "",
                                    proj_name: "",
                                    dsn: "",
                                    auth: "",
                                    mode: 3,
                                    speed_limit: 0,
                                    conn_timeout: 2000,
                                    read_timeout: 2000,
                                    write_timeout: 2000,
                                    remark: ""
                                },
                                controls: [
                                    {
                                        name: "env",
                                        type: "select",
                                        placeholder: "环境类型",
                                        options: [
                                            {
                                                value: 'test',
                                                label: '测试'
                                            },{
                                                value: 'stage',
                                                label: '预发'
                                            }, {
                                                value: 'product',
                                                label: '生产'
                                            }
                                        ],
                                        title: '提醒: 环境类型 必填'
                                    },
                                    {
                                        name: "redis_type",
                                        type: "select",
                                        placeholder: "redis类型",
                                        disabled: true,
                                        options: [
                                            {
                                                value: '-1',
                                                label: '统一缓存'
                                            },{
                                                value: '0',
                                                label: 'redis'
                                            }, {
                                                value: '1',
                                                label: 'redisProxy'
                                            }, {
                                                value: '2',
                                                label: 'redisCluster'
                                            }
                                        ],
                                        title: 'redis类型'
                                    }, {
                                        name: "skyeye",
                                        type: "text",
                                        placeholder: "请输入天眼标识...",
                                        title: '提醒: 请输入天眼标识...'
                                    },{
                                        name: "config_name",
                                        type: "text",
                                        placeholder: "configName",
                                        class: "three-width left",
                                        title: '提醒: configName'
                                    }, {
                                        name: "proj_tag",
                                        type: "text",
                                        placeholder: "projTag",
                                        class: "three-width center",
                                        title: '提醒: projTag'
                                    }, {
                                        name: "proj_name",
                                        type: "text",
                                        placeholder: "projName",
                                        class: "three-width",
                                        title: '提醒: projName'
                                    }, {
                                        name: "dsn",
                                        type: "text",
                                        placeholder: "ipPort",
                                        class: "half-width",
                                        title: '提醒: ipPort，必填, 192.168.1.1:6379，RedisCluster类型支持,分隔多个ipPort。'
                                    }, {
                                        name: "auth",
                                        type: "text",
                                        placeholder: "auth",
                                        class: "half-width right",
                                        title: '提醒: auth'
                                    }, {
                                        name: "mode",
                                        type: "select",
                                        placeholder: "模式限制",
                                        options: [
                                            {
                                                value: '1',
                                                label: '只读'
                                            }, {
                                                value: '2',
                                                label: '只写'
                                            }, {
                                                value: '3',
                                                label: '读写'
                                            }
                                        ],
                                        value: '1',
                                        title:'提醒: 模式限制，必填。'
                                    }, {
                                        name: "speed_limit",
                                        type: "text",
                                        placeholder: "频率限制",
                                        class: "half-width left",
                                        title: '提醒: 频率限制, 正整数, 0或大于等于10, 0表示不限制, 单位: 次/S'
                                    }, {
                                        name: "conn_timeout",
                                        type: "text",
                                        placeholder: "连接超时",
                                        class: "half-width right",
                                        title: '提醒: 连接超时，必填, 1000-30000, 单位: ms'
                                    }, {
                                        name: "read_timeout",
                                        type: "text",
                                        placeholder: "读取超时",
                                        class: "half-width left",
                                        title: '提醒: 读取超时，必填, 500-30000, 单位: ms'
                                    }, {
                                        name: "write_timeout",
                                        type: "text",
                                        placeholder: "写入超时",
                                        class: "half-width right",
                                        title: '提醒: 写入超时，必填, 500-30000, 单位: ms'
                                    }, {
                                        name: "remark",
                                        type: "text",
                                        placeholder: "备注",
                                        title: '提醒: 备注'
                                    }
                                ]
                            }
                        }, {
                            name: "删除...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'del_db',
                            options: {
                                key : "db_redis_clear",
                                msg : "是否确认禁用当前Redis？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let redislData = tree.right_active;
                                    store.spinOpen();
                                    api.trueDelDbserver({
                                        db_type: 1,
                                        _id: redislData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            })
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "失效...",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            auth: 'clear_redispish',
                            options: {
                                key: "db_redis_ping",
                                msg: "是否确认失效当前Redis？",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let redislData = tree.right_active;
                                    store.spinOpen();
                                    api.clearDbserver({
                                        db_type: 1,
                                        _id: redislData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "属性",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "attribute",
                            quick: "",
                            func: (modal) => {
                                let tree = store.content.middle.center.menus.menus[0].tree;
                                let redislData = tree.right_active.details;
                                modal.row = 9;
                                modal.content = [
                                    {
                                        key: 'ID',
                                        value: redislData._id
                                    }, {
                                        key: '类型',
                                        value: "Redis"
                                    }, {
                                        key: 'IP port',
                                        value: redislData.dsn
                                    }, {
                                        key: '模式限制',
                                        value: comm.modeType(redislData.mode)
                                    }, {
                                        key: '频率限制',
                                        value: `${redislData.speed_limit} 次/s`
                                    }, {
                                        key: '连接超时',
                                        value: `${redislData.conn_timeout} ms`
                                    }, {
                                        key: '读取超时',
                                        value: `${redislData.read_timeout} ms`
                                    }, {
                                        key: 'Ping',
                                        value: comm.isPing(redislData.is_ping)
                                    }, {
                                        key: '备注',
                                        value: redislData.remark
                                    }
                                ];
                            }
                        }
                    ],
                    db_mongodb: [
                        {
                            name: "Ping",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            options: {
                                key: "db_mongodb_ping",
                                msg: "是否Ping当前数据源？",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mongodbData = tree.right_active;
                                    store.spinOpen();
                                    api.pingDbserver({
                                        db_type: 3,
                                        _id: mongodbData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            });
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'redis_push',
                            options: {
                                key : "db_mongodb_push",
                                msg : "是否确认推送当前数据源？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mongodbData = tree.right_active;
                                    store.spinOpen();
                                    api.redisPushOne({
                                        db_type: 3,
                                        _id: mongodbData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "编辑...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "db",
                            auth: 'edit_dbinfo',
                            func: (modal, menu) => {
                                const tree = store.content.middle.center.menus.menus[0].tree;
                                menu.options.data.db_type = 3
                                menu.options.data.dsn = tree.right_active.details.dsn
                                menu.options.data.mode = tree.right_active.details.mode.toString()
                                menu.options.data.conn_timeout = tree.right_active.details.conn_timeout
                                menu.options.data.read_timeout = tree.right_active.details.read_timeout
                                menu.options.data.write_timeout = tree.right_active.details.write_timeout
                                menu.options.data.remark = tree.right_active.details.remark
                                menu.options.data._id = tree.right_active.details._id
                            },
                            options: {
                                title: "编辑一个MongoDB",
                                row: 5,
                                behavior: {
                                    5: []
                                },
                                data: {},
                                controls: [
                                    {
                                        name: "dsn",
                                        type: "text",
                                        placeholder: "mongodb://user:password@192.168.1.1:27017/test",
                                        title: '提醒: dsn，必填, mongodb://user:password@192.168.1.1:27017/test。'
                                    }, {
                                        name: "mode",
                                        type: "select",
                                        placeholder: "模式限制",
                                        options: [
                                            {
                                                value: '1',
                                                label: '只读'
                                            }, {
                                                value: '2',
                                                label: '只写'
                                            }, {
                                                value: '3',
                                                label: '读写'
                                            }
                                        ],
                                        value: 1,
                                        title: '提醒: 模式限制，必填。'
                                    }, {
                                        name: "conn_timeout",
                                        type: "text",
                                        placeholder: "2000",
                                        title: '提醒: 连接超时，必填, 1000-30000, 单位: ms'
                                    }, {
                                        name: "read_timeout",
                                        type: "text",
                                        placeholder: "2000",
                                        class: "half-width left",
                                        title: '提醒: 读取超时，必填, 500-30000, 单位: ms'
                                    }, {
                                        name: "write_timeout",
                                        type: "text",
                                        placeholder: "2000",
                                        class: "half-width right",
                                        title: '提醒: 写入超时，必填, 500-30000, 单位: ms'
                                    }, {
                                        name: "remark",
                                        type: "text",
                                        placeholder: "备注",
                                        title: '提醒: 备注'
                                    }
                                ]
                            }
                        }, {
                            name: "禁用...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'del_db',
                            options: {
                                key : "db_mongo_clear",
                                msg : "是否确认禁用当前mongodb？该数据源不在显示在项目中!",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mongoData = tree.right_active;
                                    store.spinOpen();
                                    api.trueDelDbserver({
                                        db_type: 3,
                                        _id: mongoData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            })
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "失效...",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            auth: 'clear_redispish',
                            options: {
                                key: "db_mongo_delete",
                                msg: "是否确认失效当前mongodb？",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mongoData = tree.right_active;
                                    store.spinOpen();
                                    api.clearDbserver({
                                        db_type: 3,
                                        _id: mongoData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "属性",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "attribute",
                            quick: "",
                            func: (modal) => {
                                let tree = store.content.middle.center.menus.menus[0].tree;
                                let mongoData = tree.right_active.details;
                                modal.row = 9;
                                modal.content = [
                                    {
                                        key: 'ID',
                                        value: mongoData._id
                                    }, {
                                        key: '类型',
                                        value: "MongoDB"
                                    }, {
                                        key: 'dsn',
                                        value: mongoData.dsn
                                    }, {
                                        key: '模式限制',
                                        value: comm.modeType(mongoData.mode)
                                    }, {
                                        key: '连接超时',
                                        value: `${mongoData.conn_timeout} ms`
                                    }, {
                                        key: '读取超时',
                                        value: `${mongoData.read_timeout} ms`
                                    }, {
                                        key: '写入超时',
                                        value: `${mongoData.write_timeout} ms`
                                    }, {
                                        key: 'Ping',
                                        value: comm.isPing(mongoData.is_ping)
                                    }, {
                                        key: '备注',
                                        value: mongoData.remark
                                    }
                                ];
                            }
                        }
                    ],
                    db_mssql: [
                        {
                            name: "Ping",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            auth: 'edit_dbinfo',
                            options: {
                                key: "db_mssql_ping",
                                msg: "是否Ping当前数据源？",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mssqlData = tree.right_active;
                                    store.spinOpen();
                                    api.pingDbserver({
                                        db_type: 4,
                                        _id: mssqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            });
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'redis_push',
                            options: {
                                key : "db_mssql_push",
                                msg : "是否确认推送当前数据源？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mssqlData = tree.right_active;
                                    store.spinOpen();
                                    api.redisPushOne({
                                        db_type: 4,
                                        _id: mssqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送Mode",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'mode_push',
                            options: {
                                key : "db_mssql_push",
                                msg : "是否确认推送当前MySQL的mode？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mssqlData = tree.right_active;
                                    store.spinOpen();
                                    api.pushMode({
                                        db_type: 4,
                                        _id: mssqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "推送频率",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'speed_push',
                            options: {
                                key : "db_mssql_push",
                                msg : "是否确认推送当前MySQL的频率？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mssqlData = tree.right_active;
                                    store.spinOpen();
                                    api.pushSpeed({
                                        db_type: 4,
                                        _id: mssqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "编辑...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "db",
                            func: (modal, menu) => {
                                const tree = store.content.middle.center.menus.menus[0].tree;
                                menu.options.data.db_type = 4
                                menu.options.data.dsn = tree.right_active.details.dsn
                                menu.options.data.mode = tree.right_active.details.mode.toString()
                                menu.options.data.speed_Limit = tree.right_active.details.speed_Limit
                                menu.options.data.remark = tree.right_active.details.remark
                                menu.options.data._id = tree.right_active.details._id
                            },
                            options: {
                                title: "编辑一个MSSql",
                                row: 4,
                                behavior: {
                                    4: []
                                },
                                data: {
                                    db_type: 4,
                                    dsn : '',
                                    mode: '1',
                                    speed_Limit: 0,
                                    remark: '',
                                    _id : ''
                                },
                                controls: [
                                    {
                                        name: "dsn",
                                        type: "text",
                                        placeholder: "server=10.100.41.15;user id=test;password=test;database=test;port=1433",
                                        title:'提醒: 只支持ADO模式,必填。'
                                    }, {
                                        name: "mode",
                                        type: "select",
                                        placeholder: "只读",
                                        options: [
                                            {
                                                value: '1',
                                                label: '只读'
                                            }, {
                                                value: '2',
                                                label: '只写'
                                            }, {
                                                value: '3',
                                                label: '读写'
                                            }
                                        ],
                                        value: "1",
                                        title: '提醒: 模式限制，必填。'
                                    }, {
                                        name: "speed_Limit",
                                        type: "text",
                                        placeholder: "频率限制",
                                        title:'提醒: 频率限制, 正整数, 0或大于等于10, 0表示不限制, 单位: 次/S'
                                    }, {
                                        name: "remark",
                                        type: "text",
                                        placeholder: "备注",
                                        title:'提醒: 备注'
                                    }
                                ]
                            }
                        }, {
                            name: "禁用...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "confirm",
                            auth: 'del_db',
                            options: {
                                key : "db_mssql_ping",
                                msg : "是否确认禁用当前MsSQL？",
                                func : () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mssqlData = tree.right_active;
                                    store.spinOpen();
                                    api.trueDelDbserver({
                                        db_type: 4,
                                        _id: mssqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            })
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "失效...",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            auth: 'clear_redispish',
                            options: {
                                key: "db_mssql_ping",
                                msg: "是否确认失效当前MsSQL？",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let mssqlData = tree.right_active;
                                    store.spinOpen();
                                    api.clearDbserver({
                                        db_type: 4,
                                        _id: mssqlData.details._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.spinClose();
                                            store.errMsgOpen('OK', 'ok');
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "属性",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "attribute",
                            quick: "",
                            func: (modal) => {
                                let tree = store.content.middle.center.menus.menus[0].tree;
                                let mssqlData = tree.right_active.details;
                                modal.row = 7;
                                modal.content = [
                                    {
                                        key: 'ID',
                                        value: mssqlData._id
                                    }, {
                                        key: '类型',
                                        value: "MsSql"
                                    }, {
                                        key: 'DSN',
                                        value: mssqlData.dsn
                                    }, {
                                        key: '模式限制',
                                        value: comm.modeType(mssqlData.mode)
                                    }, {
                                        key: '频率限制',
                                        value: `${mssqlData.speed_Limit} 次/s`
                                    }, {
                                        key: 'Ping',
                                        value: comm.isPing(mssqlData.is_ping)
                                    }, {
                                        key: '备注',
                                        value: mssqlData.remark
                                    }
                                ];
                            }
                        }
                    ],
                    db_dsf: [
                        {
                            name: "编辑...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "db",
                            auth: 'edit_dbinfo',
                            func: (modal, menu) => {
                                const tree = store.content.middle.center.menus.menus[0].tree;
                                menu.options.data.db_type = 5
                                menu.options.data.dsf_name = tree.right_active.details.dsf_name
                                menu.options.data.service_name = tree.right_active.details.service_name
                                menu.options.data.version = tree.right_active.details.version
                                menu.options.data.method = tree.right_active.details.method
                                menu.options.data.rname = tree.right_active.details.rname
                                menu.options.data.rversion = tree.right_active.details.rversion
                                menu.options.data.tag = tree.right_active.details.tag.toString()
                                menu.options.data._id = tree.right_active.details._id
                            },
                            options: {
                                title: "编辑一个DSF",
                                row: 7,
                                behavior: {
                                    7: []
                                },
                                data: {
                                    db_type: 5,
                                    dsf_name: '',
                                    service_name: '',
                                    version: '',
                                    method: '',
                                    rname: '',
                                    rversion: '',
                                    tag: ''
                                },
                                controls: [
                                    {
                                        name: "dsf_name",
                                        type: "text",
                                        placeholder: "名称",
                                        title: '提醒: 名称'
                                    }, {
                                        name: "service_name",
                                        type: "text",
                                        placeholder: "服务器全名",
                                        title: '提醒: 服务器全名'
                                    }, {
                                        name: "version",
                                        type: "text",
                                        placeholder: "版本号",
                                        title: '提醒: 版本号'
                                    }, {
                                        name: "method",
                                        type: "text",
                                        placeholder: "方法",
                                        title: '提醒: 方法'
                                    }, {
                                        name: "rname",
                                        type: "text",
                                        placeholder: "调用方名称",
                                        title: '提醒: 调用方名称'
                                    }, {
                                        name: "rversion",
                                        type: "text",
                                        placeholder: "调用方版本",
                                        title: '提醒: 调用方版本'
                                    }, {
                                        name: "tag",
                                        type: "text",
                                        placeholder: "标签",
                                        title: '提醒: 标签'
                                    }
                                ]
                            }

                        },
                        {
                            name: "调试...",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "db",
                            auth: "debug_dsf",
                            func: (modal, menu) => {
                                const tree = store.content.middle.center.menus.menus[0].tree;
                                menu.options.data.db_type = 5
                                menu.options.data.dsf_name = tree.right_active.details.dsf_name
                                menu.options.data.service_name = tree.right_active.details.service_name
                                menu.options.data.version = `${tree.right_active.details.version}/${tree.right_active.details.method}`
                                menu.options.data.method = tree.right_active.details.method
                                menu.options.data.rname = tree.right_active.details.rname
                                menu.options.data.rversion = tree.right_active.details.rversion
                                menu.options.data._id = tree.right_active.details._id
                                menu.options.data.dsf_param = '{"name":"test"}';
                            },
                            options: {
                                btnName: '调试',
                                title: "调试",
                                row: 7,
                                behavior: {
                                    7: []
                                },
                                data: {
                                    db_type: 5,
                                    _id :'',
                                    dsf_param: '{"name":"test"}'
                                },
                                controls: [
                                    {
                                        name: "_id",
                                        type: "text",
                                        placeholder: "数据源ID",
                                        readonly: true,
                                        title: '数据源ID'
                                    },
                                    {
                                        name: "dsf_name",
                                        type: 'text',
                                        placeholder: "数据源名称",
                                        class: "three-width left",
                                        readonly: true,
                                        title: '数据源名称'
                                    }, {
                                        name: "service_name",
                                        type: "text",
                                        placeholder: "服务器全名",
                                        class: "three-width center",
                                        readonly: true,
                                        title: '服务器全名'
                                    }, {
                                        name: "version",
                                        type: "text",
                                        placeholder: "版本/方法",
                                        class: "three-width",
                                        readonly: true,
                                        title: '版本/方法'
                                    },{
                                        name: "rname",
                                        type: "text",
                                        placeholder: "调用方名称",
                                        class: "half-width",
                                        readonly: true,
                                        title: '调用方名称'
                                    }, {
                                        name: "rversion",
                                        type: "text",
                                        placeholder: "调用方版本",
                                        class: "half-width right",
                                        readonly: true,
                                        title: '调用方版本'
                                    }, {
                                        name: "dsf_param",
                                        type: "textarea",
                                        placeholder: "JSON格式参数",
                                        title: 'JSON格式参数'
                                    }, {
                                        name: "param",
                                        type: "textarea",
                                        class:'margin_bottom_0 param',
                                        placeholder: "调试结果",
                                        readonly: true,
                                        title: '调试结果'
                                    }
                                ]
                            }

                        },  {
                            name: "删除...",
                            icon: "",
                            quick: "",
                            key: "confirm",
                            auth: 'del_dsf',
                            options: {
                                key: "db_dsf_delete",
                                msg: "是否删除该dsf数据源?",
                                func: () => {
                                    let tree = store.content.middle.center.menus.menus[0].tree;
                                    let dsfData = tree.right_active;
                                    api.delDbserver({
                                        db_type: 5,
                                        _id: dsfData.details._id,
                                        is_delete: true
                                    }, (res) => {
                                        store.spinOpen();
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen('OK', 'ok');
                                            });
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(res.msg);
                                        }
                                    });
                                }
                            }
                        }, {
                            name: "属性",
                            icon: "",
                            class: "merge",
                            quick: "",
                            key: "attribute",
                            quick: "",
                            func: (modal) => {
                                let tree = store.content.middle.center.menus.menus[0].tree;
                                let dsfData = tree.right_active.details;
                                modal.row = 8;
                                modal.content = [
                                    {
                                        key: 'ID',
                                        value: dsfData._id
                                    }, {
                                        key: '名称',
                                        value: dsfData.dsf_name
                                    }, {
                                        key: '服务器',
                                        value: dsfData.service_name
                                    }, {
                                        key: '版本号',
                                        value: dsfData.version
                                    }, {
                                        key: '方法',
                                        value: dsfData.method
                                    }, {
                                        key: '调用方名称',
                                        value: dsfData.rname
                                    },{
                                        key: '调用方版本',
                                        value: dsfData.rversion
                                    },{
                                        key: '标签',
                                        value: dsfData.tag
                                    }
                                ];
                            }
                        }
                    ]
                }
            }
        }
    ]
}
