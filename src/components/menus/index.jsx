import React, { Component } from 'react';

class Menus extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.menus = store.menus;
    }
    // 渲染器
    render() {
        return (
            <rightMenu className={`${this.state.class} ${this.state.menus.length ? '' : 'hide'}`} style={this.state.style}>
                <ul ref="submenus" className="submenus">
                    {
                        this.state.menus.map((m, j) => {
                            let auth_value = false;
                            if (!m.auth) {
                                auth_value = true;
                            } else {
                                if (typeof m.auth === 'string') {
                                    auth_value = perms.data[m.auth] && perms.data[m.auth][perms.key];
                                } else {
                                    let at = true;
                                    m.auth.forEach((a) => {
                                        if (!(perms.data[a] && perms.data[a][perms.key])) {
                                            at = false;
                                        }
                                    });
                                    auth_value = at;
                                }
                            }
                            return auth_value ? <li key={j} className={`right_menu_li ${m.class} ${store.discard == undefined && m.discard ? 'hide' : ''}`} onClick={this.handleClick.bind(this, m)}>
                                <i className={"icon " + m.icon}></i>
                                <span className="menuName">{m.name}</span>
                                <span className="menuQuick">{m.quick}</span>
                                <span className="menuArrow"></span>
                            </li> : ''
                        })
                    }
                    <li></li>
                </ul>
            </rightMenu>
        )
    }
    componentDidUpdate () {
        if (!$(this.refs.submenus).find('li.right_menu_li').length) {
            $(this.refs.submenus).addClass('hide');
        } else {
            $(this.refs.submenus).removeClass('hide');
        }
    }
    componentDidMount() {
        // 注册右击事件
        this.menus.handleContextMenu = this.handleContextMenu;
        this.menus.handleClick = this.handleClick;
    }
    // 右键菜单点击事件
    handleClick(menu) {
        let dialog = menu.module ? store.dialog[menu.module].dialog: store.dialog,
            modal = dialog[menu.key];
        if (modal) {
            dialog.class = "active";
            if (dialog.newfile) dialog.newfile.class = "";
            if (dialog.newdir) dialog.newdir.class = "";
            if (dialog.rename) dialog.rename.class = "";
            if (dialog.confirm) dialog.confirm.class = "";
            if (dialog.search) dialog.search.class = "";
            if (dialog.command) dialog.command.class = "";
            if (dialog.setting) dialog.setting.class = "";
            if (dialog.attribute) dialog.attribute.class = "";
            if (dialog.addroute) dialog.addroute.class = "";
            if (dialog.loading) dialog.loading.class = "";
            modal.class = "active";
            if (menu.func) menu.func(modal, menu);
            if (menu.options) {
                modal.options = {...menu.options};
                if (menu.options.data) modal.options.data = JSON.parse(JSON.stringify(menu.options.data))
            }
            dialog.setState(dialog);
        } else {
            if (menu.func) menu.func(menu, store.menus.target);
        }
    }
    // 右击显示菜单
    handleContextMenu(rightMenu, callback, e) {
        store.menus.class = "active";
        let menuLen = rightMenu.length,
            left = (e.pageX + 218) > document.body.offsetWidth ? (e.pageX - 218) : e.pageX,
            top = (e.pageY + 34 * menuLen + 12) > document.body.offsetHeight ? (e.pageY - 34 * menuLen - 12) : e.pageY;
        store.menus.style = { left: left, top: top };
        // 设置菜单
        store.menus.menus = rightMenu;
        store.menus.target = e.target;
        store.menus.setState(store.menus, callback);
        e.stopPropagation();
        e.preventDefault();
    }
}
export default Menus;
