import React from 'react';
import marked from 'marked';
import CommentBox from '../comment/comments.js';
import {Label} from 'react-bootstrap';

import styles from './task.css';

var Task = React.createClass({
	rawMarkup: function() {
		var desc = this.state.data.desc || '';
		var rawMarkup = marked(desc.toString(), {sanitize: true});
		return { __html: rawMarkup };
	},
	getInitialState: function() {
		return {
			data: {},
		};
	},
	loadTask: function(id) {
		$$.get('/api/task/' + id).then(function(res){
			console.log(res);
			if (res.msg == 'ok') {
				this.setState({data: res.data});
			}
		}.bind(this)).catch(function(err){
			console.log('bad request', err);
		});
	},
	componentDidMount() {
		this.loadTask(this.props.params.id);
	},
	render: function(){
		return (
			<div>
				<div className={styles.block}>
					<div className={styles.header}>
						<h2>
							{this.state.data.title}
						</h2>
						<span>创建人 <small>{this.state.data.ct}</small></span>
					</div>
					<div className={styles.body} dangerouslySetInnerHTML={this.rawMarkup()}></div>
				</div>
				<CommentBox taskId={this.props.params.id} />
			</div>
		);
	}
});

module.exports = Task;