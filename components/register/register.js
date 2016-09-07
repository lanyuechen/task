import React from 'react';

var Register = React.createClass({
	registerHandler: function(e) {
		e.preventDefault();
		var data = {
			mail: this.refs.mail.value.trim(),
			password: this.refs.password.value.trim()
		};
		var cfmPassword = this.refs.cfmPassword.value.trim();
		if (!data.mail || data.password != cfmPassword) {
			return;
		}
		$$.post('/api/register', data).then(function(res){
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
							<div className="form-group">
								<input type="password" ref="cfmPassword" className="form-control" placeholder="确认密码" />
							</div>
							<button type="button" onClick={this.registerHandler} className="btn btn-primary">注册</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Register;