import React, { Component } from 'react';

class NewFile extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.newfile = store.dialog.newfile;
        this.tree2 = store.controls.tree2;
    }
    render() {
        let tree = store.content.middle.center.menus.menus[0].tree,
            right_active = tree.right_active || tree.menus[0],
            dirPath = "";
        if (right_active) {
            dirPath = comm.getSubStr(right_active.paths.join('/'), 20, 30);
        }
        return (
            <newfile className={`${this.newfile.class} bounceInDown animated`} onKeyDown={this.handlekeyDown.bind(this)} style={this.tree2.class ? {} : {width: '600px', marginLeft: '-300px', marginTop: '-89px'}}>
                <div className="modal-header">
                    <div className="modal-header-title">创建一个新文件 [ <span>目录：{dirPath}</span> ]</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    <span className="btnFileUp" onClick={this.handleUploading.bind(this)}>上传文件</span>
                    <input spellCheck="false" ref="newfile" type="text" placeholder="文件名" data-tip="提醒：建议填写后缀名" className="form-control" />
                    <input ref="files" type="file" className="hide" onChange={this.handleFileUploading.bind(this)} />
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span id={this.state.isOk} className="form-btn form-primary user_select" onClick={this.handleNewFileClick.bind(this)}>确定</span>
                </div>
            </newfile>
        );
    }
    componentDidUpdate() {
        this.refs.newfile.value = "";
        this.refs.newfile.focus();
    }
    handleUploading() {
        this.refs.files.click();
    }
    handleFileUploading(e) {
        let selectedFile = this.refs.files.files[0];
        if (selectedFile) {
            this.refs.newfile.value = selectedFile.name;
        } else {
            this.refs.newfile.value = "";
        }
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog,
            tree = store.content.middle.center.menus.menus[0].tree,
            tree2 = store.controls.tree2;
        tree.right_active = {
            paths: [user]
        };
        dialog.class = "";
        dialog.newfile.class = "";
        dialog.setState(dialog, () => {
            tree2.class = "";
            if (cb) cb();
        });
    }
    // 执行新建文件
    handleNewFileClick() {
        store.spinOpen();
        let tree = store.content.middle.center.menus.menus[0].tree,
            right_active = tree.right_active || tree.menus[0],
            dirPath = [...right_active.paths],
            fileName = this.refs.newfile.value;
        // 追加后缀
        if (fileName.indexOf('.') === -1) {
            if (dirPath[1]) {
                if (language === 'node') {
                    if (dirPath[1] === 'controllers' || dirPath[1] === 'filters' || dirPath[1] === 'utils') {
                        fileName = `${fileName}.js`;
                    } else if (dirPath[1] === 'views') {
                        fileName = `${fileName}.ejs`;
                    }
                } else {
                    if (dirPath[1] === 'controllers' || dirPath[1] === 'filters' || dirPath[1] === 'utils') {
                        fileName = `${fileName}.lua`;
                    } else if (dirPath[1] === 'views') {
                        fileName = `${fileName}.html`;
                    }
                }
            }
        }
        dirPath.shift();
        let files;
        files = this.refs.files.files.length ? this.refs.files.files : undefined;
        api.addFile({
            file_path: `${dirPath.join('/')}/${fileName}`,
            isfile: true,
            files: files
        }, (res) => {
            if (res.code === 0) {
                store.funs.tree.init(() => {
                    store.spinClose();
                    store.errMsgOpen('OK', 'ok');
                    this.handleCloseClick(null);
                    let tree = store.content.middle.center.menus.menus[0].tree;
                    let path = dirPath.join('/');
                    let locations = tree.path_location[`${user}${path ? ('/' + path) : ''}/${fileName}`];
                    document.getElementById(locations.join('')).click();
                });
            } else {
                store.spinClose();
                store.errMsgOpen(res.msg);
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
export default NewFile;
