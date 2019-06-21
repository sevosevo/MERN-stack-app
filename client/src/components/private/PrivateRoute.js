import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, isAuthenticated, loading, path, ...rest}) =>  {
  console.log(isAuthenticated, loading);
  return (
  <Route
    {...rest}
    render={props =>{
      return (!isAuthenticated && !loading) || (loading && !isAuthenticated) ? <Redirect to={{
        pathname: '/login',
        state: {requestUrl: path}
      }} /> : <Component {...props} />
    }
  }
  />
)}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading
});

export default connect(mapStateToProps)(PrivateRoute);
