import React, { Component } from 'react';

class Header extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.header = store.header;
    }
    render() {
        return (
            <header onMouseLeave={ this.handleMouseLeave.bind(this) }>
                <img className="ide-logo" src={config.imgSrc + "logo2.png"}></img>
                <span className="ide-version">{perms.title}</span>
                <div className="ide-user">
                    <img src={config.imgSrc + "i_16_login.png"}></img>
                    <span className="title">
                        工号：{
                            this.header.user
                        }
                    </span>
                </div>
                <ul className="ide-menus">
                    {
                        (this.header.menus || []).map((menu, i) => {
                            return <li className={"menu " + menu.class} key={i}
                                data-key={i}
                                onClick={ this.handleClick.bind(this) }
                                onMouseOver={ this.handleMouseOver.bind(this) }
                            >
                                <span className="name">
                                    {
                                        menu.name
                                    }({
                                        menu.quick
                                    })
                                </span>
                                <ul ref={`submenus_${i}`} className={`submenus ${menu.menus ? "" : "hide"}`}>
                                    {
                                        (menu.menus || []).map((m, j) => {
                                            return (!m.auth || (m.auth && perms.data[m.auth] && perms.data[m.auth][perms.key])) ? <li key={j} className={m.class} onClick={this.handleMenuClick.bind(this, m, i)}>
                                                <i className={"icon " + m.icon}></i>
                                                <span className="menuName">{m.name}</span>
                                                <span className="menuQuick">{m.quick}</span>
                                                <span className="menuArrow">{m.menus?"▶":""}</span>
                                                <ul className={m.menus ? "" : "hide"}>
                                                    {
                                                        (m.menus || []).map((item, k) => {
                                                            return (!item.auth || (item.auth && perms.data[item.auth] && perms.data[item.auth][perms.key])) ? <li key={k} className={item.class} onClick={this.handleMenuClick.bind(this, item, i)}>
                                                                <i className={"icon " + item.icon}></i>
                                                                <span className="menuName">{item.name}</span>
                                                                <span className="menuQuick">{item.quick}</span>
                                                            </li> : ''
                                                        })
                                                    }
                                                    <li></li>
                                                </ul>
                                            </li> : ''
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
    handleMenuClick(menu, i) {
        if (menu.confirm && menu.key === 'git') {
            let tabs = store.content.middle.center.ide.tabs,
                list = tabs.list,
                edits = [];
            edits = list.map((tab) => {
                return tab.edit || '';
            });
            if (edits.join('')) {
                return menu.confirm(menu.key);
            }
        }
        let dialog = store.dialog,
            modal = dialog[menu.key];
        this.refs[`submenus_${i}`].style.display = "none";
        if (modal) {
            dialog.class = "active";
            modal.class = "active";
            if (menu.func) menu.func(menu, modal);
            dialog.setState(dialog);
        } else {
            if (store.funs[menu.key]) store.funs[menu.key]();
            if (menu.func) menu.func(menu);
        }
        setTimeout(() => {
            this.refs[`submenus_${i}`].style.display = null;
        }, 500)
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
    // 鼠标离开
    handleMouseLeave(e) {
        let menu = this.state.menus[this.state.key];
        menu.class = "";
        this.setState({
            menus: this.state.menus
        });
    }
}
export default Header;
