import React, { Component } from 'react';
import Select from 'react-select';

class Db extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.db = store.dialog.db;
    }
    render() {
        return (
            <db className={`${this.db.class} bounceInDown animated`} style={{'marginTop' : `-${57.5 + this.db.options.row * 27.5}px`}}>
                <div className="modal-header">
                    <div className="modal-header-title">{this.db.options.title}</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
                </div>
                <div className="modal-body">
                    {
                        this.db.options.controls ? this.db.options.controls.map((item, i) => {
                            switch (item.type) {
                                case 'select':
                                    const len = this.db.options.controls.length
                                    return <div key={i} data-tip={item.placeholder || ''}>
                                        <Select
                                            name={item.name}
                                            value={this.db.options.data[item.name]}
                                            options={item.options}
                                            className={i === (len - 1) ? 'no-bottom' : ''}
                                            placeholder={item.placeholder}
                                            disabled={item.disabled}
                                            resetValue=""
                                            noResultsText="选项 (o@.@o) 走丢了..."
                                            onChange={this.handleChange.bind(this, item.name, item.multi)}
                                        />
                                    </div>
                                case 'text':
                                    return <input spellCheck="false"
                                        key={i}
                                        name={item.name}
                                        type="text"
                                        readOnly={item.readonly || ''}
                                        data-tip={item.title || ''}
                                        placeholder={item.placeholder}
                                        value={this.db.options.data[item.name]}
                                        onChange={this.handleChange.bind(this, item.name, false)}
                                        className={`form-control ${item.class || ''} ${this.db.options.behavior[this.db.options.row].indexOf(item.name) !== -1 ? 'hide' : ''}`}
                                    />
                                case 'textarea':
                                    return <textarea
                                    key={i}
                                    placeholder={item.placeholder || ''}
                                    readOnly={item.readonly || ''}
                                    data-tip={item.placeholder || ''}
                                    className={`db-textarea ${item.class}`}
                                    onChange={this.handleChange.bind(this, item.name, false)}
                                    value={this.db.options.data[item.name] || ''}
                                    ></textarea>
                            }
                        }) : []
                    }
                </div>
                <div className="modal-footer">
                    <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                    <span className="form-btn form-primary user_select" onClick={this.handleOkClick.bind(this)}>{this.db.options.btnName || '确定'}</span>
                </div>
            </db>
        );
    }
    componentDidUpdate() {
        store.ReactTooltip.rebuild();
    }
    handleChange(name, multi, obj) {
        if (multi) {
           this.db.options.data[name] = obj.map((item) => item.value);
        } else {
            if (obj.value) {
                this.db.options.data[name] = obj.value;
            } else {
                this.db.options.data[name] = obj.target.value;
            }
        }
        if (name === 'redis_type') {
            console.log(this.db.options)
            if(obj.value === "-1" )  this.db.options.row = 5
            if(obj.value === "0" ) this.db.options.row = 6
            if(obj.value === "1" ) this.db.options.row = 7
            if(obj.value === "2" ) this.db.options.row = 6

        }
        this.db.setState(this.db);
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog;
        dialog.class = "";
        dialog.db.class = "";
        dialog.db.options = {};
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 添加db，修改db
    handleOkClick() {
        store.spinOpen();
        if (this.db.options.btnName) {
            api.dsfDebug({
                _id: this.db.options.data._id,
                dsf_param: this.db.options.data.dsf_param
            }, (res) => {
                if (res.code === 0) {
                    if (document.getElementsByClassName('param').length) {
                        document.getElementsByClassName('param')[0].value = res.result;
                    }
                    store.spinClose();
                    store.errMsgOpen('OK', 'ok');
                } else {
                    store.spinClose();
                    store.errMsgOpen(res.msg);
                }
            });
        } else {
            if(this.db.options.data._id){
                // 修改
                if (this.db.options.data.redis_type === '-1') this.db.options.data.redis_type = '2'
                api.editDbserver({
                    args_data: this.db.options.data
                }, (edit) => {
                    if (edit.code === 0) {
                        if (this.db.options.data.db_type !== 5) {
                            api.pingDbserver({
                                db_type: this.db.options.data.db_type,
                                _id: this.db.options.data._id
                            }, (ping) => {
                                if (ping.code === 0) {
                                    api.redisPushOne({
                                        db_type: this.db.options.data.db_type,
                                        _id: this.db.options.data._id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen(`修改DB：OK\nPing：OK\n推送：OK`, 'ok');
                                                this.handleCloseClick(null);
                                            });
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(`修改DB：${edit.msg}\nPing：${ping.msg}\n推送：${res.msg}`);
                                            this.handleCloseClick(null);
                                        }
                                    });
                                } else {
                                    store.spinClose();
                                    store.errMsgOpen(`修改DB：${edit.msg}\nPing：${ping.msg}`);
                                    this.handleCloseClick(null);
                                }
                            });
                        } else {
                            store.funs.tree.init(() => {
                                store.spinClose();
                                store.errMsgOpen(`修改DB：OK`, 'ok');
                                this.handleCloseClick(null);
                            });
                        }
                    } else {
                        store.spinClose();
                        store.errMsgOpen(`修改DB：${edit.msg}`);
                    }
                });
            } else {
                // 添加
                let id = comm.getId();
                if (this.db.options.data.redis_type === '-1') this.db.options.data.redis_type = '2'
                api.addDbserver({
                    id: id,
                    args_data: this.db.options.data
                }, (add) => {
                    if (add.code === 0) {
                        if (this.db.options.data.db_type !== 5) {
                            api.pingDbserver({
                                db_type: this.db.options.data.db_type,
                                _id: id
                            }, (ping) => {
                                if (ping.code === 0) {
                                    api.redisPushOne({
                                        db_type: this.db.options.data.db_type,
                                        _id: id
                                    }, (res) => {
                                        if (res.code === 0) {
                                            store.funs.tree.init(() => {
                                                store.spinClose();
                                                store.errMsgOpen(`创建DB：OK\nPing：OK\n推送：OK`, 'ok');
                                                this.handleCloseClick(null);
                                            });
                                        } else {
                                            store.spinClose();
                                            store.errMsgOpen(`创建DB：${add.msg}\nPing：${ping.msg}\n推送：${res.msg}`);
                                            this.handleCloseClick(null);
                                        }
                                    });
                                } else {
                                    store.spinClose();
                                    store.errMsgOpen(`创建DB：${add.msg}\nPing：${ping.msg}`);
                                    this.handleCloseClick(null);
                                }
                            });
                        } else {
                            store.funs.tree.init(() => {
                                store.spinClose();
                                store.errMsgOpen(`创建DB：OK`, 'ok');
                                this.handleCloseClick(null);
                            });
                        }
                    } else {
                        store.spinClose();
                        store.errMsgOpen(`创建DB：${add.msg}`);
                        this.db.options.data._id = null
                    }
                });
            }
        }
    }
}
export default Db;
