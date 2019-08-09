import React, { Component } from 'react';

class Logs extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.logs = store.content.middle.center.panels.logs;
    }
    render() {
        return (
            <logs>
                <div className="console-logo">
                    <i className="icon-exclamation-sign"></i>
                </div>
                <div className="logs-header">
                    <span className="console-title">错误日志</span>
                </div>
                <div className="logs-content">
                    <pre className="console-pre">
                        {
                            this.logs.list.map((item, i) => {
                                return <div className="console-row" key={i}>
                                    <span>
                                        <span>[ERROR]</span>
                                        {
                                            item.time
                                        }
                                        <span></span>：
                                    </span>
                                    { item.msg }
                                </div>
                            })
                        }
                    </pre>
                </div>
            </logs>
        );
    }
    // 渲染结束
    componentDidMount() {

    }
}
export default Logs;
