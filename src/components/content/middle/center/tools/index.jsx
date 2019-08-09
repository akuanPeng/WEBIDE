import React, { Component } from 'react';

class Tools extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.tools = store.content.middle.center.tools;
    }
    render() {
        return (
            <tools ref="tools" className={this.state.class} style={{...this.state.style}}>
                <iframe id="help" className={this.tools.active === 0 ? '' : 'hide'} src={
                    window.language == "lua" ? this.tools.luaUrl : this.tools.jsUrl
                }></iframe>
                <div className={this.tools.active === 1 ? 'shortcuts-list' : 'shortcuts-list hide'}>
                    <div className="shortcuts-title">
                        <i className="icon-th-list"></i> 编辑器 - 快捷键
                    </div>
                    <div className="shortcuts-table">
                        {
                               this.shortcuts()
                        }
                    </div>
                </div>
                <div className="ide-x-l-drag" onMouseDown={this.handleMouseDown.bind(this)}></div>
            </tools>
        );
    }
    // 渲染结束
    componentDidMount() {
        // 注册全局功能
        store.funs.tools = {
            handleMouseMove: this.handleMouseMove.bind(this),
            handleMouseUp: this.handleMouseUp.bind(this)
        };
    }
    // 生成快捷
    shortcuts() {
        let shortcuts = [];
        for (let key in this.tools.shortcuts) {
            shortcuts.push(<div className="shortcuts-table-row" key={key}>
                <div className="shortcuts-table-row-th">{key}</div>
                <div className="shortcuts-table-row-td">{this.tools.shortcuts[key]}</div>
            </div>);
        }
        return shortcuts;
    }
    // 鼠标按下
    handleMouseDown(e) {
        // 打开拖拽
        this.tools.isDragAndDrop = true;
        this.tools.width = parseFloat(this.tools.style.width);
        this.tools.maxWidth = parseFloat(this.tools.style.maxWidth);
        this.tools.minWidth = parseFloat(this.tools.style.minWidth);
        this.tools.pxThan = this.refs.tools.offsetWidth / this.tools.width;
        this.tools.mouseX = e.pageX;
        document.getElementById("help").style.visibility = "hidden";
    }
    // 鼠标移动
    handleMouseMove(e, cb) {
        let center = store.content.middle.center;
        if (center.tools.isDragAndDrop) {
            if (cb) cb();
            let toMove = e.pageX - center.tools.mouseX,
                s = center.tools.width - toMove / center.tools.pxThan,
                w = center.ide.ref.offsetWidth;
            s = s > center.tools.maxWidth ? center.tools.maxWidth : s;
            s = s < center.tools.minWidth ? center.tools.minWidth : s;
            center.tools.mouseX = e.pageX;
            if (!w) {
                if (s > center.tools.width) {
                    center.menus.style.width = (100 - s) + "%";
                    center.ide.style.left = (100 - s) + "%";
                }
            }
            center.tools.width = s;
            center.tools.style.width = s + "%";
            center.ide.style.right = s + "%";
            center.setState(center);
        }
    }
    // 鼠标离开
    handleMouseUp(e) {
        let center = store.content.middle.center;
        // 关闭拖拽
        center.tools.isDragAndDrop = false;
        document.getElementById("help").style.visibility = "visible";
    }
}
export default Tools;
