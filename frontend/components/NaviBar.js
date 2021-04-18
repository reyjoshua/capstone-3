import React, { useContext } from 'react';
import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import UserContext from '../UserContext';
import localStorage from 'localStorage'

export default function NaviBar() {
	//const {user} = useContext(UserContext);

	return (
	<Navbar bg="dark" variant="dark" expand="lg">
	  	<Link href="/">
              <a className="navbar-brand">BTA</a>
        </Link>
		  <Navbar.Toggle aria-controls="basic-navbar-nav" />
		  <Navbar.Collapse id="basic-navbar-nav">
		    <Nav className="ml-auto">
                <Link href="/">
                    <a className="nav-link" role="button">Home</a>
                </Link>
			  {(localStorage.getItem('token') !== null) ?
			  	<React.Fragment>
			  	<Link href="/budgetTracker">
				  <a className="nav-link" role="button">Budget Tracker</a>
			  	</Link>
				  <Link href="/chart">
                    <a className="nav-link" role="button">Chart</a>
                </Link>
				<Link href="/trend">
                    <a className="nav-link" role="button">Trend</a>
                </Link>
				<Link href="/profile">
                    <a className="nav-link" role="button">Profile</a>
                </Link>
				<Link href="/logout">
                    <a className="nav-link" role="button">Logout</a>
                </Link>
				</React.Fragment>
				:
				<React.Fragment>
					<Link href="/login">
                        <a className="nav-link" role="button">Login</a>
                    </Link>
					<Link href="/register">
                        <a className="nav-link" role="button">Register</a>
                    </Link>
				</React.Fragment>
			  } 
		    </Nav>
		</Navbar.Collapse>
	</Navbar>
	)
} 
