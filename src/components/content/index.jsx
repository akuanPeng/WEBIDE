import React, { Component } from 'react';
import Top from './top/index.jsx'
import Middle from './middle/index.jsx'
import Bottom from './bottom/index.jsx'

class Content extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.content = store.content;
    }
    render() {
        return (
            <content>
                <Top state={ this.state.top } />
                <Middle state={ this.state.middle } />
                <Bottom state={ this.state.bottom } />
            </content>
        );
    }
}
export default Content;
