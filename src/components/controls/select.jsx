import React, { Component } from 'react'

class Select extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.options = {};
    }
    // 渲染器
    render() {
        this.state.value = this.props.state.value || this.state.value;
        this.state.options = [...this.props.state.options];
        return <div ref="select" className={`form-select2 ${this.state.class} ${typeof this.state.value === "object" ? 'multiple' : ''}`}>
            <div className="form-select2-selected" onClick={this.handleClick.bind(this)}>
                <span ref="desc" className={`form-select2-text ${this.state.value.toString().length ? '' : 'placeholder user_select'}`}></span>
                <span className="ic-arrow user_select">▼</span>
            </div>
            <div className="form-select2-search">
                <i className="icon-search"></i>
                <input spellCheck="false" type="text" placeholder="搜索..." onKeyUp={this.handleKeyUp.bind(this)} />
            </div>
            <div className="form-select2-options user_select">
                {
                    this.state.options.map((item, i) => {
                        this.options[item.value] = item.text;
                        return <div className={`form-select2-option ${item.class}`} data-value={item.value} key={i} onClick={this.handleOptionClick.bind(this, item.value)}>
                            <i className={this.state.value.toString().indexOf(item.value) !== -1 ? `icon-check` : `icon-check-empty`}></i> {item.text}
                        </div>
                    })
                }
            </div>
        </div>
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        this.init();
    }
    init() {
        if (typeof this.state.value !== "object") {
            this.refs.desc.innerText = this.options[this.state.value] || this.state.placeholder;
        } else {
            let text = [];
            this.state.value.map((item) => {
                text.push(this.options[item]);
            });
            this.refs.desc.innerText = text.join(',') || this.state.placeholder;
        }
    }
    handleClick() {
        comm[comm.hasClass(this.refs.select, 'active') ? 'removeClass' : 'addClass'](this.refs.select, 'active');
    }
    handleOptionClick(value) {
        if (typeof this.state.value === "object") {
            let wz = this.state.value.indexOf(value);
            if (wz !== -1) {
                this.state.value.splice(wz, 1);
            } else {
                this.state.value.push(value);
            }
        } else {
            this.state.value = value;
            this.handleClick();
        }
        this.setState(this.state, () => {
            this.state.func(this.state.value);
        });
    }
    handleKeyUp(e) {
        let value = e.target.value;
        this.state.options = this.state.options.map((item, i) => {
            item.class = item.text.indexOf(value) === -1 ? "hide" : "";
            return item;
        });
        this.setState(this.state);
    }
}
export default Select
