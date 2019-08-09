import React, { Component } from 'react';
import Branch from './branch.jsx';
import Tags from './tags.jsx'
import Confirm from './confirm.jsx'
import Pull from './pull.jsx'
import Push from './push.jsx'
import Info from './info.jsx'

class GitDialog extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.dialog = store.dialog.git.dialog;
    }
    render() {
        return (
            <gitdialog open className={this.state.class}>
                <Branch state={ this.state.branch } />
                <Tags state={ this.state.tags } />
                <Confirm state={ this.state.confirm } />
                <Pull state={ this.state.pull } />
                <Push state={ this.state.push } />
                <Info state={ this.state.info } />
            </gitdialog>
        );
    }
}
export default GitDialog;
