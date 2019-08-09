import React, { Component } from 'react'

class Tree2 extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.tree2 = store.controls.tree2;
    }
    // 渲染器
    render() {
        return <div className={`modal-dirTree hide ${this.tree2.class}`}>
            <div className="modal-dirTree-header user_select">
                <span><i className="icon-th-large"></i> 目录树</span>
                <span className="modal-dirTree-opt right"><i className="icon-folder-open"></i> 展开</span>
                <span className="modal-dirTree-opt"><i className="icon-folder-close"></i> 闭合</span>
            </div>
            <div className="modal-dirTree-content user_select">
                {
                    this.init(this.state.tree)
                }
            </div>
            <div className="modal-dirTree-footer">
                <span>所选目录: <input spellCheck="false" ref="paths" type="text" defaultValue={this.state.value.join('/')} /></span>
            </div>
        </div>
    }
    init(tree, state, paths) {
        let html = [];
        for (let i=0; i < tree.length; i++) {
            if (paths) {
                 tree[i].paths = [...paths];
                 tree[i].paths.push(tree[i].name);
            } else {
                tree[i].paths = [tree[i].name];
            }
            html.push(<li key={i}>
                <div className={`modal-dirTree-title ${tree[i].paths.join('/') === this.state.value.join('/') ? 'active' : ''}`} onClick={this.handleClick.bind(this, tree[i])}>
                    <span className={`jt modal-dirTree-${tree[i].state} user_select`}>▾</span>
                    <i className={`tb icon-folder-${tree[i].state}`}></i>
                    {tree[i].name}
                </div>
                {this.init(tree[i].children || [], tree[i].state, tree[i].paths)}
            </li>);
        }
        return <ul className={state}>{html}</ul>;
    }
    handleClick(children, e) {
        if (comm.hasClass(e.target, 'jt') || comm.hasClass(e.target, 'tb')) {
            children.state = children.state === 'close' ? 'open' : 'close';
        } else {
            this.state.setValue(children.paths);
            this.refs.paths.value = children.paths.join('/');
            this.state.value = children.paths;
        }
        this.forceUpdate();
    }
}
export default Tree2
