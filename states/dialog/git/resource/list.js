export default {
    isDragAndDrop: false,
    pxThan: 0,
    mouseX: 0,
    style: {
        width: "20%",
        minWidth: "10%",
        maxWidth: "50%"
    },
    right_active: null,
    list: [
        {
            title: "文件状态",
            class: "active",
            list: [
                {
                    title: "工作副本",
                    icon: 'icon-ok',
                    class: ""
                }
            ]
        },
        {
            title: "分支",
            class: "",
            key: "branch",
            list: []
        },
        {
            title: "标签",
            class: "",
            key: "tags",
            list: []
        },
        {
            title: "远程",
            class: "",
            key: "remote",
            list: []
        }
    ],
    rightMenu: {
        branch: [
            {
                name: "切换",
                icon: "icon-ok-sign",
                quick: "",
                module: "git",
                key: "confirm",
                auth: ['get_git_log', 'get_local_branch', 'get_git_log'],
                options: {
                    key: "checkout",
                    msg: "是否切换本地分支到[{{name}}]？",
                    func: () => {
                        let list = store.dialog.git.resource.list,
                            active = list.right_active;
                        return active ? active.title : "";
                    }
                }
            },
            {
                name: "删除",
                icon: "icon-trash",
                quick: "",
                module: "git",
                key: "confirm",
                auth: ['del_local_branch', 'get_local_branch', 'get_git_log'],
                options: {
                    key: "branch",
                    msg: "是否删除本地分支[{{name}}]？",
                    func: () => {
                        let list = store.dialog.git.resource.list,
                            active = list.right_active;
                        return active ? active.title : "";
                    }
                }
            }
        ],
        tags: [
            {
                name: "推送",
                icon: "icon-upload-alt",
                quick: "",
                module: "git",
                key: "confirm",
                auth: 'push_tag',
                options: {
                    key: "push",
                    msg: "是否将tag推送到远端？",
                    func: () => {
                        let list = store.dialog.git.resource.list,
                            active = list.right_active;
                        return active ? active.title : "";
                    }
                }
            },
            {
                name: "删除",
                icon: "icon-trash",
                quick: "",
                module: "git",
                key: "confirm",
                auth: ['del_local_tag', 'get_local_tag', 'del_remote_tag', 'get_git_log'],
                options: {
                    key: "tags",
                    msg: "是否删除标签[{{name}}]？",
                    func: () => {
                        let list = store.dialog.git.resource.list,
                            active = list.right_active;
                        return active ? active.title : "";
                    }
                }
            }
        ],
        remote: [
			{
				name: "检出",
                icon: "icon-download-alt",
                quick: "",
                module: "git",
                key: "confirm",
                auth: 'checkout_remote_branch',
                options: {
                    key: "checkout_remote",
                    msg: "是否检出远端分支[{{name}}]到本地？",
                    func: () => {
                        let list = store.dialog.git.resource.list,
                            active = list.right_active;
                        return (active ? active.title.replace(/^origin\//, '') : "").trim();
                    }
                }
			},
            {
                name: "删除",
                icon: "icon-trash",
                quick: "",
                module: "git",
                key: "confirm",
                auth: 'del_remote_branch',
                options: {
                    key: "remote",
                    msg: "是否删除远端分支[{{name}}]？",
                    func: () => {
                        let list = store.dialog.git.resource.list,
                            active = list.right_active;
                        return (active ? active.title.replace(/^origin\//, '') : "").trim();
                    }
                }
            }
        ]
    }
}
