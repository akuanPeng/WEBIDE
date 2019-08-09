import React, { Component } from 'react';

class Bottom extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.bottom = store.content.bottom;
        this.tabs = store.content.middle.center.ide.tabs;
    }
    render() {
        return (
            <bottom className={this.bottom.class}>
                <ul>
                    {
                      this.bottom.menus.map((item, i) => {
                        return <li id={item.id} key={i} value={i} className={item.class} onClick={this.handleOpenClick.bind(this, i)}>
                            <div className="icon-container" value={i}><i className={item.icon} value={i}></i></div>
                            <span value={i}>{item.text}</span>
                        </li>
                      })
                    }
                </ul>
                <div className="ide-language">
                    <ul>
                        {
                            this.bottom.language.map((item, i) => {
                                return <li key={i} data-value={item.value}>{item.text}</li>
                            })
                        }
                    </ul>
                    <span>
                        <div className={`select-language ${this.tabs.tab_list && this.tabs.tab_list.length ? '' : 'hide'}`}>{this.bottom.active}</div>
                    </span>
                </div>
                <div className={`ide-branch ${this.bottom.branch.class} ${this.tabs.tab_list && this.tabs.tab_list.length ? 'right-122' : ''}`}>
                    <div className="btnBranch"></div>
                    <img src={config.imgSrc + 'branch.png'}></img>
                    <span>{store.branch}</span>
                    <div className="branch-ui">
                        <div className="branch-ui-opt">
                            <div className="ui-opt-title">GIT分支操作</div>
                            <div className="ui-opt-body">
                                <div className="ui-opt-li" onClick={this.ts.bind(this)}>
                                    <span className="btn-opt-new"><i className="icon-plus"></i> 新建分支</span>
                                </div>
                                <div className="ui-opt-li" onClick={this.ts.bind(this)}>
                                    <span className="btn-opt-async"><i className="icon-refresh"></i> 同步项目</span>
                                </div>
                            </div>
                        </div>
                        <div className="branch-ui-local">
                            <span className="branch-ui-title"><img src={config.imgSrc + 'branch.png'}></img> 本地分支</span>
                            <div className="branch-ui-list">
                                <ul>
                                    {
                                        this.bottom.branch.local.map((item, i) => {
                                            const branch = item.match(/^\* ([\S]+)$/)
                                            return <li key={i} className={branch ? 'active' : ''}>
                                                <div className="branch-active">√</div>
                                                <i className="icon-exchange" data-place="top" data-tip="切换" onClick={this.checkoutBranch.bind(this)}></i>
                                                {branch ? branch[1] : item}
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="branch-ui-remote">
                            <span className="branch-ui-title"><img src={config.imgSrc + 'branch.png'}></img> 远端分支</span>
                            <div className="branch-ui-list">
                                <ul>
                                    {
                                        this.bottom.branch.remote.map((item, i) => {
                                            if (item.indexOf('->') != -1) {
                                                return ''
                                            } else {
                                                return <li key={i}>
                                                    <i className="icon-download-alt" data-place="top" data-tip="拉取" onClick={this.checkoutBranch.bind(this)}></i>
                                                    {item}
                                                </li>
                                            }
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </bottom>
        );
    }
    ts () {
        store.errMsgOpen('正在开发请耐心等待...', 'ok');
    }
    componentDidMount() {
        // 获取nodejs补全
        api.comple_api((nodejs) => {
            // 获取lua补全
            api.comple_api_lua((lua) => {
                // utils
                api.getFileContent({file_path: `utils/utils.${language === 'node' ? 'js' : 'lua'}`}, (res) => {
                    // 获得.eslintrc
                    api.getFileContent({file_path: `.eslintrc`}, (cfg) => {
                        if (cfg.code === 0) {
                            try {
                                store.cfg = JSON.parse(cfg.result.data).rules;
                            } catch (e) {
                                store.cfg = "";
                            }
                        }
                        let utils = {};
                        if (res.code === 0) utils = comm.utilsObj(res.result.data);
                        if (language === 'node') {
                            nodejs.utils = utils;
                        } else {
                            lua.utils = utils;
                        }
                        this.bottom.grammar.nodejs = nodejs;
                        this.bottom.grammar.lua = lua;
                        this.bottom.setState(this.bottom);
                    });
                });
            });
        });
        // 获取分支信息
        this.getBranchAll();
    }
    checkoutBranch() {
        store.errMsgOpen('正在开发请耐心等待...', 'ok');
    }
    // 查询分支列表
    getBranchAll() {
        // 获取本地分支列表
        api.getBranchLocal((local) => {
            if (local.code === 0) {
                // 获取本地分支列表
                api.getBranchRemote((remote) => {
                    if (remote.code === 0) {
                        const bottom = store.content.bottom;
                        bottom.branch.local = local.result;
                        bottom.branch.remote = remote.result;
                        bottom.setState(bottom);
                    } else store.errMsgOpen(remote.msg);
                });
            } else store.errMsgOpen(local.msg);
        });
    }
    // 打开板块容器
    handleOpenClick(i) {
        // 获取中央信息
        let center = store.content.middle.center;
        // 是否已关闭
        if (this.bottom.menus[i].class === "active") {
            // 关闭底部容器和扩大编辑区
            center.panels.style.height = "0%";
            center.panels.style.minHeight = "0%";
            center.panels.active = {};
            center.menus.style.bottom = "0%";
            center.tools.style.bottom = "0%";
            center.ide.style.bottom = "0%";
            // 取消选择
            this.bottom.menus[i].class = "";
        } else {
            // 打开底部容器和恢复编辑区
            center.panels.style.height = (center.panels.height || 20) + "%";
            center.panels.style.minHeight = (center.panels.minHeight || 10) + "%";
            center.panels.active = this.bottom.menus[i];
            center.menus.style.bottom = (center.panels.height || 20) + "%";
            center.tools.style.bottom = (center.panels.height || 20) + "%";
            center.ide.style.bottom = (center.panels.height || 20) + "%";
            // 设置选择
            this.bottom.menus = this.bottom.menus.map((item) => {
                item.class = "";
                return item;
            });
            this.bottom.menus[i].class = "active";
        }
        // 执行改变
        center.setState(center, () => {
            this.setState(this.bottom);
        });
    }
    handleBranchClick() {
        this.bottom.branch.class = this.bottom.branch.class ? '' : 'active';
        this.bottom.setState(this.bottom);
    }
}
export default Bottom;
