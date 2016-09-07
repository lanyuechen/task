import styles from './app.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory, Router, IndexRoute, Route, Link} from 'react-router';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

import Console from './components/console/console.js';
import Tasks from './components/task/tasks.js';
import Task from './components/task/task.js';
import Login from './components/login/login.js';
import Register from './components/register/register.js';
import Families from './components/family/families.js';
import Family from './components/family/family.js';

import Fetch from './fetch-decorator.js';
window.$$ = Fetch;					//对fetch进行封装

var App = React.createClass({
	render: function(){
		return (
			<div>
				<Navbar fluid className={styles.nav}>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">Brand</a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							<NavItem href="#/console/family">Family</NavItem>
							<NavItem href="#/console/task">Console</NavItem>
							<NavItem href="#/login">Login</NavItem>
							<NavItem href="#/register">Register</NavItem>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<div className={styles.body}>
					{this.props.children}
				</div>
			</div>
		);
	}
});

var Entry = React.createClass({
	render: function() {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={App}>
					<Route path="console" component={Console}>
						<Route path="family" component={Families} />
						<Route path="family/:fid" component={Family}>
							<Route path="task" component={Tasks}/>
							<Route path="task/:id" component={Task}/>
						</Route>
					</Route>
					<Route path="login" component={Login}/>
					<Route path="register" component={Register}/>
				</Route>
			</Router>
		);
	}
});

ReactDOM.render(<Entry />, document.getElementById('app'));