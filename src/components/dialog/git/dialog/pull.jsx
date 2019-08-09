import React, { Component } from 'react'
import Select from '../../../controls/select.jsx'

class Pull extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.pull = store.dialog.git.dialog.pull;
    }
    render() {
        return (
            <tags className={`${this.pull.class} bounceInDown animated`}>
                <div className="modal-header">
                    <div className="modal-header-title">拉取 <span>注：拉取操作将会强制关闭编辑器内所有页签</span></div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    <Select state={{
                        value: store.branch || '',
                        class: "top_one",
                        placeholder: '请选择分支',
                        options: [{
                            text: `origin/${store.branch || 'master'}`,
                            value: store.branch
                        }],
                        func: (value) => {
                            this.pull.selected = value;
                        }
                    }}></Select>
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span className="form-btn form-primary user_select" onClick={this.handleTagsClick.bind(this)}>确定</span>
                </div>
            </tags>
        );
    }
    componentDidUpdate() {
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog.git.dialog;
        dialog.class = "";
        dialog.pull.class = "";
        dialog.pull.list = [];
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 执行新建文件
    handleTagsClick() {
        store.spinOpen();
        api.gitPull({ l_branch: store.branch, r_branch: store.branch || 'master' }, (res) => {
            if (res.code === 0) {
                store.funs.tree.init(() => {
                    store.spinClose();
                    this.handleCloseClick(() => {
                        // 关闭所有页签
                        let content = store.content,
                            tabs = content.middle.center.ide.tabs,
                            list = [...tabs.list];
                        for (let i=0; i < list.length; i++)
                            store.funs.tabs.closetab(0, content);
                        content.setState(content);
                        store.infoMsgOpen(res.result);
                    });
                });
            } else {
                store.spinClose();
                store.errMsgOpen(res.msg);
            }
        });
    }
}
export default Pull;
