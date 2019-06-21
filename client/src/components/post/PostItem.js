import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  deletePost,
  addLike,
  removeLike,
  auth,
  post: { _id, text, name, avatar, userId, likes, comments, date },
  showActions
}) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <img className="round-img" src={avatar} alt="" />
          <h5>{name}</h5>
        </div>
        <div>
          <p className="my-1">{text}</p>
          <p className="post-date">
            <Moment format="YYYY/MM/DD">{date}</Moment>
          </p>

          {showActions && (
            <Fragment>
              <button
                type="button"
                className="btn btn-light"
                onClick={e => addLike(_id)}
              >
                <strong>Like</strong>
                <span className="like-count">{"  " + likes.length}</span>
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={e => removeLike(_id)}
              >
                <strong>Remove a like</strong>
              </button>

              <button type="button" className="btn btn-dark">
                <strong>
                  <Link to={`/posts/${_id}`}>Discussion</Link>{" "}
                  {comments.length > 0 && (
                    <span className="comment-count">{comments.length}</span>
                  )}
                </strong>
              </button>
              {!auth.loading && userId === auth.user._id && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={e => deletePost(_id)}
                >
                  <strong>X</strong>
                </button>
              )}
              <Link to={`/profile/${userId}`}>View profile</Link>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

export default connect(
  state => ({
    auth: state.auth
  }),
  { addLike, removeLike, deletePost }
)(PostItem);
