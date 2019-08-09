import React, { Component } from 'react'

class Spin extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.spin = store.spin;
    }
    // 渲染器
    render() {
        return <spin className={`${this.spin.class}`}>
            <div className="spin-logo">
                <img className="ide-logo" src={config.imgSrc + "logo_big.png"}></img>
                <i className="icon-spinner icon-spin"></i>
            </div>
        </spin>
    }
    componentDidMount() {
        store.spinOpen = this.spinOpen;
        store.spinClose = this.spinClose;
    }
    // open
    spinOpen() {
        let spin = store.spin;
        spin.class = 'active';
        spin.setState(spin);
    }
    // close
    spinClose() {
        let spin = store.spin;
        spin.class = '';
        spin.setState(spin);
    }
}
export default Spin
