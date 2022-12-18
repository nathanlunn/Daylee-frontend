import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Image} from 'cloudinary-react';
import '../styles/PostHome.css';
import Comment from './Comment.js';
import {useNavigate} from 'react-router-dom';

export default function PostHome({state, setState}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentCharacterCount, setCommentCharacterCount] = useState(0);
  const [commentReload, setCommentReload] = useState(0);
  const [alreadyCommented, setAlreadyCommented] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    if (state.user.id && state.topic.id) {
      axios.post('https://daylee-backend.onrender.com/topics/commentSearch', {userID: state.user.id, topicID: state.topic.id})
        .then(res => {
          if(res.data.length > 0) {
            setAlreadyCommented(true);
          }
        })
        .catch(err => {
          console.error(err.message);
        })
    }
  })

  useEffect(() => {
    axios.get(`https://daylee-backend.onrender.com/topics/comments/${state.topic.id}`)
      .then(res => {
        setComments(res.data.sort((a, b) => {return b.id - a.id}));
      })
      .catch(err => {
        console.error(err.message);
      })
  }, [state.topic, commentReload])

  const addComment = () => {
    if (commentCharacterCount === 0 || commentCharacterCount > 100) {
      return;
    }

    axios.post('https://daylee-backend.onrender.com/topics/comments/add', {topicID: state.topic.id, userID: state.user.id, comment: newComment})
      .then(res => {
        const newComment = res.data;
        comments.unshift(newComment);
        setNewComment('');
        setCommentCharacterCount(0);

      })
      .catch(err => {
        console.error(err.message);
      })
  }

  const commentList = comments.map(comment => {
    return (
      <Comment
        key={comment.id}
        commentID={comment.id}
        userID={comment.user_id}
        content={comment.content}
        state={state}
      />
    )
  })

  return (
    <div className='topic'>
      <div className='topic__container'>

        <Image 
          className='topic__image'
          cloudName='dnggclzfd'
          publicId={state.topic.image}
        />
        
        <h2 className='topic__title'>{state.topic.title}?</h2>

        {alreadyCommented && state.user.id && <h3 className='topic__alert'>{"Thank You For Your Contribution! :)"}</h3>}
        
        {!state.user.id && <h3 className='topic__alert topic__alert--login'>{"Login to Comment On The Daylee Topic"}</h3>}

        {state.user.id && !alreadyCommented && <div className='topic__newCommentContainer'>
          <h3 className='topic__callToComment'>What Are Your Thoughts?</h3>

          <textarea 
            className='topic__newCommentInput'
            value={newComment}
            onChange={e => {
              setNewComment(e.target.value);
              setCommentCharacterCount(e.target.value.length);
              setCommentReload(commentReload + 1);
            }}

          ></textarea>

          <div className='topic__newCommentBottom'>
            <h3 
              className={commentCharacterCount > 100 ? 'topic__commentCharacterCount red' : (commentCharacterCount === 0 ? 'topic__commentCharacterCount grey' : 'topic__commentCharacterCount')}            
            >{`${commentCharacterCount} / 100`}</h3>

            <button
              className={(commentCharacterCount === 0 || commentCharacterCount > 100) ? 'topic__commentButton unavailable' : 'topic__commentButton'}
              onClick={addComment}
            >Comment</button>
          </div>
        </div>}
      </div>

      <div className='topic__commentsList'>
        {commentList}
      </div>
    </div>
  )
}
