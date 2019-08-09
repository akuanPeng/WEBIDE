import React, { Component } from 'react'
import CheckBox from '../../../controls/checkbox.jsx'

class Tags extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.tags = store.dialog.git.dialog.tags;
    }
    render() {
        this.tags.checked = true;
        return (
            <tags className={`${this.tags.class} bounceInDown animated`}>
                <div className="modal-header">
                    <div className="modal-header-title">创建一个标签 [ <span>远端最新标签：{this.tags.tag}，Commit：{this.tags.sha1}</span> ]</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    <input spellCheck="false" ref="tag" type="text" placeholder="标签名称, 必须为: ^v\d+(\.\d+){1,2}$" className="form-control bottom" />
                    <input spellCheck="false" ref="msg" type="text" placeholder="标签描述" className="form-control" maxLength="50" />
                    <CheckBox state={{
                        checked: this.tags.checked,
                        text: '是否立即推送到远端',
                        func: (checked) => {
                            this.tags.checked = checked;
                        }
                    }} />
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span className="form-btn form-primary user_select" onClick={this.handleTagsClick.bind(this)}>确定</span>
                </div>
            </tags>
        );
    }
    componentDidUpdate() {
        this.refs.tag.value = "";
        this.refs.msg.value = "";
        this.refs.tag.focus();
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog.git.dialog;
        dialog.class = "";
        dialog.tags.class = "";
        dialog.tags.sha1 = "";
        dialog.tags.tag = "";
        dialog.tags.checked = false;
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    handleTagsClick() {
        store.spinOpen();
        api.addtag({ tag: this.refs.tag.value, msg: this.refs.msg.value, sha1: this.tags.sha1 }, (res) => {
            if (res.code === 0) {
                if (this.tags.checked) {
                    api.pushtag({ tag: this.refs.tag.value }, (r) => {
                        store.spinClose();
                        if (r.code === 0) {
                            this.handleCloseClick(() => {
                                store.funs.list.getTags();
                                store.funs.history.getHistory(1);
                                comm.autoIdentification(res.result, () => {
                                    comm.autoIdentification(r.result, () => {
                                        store.errMsgOpen(`addtag: OK, pushtag: OK`);
                                    });
                                });
                            });
                        } else store.errMsgOpen(r.result);
                    });
                } else {
                    store.spinClose();
                    this.handleCloseClick(() => {
                        store.funs.list.getTags();
                        store.funs.history.getHistory(1);
                        comm.autoIdentification(res.result);
                    });
                }
            } else {
				store.spinClose();
				store.errMsgOpen(res.msg);
			}
        });
    }
}
export default Tags;
