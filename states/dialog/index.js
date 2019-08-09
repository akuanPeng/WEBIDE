import Git from './git/index.js'

export default {
    class : "active",
    git : Git,
    confirm : {
        class : "",
        options : {}
    },
    db : {
        class: "",
        options: {}
    },
    addroute : {
        class: "",
        options: {
            isAdd : true,
            route : '',
            data : {
                route: "",
                controller_name: "",
                filters: [],
                method: ["1"],
                timeout: "3000",
                description: "",
                leonid_config: []
            }
        }
    },
    newfile : {
        class: "",
        dirTreeClass: "",
        paths: ['33429'],
        isOk: "newfileOk"
    },
    newdir : {
        class: "",
        dirTreeClass: "",
        isOk: "newdirOk"
    },
    rename : {
        class: "",
        options: {},
        isOk: "renameOk"
    },
    search : {
        class: "",
        value: "",
        title: "文件名称搜索",
        files: []
    },
    command : {
        logs: [],
        cmds: [],
        wz: 0,
        class: ""
    },
    loading : {
        class: "active"
    },
    setting : {
        class: "",
        title: "配置 > 通用",
        isOk: "settingOk",
        menus: [
            {
                name: "通用",
                class: "active",
                language: "语言",
                list: [
                    {
                        language: "中文"
                    }
                ]
            }, {
                name: "主题",
                class: "",
                list: [
                    {
                        theme: "黑色"
                    }
                ]
            },
             {
                name: "快捷键",
                class: "",
                list: [
                    {
                        name: "新建文件",
                        quick: "Alt+N"
                    }, {
                        name: "新建文件夹",
                        quick: "Ctrl+Alt+N"
                    }, {
                        name: "搜索",
                        quick: "Ctrl+P"
                    }, {
                        name: "保存全部",
                        quick: "Ctrl+Shift+S"
                    }, {
                        name: "退出",
                        quick: "Shift+ESC"
                    }, {
                        name: "撤销",
                        quick: "Ctrl+Z"
                    }, {
                        name: "重做",
                        quick: "Ctrl+Y"
                    }, {
                        name: "全选",
                        quick: "Ctrl+A"
                    }, {
                        name: "剪切",
                        quick: "Ctrl+X"
                    }, {
                        name: "复制",
                        quick: "Ctrl+C"
                    }, {
                        name: "复制路径",
                        quick: "Ctrl+Shift+C"
                    }, {
                        name: "粘贴",
                        quick: "Ctrl+V"
                    }, {
                        name: "格式化",
                        quick: "Ctrl+K"
                    }, {
                        name: "注释/反注释",
                        quick: "Ctrl+/"
                    }, {
                        name: "码字模式",
                        quick: "Ctrl+Alt+T"
                    }, {
                        name: "默认模式",
                        quick: "Ctrl+Alt+D"
                    }, {
                        name: "查找",
                        quick: "Ctrl+F"
                    }, {
                        name: "查找下一个",
                        quick: "Ctrl+G"
                    }, {
                        name: "查找上一个",
                        quick: "Ctrl+Shift+G"
                    }, {
                        name: "替换",
                        quick: "Ctrl+H"
                    }, {
                        name: "替换全部",
                        quick: "Ctrl+Shift+R"
                    }
                ]
            },
            {
                name: "其他",
                class: "",
                git: 'Git 地址',
                gitUrl:'',
                set: '设置前缀',
                setUrl: ''

            }
        ]
    },
    attribute : {
        class: "",
        title: "属性",
        content: []
    }
}
