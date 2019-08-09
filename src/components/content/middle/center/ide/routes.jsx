import React, { Component } from 'react';

class Routes extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.routes = store.content.middle.center.ide.code_editor.routes;
    }
    render() {
        return (
            <div className={`ide-routes ${this.routes.class}`}>
                <div className="routes-header">
                    <i className="icon-th"></i>项目-路由【<span className="routes-count">{this.routes.count}/999</span>】
                    <i className="icon-plus" data-tip="添加路由" onClick={this.handleAddClick.bind(this)}></i>
                    <i className="icon-remove" data-tip="关闭" onClick={this.handleCloseClick.bind(this)}></i>
                </div>
                <div className="routes-list">
                    <ul className="list-root">
                        {
                            this.initTree(this.routes.tree)
                        }
                    </ul>
                </div>
            </div>
        );
    }
    // 渲染结束
    componentDidMount() {
        store.funs.routes = {
            initTreeData: this.initTreeData,
            sRoutes: this.sRoutes
        };
    }
    // 生成路由树
    initTree(tree) {
        let htmls = [], i=0;
        for (let key in tree) {
            i++;
            htmls[tree[key].is_dir ? 'unshift' : 'push'](tree[key].is_dir ? <li key={i-1}>
                <div
                    className="list-menu"
                    onClick={this.handleClick.bind(this, tree[key])}
                    onContextMenu={this.handleContextMenu.bind(this, 'dir', tree[key])}
                >
                    <span className={`menu-${tree[key].state}`}>▾</span>
                    <i className={`icon-folder-${tree[key].state}`}></i>
                    {key}
                </div>
                <ul className={`list-${tree[key].state}`}>
                    {
                        this.initTree(tree[key].children)
                    }
                </ul>
            </li> :
            <li key={i-1}>
                <div className="list-route"
                    onContextMenu={this.handleContextMenu.bind(this, 'file', tree[key])}
                >
                    <div className="list-sort">{tree[key].location[0]}</div>
                    <i className="icon-rss"></i>
                    {
                        (key === 'z♔/' ? '/' : key.replace(/^z♔/, '/')).split('♛')[0]
                    }
                    <div className="list-method">
                        {
                            comm.getMethods((key === 'z♔/' ? '/' : key.replace(/^z♔/, '/')).split('♛')[1])
                        }
                    </div>
                    <i className="icon-trash" onClick={this.handleDeleteClick.bind(this, tree[key])}></i>
                </div>
            </li>);
        }
        return htmls;
    }
    initTreeData(list, map) {
        for (let i=0, ilen=list.length; i < ilen; i++) {
            let paths = `${list[i].route}♛${list[i].method}`.split('/'),
                oldMap = map,
                pts = [];
            paths.shift();
            for (let j=0, jlen=paths.length; j < jlen; j++) {
                let name = paths[j] || '/',
                    is_dir = j !== (jlen - 1);
                name = is_dir ? name : `z♔${name}`;
                if (oldMap[name] === undefined) {
                    let ps = [...(pts || [])];
                    ps.push(name);
                    oldMap[name] = {
                        state: 'close',
                        paths: ps,
                        is_dir: is_dir,
                        location: [i],
                        children: is_dir ? {} : list[i]
                    };
                } else oldMap[name].location.push(i);
                pts = oldMap[name].paths || [];
                oldMap = oldMap[name].children;
            }
        }
        return map;
    }
    // 打开关闭路由菜单
    handleClick(tree) {
        tree.state = tree.state === 'close' ? 'open' : 'close';
        this.routes.setState(this.routes);
    }
    handleDeleteClick(route) {
        let dialog = store.dialog,
            modal = dialog.confirm;
        dialog.class = "active";
        modal.class = "active";
        modal.options = {
                key: "route",
                msg: "是否删除该路由？",
                func: () => {
                    let right_active = {...route};
                    if (right_active) {
                        try {
                            let location = right_active.location,
                                routes = JSON.parse(editor.getValue()),
                                newR = [];
                            for (let i=0; i < routes.length; i++)
                                if (location.indexOf(i) === -1)
                                    newR.push(routes[i]);
                            routes.count = newR.length;
                            this.routes.tree = this.initTreeData(newR, {});
                            this.routes.setState(this.routes, () => {
                                editor.setValue(JSON.stringify(newR));
                                CodeMirror.commands.save(editor);
                            });
                        }
                        catch(e) {}
                    }
                }
            };
        dialog.setState(dialog);
    }
    handleAddClick() {
        let dialog = store.dialog,
            modal = dialog.addroute;
        dialog.class = "active";
        modal.class = "active";
        modal.options = {
            isAdd: true,
            route: '',
            sort: "-1",
            method: 1,
            data: {
                route: "",
                controller_name: "",
                filters: [],
                method: ["1"],
                timeout: "3000",
                description: "",
                leonid_config: []
            }
        }
        dialog.setState(dialog);
    }
    handleCloseClick() {
        let routes = store.content.middle.center.ide.code_editor.routes;
        routes.class = '';
        routes.setState(routes);
    }
    sRoutes(cls) {
        let routes = store.content.middle.center.ide.code_editor.routes;
        routes.class = cls;
        routes.setState(routes);
    }
    handleContextMenu(type, route, e) {
        let routes = store.content.middle.center.ide.code_editor.routes;
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            routes.rightMenu[type],
            () => {
                routes.right_active = route;
            }, e
        );
    }
}
export default Routes;
