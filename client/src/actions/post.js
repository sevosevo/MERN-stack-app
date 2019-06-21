import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POSTS,
  POST_ERROR,
  DELETE_POST,
  UPDATE_LIKES,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  CLEAR_POST
} from "./types";

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get("/api/posts");

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    } else {
      console.log(err);
    }
  }
};

export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/${id}/like`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
    
  } catch (err) {
    if (err.response) {
      const msg = err.response.data.msg;
      if (msg) {
        dispatch(setAlert(msg, "danger", 1000));
      }

      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          message: err.response.data
        }
      });
    } else {
      console.log(err);
    }
  }
};

export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/${id}/unlike`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    if (err.response) {
      const msg = err.response.data.msg;
      if (msg) {
        dispatch(setAlert(msg, "danger", 1000));
      }

      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          message: msg
        }
      });
    } else {
      console.log(err);
    }
  }
};

export const deletePost = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: { id }
    });

    dispatch(setAlert("Post removed", "success"));
  } catch (err) {
    if (err.response) {
      const msg = err.response.data.msg;
      if (msg) {
        dispatch(setAlert(msg, "danger", 1000));
      }

      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          message: msg
        }
      });
    }
  }
};

export const addPost = formData => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.post("/api/posts", formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert("Post added", "success", 3000));
  } catch (err) {
    if (err.response) {
      const msg = err.response.data.msg;
      if (msg) {
        dispatch(setAlert(msg, "danger", 1000));
      }

      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          message: msg
        }
      });
    }
  }
};

export const getPost = id => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    } else {
      console.log(err);
    }
  }
};

export const addComment = (postId, text) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    
    const formData = {
      text: text
    }

    const res = await axios.put(
      `/api/posts/${postId}/comment`,
      formData,
      config
    );
  
    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });

    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteComment = (postId, commentId) => async dispatch => {
  try{
 
    const res = await axios.delete(`/api/posts/${postId}/comment/${commentId}`);


    dispatch({
      type: REMOVE_COMMENT,
      payload: res.data.deletedComment
    })
  
    dispatch(setAlert('Comment Added', 'success'));
  }catch(err){
    if(err.response){
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }else{
      console.log(err);
    }
  }
  };

  export const clearPost = () => dispatch => {
    dispatch({
      type: CLEAR_POST
    })
  };