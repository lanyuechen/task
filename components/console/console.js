import React from 'react';
import {
	Grid, Row, Col, 
	Nav, NavItem
} from 'react-bootstrap';

module.exports = React.createClass({
	getInitialState: function() {
		var activeHref = window.location.hash.replace(/\?.*/, '');
		return {
			activeHref: activeHref
		};
	},
	handleSelect: function(eventKey) {
		this.setState({activeHref: eventKey});
		window.location = eventKey;
	},
	render: function(){
		return (
			<div>
				<Grid fluid>
					<Row>
						<Col sm={2} className="hidden-xs">
							<Nav bsStyle="pills" stacked activeHref={this.state.activeHref} onSelect={this.handleSelect}>
							    <NavItem eventKey="#/console/task" href="#/console/task">Task</NavItem>
							</Nav>
						</Col>
						<Col sm={10}>
							{this.props.children}
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
});