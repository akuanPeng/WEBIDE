import './lib/addon/dialog/dialog.js';
import './lib/addon/mode/multiplex.js';
import './lib/mode/xml/xml.js';
import './lib/mode/htmlmixed/htmlmixed.js';
import './lib/mode/css/css.js';
import './lib/mode/javascript/javascript.js';
import './lib/mode/lua/lua.js';
import './lib/addon/fold/foldcode.js';
import './lib/addon/fold/foldgutter.js';
import './lib/addon/fold/brace-fold.js';
import './lib/addon/fold/comment-fold.js';
import './lib/addon/fold/xml-fold.js';
import './lib/addon/edit/closebrackets.js';
import './lib/addon/edit/closetag.js';
import './lib/addon/lint/lint.js';
import eslint from './lib/addon/lint/eslint.js';
window.eslint = eslint;
import './lib/addon/lint/javascript-lint.js';
import './lib/addon/lint/jshint.js';
import './lib/addon/lint/json-lint.js';
import './lib/addon/lint/lua-lint.js';
import './lib/addon/hint/show-hint.js';
import './lib/addon/hint/javascript-hint.js';
import './lib/addon/hint/xml-hint.js';
import './lib/addon/hint/html-hint.js';
import './lib/addon/hint/css-hint.js';
import './lib/addon/hint/lua-hint.js';
import './lib/addon/comment/comment.js';
import './lib/addon/merge/merge.js';
import './lib/addon/search/search.js';
import './lib/addon/search/searchcursor.js';
import './lib/keymap/sublime.js';
import './lib/format/jsformat.js';
import './lib/format/htmlformat.js';
import './lib/format/lua_format.js';
import './lib/format/cssformat.js';
import 'react-select/dist/react-select.css';

