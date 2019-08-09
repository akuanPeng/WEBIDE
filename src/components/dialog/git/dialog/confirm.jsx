import React, { Component } from 'react';

class GitConfirm extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.confirm = store.dialog.git.dialog.confirm;
    }
    render() {
        return (
            <confirm open className={`${this.confirm.class} bounceInDown animated`}>
                <div className="modal-header">
                    <div className="modal-header-title">操作提醒！</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    {(this.confirm.options.msg || "").replace('{{name}}', this.confirm.options.func ? (this.confirm.options.func().name || this.confirm.options.func()) : "")}
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span className="form-btn form-primary user_select" onClick={this.handleOKClick.bind(this)}>确定</span>
                </div>
            </confirm>
        );
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog.git.dialog;
        dialog.class = "";
        dialog.confirm.class = "";
        dialog.confirm.options.key = "";
        dialog.confirm.options.msg = "";
        dialog.confirm.options.func = undefined;
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 执行删除
    handleOKClick() {
        switch (this.confirm.options.key) {
            case 'branch':
                store.spinOpen();
                api.delBranchLocal({ branch_name: this.confirm.options.func().trim() }, (res) => {
                    store.spinClose();
                    if (res.code === 0) {
                        this.handleCloseClick(() => {
                            store.funs.list.getBranchLocal();
                            store.funs.history.getHistory(1);
                            store.infoMsgOpen(res.result);
                        });
                    } else store.errMsgOpen(res.msg);
                });
                break;
            case 'remote':
                store.spinOpen();
                api.delBranchRemote({ branch_name: this.confirm.options.func().trim() }, (res) => {
                    store.spinClose();
                    if (res.code === 0) {
                        this.handleCloseClick(() => {
                            store.funs.list.getBranchRemote();
                            store.funs.history.getHistory(1);
                            store.infoMsgOpen(res.result);
                        });
                    } else store.errMsgOpen(res.msg);
                });
                break;
			case 'checkout_remote':
				store.spinOpen();
				api.checkoutBranchRemote({ branch_name: this.confirm.options.func().trim() }, (res) => {
					store.spinClose();
					if (res.code === 0) {
						store.funs.tree.init(() => {
							this.handleCloseClick(() => {
								store.funs.list.getBranchLocal();
								store.funs.history.getHistory(1);
								this.handleCloseClick(null);
								// 关闭所有页签
								let content = store.content,
									tabs = content.middle.center.ide.tabs,
									list = [...tabs.list];
								for (let i=0; i < list.length; i++)
									store.funs.tabs.closetab(0, content);
								content.setState(content);
								store.infoMsgOpen(res.result);
							});
						})
					} else store.errMsgOpen(res.msg);
				});
				break;
            case 'tags':
                let tag_name = this.confirm.options.func();
                store.spinOpen();
                api.deltaglocal({ tag_name: tag_name }, (res) => {
                    if (res.code === 0) {
                        api.deltag({ tag_name: tag_name }, (r) => {
                            store.spinClose();
                            if (r.code === 0) {
                                this.handleCloseClick(() => {
                                    store.funs.list.getTags();
                                    store.funs.history.getHistory(1);
                                    store.infoMsgOpen(`${res.result}\r\n${r.result}`);
                                });
                            } else store.errMsgOpen(r.msg);
                        });
                    } else {
                        store.spinClose();
                        store.errMsgOpen(res.msg);
                    }
                });
                break;
            case 'checkout':
                store.spinOpen();
                api.checkoutBranchLocal({ branch_name: this.confirm.options.func().trim() }, (res) => {
                    if (res.code === 0) {
                        store.funs.tree.init(() => {
                            if (/^Switched to branch '/.test(res.result) || !res.result.length) {
                                store.funs.list.getBranchLocal();
                                store.funs.history.getHistory(1);
                                this.handleCloseClick(null);
                                store.spinClose();
                                // 关闭所有页签
                                let content = store.content,
                                    tabs = content.middle.center.ide.tabs,
                                    list = [...tabs.list];
                                for (let i=0; i < list.length; i++)
                                    store.funs.tabs.closetab(0, content);
                                content.setState(content);
                                store.infoMsgOpen(res.result.length ? res.result : 'ok');
                            } else {
                                store.spinClose();
                                store.infoMsgOpen(res.result);
                            }
                        });
                    } else {
                        store.spinClose();
                        store.errMsgOpen(res.msg);
                    }
                });
                break;
            case 'reply':
                let obj = this.confirm.options.func();
                let type = obj.icon.trim();
                let file_name = obj.name.trim();
                let tabs = store.content.middle.center.ide.tabs;
                const index = tabs.tab_list.indexOf(file_name);
                if (type !== 'question' && type !== 'plus') {
                    store.spinOpen();
                    if (this.confirm.options.type !== 'list') {
                        api.checkoutGitFile({file_name: file_name}, (res) => {
                            if (res.code === 0) {
                                this.handleCloseClick(() => {
                                    if (res.result.length) {
                                        store.spinClose();
                                        store.infoMsgOpen(res.result);
                                    } else {
                                        let files = store.dialog.git.resource.files;
                                        store.funs.tree.init((states) => {
                                            files.isUpdate = true;
                                            files.setState(files, () => {
                                                if (index !== -1) store.funs.tabs.closetab(index, null, true);
                                                store.spinClose();
                                            });
                                        })
                                    }
                                });
                            } else {
                                store.spinClose();
                                store.errMsgOpen(res.msg);
                            }
                        });
                    } else {
                        api.resetGitFile({
                            file_path: file_name
                        }, (re) => {
                            if (re.code === 0) {
                                api.checkoutGitFile({
                                    file_name: file_name
                                }, (res) => {
                                    if (res.code === 0) {
                                        this.handleCloseClick(() => {
                                            if (res.result.length) {
                                                store.spinClose();
                                                store.infoMsgOpen(res.result);
                                            } else {
                                                let files = store.dialog.git.resource.files;
                                                store.funs.tree.init((states) => {
                                                    files.isUpdate = true;
                                                    files.setState(files, () => {
                                                        if (index !== -1) store.funs.tabs.closetab(index, null, true);
                                                        store.spinClose();
                                                    });
                                                })
                                            }
                                        });
                                    } else {
                                        store.spinClose();
                                        store.errMsgOpen(res.msg);
                                    }
                                });
                            } else {
                                store.spinClose();
                                store.errMsgOpen(re.msg);
                            }
                        });
                    }
                } else {
                    this.handleCloseClick(null);
                    store.errMsgOpen('抱歉，添加和未知状态文件无法被丢弃！');
                }
                break;
            case 'push':
                let tag = this.confirm.options.func().trim();
                store.spinOpen();
                api.pushtag({tag: tag}, (res) => {
                    store.spinClose();
                    if (res.code === 0) {
                        this.handleCloseClick(() => {
                            store.infoMsgOpen(res.result);
                        });
                    } else store.errMsgOpen(res.msg);
                })
                break;
            default:
        }
    }
}
export default GitConfirm;
