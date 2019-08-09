import React, { Component } from 'react'
import Select from 'react-select';

class AddRoute extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.addroute = store.dialog.addroute;
        this.tree = store.content.middle.center.menus.menus[0].tree;
    }
    render() {
        const routes = store.content.middle.center.ide.code_editor.routes;
        return (
            <addroute className={`${this.addroute.class} bounceInDown animated`} style={{width: '600px', marginLeft: '-300px', marginTop: '-212px'}}>
                <div className="modal-header">
                    <div className="modal-header-title">{this.addroute.options ? '更新一个路由' : '创建一个路由'}</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    <input spellCheck="false"
                        name="route"
                        type="text"
                        placeholder="路由路径"
                        data-tip="路由路径"
                        className="form-control"
                        value={this.addroute.options.data.route}
                        onChange={this.handleChange.bind(this, 'route', false)}
                    />
                    <div data-tip="绑定控制器">
                        <Select name="controller_name" value={this.addroute.options.data.controller_name}
                            options={this.tree.controllers}
                            placeholder="绑定控制器"
                            resetValue=""
                            noResultsText="选项 (o@.@o) 走丢了..."
                            onChange={this.handleChange.bind(this, 'controller_name', false)}
                        />
                    </div>
                    <div data-tip="绑定过滤器">
                        <Select name="filters" value={this.addroute.options.data.filters || []} multi={true}
                            options={this.tree.filters}
                            placeholder="绑定过滤器"
                            resetValue={[]}
                            noResultsText="选项 (o@.@o) 走丢了..."
                            onChange={this.handleChange.bind(this, 'filters', true)}
                        />
                    </div>
                    <div data-tip="请求方式">
                        <Select name="method" value={this.addroute.options.data.method || []} multi={true}
                            options={[
                                { label: 'GET', value: "1" },
                                { label: 'POST', value: "2" },
                                { label: 'PUT', value: "4" },
                                { label: 'DELETE', value: "8" },
                                { label: 'OPTIONS', value: "16" },
                                { label: 'HEAD', value: "32" }
                            ]}
                            placeholder="请求方式"
                            resetValue={[]}
                            noResultsText="选项 (o@.@o) 走丢了..."
                            onChange={this.handleChange.bind(this, 'method', true)}
                        />
                    </div>
                    <input spellCheck="false"
                        name="timeout"
                        type="text"
                        placeholder="响应时间"
                        data-tip="响应时间"
                        className="form-control"
                        value={this.addroute.options.data.timeout}
                        onChange={this.handleChange.bind(this, 'timeout', false)}
                    />
                    <input spellCheck="false"
                        name="sort"
                        type="text"
                        placeholder="排序"
                        data-tip={`排序 0-${routes.count - 1}`}
                        className={`form-control ${this.addroute.options.sort === '-1' ? 'hide' : ''}`}
                        value={this.addroute.options.sort}
                        onChange={this.handleChange.bind(this, 'sort', false)}
                    />
                    <input spellCheck="false"
                        name="description"
                        type="text"
                        placeholder="描述"
                        data-tip="描述"
                        className="form-control"
                        value={this.addroute.options.data.description}
                        onChange={this.handleChange.bind(this, 'description', false)}
                    />
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span className="form-btn form-primary user_select" onClick={this.handleNewRouteClick.bind(this)}>确定</span>
                </div>
            </addroute>
        );
    }
    handleChange(name, multi, obj) {
        if (multi) {
           this.addroute.options.data[name] = obj.map((item) => item.value);
        } else {
            if (obj.value) {
                if (name === 'sort') {
                    this.addroute.options[name] = obj.value;
                } else {
                    this.addroute.options.data[name] = obj.value;
                }
            } else {
                if (name === 'sort') {
                    this.addroute.options[name] = obj.target.value;
                } else {
                    this.addroute.options.data[name] = obj.target.value;
                }
            }
        }
        this.addroute.setState(this.addroute);
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog;
        dialog.class = "";
        dialog.addroute.class = "";
        dialog.addroute.options = {
            isAdd: true,
            route: "",
            method: 1,
            sort: "-1",
            data: {
                route: "",
                controller_name: "",
                filters: [],
                method: ["1"],
                timeout: "3000",
                description: "",
                leonid_config: []
            }
        };
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 执行新建文件
    handleNewRouteClick() {
        store.spinOpen();
        try {
            let routes = JSON.parse(editor.getValue() || '[]'),
                r = this.addroute.options.data,
                isExists = false,
                _routes = store.content.middle.center.ide.code_editor.routes,
                timeout = r.timeout,
                method = r.method,
                num;
            r.timeout = parseInt(r.timeout || '0');
            r.method = eval(r.method.join('+')) || 0;
            // 判断路由是否存在
            for (let i=0; i < routes.length; i++) {
                if (!this.addroute.options.isAdd) {
                    if (routes[i].route === r.route && r.route !== this.addroute.options.route && routes[i].method === r.method) isExists = true;
                } else {
                    if (routes[i].route === r.route && routes[i].method === r.method) isExists = true;
                }
            }
            if (!isExists) {
                if (!this.addroute.options.isAdd) {
                    routes = routes.map((item, i) => {
                        if (item.route === this.addroute.options.route && item.method === this.addroute.options.method) {
                            num = i;
                            return r;
                        } else {
                            return item;
                        }
                    });
                    if (num !== undefined) {
                        // 调整位置
                        let rutHC = routes.splice(num, 1);
                        routes.splice(this.addroute.options.sort, 0, rutHC[0])
                    }
                } else {
                    routes.push(r);
                }
                let arrStr = [];
                for (let rte of routes) {
                	let filters = rte.leonid_config ? rte.filters.join('",\n      "') : '';
                	let leonid_config = rte.leonid_config ? rte.leonid_config.join('",\n      "') : '';
                	arrStr.push(
`{
	"route":"${rte.route}",
	"controller_name":"${rte.controller_name}",
	"filters":[${filters ? `\n      "${filters}"\n    ` : ''}],
	"method":${rte.method},
	"timeout":${rte.timeout},
	"description":"${rte.description}",
	"leonid_config":[${leonid_config ? `\n      "${leonid_config}"\n   ` : ''}]
}`
            	   );
                }
                editor.setValue(`[${arrStr.join(',')}]`);
                CodeMirror.commands.save(editor);
                _routes.count = routes.length;
                _routes.tree = store.funs.routes.initTreeData(routes, {});
                _routes.setState(_routes);
                this.handleCloseClick();
                store.spinClose();
            } else {
                store.spinClose();
                store.errMsgOpen('该路由已存在！');
                r.timeout = timeout;
                r.method = method;
            }
        } catch(e) {
            store.spinClose();
            store.errMsgOpen('路由文件内容格式化错误！');
        }
    }
}
export default AddRoute;
