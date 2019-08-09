import React, { Component } from 'react';

class Command extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.command = store.dialog.command;
    }
    render() {
        return (
            <command className={`${this.command.class} zoomIn animated`}>
                <div className="header user_select">
                    GIT命令行工具
                    <span onClick={this.handleCloseClick.bind(this, null)}>×</span>
                </div>
                <div ref="content" className="content" onMouseUp={this.handleMouseUp.bind(this)}>
                    {
                        this.command.logs.map((item, i) => {
                            return <pre key={i}>{item}</pre>
                        })
                    }
                    <input spellCheck="false" ref="command" type="text" onKeyUp={this.handleKeyUp.bind(this)}></input>
                </div>
            </command>
        );
    }
    componentDidUpdate() {
        this.refs.command.value = "";
        this.refs.command.focus();
    }
    handleMouseUp() {
        this.refs.command.focus();
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog;
        dialog.class = "";
        dialog.command.class = "";
        dialog.setState(dialog);
    }
    handleKeyUp(e) {
        let cmd = store.dialog.command;
        if (e && e.keyCode == 13) {
            let value = this.refs.command.value,
                command = value.split(' ');
            if (command[0] === 'git') command.shift();
            if (command.length && command[0] !== "") {
                api.command({
                    args: JSON.stringify(command)
                }, (res) => {
                    if (res.code === 0) {
                        let result = res.result;
                        if (result) {
                            cmd.logs.push(result.join('\n'));
                        } else {
                            cmd.logs.push(res.msg);
                        }
                    } else {
                        cmd.logs.push(res.msg);
                    }
                    // 最大1000条
                    cmd.cmds.push(value);
                    if (cmd.logs.length >= 1000) {
                        cmd.logs.splice(cmd.logs.length - 1000, 1000);
                        cmd.cmds.splice(cmd.cmds.length - 1000, 1000);
                    }
                    cmd.wz = cmd.cmds.length;
                    cmd.setState(cmd, () => {
                        this.refs.content.scrollTop = this.refs.content.scrollHeight;
                    });
                });
            }
        } else
        if (e && e.keyCode == 38) {
            if (cmd.wz > 0) {
                cmd.wz = cmd.wz - 1;
                this.refs.command.value = cmd.cmds[cmd.wz];
            }
        } else
        if (e && e.keyCode == 40) {
            if (cmd.wz < (cmd.cmds.length - 1)) {
                cmd.wz = cmd.wz + 1;
                this.refs.command.value = cmd.cmds[cmd.wz];
            }
        }
    }
}
export default Command;
