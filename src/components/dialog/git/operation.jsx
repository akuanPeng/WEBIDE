import React, { Component } from 'react';

class Operation extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.operation = store.dialog.git.operation;
    }
    render() {
        return (
            <operation>
                {
                    this.operation.list.map((item, i) => {
                        let auth_value = false;
                        if (!item.auth) {
                            auth_value = true;
                        } else {
                            if (typeof item.auth === 'string') {
                                auth_value = perms.data[item.auth] && perms.data[item.auth][perms.key];
                            } else {
                                let at = true;
                                item.auth.forEach((a) => {
                                    if (!(perms.data[a] && perms.data[a][perms.key])) {
                                        at = false;
                                    }
                                });
                                auth_value = at;
                            }
                        }
                        return auth_value ? <div id={item.key} key={i} className={`ide-git-opt ${item.value == 0 ? '' : item.class}`} onClick={this.handleOptClick.bind(this, item)}>
                            <div className={`${item.value == 0 || item.value == undefined ? 'hide' : ''} git-number`}>{item.value}</div>
                            <i className={item.icon}></i>
                            <br />
                            <span>{item.title}</span>
                        </div> : ''
                    })
                }
                <div className="ide-git-opt right hide">
                    <i className="icon-cog"></i>
                    <br />
                    <span>设置</span>
                </div>
            </operation>
        );
    }
    handleOptClick(opt) {
        if (!opt.class || opt.value === 0) return;
        // 功能提交
        if (opt.key === 'commit') {
            let files = store.dialog.git.resource.files;
            files.handleInputActivate();
        } else
        // 功能推送
        if (opt.key === 'push') {
            // 获取分支列表
            api.getBranchLocal((res) => {
                if (res.code === 0) {
                    let local = res.result,
                        active = '';
                    local.forEach((item, i) => {
                        if (/^\*/.test(item)) {
                            local[i] = `origin/${item.replace(/^\* /, '')}`;
                            active = item.replace(/^\* /, '');
                        } else {
                            local[i] = `origin/${item}`;
                        }
                    });
                    api.getBranchRemote((re) => {
                        if (re.code === 0) {
                            let dialog = store.dialog.git.dialog;
                            dialog.class = "active";
                            dialog.push.class = "active";
                            dialog.push.selected = active;
                            dialog.push.checked = active;
                            let list = [...local, ...re.result], s = new Set(), b = [];
                            list.map((item, index) => s.add(item));
                            for(let i of s) b.push(i)
                            dialog.push.list = b;
                            dialog.setState(dialog);
                        } else store.errMsgOpen(re.msg);
                    });
                } else store.errMsgOpen(res.msg);
            });
        } else
        // 拉取
        if (opt.key === 'pull') {
            api.getBranchRemote((re) => {
                if (re.code === 0) {
                    if (typeof re.result === 'object') {
                        let dialog = store.dialog.git.dialog;
                        dialog.class = "active";
                        dialog.pull.class = "active";
                        dialog.pull.list = re.result.map((item) => {
                            return {
                                value: item.replace(/^origin\//, ""),
                                text: item
                            }
                        });
                        dialog.setState(dialog);
                    } else {
                        store.infoMsgOpen(re.result);
                    }
                } else store.errMsgOpen(re.msg);
            });
        } else
        // 分支
        if (opt.key === 'branch') {
            let dialog = store.dialog.git.dialog;
            dialog.class = "active";
            dialog.branch.class = "active";
            dialog.setState(dialog);
        } else
        // 标签
        if (opt.key === 'tags') {
            // 查询最新tag
            api.tagsRemote((tags) => {
                if (tags.code === 0) {
                    if (typeof tags.result === 'object') {
                        const result = tags.result.sort((obj1, obj2) => {
                            let val1 = obj1['name'],
                                val2 = obj2['name'];
                            if (val1 > val2) {
                                return -1;
                            } else if (val1 < val2) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        let dialog = store.dialog.git.dialog;
                        dialog.class = "active";
                        dialog.tags.class = "active";
                        dialog.tags.tag = result[0] ? result[0].name : '';
                        dialog.setState(dialog);
                    } else store.infoMsgOpen(tags.result);
                } else store.errMsgOpen(tags.msg);
            });
        } else
        // 状态
        if (opt.key === 'state') {
            document.getElementById('git_tab_files').click();
        } else
        // 历史
        if (opt.key === 'history') {
            document.getElementById('git_tab_history').click();
        } else
        // 解决
        if (opt.key === 'resolve') {
            let files = store.dialog.git.resource.files;
            store.spinOpen();
            api.gitCommitAll({
                msg: '解决冲突'
            }, (res) => {
                if (res.code === 0) {
                    store.funs.tree.init((states) => {
                        files.isUpdate = true;
                        files.setState(files, () => {
                            store.spinClose();
                            store.infoMsgOpen(res.result);
                        });
                    })
                } else {
                    store.spinClose();
                    store.errMsgOpen(res.msg);
                }
            });
        }
    }
}
export default Operation;
