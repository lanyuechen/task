import React from 'react';

var Family = React.createClass({
	render: function() {
		return (
			<div>
				<h2>Family</h2>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Family;