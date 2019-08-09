export default {
    crumbs: [],
    tools: [
        {
            icon: "icon-search",
            title: "搜索 Ctrl+P",
            key:"search",
            func: (menu, modal) => {
                let tree = store.content.middle.center.menus.menus[0].tree;
                modal.files = tree.files;
            }
        },
        {
            icon: "icon-cog",
            title: "配置 Ctrl+J",
            key:"setting"
        }
    ]
}
