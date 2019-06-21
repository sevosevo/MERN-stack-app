import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";

const Navbar = ({ auth: { isAuthenticated, loading }, logout, history }) => {
  //Links
  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">
        <i className="fas fa-user">
        Dashboard
        </i>
        </Link>
      </li>
      <li>
        <a onClick={() => logout(history)} href="#!">
          <i className="fas fa-sign-out-alt">
            Logout
          </i>
        </a>
      </li>
      <li>
        <Link to="/profiles">Profiles</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/profiles">Profiles</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code" /> DevConnector
        </Link>
      </h1>
      {!loading && (isAuthenticated ? authLinks : guestLinks)}
    </nav>
  );
};
//We could do checking with the isAuthenticated but it shold be seperate prop so that react can preform shallow checking and see the difference
//Otherwise it would fail because it wouldn't rerender and it would be stuck at isAuthenticated to false even tho prop changed

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

export default connect(
  function mapStateToProps(state) {
    return {
      auth: state.auth
    };
  },
  {
    logout
  }
)(withRouter(Navbar));
