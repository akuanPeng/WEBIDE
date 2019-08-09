import React, { Component } from 'react';

class Top extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.top = store.content.top;
    }
    render() {
        return (
            <top>
                <div className="ide-crumbs">
                    {
                        this.loadCrumbs(this.state.crumbs).map((item, i) => {
                            return item.type === "arrows"
                            ? <div key={i} className="icon">
                                <div className="rotate">
                                    <span>∟</span>
                                </div>
                            </div>
                            : <div key={i} className="item">
                                <i className={ item.icon || ("icon-" + item.type + "-" + item.state + "-alt") }></i>
                                {item.name}
                            </div>
                        })
                    }
                </div>
                <div className="ide-tools">
                    {
                        this.state.tools.map((tool, i) => {
                            return <div id={tool.key} className="tool" key={i} data-tip={tool.title} onClick={this.handleToolsClick.bind(this,tool)}>
                                <i className={tool.icon}></i>
                            </div>
                        })
                    }
                </div>
            </top>
        );
    }
    // 加载面板削
    loadCrumbs(crumbs) {
        let crumbsPath = [];
        for (var i=0, ilen=crumbs.length; i < ilen; i++)
            if (crumbs[i]) {
                if (i) crumbsPath.push({ type: "arrows" })
                let isNotEnd = i != (ilen - 1);
                crumbsPath.push({
                    name: crumbs[i],
                    type: isNotEnd ? "folder" : "file",
                    state: isNotEnd ? "open" : "text",
                    icon: isNotEnd ? "" : "icon-file-text-alt"
                });
            }
        return crumbsPath;
    }
    // 点击事件
    handleToolsClick(tools){
        let dialog = store.dialog,
            modal = dialog[tools.key];
        if (modal) {
            dialog.class = "active";
            dialog.newfile.class = "";
            dialog.newdir.class = "";
            dialog.rename.class = "";
            dialog.confirm.class = "";
            dialog.search.class = "";
            dialog.command.class = "";
            dialog.setting.class = "";
            dialog.attribute.class = "";
            dialog.addroute.class = "";
            dialog.loading.class = "";
            modal.class = "active";
            if (tools.func) tools.func(tools, modal);
            dialog.setState(dialog);
        } else {
            if (tools.func) tools.func(tools);
        }
    }
}
export default Top;
