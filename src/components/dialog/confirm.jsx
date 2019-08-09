import React, { Component } from 'react';

class Confirm extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.confirm = store.dialog.confirm;
    }
    render() {
        return (
            <confirm open className={`${this.confirm.class} bounceInDown animated`}>
                <div className="modal-header">
                    <div className="modal-header-title">操作提醒！</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    {
                        this.confirm.options.key
                        ? this.confirm.options.msg
                        : `是否删除${this.confirm.options.type}[${this.getOptObject()}]？`
                    }
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span className={`form-btn form-primary user_select ${this.confirm.options.key === 'git' ? 'hide' : ''}`} onClick={this.handleOKClick.bind(this)}>确定</span>
                </div>
            </confirm>
        );
    }
    componentDidMount() {
        // 是否框
        store.confirmOpen = this.confirmOpen;
    }
    // 打开是否框
    confirmOpen(msg, func) {
        let dialog = store.dialog;
        dialog.class = "active";
        dialog.confirm.class = "active";
        dialog.confirm.options = { key: 'confirm', msg, func };
        dialog.setState(dialog);
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog;
        dialog.class = "";
        dialog.confirm.class = "";
        dialog.confirm.options.key = "";
        dialog.confirm.options.type = "";
        dialog.confirm.options.func = undefined;
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 执行删除
    handleOKClick() {
        if (this.confirm.options.key) {
            if (this.confirm.options.func) this.confirm.options.func();
            this.handleCloseClick();
        } else {
            store.spinOpen();
            let tree = store.content.middle.center.menus.menus[0].tree,
                tabs = store.content.middle.center.ide.tabs,
                paths = [...tree.right_active.paths],
                locations = tree.right_active.locations;
            paths.shift();
            api.del({ file_path: paths.join('/') }, (res) => {
                if (res.code === 0) {
                    // 查找目标
                    const index = tabs.tab_list.indexOf(paths.join('/'))
                    tree.setState(tree, () => {
                        this.handleCloseClick(() => {
                            store.funs.tree.init(() => {
                                if (index !== -1) store.funs.tabs.closetab(index, null, true);
                                store.spinClose();
                                store.errMsgOpen('OK', 'ok');
                            });
                        });
                    });
                } else {
                    store.spinClose();
                    store.errMsgOpen(res.msg);
                }
            });
        }
    }
    // 获取当前操作文件或文件夹
    getOptObject() {
        let tree = store.content.middle.center.menus.menus[0].tree;
        return tree.right_active ? [...tree.right_active.paths].join('/') : '';
    }
}
export default Confirm;
