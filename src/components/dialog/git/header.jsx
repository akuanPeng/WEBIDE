import React, { Component } from 'react';

class Header extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
    }
    render() {
        return (
            <header>
                <img className="ide-logo" src={config.imgSrc + "logo2.png"}></img>
                <span className="ide-version">{this.state.version}</span>
                Git 管理工具
                <span className="ide-close" onClick={this.handleCloseClick.bind(this)}>×</span>
                <ul className="ide-menus">
                    {
                        (this.state.menus || []).map((menu, i) => {
                            return <li className={"menu " + menu.class} key={i}
                                data-key={i}
                                onClick={ this.handleClick.bind(this) }
                                onMouseOver={ this.handleMouseOver.bind(this) }
                            >
                                <span className="name">
                                    { menu.name }({ menu.quick })
                                </span>
                                <ul ref={`submenus_${i}`} className={"submenus " + (menu.menus ? "" : "hide")}>
                                    {
                                        (menu.menus || []).map((m, j) => {
                                            return <li key={j} className={m.class} onClick={this.handleMenuClick.bind(this, m)}>
                                                <i className={"icon " + m.icon}></i>
                                                <span className="menuName">{m.name}</span>
                                                <span className="menuQuick">{m.quick}</span>
                                                <span className="menuArrow">{m.menus?"▶":""}</span>
                                                <ul className={m.menus ? "" : "hide"}>
                                                    {
                                                        (m.menus || []).map((item, k) => {
                                                            return <li key={k} className={item.class} onClick={this.handleMenuClick.bind(this, item)}>
                                                                <i className={"icon " + item.icon}></i>
                                                                <span className="menuName">{item.name}</span>
                                                                <span className="menuQuick">{item.quick}</span>
                                                            </li>
                                                        })
                                                    }
                                                    <li></li>
                                                </ul>
                                            </li>
                                        })
                                    }
                                    <li></li>
                                </ul>
                            </li>
                        })
                    }
                </ul>
            </header>
        );
    }
    // 关闭git
    handleCloseClick() {
        let dialog = store.dialog;
        dialog.class = "";
        dialog.git.class = "";
        dialog.setState(dialog);
    }
    // 菜单激活状态
    handleClick(e) {
        let key = e.target.getAttribute('data-key')
                || e.target.parentNode.getAttribute('data-key');
        if (key == undefined) return;
        let menu = this.state.menus[key];
        menu.class = menu.class ? "" : "active";
        this.setState({
            key: key,
            menus: this.state.menus
        });
    }
    // 菜单事件处理
    handleMenuClick(menu) {
        let dialog = store.dialog,
            modal = dialog[menu.key];
        if (modal) {
            dialog.class = "active";
            modal.class = "active";
            if (menu.func) menu.func(menu, modal);
            dialog.setState(dialog);
        } else {
            if (store.funs[menu.key]) store.funs[menu.key]();
            if (menu.func) menu.func(menu);
        }
        // 关闭头部菜单
        for (let key in this.refs) {
            comm.addClass(this.refs[key], 'hide');
            setTimeout(() => comm.removeClass(this.refs[key], 'hide'));
        }
    }
    // 菜单激活移动
    handleMouseOver(e) {
        let key = e.target.getAttribute('data-key')
                || e.target.parentNode.getAttribute('data-key');
        if (key == undefined) return;
        let menu = this.state.menus[key],
            oldMenu = this.state.menus[this.state.key];
        if (oldMenu.class) {
            oldMenu.class = "";
            menu.class = "active";
            this.setState({
                key: key,
                menus: this.state.menus
            });
        }
    }
}
export default Header;
