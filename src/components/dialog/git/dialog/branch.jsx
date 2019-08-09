import React, { Component } from 'react'
import CheckBox from '../../../controls/checkbox.jsx'

class Branch extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.branch = store.dialog.git.dialog.branch;
    }
    render() {
        this.branch.checked = true;
        return (
            <branch className={`${this.state.class} bounceInDown animated`}>
                <div className="modal-header">
                    <div className="modal-header-title">创建一个分支 [ <span>当前分支：{this.state.active}，Commit：{this.branch.sha1}</span> ]</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    <input spellCheck="false" ref="branch" type="text" placeholder="分支名称" className="form-control" />
                    <CheckBox state={{
                        checked: this.branch.checked,
                        text: '是否立即推送到远端',
                        func: (checked) => {
                            this.branch.checked = checked;
                        }
                    }} />
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span className="form-btn form-primary user_select" onClick={this.handleBranchClick.bind(this)}>确定</span>
                </div>
            </branch>
        );
    }
    componentDidUpdate() {
        this.refs.branch.value = "";
        this.refs.branch.focus();
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog.git.dialog;
        dialog.class = "";
        dialog.branch.class = "";
        dialog.branch.sha1 = "";
        dialog.branch.checked = false;
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 执行新建分支
    handleBranchClick(e) {
        store.spinOpen();
        api.addBranchLocal({
            branch_name: this.refs.branch.value,
            sha1: this.branch.sha1
        }, (res) => {
            if (res.code === 0) {
                // 切换到已创建分支
                api.checkoutBranchLocal({
                    branch_name: this.refs.branch.value
                }, (re) => {
                    if (re.code === 0) {
                        if (this.branch.checked) {
                            api.addBranchRemote({
                                branch_name: this.refs.branch.value,
                                sha1: this.branch.sha1
                            }, (r) => {
                                if (r.code === 0) {
                                    this.handleCloseClick(() => {
                                        store.funs.list.getBranchLocal();
                                        store.funs.list.getBranchRemote();
                                        store.funs.history.getHistory(1);
                                        store.funs.tree.init();
                                        store.spinClose();
                                        store.infoMsgOpen(`${res.result}\r\n${re.result}\r\n${r.result}`);
                                    });
                                } else {
                                    store.funs.list.getBranchLocal();
                                    store.funs.history.getHistory(1);
                                    store.funs.tree.init();
                                    store.spinClose();
                                    store.errMsgOpen(r.msg);
                                }
                            });
                        } else {
                            this.handleCloseClick(() => {
                                store.funs.list.getBranchLocal();
                                store.funs.history.getHistory(1);
                                store.funs.tree.init();
                                store.spinClose();
                                store.infoMsgOpen(`${res.result}\r\n${re.result}`);
                            });
                        }
                    } else {
                        store.spinClose();
                        store.errMsgOpen(re.msg);
                    }
                });
            } else {
                store.spinClose();
                store.errMsgOpen(res.msg);
            }
        });
    }
}
export default Branch;
