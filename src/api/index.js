import { path, request, splitfile } from './utils'

// let git = {
//      "git_branch_list_local": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "branch"],
//      "git_branch_list": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "branch", "-r"],
//      "git_branch_create_local": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "branch", "{{branch_name}}", "{{sha1}}"],
//      "git_branch_create": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "push", "origin", "{{branch_name}}", "{{sha1}}"],
//      "git_branch_delete_local": ["branch", "-d", "{{branch_name}}"],
//      "git_branch_delete": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "branch", "-d", "-r", "{{branch_name}}"],
//      "git_branch_checkout": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "checkout", "{{branch_name}}"],
//      "git_pull": ["pull", "origin", "{{r_branch}}:{{l_branch}}"],
//      "git_status": ["status", "-s"],
//      "git_file_add": ["add", "{{file_name}}"],
//      "git_file_reset": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "reset", "{{file_name}}"],
//      "git_file_checkout": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "checkout", "--", "{{file_name}}"],
//      "git_commit": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "commit", "-m", "{{msg}}", "{{files}}"],
//      "git_push": ["push", "origin", "{{r_branch}}:{{l_branch}}"],
//      "git_tag_list": ["show-ref", "--tags"],
//      "git_create_tag": ["tag", "-m", "{{msg}}", "-a", "{{tag_name}}", "{{sha1}}"],
//      "git_delete_tag_local": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "tag", "-d", "{{tag_name}}"],
//      "git_delete_tag": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "push", "-v", "origin", ":refs/tags/{{tag_name}}"],
//      "git_push_tag": ["-c", "diff.mnemonicprefix=false", "-c", "core.quotepath=false", "push", "origin", "{{tag_name}}"],
//      "git_simple_logs": ["log", `--pretty=format:"%d-%h-%ae-%cn-%cd-%s"`, "--graph", `--since={{end}}`, `--before={{begin}}`],
//      "git_show_log": ["show", "{{sha1}}"]
// };

function commands(data, cb) {
    if (data.params) {
        let args = data.args.join(' ');
        for (let key in data.params) {
            let regX = new RegExp(`{{${key}}}`)
            args = args.replace(regX, data.params[key])
        }
        data.args = args.split(' ');
    }
    request.post(`/mvc/v1/project/git/command/${pid}`, {
        args: JSON.stringify(data.args)
    }).then(cb, (err) => {});
}

// 获取文件树
export function getTree(cb) {
    request.get(
        `/mvc/v1/project/tree/${pid}`
    ).then(cb, (err) => {
        console.log(err);
    });
}

// 新增文件夹
export function addDir(data, cb) {
    request.post(
        `/mvc/v1/project/dir/${pid}/${data.dir_path.replace(/ /g, '_')}`, data
    ).then(cb, (err) => {});
}

// 新增文件
export function addFile(data, cb) {
    if (data.files) {
        let fileNames = [];
        Promise.all([].map.call(data.files, (file) => {
            fileNames.push(file.name.replace(/ /g, '_'));
            return request.post(
                data.isfile ? `/mvc/v1/project/file/${pid}/${data.file_path.replace(/ /g, '_')}`: `/mvc/v1/project/file/${pid}/${data.file_path}${file.name}`,
                { binary: file }
            )
        })).then((result) => {
            let res = { code: 0, msg: "", result: [] };
            for (let i=0; i < result.length; i++) {
                if (result[i].code !== 0) {
                    res.code = result[i].code;
                    res.msg += result[i].msg + ' ';
                } else {
                    res.result.push(fileNames[i]);
                }
            }
            cb(res);
        });
    } else {
        request.post(
            `/mvc/v1/project/file/${pid}/${data.file_path.replace(/ /g, '_')}`
        ).then(cb, (err) => {});
    }
}

// 获得文件内容
export function getFileContent(data, cb) {
    request.get(
        `/mvc/v1/project/file/${pid}/${data.file_path}`
    ).then(cb, (err) => {});
}

// 保存文件内容
export function saveFileContent(data, cb) {
    request.put(
        `/mvc/v1/project/file/${pid}/${data.file_path}`, data
    ).then(cb, (err) => {});
}

