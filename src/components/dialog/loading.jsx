import React from 'react';

class Loading extends React.Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.setState = this.setState.bind(this);
        this.loading = store.dialog.loading;
    }
    render() {
        return (
            <loading className={this.loading.class} style={{ backgroundImage: `url(${config.imgSrc}logo_big_5.png)`}}>
                <div className="loading-img">
                    <img src={config.imgSrc + "logo_big_6.png"} width="420"></img>
                </div>
    			<span>&copy; Copyright &copy; 2002-2017 版权所有 同程网络科技股份有限公司 基础架构-Web中间件</span>
            </loading>
        );
    }
    componentDidMount() {
        const loading = store.dialog.loading;
        setTimeout(() => {
            const dialog = store.dialog;
            dialog.class = "";
            dialog.loading.class = "";
            dialog.setState(dialog);
        }, 2000);
    }
}
export default Loading;
