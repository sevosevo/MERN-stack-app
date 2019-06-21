import axios from "axios";

import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, DELETE_ACCOUNT, CLEAR_PROFILE, GET_PROFILES, GET_REPOS, CLEAR_PROFILES } from "./types";
import { setAlert } from './alert';
//Get current users profiles
export const clearProfile = () => dispatch => {
  dispatch({type: CLEAR_PROFILE});
}
export const clearProfiles = () => dispatch => {
  dispatch({type: CLEAR_PROFILES});
}

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");
  
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

  } catch (err) {
    if(err.response) {
      const {statusText, status} = err.response;

      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: statusText, status: status}
      });
    }else{
      console.log(err);
    }
  }
};
//Get all profiles

export const getProfiles = () => async dispatch => {
  try{


    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    })


  }catch(err){
    if(err.response){
     dispatch({
       type: PROFILE_ERROR,
       payload: {msg: err.response.statusText, status: err.response.status}
     })
    }else{
      console.log(err);
    }
  }
};

export const getProfileById = userId => async dispatch => {
  try{
    console.log('Being called.');

    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })


  }catch(err){
    if(err.response){
      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }else{
      console.log(err);
    }
  }
};

export const getGithubRepos = username => async dispatch => {
  const res = await axios.get(`/api/profile/github/${username}`);
  try {
    dispatch({
      type: GET_REPOS,
      payload: res.data
    })
  }catch(err){
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
};



// Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try{
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/profile', formData, config);
    console.log(res.data);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'));

    if(!edit){
      history.push('/dashboard');
    }

    window.scrollTo(0,0);

  }catch(err){
    if(err.response) {
      const {statusText, status, data} = err.response;

      if (data.errors) {
        data.errors.forEach(error => dispatch(setAlert(error, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: statusText, status: status}
      });
    }else{
      console.log(err.message);
    }

  }
};

//Add experience

export const addExperience = (formData, history) => async dispatch => {
  try{
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/experience', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience added', 'success'));

    history.push('/dashboard');

  }catch(err){
    if(err.response) {
      const {statusText, status, data} = err.response;

      if (data.errors) {
        data.errors.forEach(error => dispatch(setAlert(error, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: statusText, status: status}
      });
    }else{
      console.log(err);
    }

  }
};


export const addEducation = (formData, history) => async dispatch => {
  try{
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/education', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education added', 'success'));

    window.scrollTo(0,0);

  }catch(err){
    if(err.response) {
      const {statusText, status, data} = err.response;

      if (data.errors) {
        data.errors.forEach(error => dispatch(setAlert(error, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: statusText, status: status}
      });
    }else{
      console.log(err.message);
    }

  }
};

export const deleteFromProfile = (id, what) => async dispatch => {
  try{
    const res = await axios.delete(`/api/profile/${what}/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(`${what.substring(0, 1).toUpperCase() + what.substring(1)} removed.`, 'success'));

  }catch(err){
    if(err.response){
      const {statusText, status, data} = err.response;

      if(data.errors){
        data.errors.forEach(err => dispatch(setAlert(err, 'danger')));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: statusText, status: status}
      })
    }else{
      console.log(err);
    }
  }
};

export const deleteProfile = () => async dispatch => {
  if(window.confirm('Are you sure you want to delete this account?')) {
    try {
      const res = await axios.delete('/api/profile');
      console.log(res);

      dispatch({type: CLEAR_PROFILE});
      dispatch({type: DELETE_ACCOUNT});
      dispatch(setAlert('Account deleted'));
    } catch (err) {
      if (err.response) {
        dispatch({
          type: PROFILE_ERROR,
          payload: {msg: err.response.statusText, status: err.response.status}
        })
      } else {
        console.log(err);
      }
    }
  }
};
