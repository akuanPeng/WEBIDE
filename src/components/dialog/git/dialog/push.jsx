import React, { Component } from 'react'
import CheckBox from '../../../controls/checkbox.jsx'

class Push extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.push = store.dialog.git.dialog.push;
    }
    render() {
        return (
            <tags className={`${this.push.class} bounceInDown animated`}>
                <div className="modal-header">
                    <div className="modal-header-title">推送</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    {
                        this.push.list.map((item, i) => {
                            let value = item.replace(/^origin\//, '');
                            return value === this.push.checked ? <CheckBox key={i} state={{
                                checked: this.push.checked,
                                text: item,
                                value: value,
                                class: i ? '' : 'top_one',
                                func: (checked) => {
                                    let push = store.dialog.git.dialog.push;
                                    push.checked = checked;
                                    push.setState(push);
                                }
                            }} /> : ''
                        })
                    }
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span className="form-btn form-primary user_select" onClick={this.handlePushClick.bind(this)}>确定</span>
                </div>
            </tags>
        );
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog.git.dialog;
        dialog.class = "";
        dialog.push.class = "";
        dialog.push.checked = "";
        dialog.push.selected = "";
        dialog.push.list = [];
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 执行新建文件
    handlePushClick() {
        store.spinOpen();
        api.gitPush({ l_branch: this.push.selected, r_branch: this.push.checked }, (res) => {
            store.spinClose();
            if (res.code === 0) {
                this.handleCloseClick(() => {
                    store.funs.history.getHistory(1);
                    store.funs.tree.init();
                    store.infoMsgOpen(res.result);
                });
            } else {
                store.errMsgOpen(res.msg);
            }
        });
    }
}
export default Push;
