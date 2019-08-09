import React, { Component } from 'react'

class Store extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.store = store.dialog.git.resource.files.content.store;
    }
    render() {
        return (
            <div className="ide-git-left" style={{...this.store.style}}>
                {
                    this.store.isHistory && this.store.selected === 1
                    ? <div className="ide-git-top">
                        <div className="ide-git-title">
                            <i className="icon-book"></i>
                            Commit详情
                        </div>
                        <span>
                            <div className="ide-git-text"><span>提交:</span> {`${this.store.commitShow.commit}[${this.store.commitShow.sha1}]`}</div>
                            <div className="ide-git-text"><span>作者:</span> {this.store.commitShow.author}</div>
                            <div className="ide-git-text"><span>日期:</span> {this.store.commitShow.dt}</div>
                            <div className="ide-git-text"><span>描述:</span> {this.store.commitShow.desc}</div>
                        </span>
                    </div>
                    : <div className="ide-git-top">
                        <div className="ide-git-title">
                            <i className="icon-check" onClick={this.handleAllTSClick.bind(this, this.store.list, 0, this.store.list.length)}></i>
                            已暂存文件
                        </div>
                        <ul className="list_ul">
                            {
                                this.store.list.map((item, i) => {
                                    return <li id={`li_${item.name}`} key={i}
                                        onClick={this.handleClick.bind(this, item.name)}
                                        onContextMenu={this.handleContextMenu.bind(this, i, 'list')}
                                    >
                                        <i id={`list_${item.name}`} className="icon-check" onClick={this.handleTSClick.bind(this, item, i, null)}></i>
                                        <i className={`icon-${item.icon}-sign`}></i>
                                        {item.name}
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                }
                {
                    this.store.isHistory && this.store.selected === 1
                    ? <div className="ide-git-bottom">
                        <div className="ide-git-title">
                            <i className="icon-list"></i>
                            Commit文件列表
                        </div>
                        <ul id="git-file-list"></ul>
                    </div>
                    : <div className="ide-git-bottom">
                        <div className="ide-git-title">
                            <i className="icon-check-empty" onClick={this.handleAllNotTSClick.bind(this, this.store.wait, 0, this.store.wait.length)}></i>
                            未暂存文件
                        </div>
                        <ul className="wait-ul">
                            {
                                this.store.wait.map((item, i) => {
                                    return <li id={`li_${item.name}`} key={i}
                                        onClick={this.handleClick.bind(this, item.name)}
                                        onContextMenu={this.handleContextMenu.bind(this, i, 'wait')}
                                    >
                                        <i id={`wait_${item.name}`} className="icon-check-empty" onClick={this.handleNotTSClick.bind(this, item, i, null)}></i>
                                        <i className={`icon-${item.icon}-sign`}></i>
                                        {item.name}
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                }
            </div>
        );
    }
    handleClick(filename, e) {
        if ($(e.target).hasClass('icon-check-empty') || $(e.target).hasClass('icon-check')) return;
        store.spinOpen();
        api.getDiffShow({file_path: filename.trim()}, (res) => {
            if (res.code === 0) {
                if (res.result && res.result.length) {
                    try {
                        let fileArr = res.result;
                        let diff = store.dialog.git.resource.files.content.diff;
                        diff.files = fileArr.join('\n');
                        diff.setState(diff, () => {
                            store.spinClose();
                            $(".wait-ul li, .list_ul li").removeClass("active");
                            let fli = document.getElementById(`li_${filename}`);
                            fli.setAttribute('class', 'active');
                            $('.d2h-file-wrapper:eq(0)').show();
                        });
                    } catch(e) {
                        store.spinClose();
                        $(".wait-ul li, .list_ul li").removeClass("active");
                        let fli = document.getElementById(`li_${filename}`);
                        fli.setAttribute('class', 'active');
                        store.infoMsgOpen(res.result);
                    }
                } else {
                    store.spinClose();
                    $(".wait-ul li, .list_ul li").removeClass("active");
                    let fli = document.getElementById(`li_${filename}`);
                    fli.setAttribute('class', 'active');
                    $('.d2h-file-wrapper:eq(0)').hide();
                }
            } else {
                store.spinClose();
                $(".wait-ul li, .list_ul li").removeClass("active");
                let fli = document.getElementById(`li_${filename}`);
                fli.setAttribute('class', 'active');
                store.errMsgOpen(res.msg);
            }
        })
    }
    // 未暂存点击
    handleNotTSClick(ts, i, cb) {
        store.spinOpen();
        api.addGitFile({ file_path: ts.name.trim()}, (res) => {
            if (res.code === 0) {
                if (res.result.toString()) {
                    store.infoMsgOpen(res.result);
                } else {
                    if (!cb) {
                        let files = store.dialog.git.resource.files;
                        store.funs.tree.init((states) => {
                            files.isUpdate = true;
                            files.setState(files, () => {
                                store.spinClose();
                            });
                        })
                    } else {
                        cb();
                    }
                }
            } else {
                store.spinClose();
                store.errMsgOpen(res.msg);
            }
        });
    }
    handleAllNotTSClick(wait, i, len) {
        if (i < len) {
            this.handleNotTSClick(wait[i], i, () => {
                i++;
                this.handleAllNotTSClick(wait, i, len);
            })
        } else {
            let files = store.dialog.git.resource.files;
            store.funs.tree.init((states) => {
                files.isUpdate = true;
                files.setState(files, () => {
                    store.spinClose();
                });
            })
        }
    }
    // 已暂存点击
    handleTSClick(ts, i, cb) {
        store.spinOpen();
        api.resetGitFile({ file_path: ts.name.trim()}, (res) => {
            if (res.code === 0) {
                if (!cb) {
                    let files = store.dialog.git.resource.files;
                    store.funs.tree.init((states) => {
                        files.isUpdate = true;
                        files.setState(files, () => {
                            store.spinClose();
                        });
                    })
                } else {
                    cb();
                }
            } else {
                store.spinClose();
                store.errMsgOpen(res.msg);
            }
        });
    }
    handleAllTSClick(list, i, len) {
        if (i < len) {
            this.handleTSClick(list[i], i, () => {
                i++;
                this.handleAllTSClick(list, i, len);
            })
        } else {
            let files = store.dialog.git.resource.files;
            store.funs.tree.init((states) => {
                files.isUpdate = true;
                files.setState(files, () => {
                    store.spinClose();
                });
            })
        }
    }
    // 右击事件层
    handleContextMenu(i, menu, e) {
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            this.store.rightMenu[menu],
            () => {
                this.store.right_active = this.store[menu][i];
            }, e
        );
    }
}
export default Store;
