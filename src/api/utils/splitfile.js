const TYPE = {
    file: 'file',
    folder: 'folder'
}
const SPLIT = '/'

function Item (name, type, path, Obj) {
    for (var key in Obj) this[key] = Obj[key];
    this.name = name;
    this.type = type;
    this.path = path;
    this.folderMap = {};
    this.fileMap = {};
}

function Path (str) {
    var items = str.split(SPLIT)
    this.name = items.pop()
    this.path = items.join(SPLIT)
}

function cook_path (root) {
    let path = root.path ? root.path + SPLIT + root.name : root.name ? root.name : '';
    return path
}

function mkdir (dirname, folderObj, root) {
    if (!root.folderMap[dirname]) {
        root.folderMap[dirname] = new Item(dirname, TYPE.folder, cook_path(root), folderObj)
    }
    return root.folderMap[dirname]
}

function mkdirp (path, folderObj, root) {
    if (!path) return root;
    var parent = root;
    for (var dirname of path.split(SPLIT))
        parent = mkdir(dirname, folderObj, parent)
    return parent
}

function touch (filename, fileObj, folder) {
    if (typeof folder.fileMap[filename] != "object") {
        var file = new Item(filename || fileObj.name, TYPE.file, cook_path(folder), fileObj)
        file.path = `${file.path ? file.path + "/" : ""}${file.name}`;
        folder.fileMap[filename || fileObj.id] = file
    } else {
        console.log('文件重复');
    }
    return file
}

function make_tree (arr, folderObj) {
    var root = new Item(folderObj.name, TYPE.folder, '', folderObj);
    let i =0;
    for (let item of arr) {
        if (item.menu && item.menu == "routerMap") {
            var file = touch("", item, root);
        } else {
            var path = new Path(item.name);
            var folder = mkdirp(path.path, folderObj, root);
            var file = touch(path.name, item, folder);
        }
    }
    return root
}

export default make_tree
