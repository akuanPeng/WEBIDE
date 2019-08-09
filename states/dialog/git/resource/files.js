export default {
    submitClass: 'active',
    push: true,
    content: {
        style: {
            bottom: "38px"
        },
        store: {
            commitShow: {},
            style: {
                width: "50%",
                bottom: 0,
                top: 0
            },
            wait: [],
            list: [],
            right_active: null,
            rightMenu: {
                list: [
                    {
                        name: "移除",
                        icon: "icon-minus",
                        quick: "",
                        auth: 'reset_git_file',
                        func: () => {
                            let sto = store.dialog.git.resource.files.content.store,
                                active = sto.right_active;
                           document.getElementById(`list_${active.name}`).click();
                        }
                    },
                    {
                        name: "丢弃",
                        icon: "icon-reply",
                        quick: "",
                        module: "git",
                        auth: ["reset_git_file", "checkout_git_file"],
                        key: "confirm",
                        options: {
                            key: "reply",
                            type: "list",
                            msg: "是否确定丢弃[{{name}}]？",
                            func: () => {
                                let sto = store.dialog.git.resource.files.content.store,
                                    active = sto.right_active;
                                return active || {}
                            }
                        }
                    }
                ],
                wait: [
                    {
                        name: "添加",
                        icon: "icon-plus",
                        quick: "",
                        auth: 'add_git_file',
                        func: () => {
                            let sto = store.dialog.git.resource.files.content.store,
                                active = sto.right_active;
                            document.getElementById(`wait_${active.name}`).click();
                        }
                    },
                    {
                        name: "丢弃",
                        icon: "icon-reply",
                        quick: "",
                        module: "git",
                        auth: ["reset_git_file", "checkout_git_file"],
                        key: "confirm",
                        options: {
                            key: "reply",
                            type: "wait",
                            msg: "是否确定丢弃[{{name}}]？",
                            func: () => {
                                let sto = store.dialog.git.resource.files.content.store,
                                    active = sto.right_active;
                                return active || {}
                            }
                        }
                    }
                ]
            }
        },
        diff: {
            isDragAndDrop: false,
            pxThan: 0,
            mouseY: 0,
            style: {
                width: "50%",
                minWidth: "10%",
                maxWidth: "80%",
                bottom: 0,
                top: 0
            }
        },
        history: {
            class: "",
            location: -1,
            isDragAndDrop: false,
            pxThan: 0,
            mouseY: 0,
            header: [],
            rightMenu: {
                list: [
                    {
                        name: "标签",
                        icon: "icon-tags",
                        quick: "",
                        auth: ['add_local_tag', 'push_tag', 'get_local_tag', 'get_git_log'],
                        func: () => {
                            store.dialog.git.dialog.branch.sha1 = '';
                            document.getElementById('tags').click();
                        }
                    },
                    {
                        name: "分支",
                        icon: "icon-random",
                        quick: "",
                        auth: ['add_local_branch', 'add_remote_branch', 'checkout_branch', 'get_local_branch', 'get_remote_branch', 'get_git_log'],
                        func: () => {
                            store.dialog.git.dialog.tags.sha1 = '';
                            document.getElementById('branch').click();
                        }
                    }
                ]
            },
            list: [],
            style: {
                height: "0%",
                minHeight: "0%",
                maxHeight: "80%",
                left: 0,
                right: 0
            }
        }
    }
}
