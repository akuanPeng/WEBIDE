const REGEXP_CONTROLLER = /await\s*res.renderAsync\(\s*(['"])(.+)\1/g
const REGEXP_VIEW = /include\(\s*(['"])(.+)\1/g
module.exports = class Scan {
    constructor(controllers, views) {
        this.controllers = controllers || {}
        this.views = views || {}
        this.not_found = new Set();
        this.calcMap()
    }
    addController (name, value) {
        if (this.controllers[name]) {
            this.depSet.c[name] = []
        }
        this.controllers[name] = value
        this.calcControllerDeps(name, value)
    }
    addView (name, value) {
        this.not_found.delete(name)
        if (this.controllers[name]) {
            this.depSet.v[name] = []
        }
        this.views[name] = value
        this.calcViewDeps(name, value)
    }
    calcMap () {
        this.depSet = {
            c: {},
            v: {}
        }
        for (var name in this.controllers) {
            this.calcControllerDeps(name, this.controllers[name])
        }
        for (var name in this.views) {
            this.calcViewDeps(name, this.views[name])
        }
        return this.depSet
    }
    check (name) {
        if (this.views[name] == undefined) {
            this.not_found.add(name)
        }
    }
    calcControllerDeps (name, content) {
        this.depSet.c[name] = this.depSet.c[name] || [];
        while (true) {
            var res = REGEXP_CONTROLLER.exec(content)
            if (!res) {
                break
            }
            var [_, _, viewName] = res
            this.check(viewName)
            // this.depList.c.push({src: name, dep: viewName})
            this.depSet.c[name].push(viewName)
        }
    }
    calcViewDeps (name, content) {
        this.depSet.v[name] = this.depSet.v[name] || []
        while (true) {
            var res = REGEXP_VIEW.exec(content)
            if (!res) {
                break
            }
            var [_, _, viewName] = res
            this.check(viewName)
            // this.depList.v.push({src: name, dep: viewName})
            this.depSet.v[name].push(viewName)
        }
    }
}
