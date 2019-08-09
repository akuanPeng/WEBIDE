import React, { Component } from 'react';

class Rename extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.rename = store.dialog.rename;
    }
    render() {
        let tree = store.content.middle.center.menus.menus[0].tree,
            right_active = tree.right_active || tree.menus[0],
            dirPath = "";
        if (right_active) {
            dirPath = comm.getSubStr(right_active.paths.join('/'), 20, 28);
        }
        return (
            <rename className={`${this.state.class} bounceInDown animated`} onKeyDown={this.handlekeyDown.bind(this)}>
                <div className="modal-header">
                    <div className="modal-header-title">{this.state.options.title} [ <span>目录：{dirPath}</span> ]</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    <input spellCheck="false" ref="rename" type="text" placeholder={this.state.options.lable} className="form-control" />
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span id={this.state.isOk} className="form-btn form-primary user_select" onClick={this.handleRenameClick.bind(this)}>确定</span>
                </div>
            </rename>
        );
    }
    componentDidUpdate() {
        let tree = store.content.middle.center.menus.menus[0].tree;
        this.refs.rename.value = tree.right_active ? tree.right_active.name : "";
        this.refs.rename.focus();
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog;
        dialog.class = "";
        dialog.rename.class = "";
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    };
    // 执行新建文件
    handleRenameClick() {
        store.spinOpen();
        let tree = store.content.middle.center.menus.menus[0].tree,
            paths = [...tree.right_active.paths],
            name = this.refs.rename.value;
        paths.shift();
        api.isexist({
            file_path: `${paths.join('/')}`.replace(/[^\/]*$/, name)
        }, (r) => {
            if (!r.result) {
                api.rename({
                    file_path: `${paths.join('/')}`,
                    new_path: `${paths.join('/')}`.replace(/[^\/]*$/, name)
                }, (res) => {
                    if (res.code === 0) {
                        let tabs = store.content.middle.center.ide.tabs,
                            wz = tabs.tab_list.indexOf(paths.join('/'));
                        if (wz !== -1) {
                            tabs.list[wz].name = name;
                            tabs.list[wz].paths[tabs.list[wz].paths.length - 1] = name;
                            let pts = [...tabs.list[wz].paths];
                            tree.file_active = pts.join('/');
                            pts.shift();
                            tabs.tab_list[wz] = pts.join('/');
                            tabs.setState(tabs, () => {
                                store.funs.tree.init(() => {
                                    store.errMsgOpen('OK', 'ok');
                                    store.spinClose();
                                    this.handleCloseClick(null);
                                });
                            });
                        } else {
                            store.funs.tree.init(() => {
                                store.errMsgOpen('OK', 'ok');
                                store.spinClose();
                                this.handleCloseClick(null);
                            });
                        }
                    } else store.errMsgOpen(res.msg);
                });
            } else {
                store.spinClose();
                store.errMsgOpen('已存在同名文件或文件夹！');
            }
        });
    }
    //回车点击确定
    handlekeyDown(event){
        if (event.keyCode==13) {//回车键的键值为13
           var okId = this.state.isOk;
          document.getElementById(okId).click();
        }
    }
}
export default Rename;
