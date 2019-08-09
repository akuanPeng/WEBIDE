import React, { Component } from 'react'

class Diff extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.diff = store.dialog.git.resource.files.content.diff;
    }
    render() {
        return (
            <div ref="diff" className="ide-git-right" style={{...this.diff.style}}>
                <div id="diff" className="ide-git-diff"></div>
                <div className="ide-x-l-drag" onMouseDown={this.handleMouseDown.bind(this)}></div>
            </div>
        );
    }
    // 渲染结束
    componentDidMount() {
        // 注册全局功能
        store.funs.diff = {
            handleMouseMove: this.handleMouseMove.bind(this),
            handleMouseUp: this.handleMouseUp.bind(this)
        };
    }
    //
    componentDidUpdate() {
        // diff
        if (this.diff.files) {
            const diff2htmlUi = new Diff2HtmlUI({diff: this.diff.files});
            diff2htmlUi.draw('#diff', {inputFormat: 'json', showFiles: false, matching: 'lines'});
            diff2htmlUi.fileListCloseable('#diff', false);
            // 计算目录
            $(".d2h-file-list-header,.d2h-file-list-wrapper").hide();
            $("#git-file-list").html('');
            $(".d2h-file-wrapper").hide();
            $.each($(".ide-git-diff .d2h-file-wrapper"), (i, item) => {
                $("#git-file-list").append(`<li class="diff-li" onclick="$('#git-file-list li').removeClass('active');$(this).addClass('active');$('.d2h-file-wrapper').hide();$('.d2h-file-wrapper:eq(${i})').show()">
                    <i class="icon-file-text-alt"></i>
                    ${$(item).find(".d2h-file-name").text()}
                </li>`);
            });
        } else {
            $("#git-file-list").html('');
            $("#diff").html('');
        }
    }
    // 鼠标按下
    handleMouseDown(e) {
        // 打开拖拽
        this.diff.isDragAndDrop = true;
        this.diff.width = parseFloat(this.diff.style.width);
        this.diff.maxWidth = parseFloat(this.diff.style.maxWidth);
        this.diff.minWidth = parseFloat(this.diff.style.minWidth);
        this.diff.pxThan = this.refs.diff.offsetWidth / this.diff.width;
        this.diff.mouseX = e.pageX;
    }
    // 鼠标移动
    handleMouseMove(e, cb) {
        let files = store.dialog.git.resource.files;
        if (files.content.diff.isDragAndDrop) {
            if (cb) cb();
            let toMove = e.pageX - files.content.diff.mouseX,
                s = files.content.diff.width - toMove / files.content.diff.pxThan;
            s = s > files.content.diff.maxWidth ? files.content.diff.maxWidth : s;
            s = s < files.content.diff.minWidth ? files.content.diff.minWidth : s;
            files.content.diff.mouseX = e.pageX;
            files.content.diff.width = s;
            files.content.diff.style.width = s + "%";
            files.content.store.style.width = (100 - s) + "%";
            files.setState(files);
        }
    }
    // 鼠标离开
    handleMouseUp(e) {
        let files = store.dialog.git.resource.files;
        // 关闭拖拽
        files.content.diff.isDragAndDrop = false;
    }
}
export default Diff;