// 删除文件或文件夹
export function del(data, cb) {
    request.delete(
        `/mvc/v1/project/file/${pid}/${data.file_path}`
    ).then(cb, (err) => {});
}

// 文件夹文件重命名
export function rename(data, cb) {
    request.post(
        `/mvc/v1/project/rename/${pid}/${data.file_path.replace(/ /g, '_')}`, data
    ).then(cb, (err) => {});
}

// 复制
export function copy(data, cb) {
    request.post(
        `/mvc/v1/project/copy/${pid}/${data.file_path}`, data
    ).then(cb, (err) => {});
}

// 文件是否存在
export function isexist(data, cb) {
    request.get(
        `/mvc/v1/project/isexist/${pid}/${data.file_path}`
    ).then(cb, (err) => {});
}

// 获取api
export function comple_api(cb) {
    request.get(
        "http://leonidapi.17usoft.com/mvcplus/helper/api"
    ).then(cb, (err) => {});
}

// 获取api lua
export function comple_api_lua(cb) {
    request.get(
        "http://leonidapi.17usoft.com/mvcplus/helper/api_lua"
    ).then(cb, (err) => {});
}

// git命令行模式
export function command(data, cb) {
    request.post(
        `/mvc/v1/project/git/command/${pid}`, data
    ).then(cb, (err) => {});
}

// 获取Git状态列表
export function getGitStatus(cb) {
    // commands({
    //     args: git['git_status']
    // }, cb);
    request.post(
        `/mvc/v1/project/git/status/${pid}`
    ).then(cb, (err) => {});
}

// 添加Git状态 *
export function addGitFile(data, cb) {
    // commands({
    //     args: git['git_file_add'],
    //     params: {
    //         file_name: data.file_path
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/file/add/${pid}/${data.file_path}`
    ).then(cb, (err) => {});
}

// 重置GIT状态 *
export function resetGitFile(data, cb) {
    // commands({
    //     args: git['git_file_reset'],
    //     params: {
    //         file_name: data.file_name
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/file/reset/${pid}/${data.file_path}`
    ).then(cb, (err) => {});
}

// 检验Git状态
export function checkoutGitFile(data, cb) {
    // commands({
    //     args: git['git_file_checkout'],
    //     params: {
    //         file_name: data.file_name
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/file/checkout/${pid}/${data.file_name}`
    ).then(cb, (err) => {});
}

// 推送到本地
export function gitCommit(data, cb) {
    // commands({
    //     args: git['git_commit'],
    //     params: {
    //         msg: data.msg,
    //         files: data.commit_files
    //     }
    // }, cb);
    data.commit_files = JSON.stringify(data.commit_files);
    request.post(
        `/mvc/v1/project/git/commit/${pid}`, data
    ).then(cb, (err) => {});
}

// 推送到本地解决冲突
export function gitCommitAll(data, cb) {
    request.post(
        `/mvc/v1/project/git/commitall/${pid}`, data
    ).then(cb, (err) => {});
}

// 推送到远端
export function gitPush(data, cb) {
    // commands({
    //     args: git['git_push'],
    //     params: {
    //         r_branch: data.r_branch,
    //         l_branch: data.l_branch
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/push/${pid}`, data
    ).then(cb, (err) => {});
}

