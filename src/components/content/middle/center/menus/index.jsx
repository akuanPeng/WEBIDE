import React, { Component } from 'react';
import Tree from './tree.jsx'

class Menus extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.menus = store.content.middle.center.menus;
    }
    render() {
        return (
            <menus ref="menus" className={this.state.class} style={{...this.state.style}}>
                <div className="ide-menu">
                    <ul>
                        {
                            this.state.menus.map((item, i) => {
                                return <li key={i} className="ide-menu-li" onClick={this.handleMenusClick.bind(this,item)}>
                                    <div
                                        className="ide-menu-title"
                                        onContextMenu={this.handleContextMenu.bind(this, item)}
                                    >
                                        <i className="icon-question-sign" data-tip="注: 蓝色=修改，绿色=新增，黄色=冲突，灰色=默认，文件夹内支持拖拽上传文件"></i>
                                        <span>{item.title}</span>
                                        <i className="icon icon-refresh" data-tip="刷新目录" onClick={this.handleRefreshClick.bind(this)}></i>
                                    </div>
                                    <div className="ide-menu-minus">
                                        <Tree state={ item.tree } ></Tree>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                </div>
                <div className="ide-x-r-drag" onMouseDown={this.handleMouseDown.bind(this)}></div>
            </menus>
        );
    }
    // 渲染结束
    componentDidMount() {
        // 注册全局功能
        store.funs.menus = {
            handleMouseMove: this.handleMouseMove.bind(this),
            handleMouseUp: this.handleMouseUp.bind(this)
        };
    }
    // 鼠标按下
    handleMouseDown(e) {
        // 打开拖拽
        this.menus.isDragAndDrop = true;
        this.menus.width = parseFloat(this.menus.style.width);
        this.menus.maxWidth = parseFloat(this.menus.style.maxWidth);
        this.menus.minWidth = parseFloat(this.menus.style.minWidth);
        this.menus.pxThan = this.refs.menus.offsetWidth / this.menus.width;
        this.menus.mouseX = e.pageX;
        document.getElementById("help").style.visibility = "hidden";
    }
    // 鼠标移动
    handleMouseMove(e, cb) {
        let center = store.content.middle.center;
        if (center.menus.isDragAndDrop) {
            if (cb) cb();
            let toMove = e.pageX - center.menus.mouseX,
                s = center.menus.width + toMove / center.menus.pxThan,
                w = center.ide.ref.offsetWidth;
            s = s > center.menus.maxWidth ? center.menus.maxWidth : s;
            s = s < center.menus.minWidth ? center.menus.minWidth : s;
            center.menus.mouseX = e.pageX;
            if (!w) {
                if (s > center.menus.width) {
                    center.tools.style.width = (100 - s) + "%";
                    center.ide.style.right = (100 - s) + "%";
                }
            }
            center.menus.width = s;
            center.menus.style.width = s + "%";
            center.ide.style.left = s + "%";
            center.setState(center);
        }
    }
    // 鼠标离开
    handleMouseUp(e) {
        let center = store.content.middle.center;
        // 关闭拖拽
        center.menus.isDragAndDrop = false;
        document.getElementById("help").style.visibility = "visible";
    }
    // 右击事件层
    handleContextMenu(item, e) {
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            item.rightMenu, () => {}, e
        );
    }
    // 点击事件
    handleMenusClick(menus){
        let dialog = store.dialog,
            modal = dialog[menus.key];
        if (modal) {
            dialog.class = "active";
            modal.class = "active";
            if (menus.func) menus.func(menus, modal);
            dialog.setState(dialog);
        } else {
            if (menus.func) menus.func(menus);
        }
    }
    // 刷新
    handleRefreshClick() {
        store.spinOpen();
        store.funs.tree.init(() => {
            store.spinClose();
            store.errMsgOpen('OK', 'ok');
        });
    }
}
export default Menus;
