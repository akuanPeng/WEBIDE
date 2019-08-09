import React, { Component } from 'react';

class Tabs extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.tabs = store.content.middle.center.ide.tabs;
        this.tree = store.content.middle.center.menus.menus[0].tree;
    }
    render() {
        return (
            <tabs ref="tabs" className={this.state.list.length ? '' : 'hide'}>
                {
                    this.state.list.map((tab, i) => {
                        return <tab key={i} data-key={i} className={this.tree.file_active === tab.paths.join('/') ? 'active' : ''}
                            onClick={this.handleTabClick.bind(this, i, null, null)}
                            onContextMenu={this.handleContextMenu.bind(this, tab)}
                        >
                            <i className="icon-file-text-alt" data-place="bottom" data-tip={tab.paths.join('/')}></i>
                            {tab.name}
                            <close id={`tab_${tab.locations.join('')}`} onClick={this.handleCloseClick.bind(this, i, null, null)} data-place="top" className={tab.edit}>{tab.edit ? '•' : '×'}</close>
                        </tab>
                    })
                }
            </tabs>
        );
    }
    // tab更新后执行
    componentDidUpdate() {
        // 控制显示编辑器代码层
        let ide = store.content.middle.center.ide;
        ide.code_editor.tabLen = this.state.list.length;
        // 是否出现滚动条
        if (this.refs.tabs.scrollWidth > this.refs.tabs.clientWidth) {
            comm.addClass(ide.ref, 'active');
        } else {
            comm.removeClass(ide.ref, 'active');
        }
        ide.code_editor.setState(ide.code_editor);
        store.ReactTooltip.rebuild();
    }
    componentDidMount() {
        // 树公开事件
        store.funs.tabs = {
            clicktab: this.handleTabClick,
            closetabdata: this.closeTabData,
            closetab: this.handleCloseClick,
            fileclick: this.fileClick,
            closepathtab: this.handleClosePathClick
        };
        this.tabs.ref = this.refs.tabs;
    }
    // 根据文件路径关闭tag
    handleClosePathClick(path) {
        let tabs = store.content.middle.center.ide.tabs,
            index = tabs.tab_list.indexOf(path);
        if (index !== -1) store.funs.tabs.closetab(index, null, true);
    }
    // 关闭tab
    handleCloseClick(i, content, isClose) {
        // 执行关闭
        let conxt = content || store.content,
            tabs = conxt.middle.center.ide.tabs,
            tree = conxt.middle.center.menus.menus[0].tree,
            tab = tabs.list[i];
        // 判断是否关闭
        if (tab.edit && !content && !isClose) {
            return store.confirmOpen(`文件[${tab.name}]已改动未保存，是否确定关闭？`, () => {
                tab.edit = undefined;
                store.funs.tabs.closetab(i, content);
            });
        }
        // 当前待关闭tab是否被选中
        if (tab.paths.join('/') === tree.file_active) {
            // 计算新tab
            let num = i ? (i - 1) : (i + 1);
            // 设置新选中
            store.funs.tabs.clicktab(num, conxt, (conxt, paths) => {
                // 内容置空
                store.funs.tabs.closetabdata(tab, tabs, i);
                // 设置新位置
                tabs.active = tabs.list.length ? (num > i ? (num - 1) : num) : undefined;
                // 更新
                conxt.top.crumbs = paths;
                if (!content) conxt.setState(conxt);
            });
        } else {
            // 内容置空
            store.funs.tabs.closetabdata(tab, tabs, i);
            // 计算新位置
            tabs.active = tabs.active > i ? (tabs.active - 1) : tabs.active;
            // 更新
            if (!content) tabs.setState(tabs);
        }
    }
    // 执行关闭并清理数据
    closeTabData(tab, tabs, i) {
        // 内容置空
        tab.content = undefined;
        tab.newcontent = undefined;
        tab.edit = undefined;
        tab.scroll = undefined;
        tab.history = undefined;
        tab.cursor = undefined;
        // 关闭tab
        tabs.list.splice(i, 1);
        tabs.tab_list.splice(i, 1);
        let tree = store.content.middle.center.menus.menus[0].tree;
        if (!tabs.tab_list.length) {
            tree.file_active = "";
        }
    }
    // tab点击
    handleTabClick(i, content, callback, e) {
        // 判断点击元素是否有效
        if (e && e.target.tagName.toLowerCase() === "close") return;
        // 模拟触发文件点击
        content = content || store.content;
        let center = content.middle.center,
            code_editor = center.ide.code_editor,
            tabs = center.ide.tabs,
            active = tabs.list[i];
        store.funs.tabs.fileclick(active, tabs, () => {
            tabs.active = i;
            if (active) store.funs.routes.sRoutes(/^route\.json$/.test(active.name) ? 'active' : '');
            if (active) store.funs.editor_img.sImgs(
                /\.(png|jpg|webp|jpeg|gif|bmp|svg|tiff|tga|exif|fpx|psd|cdr|pcd|dxf|ufo|eps|hdri)$/i.test(active.name)
                ? 'active' : '',
                `${imgUrlPrefix}/${pid}/${active.paths.join('/')}`
            );
            code_editor.isKey = true;
            editor.setValue(active ? (
                active.newcontent === undefined ? active.content : active.newcontent
            ) : "");
            if (callback) {
                callback(content, active ? active.paths : []);
            } else {
                content.top.crumbs = active.paths;
                content.setState(content);
            }
        });
    }
    // 模拟文件点击
    fileClick(tab, tabs, callback) {
        let tree = store.content.middle.center.menus.menus[0].tree;
        // 设置新选中
        if (tab) tree.file_active = tab.paths.join('/');
        // 返回执行
        callback();
    }
    // 右击事件层
    handleContextMenu(tab, e) {
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            this.tabs.rightMenu,
            () => {
                this.tabs.right_active = tab;
                this.tabs.setState(this.tabs);
            }, e
        );
    }
}
export default Tabs;
