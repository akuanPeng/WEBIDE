export default {
    active: 'AUTO',
    menus: [
        {
            id: "console",
            text: "控制台",
            icon: "icon-laptop",
            class: ""
        },
        {
            id: "logs",
            text: "错误日志",
            icon: "icon-comment",
            class: ""
        }
    ],
    language: [
        {
            text: "CSS",
            value: "css"
        },
        {
            text: "EJS",
            value: "ejs"
        },
        {
            text: "HTML",
            value: "html"
        },
        {
            text: "JS",
            value: "js"
        },
        {
            text: "JSON",
            value: "json"
        },
        {
            text: "NodeJS",
            value: "nodejs"
        },
        {
            text: "TXT",
            value: "txt"
        }
    ],
    grammar: {
        lua: {},
        jquery: {},
        nodejs: {}
    },
    branch: {
        class: '',
        local: [],
        remote: []
    }
}
