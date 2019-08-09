import React, { Component } from 'react';
import CheckBox from '../controls/checkbox.jsx'

class Setting extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.setting = store.dialog.setting;
    }
    render() {
        return (
            <setting className={`${this.setting.class} bounceInDown animated`} onKeyDown={this.handlekeyDown.bind(this)}>
               <div className="modal-header">
                    <div className="modal-header-title">{this.state.title}</div>
                    <i className="icon-remove" onClick={this.handleCloseClick.bind(this, null)}></i>
               </div>
               <div className="modal-body">
                    <div className="clearfix">
                        <ul className="nav">
                        {
                            this.state.menus.map((item, i) => {
                                return <li key={i} className={item.class} onClick={this.handleChangeTabClick.bind(this, i)} >{item.name}</li>
                            })
                         }
                        </ul>
                        <div className="tab-content">
                            <div className={`tab-pane-0`+" "+this.state.menus[0].class }>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label">{this.state.menus[0].language}</label>
                                        <div className="control-div">
                                            <select className="form-control">
                                                {
                                                    this.state.menus[0].list.map((item, i) => {
                                                        return    <option key={i} value="">{item.language}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">离开警告</label>
                                        <div className="control-div">
                                            <CheckBox state={{
                                                checked: '1',
                                                text: '',
                                                value: '1',
                                                class: 'top_one',
                                                func: (checked) => {}
                                            }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className={`tab-pane-1`+" "+this.state.menus[1].class }>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label">{this.state.menus[1].name}</label>
                                        <div className="control-div">
                                            <select>
                                                {
                                                    this.state.menus[1].list.map((item, i) => {
                                                        return    <option key={i} value="">{item.theme}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className={`tab-pane-2`+" "+this.state.menus[2].class }>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <table className="keymap">
                                            <thead>
                                                <tr>
                                                    <th>说明</th>
                                                    <th>快捷键</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.menus[2].list.map((item, i) => {
                                                        return  <tr key={i} >
                                                            <td>{item.name}</td>
                                                            <td>{item.quick}</td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </form>
                            </div>
                            <div className={`tab-pane-2`+" "+this.state.menus[3].class }>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label">{this.state.menus[3].git}</label>
                                        <div className="control-div">
                                             <input spellCheck="false" className="git-input" type="text" defaultValue={`${perms.git}${pid}.git`} readOnly/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">{this.state.menus[3].set}</label>
                                        <div className="control-div">
                                             <input spellCheck="false" ref="url_prefix" className="git-input" type="text" defaultValue={`${localStorage['url_prefix_' + pid] || ''}`} placeholder="请输入合法的URL地址..."/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="pour">
                                            注：git地址的用户名：工号，例如：10682, 密码：usertoken
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
               </div>
               <div className="modal-footer">
                   <span className="form-btn form-default user_select" onClick={this.handleCloseClick.bind(this, null)}>取消</span>
                   <span id={this.state.isOk} className="form-btn form-primary user_select" onClick={this.handleSettingClick.bind(this)}>确定</span>
               </div>
            </setting>
        );
    }
    // 关闭弹出层
    handleCloseClick(cb) {
        let dialog = store.dialog;
        dialog.class = "";
        dialog.setting.class = "";
        this.handleChangeTabClick(0);
        dialog.setState(dialog, () => {
            if (cb) cb();
        });
    }
    // 点击确认
    handleSettingClick() {
        localStorage['url_prefix_' + pid] = this.refs.url_prefix.value;
        this.handleCloseClick(null);
    }
    // 切换内容
    handleChangeTabClick (i) {
        let menus = this.setting.menus,
            name = '';
        for (let j = 0; j < menus.length; j++) {
            if (j === i) {
                this.setting.menus[j].class = "active";
                name = this.setting.menus[j].name;
            } else {
                this.setting.menus[j].class = "";
            }
        }
        this.setState({
            title: `配置 > ${name}`
        })
    }
    //回车点击确定
    handlekeyDown(event){
        if (event.keyCode==13) {//回车键的键值为13
           var okId = this.state.isOk;
          document.getElementById(okId).click();
        }
    }
}
export default Setting;