// 拉取远端分支到指定分支上
export function gitPull(data, cb) {
    // commands({
    //     args: git['git_pull'],
    //     params: {
    //         r_branch: data.r_branch,
    //         l_branch: data.l_branch
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/pull/${pid}`, data
    ).then(cb, (err) => {});
}

// 历史
export function getHistory(data, cb) {
    // let time = {
    //     1: {
    //         begin: '2017-5-17',
    //         end: '2017-4-17'
    //     }
    // }[data.divisor];
    // commands({
    //     args: git['git_simple_logs'],
    //     params: {
    //         begin: time.begin,
    //         end: time.end
    //     }
    // }, cb);
    request.get(
        `/mvc/v1/project/git/log/${pid}?divisor=${data.divisor}`
    ).then(cb, (err) => {});
}

// 获得提交信息
export function getHistoryShow(data, cb) {
    // commands({
    //     args: git['git_show_log'],
    //     params: {
    //         sha1: data.sha1
    //     }
    // }, cb);
    request.get(
        `/mvc/v1/project/git/show/${pid}/${data.sha1}`
    ).then(cb, (err) => {});
}

// 获得本地diff
export function getDiffShow(data, cb) {
    request.get(
        `/mvc/v1/project/git/diff/${pid}/${data.file_path}`
    ).then(cb, (err) => {});
}

// 获取本地分支列表
export function getBranchLocal(cb) {
    // commands({
    //     args: git['git_branch_list_local']
    // }, cb);
    request.get(
        `/mvc/v1/project/git/branch/local/${pid}?place=local`
    ).then(cb, (err) => {});
}

// 创建本地分支
export function addBranchLocal(data, cb) {
    // let cmd = [...git['git_branch_create_local']];
    // if (!data.sha1) cmd.pop();
    // commands({
    //     args: cmd,
    //     params: {
    //          branch_name: data.branch_name,
    //          sha1: data.sha1
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/branch/local/${pid}`, data
    ).then(cb, (err) => {});
}

// 删除本地分支
export function delBranchLocal(data, cb) {
    // commands({
    //     args: git['git_branch_delete_local'],
    //     params: {
    //          branch_name: data.branch_name
    //     }
    // }, cb);
    request.delete(
        `/mvc/v1/project/git/branch/local/${pid}?branch_name=${data.branch_name}`
    ).then(cb, (err) => {});
}

// 切换本地分支
export function checkoutBranchLocal(data, cb) {
    // commands({
    //     args: git['git_branch_checkout'],
    //     params: {
    //          branch_name: data.branch_name
    //     }
    // }, cb);
    request.get(
        `/mvc/v1/project/git/branch/checkout/${pid}?branch_name=${data.branch_name}`
    ).then(cb, (err) => {});
}

// 获取远端分支列表
export function getBranchRemote(cb) {
    // commands({
    //     args: git['git_branch_list']
    // }, cb);
    request.get(
        `/mvc/v1/project/git/branch/remote/${pid}`
    ).then(cb, (err) => {});
}

// 创建远端分支
export function addBranchRemote(data, cb) {
    // let cmd = [...git['git_branch_create']];
    // if (!data.sha1) cmd.pop();
    // commands({
    //     args: cmd,
    //     params: {
    //          branch_name: data.branch_name,
    //          sha1: data.sha1
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/branch/remote/${pid}`, data
    ).then(cb, (err) => {});
}

// 删除远端分支
export function delBranchRemote(data, cb) {
    // commands({
    //     args: git['git_branch_delete'],
    //     params: {
    //          branch_name: data.branch_name
    //     }
    // }, cb);
    request.delete(
        `/mvc/v1/project/git/branch/remote/${pid}?branch_name=${data.branch_name}`
    ).then(cb, (err) => {});
}

// 检出远端分支到本地
export function checkoutBranchRemote(data, cb) {
    request.get(
        `/mvc/v1/project/git/branch/checkoutorigin/${pid}?branch_name=${data.branch_name.replace('origin/', '')}&branch_name_origin=${data.branch_name}`
    ).then(cb, (err) => {});
}

// tag列表
export function tags(cb) {
    // commands({
    //     args: git['git_tag_list']
    // }, cb);
    request.get(
        `/mvc/v1/project/git/tag/${pid}`
    ).then(cb, (err) => {});
}

// 线上tag
export function tagsRemote (cb) {
    request.get(
        `/mvc/v1/project/remotegit/tags?pid=${pid}`
    ).then(cb, (err) => {});
}

// 创建tag
export function addtag(data, cb) {
    // commands({
    //     args: git['git_create_tag'],
    //     params: {
    //          msg: data.msg,
    //          tag_name: data.tag,
    //          sha1: data.sha1
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/tag/${pid}`, data
    ).then(cb, (err) => {});
}

