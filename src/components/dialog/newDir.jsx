import React, { Component } from 'react';

class NewDir extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.newdir = store.dialog.newdir;
    }
    render() {
        let tree = store.content.middle.center.menus.menus[0].tree,
            right_active = tree.right_active || tree.menus[0],
            dirPath = "";
        if (right_active) {
            dirPath = comm.getSubStr(right_active.paths.join('/'), 20, 28);
        }
        return (
            <newdir className={`${this.state.class} bounceInDown animated`} onKeyDown={this.handlekeyDown.bind(this)}>
                <div className="modal-header">
                    <div className="modal-header-title">创建一个新文件夹 [ <span>目录：{dirPath}</span> ]</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    <input spellCheck="false" ref="newdir" type="text" placeholder="文件夹名" className="form-control" />
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span id={this.state.isOk} className="form-btn form-primary user_select" onClick={this.handleNewDirClick.bind(this)}>确定</span>
                </div>
            </newdir>
        );
    }
    componentDidUpdate() {
        this.refs.newdir.value = "";
        this.refs.newdir.focus();
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog,
            tree = store.content.middle.center.menus.menus[0].tree;
        tree.right_active = {
            paths: [user]
        };
        dialog.class = "";
        dialog.newdir.class = "";
        dialog.newdir.dirTreeClass = "";
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 执行新建文件
    handleNewDirClick() {
        store.spinOpen();
        let tree = store.content.middle.center.menus.menus[0].tree,
            right_active = tree.right_active || tree.menus[0],
            dirPath = [...right_active.paths],
            dirName = this.refs.newdir.value;
        dirPath.shift();
        api.addDir({
            dir_path: `${dirPath.join('/')}/${dirName}`
        }, (res) => {
            if (res.code === 0) {
                store.funs.tree.init(() => {
                    store.spinClose();
                    store.errMsgOpen('OK', 'ok');
                    this.handleCloseClick(null);
                });
            } else {
                store.spinClose();
                store.errMsgOpen(res.msg);
            }
        });
    }
    // 对象数组排序算法
    compare(obj1, obj2) {
        let val1 = obj1.name,
            val2 = obj2.name;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
    //回车点击确定
    handlekeyDown(event){
        if (event.keyCode==13) {//回车键的键值为13
           var okId = this.state.isOk;
          document.getElementById(okId).click();
        }
    }
}
export default NewDir;
