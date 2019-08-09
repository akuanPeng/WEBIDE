import React, { Component } from 'react';

class Right extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.right = store.content.middle.right;
    }
    render() {
        return (
            <right className={`${this.right.class} user_select`}>
                {
                    this.right.menus.map((item, i) => {
                        return <span
                            key={i}
                            className={"ide-menu-btn " + (item.class || "")}
                            style={{top: (83 * i) + "px"}}
                            onClick={this.handleSelectClick.bind(this, i)}
                        >
                            {item.text}
                        </span>
                    })
                }
            </right>
        );
    }
    // 选择点击
    handleSelectClick(i) {
        // 获取中央信息
        let center = store.content.middle.center;
        // 是否已关闭
        if (this.right.menus[i].class === "active") {
            // 打开菜单和恢复编辑区
            center.tools.active = 0;
            // 关闭菜单和扩大编辑区
            center.tools.style.width = "0%";
            center.tools.style.minWidth = "0%";
            center.ide.style.right = "0%";
            // 设置选择
            this.right.menus[0].class = "";
            this.right.menus[1].class = "";
        } else {
            // 打开菜单和恢复编辑区
            center.tools.active = i;
            center.tools.style.width = (center.tools.width || 35) + "%";
            center.tools.style.minWidth = (center.tools.minWidth || 10) + "%";
            center.ide.style.right = (center.tools.width || 35) + "%";
            // 设置选择
            if (i) {
                this.right.menus[0].class = "";
            } else {
                this.right.menus[1].class = "";
            }
            this.right.menus[i].class = "active";
        }
        // 执行改变
        center.setState(center, () => {
            this.setState(this.right);
        });
    }
}
export default Right;
