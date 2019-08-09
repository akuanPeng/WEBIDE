import React, { Component } from 'react'

class History extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.history = store.dialog.git.resource.files.content.history;
    }
    render() {
        return (
            <history ref="history" style={{...this.history.style}}>
                <table>
                    <thead>
                        <tr>
                            <th style={{width: "80px"}}>图谱</th>
                            <th>描述</th>
                            <th style={{width: "115px"}}>日期</th>
                            <th style={{width: "115px"}}>作者</th>
                            <th style={{width: "64px"}}>提交</th>
                            <th style={{width: "64px"}}>Commit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.history.list.map((log, i) => {
                                return <tr key={i} className={log.class}
                                    onClick={this.handleHistoryClick.bind(this, i)}
                                    onContextMenu={this.handleContextMenu.bind(this, i, 'list')}
                                >
                                    <td>
                                        {
                                            log.view.map((v, j) => {
                                                return <div className="pipe" key={j}>
                                                    {
                                                        v === '*' ? '●' : v
                                                    }
                                                </div>
                                            })
                                        }
                                    </td>
                                    <td>
                                        {log.desc}
                                        {
                                            log.tabs.map((tab, j) => {
                                                return <div className="tag" key={j}>{tab}</div>
                                            })
                                        }

                                    </td>
                                    <td>{log.dt}</td>
                                    <td>{log.author}</td>
                                    <td>{log.submit}</td>
                                    <td>{log.commit}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <div className="ide-y-b-drag" onMouseDown={this.handleMouseDown.bind(this)}></div>
            </history>
        );
    }
    // 渲染结束
    componentDidMount() {
        // 注册到模块上
        this.history.getHistory = this.getHistory;
        // 注册全局功能
        store.funs.history = {
            handleMouseMove: this.handleMouseMove.bind(this),
            handleMouseUp: this.handleMouseUp.bind(this),
            getHistory: this.getHistory
        };
    }
    // 日志点击事件
    handleHistoryClick(i) {
        let files = store.dialog.git.resource.files,
            history = files.content.history;
        if (i === history.location) {
            history.location = -1;
            history.list[i].class = "";
            files.content.store.isHistory = false;
            files.setState(files);
        } else {
            if (history.list[i].commit) {
                this.getHistoryShow(history.list[i], (details) => {
                    if (history.location !== -1) history.list[history.location].class = "";
                    history.location = i;
                    history.list[i].class = "active";
                    files.content.store.isHistory = true;
                    history.list[i].commitShow = details;
                    files.content.store.commitShow = details;
                    files.content.diff.files = details.files;
                    files.setState(files);
                });
            }
        }
    }
    // 获取git提交日志
    getHistory(num, cb) {
        // 获取历史日志
        api.getHistory({divisor: num || 1}, (res) => {
            if (res.code === 0) {
                let result = typeof res.result === 'object' ? res.result : [];
				if (result[0] && result[0] === `fatal: your current branch 'master' does not have any commits yet`) result = []
                result = result.map((item, i) => {
                    let msgarr = [];
                    if (item.indexOf('##') !== -1) {
                        msgarr = /^(.*)"\{([^}]*)\} \{([^}]*)\} \{([^}]*)\} \{([^}]*)\} \{([^}]*)\}##(.*)"$/.exec(item);
                    } else {
                        msgarr = /^(.*)(:?"\{([^}]*)\} \{([^}]*)\} \{([^}]*)\} \{([^}]*)\} \{([^}]*)\}##(.*)")?$/.exec(item);
                    }
                    let vs = (msgarr[1] || '').trim().split('');
                    let tabs = [];
                    (msgarr[2] || '').trim().replace(/^\((.*)\)/, (str, t1) => {
                        tabs = t1.split(/[\s]*,[\s]*/);
                    });
                    return {
                        tabs: tabs,
                        view: vs,
                        commit: msgarr[3] || '',
                        author: msgarr[4] || '',
                        dt: msgarr[6] ? comm.dateFormat(new Date(msgarr[6]), 'yyyy-MM-dd hh:mm:ss') : '',
                        desc: msgarr[7] || '',
                        submit: msgarr[5] || ''
                    }
                });
                if (cb) {
                    cb(result);
                } else {
                    let history = store.dialog.git.resource.files.content.history;
                    history.list = result;
                    history.setState(history);
                }
            } else {
                store.errMsgOpen(res.msg);
            }
        });
    }
    // 获取日志详情
    getHistoryShow(log, cb) {
        // 是否已经取过值
        if (log.commitShow) {
            cb(log.commitShow);
        } else {
            // 获取日志详情
            api.getHistoryShow({sha1: log.commit}, (res) => {
                if (res.code === 0) {
                    let result =  typeof res.result === 'object' ? res.result : [];
                    let logs = {
                        sha1: log.commit,
                        desc: []
                    }, isFile = false, files = [];
                    if (/^Author:/.test(result[1])) {
                        result.forEach((item, i) => {
                            if (i === 0) {
                                logs['commit'] = item.replace("commit ", "");
                            } else
                            if (i === 1) {
                                logs['author'] = item.replace("Author: ", "");
                            } else
                            if (i === 2) {
                                logs['dt'] = comm.dateFormat(new Date(item.replace("Date:   ", "")), 'yyyy-MM-dd hh:mm:ss')
                            } else
                            if (i >= 3) {
                                if (/^diff /.test(item)) {
                                    files.push(item);
                                    isFile = true;
                                } else {
                                    if (!isFile){
                                        logs['desc'].push(item);
                                    } else {
                                        files.push(item);
                                    }
                                }
                            }
                        });
                    } else {
                        result.forEach((item, i) => {
                            if (i === 0) {
                                logs['commit'] = item.replace("commit ", "");
                            } else
                            if (i === 2) {
                                logs['author'] = item.replace("Author: ", "");
                            } else
                            if (i === 3) {
                                logs['dt'] = comm.dateFormat(new Date(item.replace("Date:   ", "")), 'yyyy-MM-dd hh:mm:ss')
                            } else
                            if (i >= 4) {
                                if (/^diff /.test(item)) {
                                    files.push(item);
                                    isFile = true;
                                } else {
                                    if (!isFile){
                                        logs['desc'].push(item);
                                    } else {
                                        files.push(item);
                                    }
                                }
                            }
                        });
                    }
                    logs.files = files.join('\r\n');
                    logs.desc = logs.desc.join('\r\n');
                    cb(logs);
                } else {
                    store.errMsgOpen(res.msg);
                }
            });
        }
    }
    // 鼠标按下
    handleMouseDown(e) {
        // 打开拖拽
        this.history.isDragAndDrop = true;
        this.history.height = parseFloat(this.history.style.height);
        this.history.maxHeight = parseFloat(this.history.style.maxHeight);
        this.history.minHeight = parseFloat(this.history.style.minHeight);
        this.history.pxThan = this.refs.history.offsetHeight / this.history.height;
        this.history.mouseY = e.pageY;
    }
    // 鼠标移动
    handleMouseMove(e, cb) {
        let files = store.dialog.git.resource.files;
        if (files.content.history.isDragAndDrop) {
            if (cb) cb();
            let toMove = files.content.history.mouseY - e.pageY,
                s = files.content.history.height - toMove / files.content.history.pxThan;
            s = s > files.content.history.maxHeight ? files.content.history.maxHeight : s;
            s = s < files.content.history.minHeight ? files.content.history.minHeight : s;
            files.content.history.mouseY = e.pageY;
            files.content.history.height = s;
            files.content.history.style.height = s + "%";
            files.content.store.style.top = s + "%";
            files.content.diff.style.top = s + "%";
            files.setState(files);
        }
    }
    // 鼠标离开
    handleMouseUp(e) {
        let files = store.dialog.git.resource.files;
        // 关闭拖拽
        files.content.history.isDragAndDrop = false;
    }
    // 右击事件层
    handleContextMenu(i, menu, e) {
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            this.history.rightMenu[menu],
            () => {
                store.dialog.git.dialog.branch.sha1 = this.history.list[i].commit;
                store.dialog.git.dialog.tags.sha1 = this.history.list[i].commit;
            }, e
        );
    }
}
export default History;
