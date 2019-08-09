import React, { Component } from 'react'

class Information extends Component {
    // 构造器
    constructor(props) {
        super(props);
        // getInitialState
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.information = store.information;
    }
    // 渲染器
    render() {
        return <information className={`${this.state.direction} ${this.state.type} ${this.state.class} fadeIn${{left: 'Left', right: 'Right', top: 'Down', bottom: 'Up'}[this.state.direction]} animated`}>
            <span>{this.state.msg}</span>
            <close className="user_select" onClick={this.handleCloseClick.bind(this)}>×</close>
        </information>
    }
    componentDidMount() {
        // 统一错误弹出
        store.errMsgOpen = this.errMsgOpen;
    }
    componentDidUpdate() {
        if (this.information.type === "ok") {
            setTimeout(() => {
                this.handleCloseClick();
            }, 1000)
        }
    }
    // 关闭事件
    handleCloseClick() {
        this.information.direction = "";
        this.information.type = "";
        this.information.class = "";
        this.information.msg = "";
        this.setState(this.information);
    }
    // 错误消息提醒
    errMsgOpen(msg, type) {
        let information = store.information;
        information.direction = "top";
        information.type = type || "err";
        information.class = "active";
        information.msg = msg;
        information.setState(information, () => {
            if (information.type === 'err') {
                // 记录错误日志
                let logs = store.content.middle.center.panels.logs;
                logs.list.push({
                    time: comm.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    msg: msg
                });
                // 最大500条
                if (logs.list.length >= 500)
                    logs.list.splice(logs.list.length - 500, 500);
                if (logs.setState) logs.setState(logs);
            }
        });
    }
}
export default Information
