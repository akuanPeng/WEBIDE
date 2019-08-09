import React, { Component } from 'react';

class Left extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.left = store.content.middle.left;
    }
    render() {
        return (
            <left className={`${this.left.class} user_select`}>
                {
                    this.left.menus.map((item, i) => {
                        return <span
                            key={i}
                            className={"ide-menu-btn " + (item.class || "")}
                            style={{top: (83 * (i + 1)) + "px"}}
                            onClick={this.handleSelectClick.bind(this, i)}
                        >
                            {item.text}
                        </span>
                    })
                }
            </left>
        );
    }
    // 选择点击
    handleSelectClick(i) {
        // 获取中央信息
        let center = store.content.middle.center;
        // 是否已关闭
        if (this.left.menus[i].class === "active") {
            // 关闭菜单和扩大编辑区
            center.menus.style.width = "0%";
            center.menus.style.minWidth = "0%";
            center.ide.style.left = "0%";
            // 取消选择
            this.left.menus[i].class = "";
        } else {
            // 打开菜单和恢复编辑区
            center.menus.style.width = (center.menus.width || 20) + "%";
            center.menus.style.minWidth = (center.menus.minWidth || 10) + "%";
            center.ide.style.left = (center.menus.width || 20) + "%";
            // 设置选择
            this.left.menus[i].class = "active";
        }
        // 执行改变
        center.setState(center, () => this.setState(this.left));
    }
}
export default Left;
