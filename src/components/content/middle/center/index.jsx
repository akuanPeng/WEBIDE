import React, { Component } from 'react';
import Menus from './menus/index.jsx'
import Tools from './tools/index.jsx'
import Panels from './panels/index.jsx'
import IDE from './ide/index.jsx'

class Center extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.center = store.content.middle.center;
    }
    render() {
        return (
            <ide_center style={{...this.center.style}}>
                <Menus state={ this.state.menus } />
                <Tools state={ this.state.tools } />
                <Panels state={ this.state.panels } />
                <IDE state={ this.state.ide } />
            </ide_center>
        );
    }
}
export default Center;
