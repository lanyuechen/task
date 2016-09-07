import React from 'react';

var Login = React.createClass({
	loginHandler: function(e) {
		e.preventDefault();
		var mail = this.refs.mail.value.trim();
		var password = this.refs.password.value.trim();
		if (!mail || !password) {
			return;
		}
		var data = {mail: mail, password: password};
		$$.post('/api/login', data).then(function(res){
			window.location = '#/console/task'
		}).catch(function(err){
			console.log('bad request', err);
		});
	},
	render: function() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-4 col-md-offset-4">
						<form>
							<div className="form-group">
								<input type="email" ref="mail" className="form-control" placeholder="邮箱" />
							</div>
							<div className="form-group">
								<input type="password" ref="password" className="form-control" placeholder="密码" />
							</div>
							<div className="form-group text-right">
								没有帐号？<a href="#/register">去注册</a>
							</div>
							<button type="button" onClick={this.loginHandler} className="btn btn-primary">登录</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Login;