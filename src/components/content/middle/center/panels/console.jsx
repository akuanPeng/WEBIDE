import React, { Component } from 'react';
import io from 'socket.io-client';

const methods = {
    1: 'GET',
    2: 'POST',
    4: 'PUT',
    8: 'DELETE',
    16: 'OPTIONS',
    32: 'HEAD'
}

class Console extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.socket = null;
        this.state.setState = this.setState.bind(this);
        this.console = store.content.middle.center.panels.console;
    }
    render() {
        return (
            <console>
                <div className="console-logo">
                    <i className="icon-globe"></i>
                </div>
                <div className="console-header">
                    <span className="console-title">控制台</span>
                    <span className="console-time">系统耗时: {this.console.system || 0}ms, 用户耗时: {this.console.user || 0}ms</span>
                </div>
                <div className="console-menus">
                    <div ref="empty" className="console-menu" title="清空" onClick={this.handleEmpty.bind(this)}>
                        <i className="icon-trash"></i>
                    </div>
                </div>
                <div ref="content" className="console-content" onContextMenu={this.handleContextMenu.bind(this)} onClick={this.handleClick.bind(this)}>
                    <pre className="console-pre">
                        {
                            this.state.list.map((item, i) => {
                                return <div className="console-row" key={i}>
                                    <span>
                                        <span>[DEBUG]</span>
                                        Route address {item.method}:
                                        <span>{item.route} {item.time}ms</span>：
                                    </span>
                                    {
                                        item.logs.map((log, j) => {
                                            return <div className="console-msg" key={j}>
                                                <span><i>▶</i>{log.type.toUpperCase()}：</span>{log.data}
                                            </div>
                                        })
                                    }
                                </div>
                            })
                        }
                    </pre>
                </div>
                <div className="console-input">
                    <input spellCheck="false" ref="cmd" type="text"></input>
                </div>
            </console>
        );
    }
    logsListener (logs) {
        let cle = store.content.middle.center.panels.console;
        cle.system = logs.spend.system;
        cle.user = logs.spend.user;
        cle.list.push({
            method: methods[logs.route.method] || (logs.route.method || ''),
            time: logs.spend.system + logs.spend.user,
            route: logs.route.rule.route,
            logs: JSON.stringify(logs.logs || {}) === '{}' ? [] : logs.logs
        });
        if (cle.list.length > cle.len) {
            cle.list.splice(cle.list.length - cle.len, cle.len);
        }
        cle.setState(cle, () => {
            cle.refs.content.scrollTop = cle.refs.content.scrollHeight;
        });
    }
    // 渲染结束
    componentDidMount() {
        store.funs.console = {
            logsListener: this.logsListener
        }
        const { pid, user:uid } = window
        this.console.refs = this.refs;
        if (!this.socket) {
            const socket = this.socket = io(`ws://${location.host}/mvc_logger`)
            socket.once('connect', () => {
                console.info('socket-connect-success', socket.id)
                socket.on('logs', this.logsListener)
                socket.emit('channel', { pid, uid })
            })
        }
    }
    componentWillUnmount() {
        this.socket && this.socket.off('logs', this.logsListener)
    }
    handleEmpty() {
        let cle = store.content.middle.center.panels.console;
        cle.system = 0;
        cle.user = 0;
        cle.list = [];
        cle.setState(cle);
    }
    handleClick() {
        // this.refs.cmd.focus();
    }
    handleContextMenu(e) {
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            this.console.rightMenu,
            () => {
            }, e
        );
    }
}
export default Console;
