import React, { Component } from 'react'

class List extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.list = store.dialog.git.resource.list;
    }
    render() {
        return (
            <list ref="list" style={{...this.list.style}}>
                {
                    this.list.list.map((item, i) => {
                        return <div key={i} data-key={i} className={"item " + item.class} onClick={this.handleClick.bind(this, item)}>
                            <i className="icon-caret-down"></i>
                            <i className="icon-caret-right"></i>
                            <span>{item.title}</span>
                            <div className="block"></div>
                            <div className="git-menu-list">
                                {
                                    item.list.map((t, j) => {
                                        return <div key={j} data-key="-1" className={`m frist ${t.class}`} onContextMenu={this.handleContextMenu.bind(this, item.key, t)}>
                                            <span>{t.icon ? <i className={t.icon}></i> : '•'}</span> {t.title} <div className="message" title={t.message || ''}>{t.message || ''}</div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    })
                }
                <div className="ide-x-r-drag" onMouseDown={this.handleMouseDown.bind(this)}></div>
            </list>
        );
    }
    // 渲染结束
    componentDidMount() {
        // 初始化分支
        this.getBranchLocal(() => {});
        // 注册全局功能
        store.funs.list = {
            handleMouseMove: this.handleMouseMove.bind(this),
            handleMouseUp: this.handleMouseUp.bind(this),
            getBranchLocal: this.getBranchLocal,
            getBranchRemote: this.getBranchRemote,
            getTags: this.getTags
        };
    }
    // 鼠标按下
    handleMouseDown(e) {
        // 打开拖拽
        this.list.isDragAndDrop = true;
        this.list.width = parseFloat(this.list.style.width);
        this.list.maxWidth = parseFloat(this.list.style.maxWidth);
        this.list.minWidth = parseFloat(this.list.style.minWidth);
        this.list.pxThan = this.refs.list.offsetWidth / this.list.width;
        this.list.mouseX = e.pageX;
    }
    // 鼠标移动
    handleMouseMove(e, cb) {
        let resource = store.dialog.git.resource;
        if (resource.list.isDragAndDrop) {
            if (cb) cb();
            let toMove = e.pageX - resource.list.mouseX,
                s = resource.list.width + toMove / resource.list.pxThan;
            s = s > resource.list.maxWidth ? resource.list.maxWidth : s;
            s = s < resource.list.minWidth ? resource.list.minWidth : s;
            resource.list.mouseX = e.pageX;
            resource.list.width = s;
            resource.list.style.width = s + "%";
            resource.style.width = (100 - s) + "%";
            resource.setState(resource);
        }
    }
    // 鼠标离开
    handleMouseUp(e) {
        let resource = store.dialog.git.resource;
        // 关闭拖拽
        resource.list.isDragAndDrop = false;
    }
    // 展开合并列表
    handleClick(item, e) {
        let key = e.target.getAttribute('data-key')
                || e.target.parentNode.getAttribute('data-key');
        if (key != "-1") {
            let cls = this.list.list[key].class;
            if (cls) {
                this.list.list[key].class = "";
                this.list.setState(this.list);
            } else {
                if (item.key === 'branch') {
                    this.getBranchLocal(() => {
                        this.list.list[key].class = "active";
                        this.list.setState(this.list)
                    });
                } else
                if (item.key === 'tags') {
                    this.getTags(() => {
                        this.list.list[key].class = "active";
                        this.list.setState(this.list)
                    });
                } else
                if (item.key === 'remote') {
                    this.getBranchRemote(() => {
                        this.list.list[key].class = "active";
                        this.list.setState(this.list)
                    });
                } else {
                    this.list.list[key].class = "active";
                    this.list.setState(this.list);
                }
            }
        }
    }
    // 获取本地分支列表
    getBranchLocal(cb) {
        // 获取本地分支列表
        api.getBranchLocal((res) => {
            if (res.code === 0) {
                let list = store.dialog.git.resource.list;
                try {
                    list.list[1].list = res.result.map((item, i) => {
                        let dialog = store.dialog.git.dialog,
                            cls = "";
                        if (/^\*/.test(item)) {
                            cls = "active";
                            dialog.branch.active = item.replace(/^\*/, "");
                            dialog.setState(dialog);
                        }
                        return {
                            icon: 'icon-random',
                            class: cls,
                            title: item.replace(/^\*/, "")
                        }
                    });
                    list.setState(list, cb);
                } catch(e) {
                   store.infoMsgOpen(res.result);
                }
            } else store.errMsgOpen(res.msg);
        });
    }
    // 获取tag列表
    getTags(cb) {
        api.tags((res) => {
            if (res.code === 0) {
                let list = store.dialog.git.resource.list;
                try {
                    if (res.result === "exit status 1") {
                        res.result = [];
                    }
                    // 线上tags
                    api.tagsRemote((tags) => {
                        if (tags.code === 0) {
                            let list1 = {};
                            // 本地
                            res.result.forEach((item) => {
                                const tag = item.match(/v\d+(\.\d+){1,2}$/);
                                if (tag[0]) list1[tag[0]] = {
                                    icon: 'icon-tag',
                                    title: tag[0]
                                };
                            });
                            // 远端
                            tags.result.forEach((item) => {
                                const tag = item.name;
                                if (tag[0]) list1[tag] = {
                                    icon: 'icon-tag',
                                    title: tag,
                                    class: 'active',
									message: item.message
                                };
                            });
                            // 解析成数组
                            let taglist = [];
                            for (let key in list1) {
                                taglist.push(list1[key]);
                            }
                            list.list[2].list = taglist;
                            list.setState(list, cb);
                        } else store.errMsgOpen(tags.msg);
                    });
                } catch(e) {
                   store.infoMsgOpen(res.result);
                }
            } else store.errMsgOpen(res.msg);
        });
    }
    // 获取远程分支
    getBranchRemote(cb) {
        // 获取本地分支列表
        api.getBranchRemote((res) => {
            if (res.code === 0) {
                let list = store.dialog.git.resource.list;
                try {
                    list.list[3].list = res.result.map((item, i) => {
                        return {
                            icon: 'icon-random',
                            title: item
                        }
                    });
                    list.setState(list, cb);
                } catch(e) {
                   store.infoMsgOpen(res.result);
                }
            } else store.errMsgOpen(res.msg);
        });
    }
    // 右击事件层
    handleContextMenu(menu, t, e) {
        if (!menu) return;
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            this.list.rightMenu[menu],
            () => {
                this.list.right_active = t;
            }, e
        );
    }
}
export default List;
