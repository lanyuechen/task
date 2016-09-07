/* 
 * -Tasks
 *   -TaskList
 *     -TaskItem
 *   -ModalTaskAdd
 */

import React from 'react';
import {
	ButtonToolbar, Button, 
	Modal, 
	Form, FormGroup, Col, ControlLabel, FormControl,
	Pagination,
	Glyphicon
} from 'react-bootstrap';
import styles from './tasks.css';
import marked from 'marked';

var ModalTaskAdd = React.createClass({
	commit: function() {
		$$.post('/api/family/'+this.props.family+'/task', {
			title: this.state.title,
			desc: this.state.desc
		}).then(function(res){
			if (res.msg == 'ok') {
				this.props.success();
				this.props.onHide();
			}
		}.bind(this)).catch(function(err){
			console.log('bad request', err);
		});
	},
	titleHandler: function(event) {
		this.setState({title: event.target.value});
	},
	descHandler: function(event) {
		this.setState({desc: event.target.value});
	},
	render: function() {
		return (
			<Modal {...this.props}>
				<Modal.Header closeButton>
					<Modal.Title>添加任务</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form horizontal>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>标题</Col>
							<Col sm={10}>
								<FormControl type="text" onChange={this.titleHandler} placeholder="标题" />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>描述</Col>
							<Col sm={10}>
								<FormControl componentClass="textarea" onChange={this.descHandler} placeholder="描述" />
							</Col>
						</FormGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="primary" onClick={this.commit}>确定</Button>
					<Button bsStyle="default" onClick={this.props.onHide}>取消</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

var TaskItem = React.createClass({
	rawMarkup: function() {
		var desc = this.props.data.desc || '';
		var rawMarkup = marked(desc.toString(), {sanitize: true});
		return { __html: rawMarkup };
	},
	delHandler: function() {
		$$.delete('/api/task/' + this.props.data.id).then(function(res){
			if (res.msg == 'ok') {
				this.props.delCallback(this.props.data.id);
			}
		}.bind(this)).catch(function(err){
			console.log('bad request', err)
		});
	},
	render: function(){
		return (
			<div className={styles.card}>
				<div className={styles.cardHeader}>
					<h2><a href={'#/console/family/'+this.props.data.fid+'/task/' + this.props.data.id}>{this.props.data.title}</a></h2>
					<a onClick={this.delHandler} className={styles.close} href="javascript:;">
						<Glyphicon glyph="trash" bsClass="glyphicon" />
					</a>
				</div>
				<div className={styles.cardBody}>
					<div dangerouslySetInnerHTML={this.rawMarkup()}></div>
				</div>
				<div className={styles.cardFooter}>
					{this.props.data.ct}
				</div>
			</div>
		);
	}
});

var TaskList = React.createClass({
	render: function(){
		return (
			<div>
				{this.props.data.map(function(item){
					return (
						<TaskItem data={item} delCallback={this.props.delCallback} />
					);
				}.bind(this))}
			</div>
		);
	}
});

var Tasks = React.createClass({
	getInitialState: function() {
		return {
			data: [],
			page: 1,
			size: 10,
			total: 0,
			show: false
		};
	},
	loadTasks: function(page) {
		$$.get('/api/family/'+this.props.params.fid+'/task?page=' + page + '&size=' + this.state.size).then(function(res){
			console.log(res);
			if (res.msg == 'ok') {
				this.setState({data: res.data});
				this.setState({total: Math.ceil(res.total / this.state.size)});
			}
		}.bind(this)).catch(function(err){
			console.log('bad request', err)
		});
	},
	componentDidMount: function() {
		this.loadTasks(this.state.page);
	},
	openTaskAddModal: function() {
		this.setState({show: true});
	},
	closeTaskAddModal: function() {
		this.setState({show: false});
	},
	addTaskSuccess: function() {
		this.loadTasks(this.state.page);
	},
	pageHandler: function(eventKey) {
		this.setState({page: eventKey});
		this.loadTasks(eventKey);
	},
	delCallback: function(id) {
		var data = this.state.data
		for (var i = 0; i < data.length; i++) {
			if (data[i].id == id) {
				data.splice(i, 1);
				break;
			}
		}
		this.setState({data: data});
	},
	render: function(){
		return (
			<div>
				<ButtonToolbar>
					<Button className={styles.btnRound} onClick={this.openTaskAddModal} bsStyle="primary">
						+
					</Button>
				</ButtonToolbar>
				<TaskList data={this.state.data} delCallback={this.delCallback} />
				<ModalTaskAdd family={this.props.params.fid} show={this.state.show} onHide={this.closeTaskAddModal} success={this.addTaskSuccess} />
			</div>
		);
	}
});

module.exports = Tasks;