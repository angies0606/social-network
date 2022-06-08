import {useEffect, useState} from "react";
import classes from "./PostsBlock.module.css";
import Post from "./Post/Post";
import { Field, reduxForm } from 'redux-form';
import { maxLengthCreator, required} from "../../../utils/validators/validators"
import { Textarea } from '../../common/FormsControls/FormsControls';
import PostCreatorConnected from "./PostCreator/PostCreatorConnected.js";
import {postsApi} from "@api/api-n";
import Card from "@mui/material/Card";
import { Button, TextField } from "@mui/material";
import CommentsCreator from "@components/CommentsCreator/CommentsCreator";
import { AddComment, CommentsDisabled } from "@mui/icons-material";
import PostConnected from "./Post/PostConnected";
import { useAuthContext } from "@features/auth/auth.context";
import { useProgressContext } from "@features/progress/progress.context";


const PostsBlock = ({
  profileUser,
  profileUserId,
  isForCurrentUser,
  addPost,
  posts,
  deletePost,
  editPost,
  setPosts
  // addLike,
  // putComments,
  // comments,
  // addImage
}) => {
 
// TODO: реализовать метод, который не будет задваивать посты при перехода со страницы на страницу
//TODO: user userId в пропсах заменить на user?

const {state: {user: authedUser}} = useAuthContext();
const {isProgress} = useProgressContext();
const [isPostsReady, setPostsIsReady] = useState(false);


  // useEffect(() => {
  //   postsApi.getPosts(profileUserId)
  //     .then(posts => {
  //       setPostsIsReady(true);
  //       addPosts(posts);
  //     });
  // }, []);

  useEffect(() => {
    postsApi.getPosts(profileUserId, authedUser._id)
      .then(posts => {
        setPostsIsReady(true);
        setPosts(posts.map(post => {
          return {
            ...post,
            comments: []
          }
        }));
      });
  }, [profileUserId]);

  const onAddPost = (newPost) => {
    const newPostData = {
      user: profileUserId,
      ...newPost
    }
    return postsApi.createPost(newPostData)
      .then(post => {
        addPost([post]);
      });
  }

  const onDeletePost = (postId) => {
    return postsApi.deletePost(postId)
      .then(postId => {
        deletePost(postId);
      })
  }

  const onEditPost = (post) => {
    return postsApi.editPost(post)
      .then(post => {
        editPost(post);
      })
  }

  const isPostShown = posts?.length > 0 && isPostsReady;

  let postsElements = posts.map((post, index) => 
    <PostConnected 
      post={post}
      key={index}
      deletePost={onDeletePost}
      editPost={onEditPost}
      editPostImage={editPost}
      profileUser={profileUser}
      profileUserId={profileUserId}
      isForCurrentUser={isForCurrentUser}
      authedUser={authedUser}
    />
  );

 return (
    <div className={classes.PostsBlock}>
      <div className={classes.PostsBlock__Header}>
        <h3>
          Мои записи
        </h3>
      </div>
      {/* <AddNewPostFormRedux onSubmit={onAddPost} /> */}
      <div className={classes.PostsBlock_Posts}>
        {
          isForCurrentUser &&
          <Card className={classes.PostsBlock_PostsCreatorCard}>
            <PostCreatorConnected 
              onPostConfirm={onAddPost}
              buttonContent={'Поделиться'}
              textField={
                <TextField
                  className={classes.PostsBlock__TextField}
                  label="Добавить запись"
                  placeholder="Что у Вас нового?"
                  fullWidth
                  multiline
                  maxRows={4}
                  minRows={2}
                />
              }
            />
          </Card>
        }
        {
        //  isPostShown &&
          postsElements
        }
      </div>
    </div>
  )
}

// const maxLength10 = maxLengthCreator(10);
// const AddNewPostForm = (props) => {
//   return (
//     <form onSubmit={props.handleSubmit}>
//       <div>
//         <Field name="newPostText" component={Textarea}
//         validate={[required, maxLength10]} placeholder={"Добавить сообщение"}/>
//       </div>
//       <div>
//         <button>Добавить запись</button>
//       </div>
//     </form>
//   )
// }

// const AddNewPostFormRedux = reduxForm({
//   form: "ProfileAddNewPostForm"
// })(AddNewPostForm);

export default PostsBlock;