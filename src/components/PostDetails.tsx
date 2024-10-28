import React, { useEffect, useState } from 'react';
import * as commentService from '../api/comments';
import { Loader } from './Loader';
import { CommentList } from './CommentList';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';

type Props = {
  selestedPost: Post;
};

export const PostDetails: React.FC<Props> = ({ selestedPost }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCommentFormShown, setIsCommentFormShown] = useState(false);

  useEffect(() => {
    setIsCommentsLoading(true);
    commentService
      .getComments(selestedPost.id)
      .then(setComments)
      .catch(() => setHasError(true))
      .finally(() => setIsCommentsLoading(false));
  }, [selestedPost]);

  function deleteComment(commId: number) {
    setComments(currComments => currComments.filter(com => commId !== com.id));

    return commentService.deleteComment(commId).catch(error => {
      setComments(comments);
      setHasError(true);
      throw error;
    });
  }

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            #{selestedPost.id}: {selestedPost.title}
          </h2>

          <p data-cy="PostBody">{selestedPost.body}</p>
        </div>

        <div className="block">
          {isCommentsLoading ? (
            <Loader />
          ) : (
            <>
              {hasError && (
                <div className="notification is-danger" data-cy="CommentsError">
                  Something went wrong
                </div>
              )}

              {!comments.length && !hasError && (
                <p className="title is-4" data-cy="NoCommentsMessage">
                  No comments yet
                </p>
              )}

              {!!comments.length && !hasError && (
                <CommentList comments={comments} onDelete={deleteComment} />
              )}
            </>
          )}

          {!isCommentFormShown && !hasError && !isCommentsLoading && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => setIsCommentFormShown(true)}
            >
              Write a comment
            </button>
          )}
        </div>

        {isCommentFormShown && (
          <NewCommentForm
            setComments={setComments}
            setHasError={setHasError}
            post={selestedPost}
          />
        )}
      </div>
    </div>
  );
};