// git_push_tag
export function pushtag(data, cb) {
    // commands({
    //     args: git['git_push_tag'],
    //     params: {
    //          tag_name: data.tag
    //     }
    // }, cb);
    request.post(
        `/mvc/v1/project/git/pushtag/${pid}`, data
    ).then(cb, (err) => {});
}

// git_delete_tag_local
export function deltaglocal(data, cb) {
    // commands({
    //     args: git['git_delete_tag_local'],
    //     params: {
    //          tag_name: data.tag_name
    //     }
    // }, cb);
    data.tag = data.tag_name;
    request.delete(
        `/mvc/v1/project/git/tag/${pid}/local`, data
    ).then(cb, (err) => {});
}

// git_delete_tag
export function deltag(data, cb) {
    // commands({
    //     args: git['git_delete_tag'],
    //     params: {
    //          tag_name: data.tag_name
    //     }
    // }, cb);
    data.tag = data.tag_name;
    request.delete(
        `/mvc/v1/project/git/tag/${pid}/remote`, data
    ).then(cb, (err) => {});
}

// fetchstat
export function fetchstat(data, cb) {
    request.post(
        `/mvc/v1/project/git/fetchstat/${pid}`, data
    ).then(cb, (err) => {});
}

// pushstat
export function pushstat(cb) {
    request.post(
        `/mvc/v1/project/git/pushstat/${pid}`
    ).then(cb, (err) => {});
}

// 获取 db
export function getDbinfoall(cb) {
    request.post(
        `/dbserver/v2/dbinfoall`, {
            mvc_id: pid
        }
    ).then(cb, (err) => {});
}
// 添加db
export function addDbserver(data, cb) {
    data.args_data["mvc_id"] = `${pid}`
    // redis
   if (data.args_data.db_type === 1){
       data.args_data['mode'] = parseInt(data.args_data['mode'])
       data.args_data['speed_limit'] = parseInt(data.args_data['speed_limit'])
       data.args_data['conn_timeout'] = parseInt(data.args_data['conn_timeout'])
       data.args_data['read_timeout'] = parseInt(data.args_data['read_timeout'])
       data.args_data['write_timeout'] = parseInt(data.args_data['write_timeout'])
       data.args_data["redis_type"] = parseInt(data.args_data["redis_type"])
       data.args_data.is_ping = data.args_data.is_ping == "true"
   }else
   // mysql
   if (data.args_data.db_type === 2){
       data.args_data['mode'] = parseInt(data.args_data['mode'])
       data.args_data['speed_Limit'] = parseInt(data.args_data['speed_Limit'])
       data.args_data.is_ping = data.args_data.is_ping == "true"
   } else
   // mssql
   if (data.args_data.db_type === 4){
       data.args_data['mode'] = parseInt(data.args_data['mode'])
       data.args_data['speed_Limit'] = parseInt(data.args_data['speed_Limit'])
       data.args_data.is_ping = data.args_data.is_ping == "true"
   } else
   // mongodb
   if (data.args_data.db_type === 3){
       data.args_data['mode'] = parseInt(data.args_data['mode'])
       data.args_data['conn_timeout'] = parseInt(data.args_data['conn_timeout'])
       data.args_data['read_timeout'] = parseInt(data.args_data['read_timeout'])
       data.args_data['write_timeout'] = parseInt(data.args_data['write_timeout'])
       data.args_data.is_ping = data.args_data.is_ping == "true"
   } else
   //dsf
   if (data.args_data.db_type === 5){
       if(typeof data.args_data.tag === "string") data.args_data.tag = data.args_data.tag ? data.args_data.tag.split(',') : []
   }
   for (let key in data.args_data) {
      data.args_data[key] = typeof data.args_data[key] === "string" ? data.args_data[key].trim() : data.args_data[key];
  }
    data["db_type"] = data.args_data["db_type"]
    data.args_data['_id'] = data.id;
    data["args_data"]= JSON.stringify(data.args_data)
    request.post(
        `/dbserver/v2/dbinfo`, data
    ).then(cb, (err) => {});
}

