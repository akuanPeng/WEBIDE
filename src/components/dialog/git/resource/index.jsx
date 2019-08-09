import React, { Component } from 'react'
import List from './list.jsx'
import Files from './files/index.jsx'

class Resource extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.resource = store.dialog.git.resource;
    }
    render() {
        return (
            <resource>
                <List state={ this.resource.list } ></List>
                <files style={{...this.resource.style}}>
                    <div className="ide-git-main">
                        <Files state={ this.resource.files } ></Files>
                    </div>
                    <div className="ide-git-footer user_select">
                        {
                            this.resource.footer.list.map((item, i) => {
                                return <div id={`git_tab_${item.key}`} key={i} className={`ide-git-tag ${item.class}`} onClick={this.handleTagClick.bind(this, i, null)}>
                                    {item.name}
                                </div>
                            })
                        }
                    </div>
                </files>
            </resource>
        );
    }
    componentDidMount() {
        this.resource.handleTagClick = this.handleTagClick;
    }
    // 点击切换tag
    handleTagClick(i, cb) {
        let resource = store.dialog.git.resource,
            list = resource.footer.list,
            files = resource.files;
        // 设置页签选中
        list = list.map((item, j) => {
            item.class = j == i ? "active" : "";
            return item;
        });
        files.submitClass = list[i].submitClass;
        files.content.style.bottom = files.submitClass ? "38px" : "0px";
        files.content.store.selected = i || 0;
        files.content.store.style.top = files.submitClass ? "0px" : "50%";
        files.content.diff.style.top = files.submitClass ? "0px" : "50%";
        files.content.history.style.height = files.submitClass ? "0px" : "50%";
        files.content.history.style.minHeight = files.submitClass ? "0px" : "10%";
        if (cb) cb(files);
        if (files.class === 'active' && !i) {
            files.content.style.bottom = "0";
            files.content.store.style.bottom = "128px";
            files.content.diff.style.bottom = "128px";
        } else {
            files.content.store.style.bottom = "0";
            files.content.diff.style.bottom = "0";
        }
        if (i) {
            files.content.history.getHistory(1, (res) => {
                files.content.history.list = res;
                resource.setState(resource, () => {
                    if (files.class === 'active') files.refs.git_msg.focus();
                });
            });
        } else {
            resource.setState(resource, () => {
                if (files.class === 'active') files.refs.git_msg.focus();
            });
        }
    }
}
export default Resource;
