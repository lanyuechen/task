import 'whatwg-fetch';

module.exports = {
	response: function(res) {
		if (res.status == 401) {
			window.location = '#/login';
		}
		if (res.status < 200 || res.status >= 300) {
			var error = new Error(res.statusText)
			error.res = res
			throw error
		}
		return res.json();
	},
	get: function(url) {
		return fetch(url, {
			credentials: 'same-origin'
		}).then(function(res){
			return this.response(res);
		}.bind(this));
	},
	post: function(url, data) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(function(res){
			return this.response(res);
		}.bind(this));
	},
	delete: function(url) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'DELETE'
		}).then(function(res){
			return this.response(res);
		}.bind(this));
	}
}