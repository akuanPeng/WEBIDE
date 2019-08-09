export default {
    list: [
        {
            icon: "icon-arrow-up",
            class: "active",
            title: "提交",
            auth: 'commit_project',
            key: "commit"
        },
        {
            icon: "icon-ok-circle",
            class: "active",
            title: "解决冲突",
            auth: 'commit_all_project',
            key: "resolve"
        },
        {
            icon: "icon-download-alt",
            class: "active",
            title: "拉取",
            auth: ['pull_project', 'get_remote_branch'],
            key: "pull"
        },
        {
            icon: "icon-upload-alt",
            class: "active",
            title: "推送",
            auth: ['push_project', 'get_local_branch', 'get_remote_branch', 'get_git_log'],
            key: "push"
        },
        {
            icon: "icon-random",
            class: "active",
            title: "分支",
            auth: ['add_local_branch', 'add_remote_branch', 'checkout_branch', 'get_local_branch', 'get_remote_branch', 'get_git_log'],
            key: "branch"
        },
        {
            icon: "icon-tags",
            class: "active",
            title: "标签",
            auth: ['add_local_tag', 'push_tag', 'get_local_tag', 'get_git_log'],
            key: "tags"
        },
        {
            icon: "icon-file-alt",
            class: "active",
            title: "状态",
            key: "state"
        },
        {
            icon: "icon-list-alt",
            class: "active",
            title: "日志/历史",
            auth: 'get_git_log',
            key: "history"
        }
    ]
}
