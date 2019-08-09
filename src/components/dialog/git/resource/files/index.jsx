import React, { Component } from 'react'
import Diff from './diff.jsx'
import History from './history.jsx'
import Store from './store.jsx'

class Files extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.files = store.dialog.git.resource.files;
    }
    render() {
        return (
            <file className={this.files.class}>
                <div className="ide-git-header">
                    <div className="ide-git-address">
                        <span className="btnCopyGit user_select" data-tip="复制Git地址" onClick={this.handleCopy.bind(this, `${perms.git}${pid}.git`)}>
                            <i className="icon-copy"></i> GIT地址：
                        </span>
                        <span className="right">{comm.getSubStr(`${perms.git}${pid}.git`, 16, 28)}</span>
                    </div>
                </div>
                <div className="ide-git-content" style={{...this.files.content.style}}>
                    <History state={ this.files.content.history } />
                    <Store state={ this.files.content.store } />
                    <Diff state={ this.files.content.diff } />
                </div>
                <div className={`ide-git-submit ${this.files.submitClass}`}>
                    <i className="icon-user"></i>
                    <div className="ide-git-input" onClick={this.handleInputActivate.bind(this)}>
                        <span>提交信息</span>
                        <div className="git-textarea">
                            <textarea ref="git_msg"></textarea>
                        </div>
                    </div>
                    <div className="ide-git-check user_select" onClick={this.handleCheckClick.bind(this)}>
                        <i className={this.files.push ? "icon-check" : "icon-check-empty"}></i>
                        <span>推送到：origin/{store.branch}</span>
                    </div>
                    <div className="ide-git-opts">
                        <span className="btn close" onClick={this.handleInputActivateClose.bind(this)}>取消</span>
                        <span className="btn" onClick={this.handleGitCommit.bind(this)}>提交</span>
                    </div>
                </div>
            </file>
        );
    }
    componentDidMount() {
        this.files.handleInputActivate = this.handleInputActivate;
        this.files.refs = this.refs;
    }
    componentDidUpdate() {
        // 是否执行更新
        let tree = store.content.middle.center.menus.menus[0].tree;
        if (this.files.isUpdate) {
            this.refs.git_msg.value = "";
            let list = [];
            let wait = [];
            for (let key in tree.states) {
                let sps = tree.states[key].split(' ');
                if (sps[1] === 'list') {
                    list.push({
                        icon: sps[0],
                        name: key.replace(new RegExp(`^${store.user}\/`), '')
                    })
                } else {
                    wait.push({
                        icon: sps[0],
                        name: key.replace(new RegExp(`^${store.user}\/`), '')
                    })
                }
            }
            this.files.content.store.list = list;
            this.files.content.store.wait = wait;
            this.files.isUpdate = false;
            this.setState(this.files, () => {
                $(".wait-ul li, .list_ul li").removeClass("active");
            });
        }
    }
    // 自动推送
    handleCheckClick() {
        this.files.push = !this.files.push;
        this.files.setState(this.files);
    }
    // 复制
    handleCopy(str) {
        comm.copy(str);
        store.errMsgOpen('复制成功！', 'ok');
    }
    // 提交到本地
    handleGitCommit() {
        // 是否可以提交
        if (this.refs.git_msg.value.length && this.state.content.store.list.length) {
            // 执行本地提交
            store.spinOpen();
            api.gitCommit({
                commit_files: this.state.content.store.list.map((item) => {
                    return item.name;
                }),
                msg: this.refs.git_msg.value
            }, (res) => {
                // 是否立即推送
                if (this.files.push) {
                    api.gitPush({ l_branch: store.branch, r_branch: store.branch}, (push) => {
                        if (push.code === 0) {
                            this.handleInputActivateClose();
                            store.funs.tree.init((states) => {
                                this.files.isUpdate = true;
                                this.setState(this.files, () => {
                                    store.spinClose();
                                    store.infoMsgOpen(`${res.result}\n${push.result}`);
                                });
                            })
                        } else {
                            store.spinClose();
                            store.errMsgOpen(`${res.result}\n${push.msg}`);
                        }
                    });
                } else {
                    if (res.code === 0) {
                        this.handleInputActivateClose();
                        store.funs.tree.init((states) => {
                            this.files.isUpdate = true;
                            this.setState(this.files, () => {
                                store.spinClose();
                                store.infoMsgOpen(res.result);
                            });
                        })
                    } else {
                        store.spinClose();
                        store.errMsgOpen(res.msg);
                    }
                }
            });
        } else {
            store.errMsgOpen('提交信息和文件必传！');
        }
    }
    // 关闭提交状态
    handleInputActivateClose() {
        this.files.class = "";
        this.files.content.style.bottom = "38px";
        this.files.content.store.style.bottom = "0";
        this.files.content.diff.style.bottom = "0";
        this.refs.git_msg.value = "";
        this.files.setState(this.files);
    }
    // 点击激活提交状态
    handleInputActivate() {
        let resource = store.dialog.git.resource;
        resource.handleTagClick(0, (files) => {
            files.class = "active";
        });
    }
    // 添加GIT文件夹状态
    addGitFiles(files, errs, cb) {
        let i = errs.length;
        // 是否执行完
        if (i < files.length) {
            // 文件夹
            if (/\/$/.test(files[i])) {
                // 添加文件
                api.addGitFile({ file_path: files[i] }, (res) => {
                    // 是否添加成功
                    errs[i] = res.code !== 0 ? res.msg : "";
                    // 递归
                    this.addGitFiles(files, errs, cb);
                });
            } else {
                errs[i] = "";
                this.addGitFiles(files, errs, cb);
            }
        } else {
            // 返回添加结果
            cb(errs.join(""));
        }
    }
}
export default Files;
