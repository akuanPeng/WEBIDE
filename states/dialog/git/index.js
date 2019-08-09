import Resource from './resource/index.js'
import Header from './header.js'
import Operation from './operation.js'

export default {
    header: Header,
    operation: Operation,
    resource: Resource,
    dialog: {
        class: '',
        branch: {
            active: "",
            class: "",
            checked: true
        },
        tags: {
            class: "",
            tag: "",
            checked: true
        },
        confirm: {
            class: "",
            options: {}
        },
        pull: {
            class: '',
            selected: '',
            list: []
        },
        push: {
            class: "",
            checked: '',
            selected: '',
            list: []
        },
        info: {
            class: '',
            msg: ''
        }
    }
}
