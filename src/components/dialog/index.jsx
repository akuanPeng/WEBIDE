import React, { Component } from 'react';
import Git from './git/index.jsx'
import NewFile from './newfile.jsx'
import NewDir from './newdir.jsx'
import Rename from './rename.jsx'
import Confirm from './confirm.jsx'
import Search from './search.jsx'
import Command from './command.jsx'
import Setting from './setting.jsx'
import Attribute from './attribute.jsx'
import AddRoute from './addroute.jsx'
import Loading from './loading.jsx'
import Db from './db.jsx'

class Dialog extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.dialog = store.dialog;
    }
    render() {
        return (
            <dialog className={this.dialog.class} onClick={this.handleCloseClick.bind(this)}>
                <Git state={ this.dialog.git } />
                <NewFile state={ this.dialog.newfile } />
                <NewDir state={ this.dialog.newdir } />
                <Rename state={ this.dialog.rename } />
                <Confirm state={ this.dialog.confirm } />
                <Search state={ this.dialog.search } />
                <Command state={ this.dialog.command } />
                <Setting state={ this.dialog.setting } />
                <Attribute state={ this.dialog.attribute } />
                <AddRoute state={this.dialog.addroute } />
                <Loading state={this.dialog.loading } />
                <Db state={this.dialog.db} />
            </dialog>
        );
    }
    componentDidMount() {
        // 注册右击事件
        this.dialog.handleAllCloseClick = this.handleAllCloseClick;
    }
    // 关闭弹出层
    handleCloseClick(e) {
        // 搜索时触发
        if (this.dialog.search.class) {
            let isSearh = comm.hasClass(e.target, 'search') || comm.hasClass(e.target.parentNode, 'search');
            if (!isSearh) {
                let dialog = store.dialog;
                dialog.class = "";
                dialog.search.class = "";
                dialog.search.value = "";
                document.getElementById('search').value = "";
                dialog.setState(dialog);
            }
        }
    }
}
export default Dialog;
