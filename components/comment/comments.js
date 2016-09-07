/* 
 * -CommentBox
 *   -CommentList
 *     -Comment
 *   -CommentForm
 */

import React from 'react';
import marked from 'marked';

var CommentBox = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadComments();
		// setInterval(this.loadComments, this.props.pollInterval);
	},
	loadComments: function() {
		var id = this.props.taskId;
		$$.get('/api/task/' + id + '/cmt').then(function(res){
			console.log(res);
			if (res.msg == 'ok') {
				this.setState({data: res.data});
			}
		}.bind(this)).catch(function(err){
			console.log('bad request', err);
		});
	},
	commentSubmitCallback: function(data) {
		var id = this.props.taskId;
		$$.post('/api/task/' + id + '/cmt', data).then(function(res){
			console.log('res', res);
			if (res.msg == 'ok') {
				data.ct = (new Date()).toISOString();
				var comments = this.state.data;
				comments.unshift(data);
				this.setState({data: comments});
			}
		}.bind(this).bind(data)).catch(function(err){
			console.log('bad request', err);
		});
	},
	render: function() {
		return (
			<div>
				<h2>评论列表</h2>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.commentSubmitCallback} />
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function() {
		return (
			<div>
				{this.props.data.map(function(comment){
					return (
						<Comment data={comment} />
					);
				})}
			</div>
		);
	}
});

var Comment = React.createClass({
	rawMarkup: function() {
		var desc = this.props.data.desc || '';
		var rawMarkup = marked(desc.toString(), {sanitize: true});
		return { __html: rawMarkup };
	},
	render: function() {
		return (
			<div>
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
				<small>{this.props.data.ct}</small>
				<hr/>
			</div>
		);
	}
});

var CommentForm = React.createClass({
	submitHandler: function(e) {
		e.preventDefault();
		var desc = this.refs.desc.value.trim();
		if (!desc) {
			return;
		}
		var data = {desc: desc};
		this.props.onCommentSubmit(data);
		this.refs.desc.value = '';
	},
	render: function() {
		return (
			<from>
				<input type="text" placeholder="内容" ref="desc" />
				<button onClick={this.submitHandler} type="button" class="btn btn-primary">
					提交
				</button>
			</from>
		);
	}
});

module.exports = CommentBox;