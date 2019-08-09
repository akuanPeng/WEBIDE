import React, { Component } from 'react';
import Console from './console.jsx'
import Logs from './logs.jsx'

class Panels extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.panels = store.content.middle.center.panels;
    }
    render() {
        return (
            <panels ref="panels" className={this.state.class} style={{...this.state.style}}>
                <div className="ide-y-t-drag" onMouseDown={this.handleMouseDown.bind(this)}></div>
                {
                    {
                        console: <Console state={ this.state.console } />,
                        logs: <Logs state={ this.state.logs } />,
                        blank: ''
                    }[this.state.active.id || 'blank']
                }
            </panels>
        );
    }
    // 渲染结束
    componentDidMount() {
        // 注册全局功能
        store.funs.panels = {
            handleMouseMove: this.handleMouseMove.bind(this),
            handleMouseUp: this.handleMouseUp.bind(this)
        };
    }
    // 鼠标按下
    handleMouseDown(e) {
        // 打开拖拽
        this.panels.isDragAndDrop = true;
        this.panels.height = parseFloat(this.panels.style.height);
        this.panels.maxHeight = parseFloat(this.panels.style.maxHeight);
        this.panels.minHeight = parseFloat(this.panels.style.minHeight);
        this.panels.pxThan = this.refs.panels.offsetHeight / this.panels.height;
        this.panels.mouseY = e.pageY;
    }
    // 鼠标移动
    handleMouseMove(e, cb) {
        let center = store.content.middle.center;
        if (center.panels.isDragAndDrop) {
            if (cb) cb();
            let toMove = e.pageY - center.panels.mouseY,
                s = center.panels.height - toMove / center.panels.pxThan;
            s = s > center.panels.maxHeight ? center.panels.maxHeight : s;
            s = s < center.panels.minHeight ? center.panels.minHeight : s;
            center.panels.mouseY = e.pageY;
            center.panels.height = s;
            center.panels.style.height = s + "%";
            center.ide.style.bottom = s + "%";
            center.menus.style.bottom = s + "%";
            center.tools.style.bottom = s + "%";
            center.setState(center);
        }
    }
    // 鼠标离开
    handleMouseUp(e) {
        let center = store.content.middle.center;
        // 关闭拖拽
        center.panels.isDragAndDrop = false;
    }
}
export default Panels;
