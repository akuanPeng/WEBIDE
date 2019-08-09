import React, { Component } from 'react';
import Tabs from './tabs.jsx'
import CodeEditor from './code_editor.jsx'

class IDE extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.ide = store.content.middle.center.ide;
    }
    render() {
        return (
            <ide ref="ide" style={{...this.state.style}}>
                <div className="more">
                    <div className="top" onClick={this.handleLeftClick.bind(this)}><i className="icon-caret-left"></i></div>
                    <div className="bottom" onClick={this.handleRightClick.bind(this)}><i className="icon-caret-right"></i></div>
                </div>
                <Tabs state={ this.state.tabs } />
                <CodeEditor state={ this.state.code_editor } />
            </ide>
        );
    }
    // 渲染结束
    componentDidMount() {
        this.ide.ref = this.refs.ide;
    }
    handleLeftClick() {
        let tabs = store.content.middle.center.ide.tabs;
        tabs.ref.scrollLeft -= 100;
        if (tabs.ref.scrollLeft < 0) tabs.ref.scrollLeft = 0;
    }
    handleRightClick() {
        let tabs = store.content.middle.center.ide.tabs;
        let len = tabs.ref.scrollWidth - tabs.ref.clientWidth;
        tabs.ref.scrollLeft += 100;
        if (tabs.ref.scrollLeft > len) tabs.ref.scrollLeft = len;
    }
}
export default IDE;
