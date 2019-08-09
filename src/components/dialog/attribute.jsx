import React, { Component } from 'react';

class Attribute extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.attribute = store.dialog.attribute;
    }
    render() {
        return (
            <attribute className={`${this.state.class} bounceInDown animated`}  style={{'marginTop' : `-${57.5 + (this.attribute.row || 0) * 27.5}px`}}>
                <div className="modal-header">
                    <div className="modal-header-title">{this.state.title}</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    {
                        this.state.content.map((item, i) => {
                            return <div className="form-control form-control-text" key={i}>
                                <div className="form-text-left text-right disabled-selected">{item.key}</div>
                                <div className="form-text-right text-left">
                                    <input spellCheck="false" type="text" readOnly defaultValue={item.value}/>
                                </div>
                            </div>
                        })
                     }
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                </div>
            </attribute>
        );
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog;
        dialog.class = "";
        dialog.attribute.class = "";
        dialog.attribute.content = [];
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
}
export default Attribute;
