import React, { useState, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = formData;

  

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();

    if (password !== password2) {
      return setAlert("Passwords do not match.", "danger", 2000);
    }

    const newUser = {
      name,
      email,
      password
    };

    register(newUser, 6000);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        {" "}
        <i className="fas fa-user"> </i> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={e => onChange(e)}
            value={password}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            onChange={e => onChange(e)}
            value={password2}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

export default connect(
  state => ({
    isAuthenticated: state.auth.isAuthenticated
  }),
  { setAlert, register }
)(Register);

/* Shorthand for:

if you do 
connect(null, { setAlert })(Regiser) 
considering that:
    *Your setAlert is pure actionCreator 
Then you can simply do this and it will automaticly do this for you:

const { bindActionCreators } from 'redux' 
(dispatch) => {
    const boundDispatchToProps = bindActionCreators(objWithSetAlert, dispatch);
}
*First it will take your object and put it in function that has dispatch as arg (It will be called internally by React providing that dispatch)
Then it will do bindActionCreators on that obj (containing actionCreators) and it just calls dispatch on them

In case you don't want bindDispatchProps then you can manually do it with function and then you ll be able to add more logic in the body of the fucntion


Longest and hardest way of doing it:

export default connect(null, (dispatch) => ({
    increment: (dispatch) => dispatch(increment())
}))(Register);

Shorter version:

(dispatch) => {
    const  increment = bindActionCreators(increment, dispatch);
    return {
        increment: bindActionCreators
    }
}

increment is here:
const increment = () => dispatch(increment())



*/