// ping db
export function pingDbserver(data, cb) {
    request.get(
        `/dbserver/v2/ping?db_type=${data.db_type}&_id=${data._id}`
    ).then(cb, (err) => {});
}
// 推送 db
export function redisPushOne(data, cb) {
    request.get(
        `/dbserver/v2/redispush?db_type=${data.db_type}&_id=${data._id}`
    ).then(cb, (err) => {});
}
// 推送 db MODE
export function pushMode(data, cb) {
    request.get(
        `/dbserver/v2/pushreload?db_type=${data.db_type}&_id=${data._id}`
    ).then(cb, (err) => {});
}
// 推送 db speed
export function pushSpeed(data, cb) {
    request.post(
        `/dbserver/v2/pushreload`,data
    ).then(cb, (err) => {});
}
// 修改db
export function editDbserver(data, cb) {
    data.args_data["mvc_id"] = `${pid}`
    // redis
   if (data.args_data.db_type === 1){
       data.args_data['mode'] = parseInt(data.args_data['mode'])
       data.args_data['speed_limit'] = parseInt(data.args_data['speed_limit'])
       data.args_data['conn_timeout'] = parseInt(data.args_data['conn_timeout'])
       data.args_data['read_timeout'] = parseInt(data.args_data['read_timeout'])
       data.args_data['write_timeout'] = parseInt(data.args_data['write_timeout'])
       data.args_data["redis_type"] = parseInt(data.args_data["redis_type"])
       data.args_data.is_ping = data.args_data.is_ping == "true"
   }else
   // mysql
   if (data.args_data.db_type === 2){
       data.args_data['mode'] = parseInt(data.args_data['mode'])
       data.args_data['speed_Limit'] = parseInt(data.args_data['speed_Limit'])
       data.args_data.is_ping = data.args_data.is_ping == "true"
   } else
   // mssql
   if (data.args_data.db_type === 4){
       data.args_data['mode'] = parseInt(data.args_data['mode'])
       data.args_data['speed_Limit'] = parseInt(data.args_data['speed_Limit'])
       data.args_data.is_ping = data.args_data.is_ping == "true"
   } else
   // mongodb
   if (data.args_data.db_type === 3){
       data.args_data['mode'] = parseInt(data.args_data['mode'])
       data.args_data['conn_timeout'] = parseInt(data.args_data['conn_timeout'])
       data.args_data['read_timeout'] = parseInt(data.args_data['read_timeout'])
       data.args_data['write_timeout'] = parseInt(data.args_data['write_timeout'])
       data.args_data.is_ping = data.args_data.is_ping == "true"
   } else
   //dsf
   if (data.args_data.db_type === 5){
       if(typeof data.args_data.tag === "string") data.args_data.tag = data.args_data.tag ? data.args_data.tag.split(',') : []
   }
   for (let key in data.args_data) {
      data.args_data[key] = typeof data.args_data[key] === "string" ? data.args_data[key].trim() : data.args_data[key];
  }
    data["db_type"] = data.args_data["db_type"]
    data["_id"] = data.args_data["_id"]
    data["args_data"]= JSON.stringify(data.args_data)
    request.put(
        `/dbserver/v2/dbinfo`, data
    ).then(cb, (err) => {});
}
// 删除 dsf
export function delDbserver(data, cb) {
    request.delete(
        `/dbserver/v2/dbinfo`, data
    ).then(cb, (err) => {});
}
// 失效 db
export function clearDbserver(data, cb) {
    request.delete(
        `/dbserver/v2/redispush`, data
    ).then(cb, (err) => {});
}
// 禁用 db
export function trueDelDbserver(data, cb) {
    request.delete(
        `/dbserver/v2/warningdo`, data
    ).then(cb, (err) => {});
}
// 调试 dsf
export function dsfDebug(data, cb) {
    data.dsf_param = JSON.parse(data.dsf_param)
    data._id = data._id
    request.post(
        `/dbserver/v2/dsfdebug`,data
    ).then(cb, (err) => {});
}
