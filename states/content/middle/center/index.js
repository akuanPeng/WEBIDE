import Menus from './menus'
import IDE from './ide'

export default {
    style: {
        left: '25px',
        right: '25px'
    },
    menus: Menus,
    ide: IDE,
    panels: {
        isDragAndDrop: false,
        pxThan: 0,
        mouseY: 0,
        style: {
            height: "0%",
            minHeight: "0%",
            maxHeight: "80%",
            left: 0,
            right: 0
        },
        active: {},
        logs: {
            list: []
        },
        console: {
            len: 1000,
            list: [],
            rightMenu: [
                {
                    name: "清空...",
                    icon: "icon-trash",
                    quick: "",
                    func: () => {
                        let cle = store.content.middle.center.panels.console;
                        cle.refs.empty.click();
                    }
                }
            ]
        }
    },
    tools: {
        active: 0,
        isDragAndDrop: false,
        pxThan: 0,
        mouseX: 0,
        style: {
            width: "0%",
            minWidth: "0%",
            maxWidth: "80%",
            top: 0,
            bottom: 0
        },
        language: "js",
        // luaUrl: "http://leonidapi.17usoft.com/mvcplus/prod/mvcleonid/58e712f4a7533700012260d7/",
        // jsUrl: "http://leonidapi.17usoft.com/mvcplus/prod/mvcleonid/58e712f4a7533700012260d7/jshelp",
		luaUrl: 'http://leonidapi.17usoft.com/docs/mvcplus2/lua',
		jsUrl: 'http://leonidapi.17usoft.com/docs/mvcplus2/js',
        shortcuts: {
            "Ctrl+{": "多行向左缩进",
            "Ctrl+}": "多行向右缩进",
            "Ctrl+←": "向左单位性, 移动光标",
            "Ctrl+→": "向右单位性, 移动光标",
            "Ctrl+/": "注释单行",
            "Ctrl+A": "全选",
            "Ctrl+C": "选择, 复制",
            "Ctrl+D": "选择, 重复可继续选择相同文本",
            "Ctrl+F": "查找",
            "Ctrl+G": "查找状态下, 查找下一个",
            "Ctrl+H": "替换",
            "Ctrl+J": "将代码合并到光标所在行",
            "Ctrl+L": "选择行",
            "Ctrl+M": "光标必须在目标内, 折叠代码",
            "Ctrl+P": "在当前项目中搜索文件",
            "Ctrl+S": "保存",
            "Ctrl+U": "软撤销, 撤销光标位置",
            "Ctrl+V": "粘贴",
            "Ctrl+X": "选择, 剪切. 否则, 删除光标所在行",
            "Ctrl+Y": "恢复撤销",
            "Ctrl+Z": "撤销",
            "Ctrl+K+U": "转换大写",
            "Ctrl+K+L": "转换小写",
            "Ctrl+Shift+↑": "向上替换行",
            "Ctrl+Shift+↓": "向下替换行",
            "Ctrl+Shift+←": "向左单位性地选中文本",
            "Ctrl+Shift+→": "向右单位性地选中文本",
            "Ctrl+Shift+D": "复制光标所在整行, 插入到下一行",
            "Ctrl+Shift+Enter": "当前行向上插入新行",
            "Ctrl+Shift+F": "查找并替换文本",
            "Ctrl+Shift+G": "查找状态下, 查找上一个",
            "Ctrl+Shift+K": "删除整行",
            "Ctrl+Shift+L": "格式化",
            "Ctrl+Shift+R": "替换全部",
            "Ctrl+Alt+N": "新建文件夹",
            "Ctrl+Shift+P": "在当前项目中搜索文件",
            "Ctrl+Shift+S": "保存所有",
            "Alt+F3": "选择所有相同的文本",
            "Alt+N": "新建文件",
            "Shift+↑": "向上选中多行",
            "Shift+↓": "向下选中多行",
            "Shift+←": "向左选中文本",
            "Shift+→": "向右选中文本",
            "Shift+Tab": "单行向左缩进"
        }
    }
}
