import React, { Component } from 'react';
import Left from './left/index.jsx'
import Center from './center/index.jsx'
import Right from './right/index.jsx'

class Middle extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.middle = store.content.middle;
    }
    render() {
        return (
            <middle style={{...this.middle.style}}>
                <Left state={ this.state.left } />
                <Center state={ this.state.center } />
                <Right state={ this.state.right } />
            </middle>
        );
    }
}
export default Middle;
