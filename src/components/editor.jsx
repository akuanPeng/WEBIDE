import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import Header from './header/index.jsx'
import Content from './content/index.jsx'
import Footer from './footer/index.jsx'
import Dialog from './dialog/index.jsx'
import Menus from './menus/index.jsx'
import Information from './information/index.jsx'
import Spin from './spin/index.jsx'

class IDE extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        store.ReactTooltip = ReactTooltip;
        this.ide = store;
    }
    // 渲染器
    render() {
        return <div ref="ide" className="ide-container"
            onClick={this.handleClick.bind(this)}
            onMouseMove={this.handleMouseMove.bind(this)}
            onMouseUp={this.handleMouseUp.bind(this)}
            onDragEnter={this.handleDrag.bind(this)}
            onDragOver={this.handleDrag.bind(this)}
            onDrop={this.handleDrag.bind(this)}
        >
            <Header state={ this.state.header } />
            <Content state={ this.state.content } />
            <Footer state={ this.state.footer } />
            <Dialog state={ this.state.dialog } />
            <Menus state={ this.state.menus } />
            <Information state={ this.state.information } />
            <Spin state={ this.state.spin } />
            <ReactTooltip type="info" place="left" effect="solid" />
        </div>
    }
    // 执行拖放，取消事件传播及默认行为, 获得拖放的文件
    handleDrag(e) {
        // 取消事件传播及默认行为
        e.stopPropagation();
        e.preventDefault();
    }
    // 鼠标移动事件
    handleMouseMove(e) {
        // 菜单移动拉伸
        this.ide.funs.menus.handleMouseMove(e, () => comm.addClass(this.refs.ide, "user_select"));
        // 工具移动拉伸
        this.ide.funs.tools.handleMouseMove(e, () => comm.addClass(this.refs.ide, "user_select"));
        // 板块移动拉伸
        this.ide.funs.panels.handleMouseMove(e, () => comm.addClass(this.refs.ide, "user_select"));
        // git列表移动拉伸
        this.ide.funs.list.handleMouseMove(e, () => comm.addClass(this.refs.ide, "user_select"));
        // gitDiff移动拉伸
        this.ide.funs.diff.handleMouseMove(e, () => comm.addClass(this.refs.ide, "user_select"));
        // git历史移动拉伸
        this.ide.funs.history.handleMouseMove(e, () => comm.addClass(this.refs.ide, "user_select"));
    }
    // 鼠标松开事件
    handleMouseUp(e) {
        // 启用选择
        comm.removeClass(this.refs.ide, "user_select");
        // 菜单移动拉伸停止
        this.ide.funs.menus.handleMouseUp(e);
        // 工具移动拉伸停止
        this.ide.funs.tools.handleMouseUp(e);
        // 板块移动拉伸停止
        this.ide.funs.panels.handleMouseUp(e);
        // git列表移动拉伸停止
        this.ide.funs.list.handleMouseUp(e);
        // gitDiff移动拉伸停止
        this.ide.funs.diff.handleMouseUp(e);
        // git历史移动拉伸停止
        this.ide.funs.history.handleMouseUp(e);
    }
    // 页面点击事件
    handleClick() {
        let menus = store.menus,
            tree = store.content.middle.center.menus.menus[0].tree;
        menus.class = "";
        menus.setState(menus, () => {
            if (tree.right_active) {
                tree.right_active.class = "";
                tree.setState(tree);
            }
        });
    }
}
export default IDE
