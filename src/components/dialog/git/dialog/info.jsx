import React, { Component } from 'react';

class Info extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.info = store.dialog.git.dialog.info;
    }
    render() {
        const msg = (typeof this.info.msg === "object") ? this.info.msg.join('\n') : this.info.msg;
        return (
            <info className={`${this.info.class} fadeInDown animated`}>
                <div className="info-content">
                    <pre>{msg}</pre>
                </div>
                <div className="info-opt user_select" onClick={this.handleCloseClick.bind(this)}>
                    关闭
                </div>
            </info>
        );
    }
    componentDidMount() {
        // 统一错误弹出
        store.infoMsgOpen = this.infoMsgOpen;
    }
    infoMsgOpen(msg) {
        let dialog = store.dialog.git.dialog;
        dialog.class = "active";
        dialog.info.class = "active";
        dialog.info.msg = msg;
        dialog.setState(dialog);
    }
    // 关闭弹出层
    handleCloseClick() {
        let dialog = store.dialog.git.dialog;
        dialog.class = "";
        dialog.info.class = "";
        dialog.info.msg = "";
        dialog.setState(dialog);
    }
}
export default Info;
