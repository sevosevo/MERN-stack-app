import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const OnlyPublicRoute = ({
  component: Component,
  isAuthenticated,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

OnlyPublicRoute.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(OnlyPublicRoute);
