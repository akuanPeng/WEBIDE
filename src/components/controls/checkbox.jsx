import React, { Component } from 'react'

class CheckBox extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
    }
    // 渲染器
    render() {
        return <div className={`form-checkbox user_select ${this.state.class}`}>
            <i className={
                    this.state.value
                    ? (this.props.state.checked === this.state.value ? `icon-check` : `icon-check-empty`)
                    : (this.state.checked ? `icon-check` : `icon-check-empty`)
            } onClick={this.handleClick.bind(this)}></i>
            <span>{this.state.text}</span>
        </div>
    }
    handleClick() {
        if (this.state.value) {
            this.state.func(this.state.value);
        } else {
            this.state.checked = !this.state.checked;
            this.state.func(this.state.checked);
            this.setState(this.state);
        }
    }
}
export default CheckBox
