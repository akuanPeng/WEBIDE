import List from './list.js'
import Files from './files.js'

export default {
    style: {
        width: "80%"
    },
    list: List,
    files: Files,
    footer: {
        list: [
            {
                name: "状态",
                class: "active",
                key: "files",
                submitClass: "active"
            },
            {
                name: "日志/历史",
                class: "",
                key: "history",
                submitClass: ""
            }
        ]
    }
}
