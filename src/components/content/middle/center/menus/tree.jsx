import React, { Component } from 'react';

class Tree extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.tree = store.content.middle.center.menus.menus[0].tree;
    }
    render() {
        this.tree.files = [];
        this.tree.controllers = [];
        this.tree.filters = [];
        // db
        return (
            <tree>
                { this.initTree(this.state.menus, true, 0, null, [], [], '') }
            </tree>
        );
    }
    componentDidMount() {
        // 树公开事件
        store.funs.tree = {
            refs: this.refs,
            openfile: this.handleFileClick,
            opentab: this.handleTabClick,
            init: this.init,
            strHandle: this.strHandle
        };
        // 初始化目录树
        this.init();
    }
    // 获取或刷新目录树
    init(cb, opt) {
        // 获取目录树
        let tree = store.content.middle.center.menus.menus[0].tree;
        api.getTree((res) => {
            if (res.code === 0) {
                // 获得用户
                window.user = res.result.name;
                store.user = res.result.name;
                if (perms.data.get_local_branch[perms.key]) {
                    // 获得默认分支
                    api.getBranchLocal((r) => {
                        if (r.code === 0) {
                            store.header.user = store.user;
                            let str = r.result.join(",");
                            store.header.branch = str ? str.split("* ")[1].split(",")[0] : '';
                            // if (typeof r.result === 'object') {
                            //     if (r.result.length) {
                            //         let str = r.result.join(",");
                            //         store.header.branch = str.split("* ")[1].split(",")[0];
                            //         // 获得待推送数
                            //         api.pushstat((re) => {
                            //             if (re.code === 0) {
                            //                 let operation = store.dialog.git.operation;
                            //                 operation.list[2].value = re.result ? re.result.length : 0;
                            //                 operation.setState(operation);
                            //             } else store.errMsgOpen(re.msg);
                            //         });
                            //         // 获得待拉取数
                            //         api.fetchstat({
                            //             branch: store.header.branch
                            //         }, (re) => {
                            //             if (re.code === 0) {
                            //                 let operation = store.dialog.git.operation;
                            //                 if (re.result.length) {
                            //                     let dts = re.result[0].split(',');
                            //                     if (dts.length == 3) {
                            //                         operation.list[1].value = dts[2].trim().split(' ')[0];
                            //                     } else {
                            //                          operation.list[1].value = 0;
                            //                     }
                            //                 } else {
                            //                     operation.list[1].value = 0;
                            //                 }
                            //                 operation.setState(operation);
                            //             } else store.errMsgOpen(re.msg);
                            //         });
                            //     }
                            // } else {
                            //     store.header.branch = '';
                            // }
                            store.branch = store.header.branch;
                            store.header.setState(store.header);
                        } else store.errMsgOpen(r.msg);
                    })
                } else {
                    store.header.user = store.user;
                    store.header.branch = '';
                    store.branch = '';
                    store.header.setState(store.header);
                }
                res.result.is_root = true;
                // db
                api.getDbinfoall((dbs) => {
                    if (perms.data.get_dbinfoall && perms.data.get_dbinfoall[perms.key]) {
                        if (dbs.code === 0) {
                            tree.menus = [res.result, {
                                name: 'dbservice',
                                is_dir: true,
                                menu: 'db',
                                children: [
                                    {
                                        name: 'redis',
                                        is_dir: true,
                                        menu: 'redis',
                                        children: dbs.result.redis.map((item) => {
                                            return {
                                                name: item.dsn && item.dsn.length > 12 ? this.strHandle(item.dsn, true, 6) : item.dsn,
                                                is_dir: false,
                                                menu: 'db_redis',
                                                details: item
                                            }
                                        })
                                    },
                                    // {
                                    //     name: 'mysql',
                                    //     is_dir: true,
                                    //     menu: 'mysql',
                                    //     children: dbs.result.mysql.map((item) => {
                                    //         return {
                                    //             name: item.dsn && item.dsn.length > 12 ? this.strHandle(item.dsn, true, 6) : item.dsn,
                                    //             is_dir: false,
                                    //             menu: 'db_mysql',
                                    //             details: item
                                    //         }
                                    //     })
                                    // },
                                    // {
                                    //     name: 'mongodb',
                                    //     is_dir: true,
                                    //     menu: 'mongodb',
                                    //     children: dbs.result.mongodb.map((item) => {
                                    //         return {
                                    //             name: item.dsn && item.dsn.length > 12 ? this.strHandle(item.dsn, true, 6) : item.dsn,
                                    //             is_dir: false,
                                    //             menu: 'db_mongodb',
                                    //             details: item
                                    //         }
                                    //     })
                                    // },
                                    // {
                                    //     name: 'mssql',
                                    //     is_dir: true,
                                    //     menu: 'mssql',
                                    //     children: dbs.result.mssql.map((item) => {
                                    //         return {
                                    //             name: item.dsn && item.dsn.length > 12 ? this.strHandle(item.dsn, true, 6) : item.dsn,
                                    //             is_dir: false,
                                    //             menu: 'db_mssql',
                                    //             details: item
                                    //         }
                                    //     })
                                    // },
                                    // {
                                    //     name: 'dsf',
                                    //     is_dir: true,
                                    //     menu: 'dsf',
                                    //     children: dbs.result.dsf.map((item) => {
                                    //         return {
                                    //             name: item.dsf_name,
                                    //             is_dir: false,
                                    //             menu: 'db_dsf',
                                    //             details: item
                                    //         }
                                    //     })
                                    // }
                                ]
                            }];
                        } else {
                            tree.menus = [res.result];
                            store.errMsgOpen(dbs.msg);
                        }
                    } else {
                        tree.menus = [res.result];
                    }
                    // 状态权限判断
                    if (perms.data.status_project[perms.key]) {
                        // 获得状态
                        api.getGitStatus((re) => {
                            if (re.code === 0) {
                                if (typeof re.result === 'object') {
                                    tree.states = comm.toJSONFilesType(re.result);
                                    tree.setState(tree, () => {
                                        if (cb) cb();
                                    });
                                } else {
                                    store.errMsgOpen(re.result || '获取状态为空字符串, 没有拿到预期结果[]');
                                }
                            } else store.errMsgOpen(res.msg);
                        });
                    } else {
                        tree.states = {};
                        tree.setState(tree, () => {
                            if (cb) cb();
                        });
                    }
                });
            } else store.errMsgOpen(res.msg);
        });
    }
    strHandle(val, isSuffix, num) {
    	return `${ val.substring(0, num) }...${isSuffix ? val.substr(val.length - num, num) : ""}`;
    };
    // 初始化渲染树
    initTree(children, isDir, layer, state, paths, locations, classState) {
        // 是否是文件夹
        if (isDir) {
            let lis_dirs = [], lis_files = [];
            for (let i=0; i < children.length; i++) {
                children[i].paths = [...paths];
                children[i].paths.push(children[i].name);
                children[i].locations = [...locations];
                children[i].locations.push(i);
                if (children[i].is_dir) {
                    let path = children[i].paths.join('/');
                    this.tree.opens[path] = this.tree.opens[path] || 'close';
                    children[i].states = this.tree.states[`${path}/`];
                    if (children[i].states === 'question') delete this.tree.states[`${path}/`];
                    if (classState === 'question') children[i].states = 'question';
                    lis_dirs.push(
                        <li key={i}
                            onDragEnter={this.handleDrag.bind(this)}
                            onDragOver={this.handleDrag.bind(this)}
                            onDrop={this.handleDrop.bind(this, children[i])}
                        >
                            <div className={`menu-li ${children[i].class}`} style={{"paddingLeft": (layer * 21 + 10) + "px", "opacity": (children[i].isCut ? '0.6' : '1')}}
                                onClick={this.handleDirClick.bind(this, path)}
                                onContextMenu={this.handleContextMenu.bind(this, children[i])}
                            >
                                <span className={`menu-${this.tree.opens[path]}`}>▾</span>
                                <i className={`icon-folder-${this.tree.opens[path]}-alt`}></i>
                                <span className="menu-li-text">{children[i].name}</span>
                            </div>
                            {
                                this.initTree(
                                    children[i].children,
                                    children[i].is_dir,
                                    layer + 1,
                                    this.tree.opens[path],
                                    children[i].paths,
                                    children[i].locations,
                                    children[i].states
                                )
                            }
                        </li>
                    );
                } else {
                    let path = children[i].paths.join('/');
                    let tabs = store.content.middle.center.ide.tabs;
                    let active = tabs.list[tabs.active];
                    if (active && active.paths.join('/') === path) children[i] = active;
                    this.tree.files.push(children[i]);
                    if (children[i].paths[1] && children[i].paths[1] === 'controllers') this.tree.controllers.push({
                        value: path.replace(`${user}/controllers/`, '').replace(/\.(js|lua)$/, ''),
                        label: path.replace(`${user}/controllers/`, '')
                    });
                    if (children[i].paths[1] && children[i].paths[1] === 'filters') this.tree.filters.push({
                        value: path.replace(`${user}/filters/`, '').replace(/\.(js|lua)$/, ''),
                        label: path.replace(`${user}/filters/`, '')
                    });
                    this.tree.path_location[path] = children[i].locations;
                    if (classState === 'question') this.tree.states[path] = 'question';
                    children[i].states = this.tree.states[path];
                    lis_files.push(
                        <li key={i}>
                            <div className={`menu-li ${children[i].states} ${this.tree.file_active === path ? 'active' : ''} ${children[i].class}`} style={{"paddingLeft": (layer * 20 + 10) + "px", "opacity": (children[i].isCut ? '0.6' : '1')}}
                                onClick={this.handleFileClick.bind(this, children[i].locations)}
                                onContextMenu={this.handleContextMenu.bind(this, children[i])}
                                draggable="true"
                                onDragStart={this.handleDBDropStart.bind(this, children[i].menu || children[i].paths[1], children[i].details || children[i].paths)}
                            >
                                <i id={children[i].locations.join('')} className="icon-file-text-alt"></i>
                                <span className="menu-li-text-file">{children[i].name}</span>
                            </div>
                        </li>
                    );
                }
            }
            return <ul className={`menu-ul ${this.tree.states[paths.join('/') + '/']} ${state}`}>
                {
                    [...lis_dirs, ...lis_files]
                }
            </ul>
        }
        return "";
    }
    handleDBDropStart(type, db, e) {
        let html = "";
        switch (type) {
            case "db_redis":
                html += language === "lua" ? `-- 建立redis连接 ${db.remark}
local rd = global.redis('${db._id}')
-- redis取
-- local data, err = rd.get('["key"]')
-- ...` :`// 建立redis连接 ${db.remark}
let rs = redis('${db._id}');
// redis存
// let [err1, data1] = await rs.set('key', 'value');
// redis取
// let [err2, data2] = await rs.get('key');
// ...`;
                break;
            case "db_mysql":
                html += language === "lua" ? `-- 建立mysql连接 ${db.remark}
local my = global.mysql('${db._id}')
-- 写sql语法获取执行结果
-- local data, err = my.queryAsync('sql语法')` : `// 建立mysql连接 ${db.remark}
let my = mysql('${db._id}');
// 写sql语法获取执行结果
// let [err, data] = await my.queryAsync('sql语法');`;
                break;
                case "db_mssql":
                    html += language === "lua" ? `-- 建立mssql连接 ${db.remark}
local ms = global.mssql('${db._id}')
-- 写sql语法获取执行结果
-- local data, err = ms.queryAsync('sql语法')` : `// 建立mssql连接 ${db.remark}
let ms = mssql('${db._id}');
// 写sql语法获取执行结果
// let [err, data] = await ms.queryAsync('sql语法');`;
                break;
            case "db_mongodb":
                html += language === "lua" ? `-- 建立mongo连接 ${db.remark}
local mg = global.mongo('${db._id}')
-- 写mongo语法获取执行结果
-- local data, err = mg.execAsync('mongo语法')` : `// 建立mongo连接 ${db.remark}
let mg = mongo('${db._id}');
// 写mongo语法获取执行结果
// let [err, data] = await mg.execAsync('mongo语法');`;
                break;
            case "db_dsf":
                html += language === "lua" ? `-- 建立dsf连接 ${db.name}
local data, err = global.dsf(
-- string 服务器地址
'${db.servicename}',
-- string 版本
'${db.version}',
-- string 请求方式
'${db.method}',
-- json 参数
{},
-- bool 是否是测试
false,
-- number 结果是否parse
false
)` : `// 建立dsf连接 ${db.name}
let [err, data] = await lib.dsfAsync(
// string 服务器地址
'${db.servicename}',
// string 版本
'${db.version}',
// string 请求方式
'${db.method}',
// json 参数
{},
// bool 是否是测试
false,
// number 结果是否parse 0和1
0
);`;
                break;
            case 'views':
                let paths = [...db];
                paths.shift();
                paths.shift();
                html += language === "lua" ? `<% include ${paths.join('/').split('.')[0]} %>` : `<%- include("${paths.join('/').split('.')[0]}") %>`
                break;
            default:
        }
        e.dataTransfer.setData("text", html);
    }
    // 处理拖放，确保没有其他元素会取得这个事件
    handleDrag(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    // 执行拖放，取消事件传播及默认行为, 获得拖放的文件
    handleDrop(children, e) {
        // 取消事件传播及默认行为
        e.stopPropagation();
        e.preventDefault();
        let data = e.dataTransfer,
            files = data.files;
        let tree = store.content.middle.center.menus.menus[0].tree,
            dirPath = [...children.paths];
            dirPath.shift();
        if (files.length) {
            api.addFile({
                file_path: `${dirPath.join('/')}/`,
                files: files
            }, (res) => {
                if (res.code === 0) {
                    // 静态添加文件夹
                    let active = comm.searchLocation(children.locations, tree.menus);
                    for (let i=0; i < res.result.length; i++)
                        active.children.push({ name: res.result[i], is_dir: false, children: null });
                    active.children = active.children.sort(comm.compare);
                    tree.setState(tree, () => {
                        store.errMsgOpen('OK', 'ok');
                    });
                } else {
                    store.errMsgOpen(res.msg);
                }
            });
        }
    }
    // 文件夹点击
    handleDirClick(path) {
        // 获得中央控制数据集和选择节点
        let center = store.content.middle.center,
            tree = center.menus.menus[0].tree;
        tree.status = undefined;
        tree.opens[path] = tree.opens[path] && tree.opens[path] === 'open' ? 'close' : 'open';
        tree.setState(tree);
    }
    // 文件点击
    handleFileClick(locations) {
        if (locations[0]) return; //store.errMsgOpen(`抱歉，DB无法生成页签，您可以拖到${language}代码中使用。`);
        // 获得中央控制数据集和选择节点
        let center = store.content.middle.center,
            active = comm.searchLocation(locations, center.menus.menus[0].tree.menus),
            paths = [...active.paths],
            $icon = $(`#${active.locations.join("")}`),
            tabs = store.content.middle.center.ide.tabs;
        if (!$icon) return store.errMsgOpen('让您失望了，目录树正在刷新中...请重试!');
        paths.shift();
        let path = paths.join('/'),
            location = tabs.tab_list.indexOf(path);
        // 判断是否已经存在内容
        if (location === -1) {
            // 菊花
            $icon.removeClass("icon-file-text-alt");
            $icon.addClass("icon-spinner");
            // 请求内容
            api.getFileContent({file_path: path}, (res) => {
                if (res.code === 0) {
                    if (/\.(png|jpg|webp|jpeg|gif|bmp|svg|tiff|tga|exif|fpx|psd|cdr|pcd|dxf|ufo|eps|hdri)$/i.test(active.name)) {
                        active.content = '';
                        // 创建tab
                        store.funs.tree.opentab(active, path, center.ide.tabs, () => {
                            // 内容显示在编辑器
                            editor.setValue('');
                            // 内容显示在编辑器
                            center.setState(center, () => {
                                let top = store.content.top;
                                top.crumbs = active.paths;
                                top.setState(top, () => {
                                    $icon.removeClass("icon-spinner");
                                    $icon.addClass("icon-file-text-alt");
                                    store.funs.routes.sRoutes('');
                                    store.funs.editor_img.sImgs('active', `${imgUrlPrefix}/${pid}/${user}/${path}`);
                                });
                            });
                        });
                    } else {
                        active.content = res.result.data.replace(/\r/g, '');
                        // 创建tab
                        store.funs.tree.opentab(active, path, center.ide.tabs, () => {
                            // 内容显示在编辑器
							active.newcontent = ''
							if (active.content === '' && /\.(html|ejs)$/.test(path)) active.newcontent = `<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>

</body>
</html>`;
                            editor.setValue(active.content || active.newcontent);
                            center.setState(center, () => {
                                let top = store.content.top;
                                top.crumbs = active.paths;
                                top.setState(top, () => {
                                    $icon.removeClass("icon-spinner");
                                    $icon.addClass("icon-file-text-alt");
                                    // 是否是路由
                                    if (/^route\.json$/.test(active.name)) {
                                        let routes = store.content.middle.center.ide.code_editor.routes,
                                            list = [];
                                        try {
                                            let rtes = JSON.parse(active.content || '[]');
                                            routes.count = rtes.length;
                                            routes.tree = store.funs.routes.initTreeData(rtes, {});
                                            routes.class = "active";
                                            routes.setState(routes);
                                        } catch(e) {
                                            store.errMsgOpen('路由对象数组解析错误');
                                        }
                                    } else store.funs.routes.sRoutes('');
                                    store.funs.editor_img.sImgs('');
                                });
                            });
                        });
                    }
                } else {
                    $icon.removeClass("icon-spinner");
                    $icon.addClass("icon-file-text-alt");
                    store.errMsgOpen(res.msg);
                }
            });
        } else {
            // 选择tab
            active = tabs.list[location];
            store.funs.tree.opentab(active, path, center.ide.tabs, () => {
                // 内容显示在编辑器
                editor.setValue(active.newcontent === undefined ? active.content : active.newcontent);
                center.setState(center, () => {
                    let top = store.content.top;
                    top.crumbs = active.paths;
                    top.setState(top, () => {
                        store.funs.routes.sRoutes(/^route\.json$/.test(active.name) ? 'active' : '');
                        store.funs.editor_img.sImgs(/\.(png|jpg|webp|jpeg|gif|bmp|svg|tiff|tga|exif|fpx|psd|cdr|pcd|dxf|ufo|eps|hdri)$/i.test(active.name) ? 'active' : '', `${imgUrlPrefix}/${pid}/${user}/${path}`);
                    });
                });
            });
        }
    }
    // 模拟tab点击
    handleTabClick(active, path, tabs, callback) {
        // 获得tag位置
        let tree = store.content.middle.center.menus.menus[0].tree;
        let code_editor = store.content.middle.center.ide.code_editor;
        let location = tabs.tab_list.indexOf(path);
        // 设置新选中
        tree.file_active = active.paths.join('/');
        code_editor.isKey = true;
        // 是否需要加tab
        if (location === -1) {
            tabs.list.unshift(active);
            tabs.tab_list.unshift(path);
            tabs.active = 0;
        } else {
            tabs.active = location;
        }
        callback();
    }
    // 右击事件层
    handleContextMenu(children, e) {
        store.discard = (children.states || '').indexOf('info') !== -1 ? true : undefined;
        // 执行右键菜单显示
        store.menus.handleContextMenu(
            children.is_root ?
            this.state.rightMenu.root :
            (
                children.menu ? (
                    this.state.rightMenu[children.menu] || []
                ) : (
                    children.is_dir ?
                    this.state.rightMenu.dir :
                    this.state.rightMenu.file
                )
            ),
            () => {
                if (this.tree.right_active)
                    this.tree.right_active.class = "";
                children.class = "right_active";
                this.tree.right_active = children;
                this.tree.setState(this.tree);
            }, e
        );
    }
}
export default Tree;
