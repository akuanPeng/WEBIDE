import React, { Component } from 'react';
import Dialog from './dialog/index.jsx'
import Resource from './resource/index.jsx'
import Header from './header.jsx'
import Operation from './operation.jsx'

class Git extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.git = store.dialog.git;
    }
    render() {
        return (
            <git className={`${this.state.class} zoomIn animated`}>
                <Header state={ this.state.header } ></Header>
                <Operation state={ this.state.operation } ></Operation>
                <Resource state={ this.state.resource } ></Resource>
                <Dialog state={ this.state.dialog } ></Dialog>
            </git>
        );
    }
}
export default Git;
