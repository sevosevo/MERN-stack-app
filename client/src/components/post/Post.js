import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPost, clearPost } from '../../actions/post';
import PostItem from '../post/PostItem';
import {Link} from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem.js';

const Post = ({clearPost, getPost, post: { post, loading }, match }) => {

    useEffect( ()=> {
        getPost(match.params.id);

        return () => {
            clearPost();
        }

    }, [getPost, match.params.id] );

    return loading || post === null ? <Spinner /> : <Fragment>
        <Link to={'/posts'} className="btn">Back To Posts</Link>
        <PostItem post={post} showActions={false} />
        <CommentForm  postId={post._id} />
        <div className="comments">
            {
                post.comments.map(comment => <CommentItem key={comment._id} comment={comment} postId={post._id} /> )
            }
        </div>
        </Fragment>
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    clearPost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPost, clearPost })(Post);
