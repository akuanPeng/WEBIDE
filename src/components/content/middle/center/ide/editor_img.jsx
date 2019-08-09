import React, {Component} from 'react';

class EditorImg extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.editor_img = store.content.middle.center.ide.code_editor.editor_img;
    }

    render() {
        return (
            <editor_img className={`${this.editor_img.class} ${this.editor_img.theme ? this.editor_img.theme : ""}`}>
                <div className="editor-preview-header">
                    <div className="editor-preview-skin white" onClick={this.handleChangeTheme.bind(this,`white`)}></div>
                    <div className="editor-preview-skin dark" onClick={this.handleChangeTheme.bind(this,`dark`)}></div>
                    <div className="editor-preview-skin " onClick={this.handleChangeTheme.bind(this, "")}></div>
                </div>
                <div className="editor-preview-body">
                    <img ref="img" className="editor-preview-img" src={this.editor_img.src} style={{...this.editor_img.style}} onLoad={this.handleImageLoaded.bind(this)}/>
                </div>
            </editor_img>
        );
    }
    componentDidMount() {
        store.funs.editor_img = {
            sImgs: this.sImgs
        };
    }
    sImgs(cls, src) {
        let editor_img = store.content.middle.center.ide.code_editor.editor_img;
        editor_img.class = cls;
        if (cls && src) editor_img.src = src;
        editor_img.setState(editor_img);
    }
    handleChangeTheme(theme) {
        this.editor_img.theme = theme;
        this.editor_img.setState(this.editor_img);
    }
    handleImageLoaded() {
        let obj = document.getElementsByClassName("editor-preview-img")[0];
        let imgHeight = obj.clientHeight;
        let imgWidth = obj.clientWidth;
        let marginL = -imgWidth/2;
        let marginT = -imgHeight/2;
        this.editor_img.style = {
            marginLeft: marginL,
            marginTop: marginT
        }
        this.editor_img.setState(this.editor_img);
     }
}
export default EditorImg;