window.comm = {
    // 自动识别错误
    autoIdentification: (result, cb) => {
        if (typeof result === "object") {
            const msg = result.join('');
            if (msg) {
                store.infoMsgOpen(result);
            } else {
                if (cb) {
                    cb();
                } else store.errMsgOpen('OK', 'ok');
            }
        } else store.infoMsgOpen(result);
    },
    getId: () => {
        let time = Date.now().toString();
        time = time.substr(time.length - 8);
        let hz = '';
        for (let i=16; i > 0; i--) {
            hz += Math.floor(Math.random()*16.0).toString(16);
        }
        return time + hz;
    },
    // 截取字符串
    getSubStr: (str, q, h) => {
        let len = str.replace(/[\u4e00-\u9fa5]/g, '00').length;
        if (len > (q+h)) {
            return `${str.substring(0, q)}...${str.substr(len - h, h)}`;
        } else {
            return str;
        }
    },
    // 解析方法
    getMethods(value) {
        value = parseInt(value);
        let methods = [];
        if (value & 1)
            methods.push('GET');
        if (value & 2)
            methods.push('POST');
        if (value & 4)
            methods.push('PUT');
        if (value & 8)
            methods.push('DELETE');
        if (value & 16)
            methods.push('OPTIONS');
        if (value & 32)
            methods.push('HEAD');
        return methods.join(' ')
    },
    // 获得字符长度区分中英文
    getBLen: (str) => {
        if (str == null)
            return 0;
        if (typeof str != "string") {
            str += "";
        }
        return str.replace(/[^\x00-\xff]/g, "01").length;
    },
    // 动态注册uitils
    utilsObj: (txt) => {
        let utils = {},
            exts = txt.match(/exports\.([0-9a-zA-Z_\u4e00-\u9fa5]*)/g);
        if (exts) {
            for (var i = 0; i < exts.length; i++) {
                utils[exts[i].replace("exports.", "")] = null;
            }
        }
        return utils;
    },
    modeType: (value) => {
        return {1: '只读', 2: '只写', 3: '读写'}[value]
    },
    isPing: (value) => {
        return {false: '未通过', true: '通过'}[value]
    },
    hasClass: (obj, cls) => {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: (obj, cls) => {
        if (!comm.hasClass(obj, cls))
            obj.className += " " + cls;
        }
    ,
    removeClass: (obj, cls) => {
        if (comm.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    },
    dateFormat: (dt, fmt) => {
        var o = {
            "M+": dt.getMonth() + 1,
            "d+": dt.getDate(),
            "h+": dt.getHours(),
            "m+": dt.getMinutes(),
            "s+": dt.getSeconds(),
            "q+": Math.floor((dt.getMonth() + 3) / 3),
            "S": dt.getMilliseconds()
        };
        fmt = /(y+)/.test(fmt)
            ? fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length))
            : fmt;
        for (var k in o)
            fmt = new RegExp("(" + k + ")").test(fmt)
                ? fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
                    ? (o[k])
                    : (("00" + o[k]).substr(("" + o[k]).length)))
                : fmt;
        return fmt;
    },
    toDataURL: (file, cb) => {
        let reader = new FileReader();
        let blob = new Blob([file], {type: "image/png"});
        //将文件以Data URL形式读入页面
        reader.readAsDataURL(blob);
        reader.onload = function(e) {
            cb(e.target.result);
        }
    },
    // 对象数组排序算法
    compare: (obj1, obj2) => {
        let val1 = obj1[window.skey || 'name'],
            val2 = obj2[window.skey || 'name'];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    },
    // 根据路径查找
    searchLocation: (location, menus, isDel) => {
        // 执行查找
        let menu;
        for (let i = 0, ilen = location.length; i < ilen; i++) {
            if (isDel && i === (ilen - 1)) {
                // 关闭tab
                let tab = document.getElementById(`tab_${location.join('')}`)
                if (tab)
                    tab.click();
                menu.children.splice(location[i], 1);
            } else {
                menu = i
                    ? menu.children[location[i]]
                    : menus[location[i]];
            }
        }
        return menu;
    },
    // 复制
    copy: (txt, ispaste) => {
        var clipboard = document.getElementById("clipboard");
        store.clipboard = ispaste
            ? txt
            : undefined;
        clipboard.value = txt;
        clipboard.select();
        document.execCommand("Copy");
    },
    // 过滤出文件
    getFilePath(treeStates, fileStr, reg, status) {
        if (reg.source === "^RM ") {
            let files1 = fileStr.replace(/^RM /, "").split(' -> ');
            treeStates[store.user + '/' + files1[1]] = status;
        } else if (reg.source === "^R ") {
            let files1 = fileStr.replace(/^R /, "").split(' -> ');
            treeStates[store.user + '/' + files1[0].trim()] = status[0];
            treeStates[store.user + '/' + files1[1]] = status[1];
        } else {
            let filepath = fileStr.replace(reg, "").trim();
            if (/^(["])(.*)\1$/.test(filepath))
                filepath = filepath.replace(/^(["])(.*)\1$/, (t, t1, t2) => t2)
            treeStates[store.user + '/' + filepath] = status;
        }
    },
    // 文件类型整理
    toJSONFilesType: (files) => {
        let treeStates = {},
            errors = [],
            status = [
                [
                    /^ D /, "minus store"
                ],
                [
                    /^DD /, "minus store clash"
                ],
                [
                    /^MD /, "minus store"
                ],
                [
                    /^D /, "minus list"
                ],
                [
                    /^AD /, "minus store"
                ],
                [
                    /^UD /, "minus store clash"
                ],
                [
                    /^DU /, "plus store clash"
                ],
                [
                    /^A /, "plus list"
                ],
                [
                    /^UU /, "info store clash"
                ],
                [
                    /^UA /, "plus store clash"
                ],
                [
                    /^AU /, "info store clash"
                ],
                [
                    /^AA /, "plus store clash"
                ],
                [
                    /^AM /, "plus store"
                ],
                [
                    /^DM /, "info store"
                ],
                [
                    /^ M /, "info store"
                ],
                [
                    /^MM /, "info store"
                ],
                [
                    /^M /, "info list"
                ],
                [
                    /^\?\? /, "question store"
                ],
                [
                    /^RM /, "info store"
                ],
                [
                    /^R /,
                    ["minus list", "plus list"]
                ],
				[
					/^C /,
                    ["info list", "plus list"]
				]
            ];
        // 状态
        for (let i = 0; i < files.length; i++) {
            let isEx = true
            for (let j = 0; j < status.length; j++) {
                if (status[j][0].test(files[i])) {
                    isEx = false;
                    comm.getFilePath(treeStates, files[i], status[j][0], status[j][1])
                }
            }
            if (isEx)
                errors.push(files[i]);
            }
        if (errors.length)
            store.errMsgOpen(`由于git status 状态，部分很难模拟如：${JSON.stringify(errors)}, 没有成功识别, 请联系管理员补录.`);
        return treeStates;
    },
    // 计算方法值
    countMethod(value) {
        let values = [];
        value = parseInt(value);
        if ((1 & value) === 1)
            values.push("1");
        if ((2 & value) === 2)
            values.push("2");
        if ((4 & value) === 4)
            values.push("4");
        if ((8 & value) === 8)
            values.push("8");
        if ((16 & value) === 16)
            values.push("16");
        if ((32 & value) === 32)
            values.push("32");
        return values;
    },
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
};

window.pid = comm.getUrlParam('pid');
window.language = comm.getUrlParam('language');
window.perms = JSON.parse(sessionStorage[pid]);
// window.perms = {
//     "title": "test",
//     "dev": "http://127.0.0.1:6502/",
//     "uri": "http://127.0.0.1:7611/libraapi2",
//     "git": "http://127.0.0.1:10080/root/",
//     "key": "704617284b7c76cdd6685868e461dc66",
//     "token": '0f15a5f0211def1c203e8e5c75ab34ad',
//     "data": {
//         "add_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "get_project": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "del_project": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "get_product": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "add_product": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "copy_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "rename_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "transfer_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "publish_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "twlogs_project": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "get_taglist": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "del_taglist": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "get_users": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "add_users": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "del_users": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "get_remote_tags": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "clone_project": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "get_local_branch": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "get_remote_branch": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "add_local_branch": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "add_remote_branch": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "del_local_branch": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "del_remote_branch": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "checkout_branch": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "pull_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "status_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "add_git_file": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "reset_git_file": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "checkout_git_file": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "commit_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "push_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "get_local_tag": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "add_local_tag": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "del_local_tag": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "del_remote_tag": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "push_tag": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "get_git_log": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "get_git_show": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "get_tree": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "get_file": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "add_file": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "add_dir": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "rename_file_dir": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "update_file": {
//             "704617284b7c76cdd6685868e461dc66": 4
//         },
//         "del_file_dir": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "copy_file": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "isexist_file": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "ping_db": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "get_dbinfoall": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "add_dbinfo": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "edit_dbinfo": {
//             "704617284b7c76cdd6685868e461dc66": 4
//         },
//         "redis_push": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "mode_push": {
//             "704617284b7c76cdd6685868e461dc66": 1
//         },
//         "speed_push": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "del_dsf": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "clear_redispish": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "del_db": {
//             "704617284b7c76cdd6685868e461dc66": 8
//         },
//         "debug_dsf": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         },
//         "commit_all_project": {
//             "704617284b7c76cdd6685868e461dc66": 2
//         }
//     }
// }
window.imgUrlPrefix = `${perms.uri}/staticproxy/mvcfile`;
import '../config'
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/editor.jsx';
import States from '../states/editor'
import * as API from './api/index.js'
import './main.scss'

// 缓存状态
window.store = States;
window.api = API;

// 浏览器关闭事件
// window.onbeforeunload = function(e) {
//     return "是否确认离开MVC+编辑器？"
// };

$(window).resize(function() {
    let ide = store.content.middle.center.ide;
    let tabs = ide.tabs;
    // 是否出现滚动条
    if (tabs.ref.scrollWidth > tabs.ref.clientWidth) {
        comm.addClass(ide.ref, 'active');
    } else {
        comm.removeClass(ide.ref, 'active');
    }
});

// 浏览器关闭事件
window.onbeforeunload = function(e) {
    return "是否确认离开MVC+编辑器？"
};

// 屏蔽浏览器事件
document.onkeydown = (e) => {
    e = window.event || e;
    var keycode = e.keyCode || e.which;
    if (e.ctrlKey && keycode == 87) { //屏蔽Ctrl+w
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && keycode == 82) { //Ctrl + R
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && keycode == 83) { //Ctrl + S
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && keycode == 74) { //Ctrl + J
        // $("#setting").click();
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && keycode == 75) { //Ctrl + K
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && keycode == 78) { //Ctrl + N
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.altKey && keycode == 78) { //Alt + N
        store.menus.handleClick({key: "newfile", auth: "add_file"});
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && e.altKey && keycode == 78) { //Ctrl + Alt + N
        store.menus.handleClick({key: "newdir", auth: "add_dir"});
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && e.altKey && keycode == 84) { //Ctrl + Alt + T
        document.getElementById("icon-desktop").click()
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && e.altKey && keycode == 68) { //Ctrl + Alt + D
        document.getElementById("icon-desktop").click()
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && keycode == 79) { //Ctrl + O
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && keycode == 80) { //Ctrl + P
        $("#search").click();
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.ctrlKey && e.shiftKey && keycode == 83) { //Ctrl + Shift + S
        CodeMirror.commands.allSave(editor);
        e.preventDefault();
        e.returnValue = false;
    }
    if (e.shiftKey && keycode == 27) { // Shift + ESC
        window.close();
        e.preventDefault();
        e.returnValue = false;
    }
    // 格式化
    if (e.ctrlKey && keycode == 75) { //Ctrl + K
        // CodeMirror.commands.format(editor);
        e.preventDefault();
        e.returnValue = false;
    }
};

ReactDOM.render(
    <Editor state={States}/>, document.getElementById('ide'))
