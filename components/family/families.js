import React from 'react';
import {Modal, Button} from 'react-bootstrap';

var ModalFamilyAdd = React.createClass({
	commit: function() {
		$$.post('/api/family', {
			name: this.refs.name.value.trim(),
			desc: this.refs.desc.value.trim()
		}).then(function(res){
			this.props.success();
			this.props.onHide();
		}.bind(this)).catch(function(err){
			console.log('bad request', err);
		});
	},
	render: function() {
		return (
			<Modal {...this.props}>
				<Modal.Header closeButton>
					<Modal.Title>添加任务</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="form-horizontal">
						<div className="form-group">
							<label className="control-label col-sm-2">名称</label>
							<div className="col-sm-10">
								<input className="form-control" type="text" ref="name" placeholder="名称"/>
							</div>
						</div>
						<div className="form-group">
							<label className="control-label col-sm-2">简介</label>
							<div className="col-sm-10">
								<textarea className="form-control" ref="desc" placeholder="简介"></textarea>
							</div>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="primary" onClick={this.commit}>确定</Button>
					<Button bsStyle="default" onClick={this.props.onHide}>取消</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

var FamilyItem = React.createClass({
	render: function(){
		var href = '#/console/family/' + this.props.data.fid + '/task';
		return (
			<div>
				<a href={href}>
					{this.props.data.name}
				</a>
			</div>
		)
	}
});

var Families = React.createClass({
	getInitialState: function() {
		return {
			data: [],
			show: false
		};
	},
	componentDidMount: function() {
		this.loadFamilies();
	},
	loadFamilies: function() {
		$$.get('/api/family').then(function(res){
			console.log('res', res);
			this.setState({data: res.data});
		}.bind(this)).catch(function(err){
			console.log('bad request', err);
		});
	},
	openFamilyAddModal: function() {
		this.setState({show: true});
	},
	closeFamilyAddModal: function() {
		this.setState({show: false});
	},
	addFamilySuccess: function() {
		this.loadFamilies()
	},
	render: function() {
		return (
			<div>
				{this.state.data.map(function(item){
					return (
						<FamilyItem data={item} />
					);
				})}
				<a href="javascript:;" onClick={this.openFamilyAddModal}>创建</a>
				<ModalFamilyAdd show={this.state.show} onHide={this.closeFamilyAddModal} success={this.addFamilySuccess} />
			</div>
		);
	}
});

module.exports = Families;