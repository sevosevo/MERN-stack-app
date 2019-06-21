import React, {Fragment} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { deleteComment } from "../../actions/post";

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, userId, date },
  auth,
  deleteComment
}) => {

  return (
      <Fragment>
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={'/profile/'+userId}>
          <img
            className="round-img"
            src={avatar}
            alt=""
          />
          <h4>{name}</h4>
          </Link>
      </div>
      <div>
        <p className="my-1">
          {text}
        </p>
        <p className="post-date">Posted on <Moment format="YYYY/MM/DD">{date}</Moment> </p>
        {
            !auth.loading && userId === auth.user._id && (
                <button onClick={e=>deleteComment(postId, _id)} >
                    Delete 
                </button>
            )
        }
      </div>
      </div>
    </Fragment>
  );
};
CommentItem.propTypes = {
    auth: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    deleteComment: PropTypes.func.isRequired
}

const mapStateToProps = state => ( {
    auth: state.auth
} );

export default connect(mapStateToProps, {deleteComment} )(CommentItem);
