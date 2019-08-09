import React, { Component } from 'react';

class Search extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.search = store.dialog.search;
    }
    render() {
        return (
            <search className={`${this.search.class} search bounceInDown animated`}>
                <i className="icon-search"></i>
                <input spellCheck="false" id="search" autoComplete="off" className="form-control" placeholder={this.search.title} onKeyUp={this.handleKeyUp.bind(this)} />
                <ul className={this.search.files.length !== 0 && this.search.value !== "" ? "": `hide`}>
                    {
                        this.search.files.map((item, i) => {
                            let path = item.paths.join('/');
                            return path.indexOf(this.search.value) !== -1
                                ? <li key={i} data-key={i} onClick={this.handleClick.bind(this)} onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>{path}</li>
                                : "";
                        })
                    }
                </ul>
            </search>
        );
    }
    // 搜索
    handleKeyUp(e) {
        let value = e.target.value;
        this.search.value = value;
        this.search.setState(this.search);
    }
    handleMouseOver(e) {
        comm.addClass(e.target, "active");
    }
    handleMouseOut(e) {
        comm.removeClass(e.target, "active");
    }
    handleClick(e) {
        let content = store.content,
            tree = content.middle.center.menus.menus[0].tree,
            menus = tree.menus,
            key = e.target.getAttribute('data-key'),
            active = this.search.files[key],
            locations = active.locations,
            paths = active.paths,
            arrPaths = [];
        paths.forEach((item, i) => {
            arrPaths.push(item);
            if (i !== (paths.length - 1)) {
                tree.opens[arrPaths.join('/')] = "open";
            }
        });
        tree.setState(tree, () => {
            document.getElementById(locations.join('')).click();
        });
    }
}
export default Search;
