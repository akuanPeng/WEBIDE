import React, { Component } from 'react';

class Footer extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.footer = store.footer;
    }
    render() {
        return (
            <footer>
                <div className="ide-msg">{this.state.msg}</div>
                <div className="ide-function">
                    {
                        this.state.functions.map((fun, i) => {
                            return <i id={fun.icon} key={i} className={fun.icon} title={fun.title} onClick={this.handleFullClick.bind(this)}></i>
                        })
                    }
                </div>
            </footer>
        );
    }
    // 开发者模式
    handleFullClick(e) {
        let content = store.content;
        // 是否为码字模式
        if (content.bottom.class !== "hide") {
            content.bottom.class = "hide";
            content.middle.left.class = "hide";
            content.middle.right.class = "hide";
            content.middle.center.menus.class = "hide";
            content.middle.center.panels.class = "hide";
            content.middle.center.tools.class = "hide";
            this.footer.middle = {...content.middle.style};
            this.footer.center = {...content.middle.center.style};
            this.footer.ide = {...content.middle.center.ide.style};
            content.middle.style = {bottom: '0px'};
            content.middle.center.style = {left: '0px', right: '0px'};
            content.middle.center.ide.style = {top: 0, left: 0, right: 0, bottom: 0};
        } else {
            content.bottom.class = "";
            content.middle.left.class = "";
            content.middle.right.class = "";
            content.middle.center.menus.class = "";
            content.middle.center.panels.class = "";
            content.middle.center.tools.class = "";
            content.middle.style = {...this.footer.middle};
            content.middle.center.style = {...this.footer.center};
            content.middle.center.ide.style = {...this.footer.ide};
        }
        content.setState(content);
    }
}
export default Footer;
