import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Lading";
import Login from "./components/auth/Login";
import CreateProfile from './components/profile-form/CreateProfile';
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/private/PrivateRoute";
import OnlyPublicRoute from "./components/private/OnlyPublicRoute";
import EditProfile from "./components/profile-form/EdProfile";
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/post/Posts';
import Post from './components/post/Post';

import Alert from "./components/layout/alert";

import { Provider } from "react-redux";
//Bring in the store
import store from "./store";
import "./App.css";

import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";


const App = () => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <OnlyPublicRoute exact path={"/"} component={Landing} />
        <section className={"container"}>
          <Alert />
          <Switch>
            <Route path={"/register"} component={Register} />
            <Route path={"/login"} component={Login} />
            <Route path={'/profiles'} component={Profiles} />
            <Route path={'/profile/:id'} component={Profile} />
            <PrivateRoute exact path={"/dashboard"} component={Dashboard} />
            <PrivateRoute exact path={"/create-profile"} component={CreateProfile} />
            <PrivateRoute exact path={"/edit-profile"} component={EditProfile} />
            <PrivateRoute exact path={'/add-experience'} component={AddExperience} />
            <PrivateRoute exact path={'/add-education'} component={AddEducation} />
            <PrivateRoute exact path={'/posts'} component={Posts} />
            <PrivateRoute exact path={'/posts/:id'} component={Post} />
          </Switch>
        </section>
      </Router>
    </Provider>
  );
};
export default App;
