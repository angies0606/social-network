import {useEffect} from 'react';
import classes from "./PostsBlock.module.css";
import Post from "./Post/Post";
import { Field, reduxForm } from 'redux-form';
import { maxLengthCreator, required} from "../../../utils/validators/validators"
import { Textarea } from '../../common/FormsControls/FormsControls';
import PostCreator from './PostCreator/PostCreator';
import {postsApi} from '@api/api-n';


const PostsBlock = ({
  addPosts,
  posts,
  authUserId,
  deletePost
}) => {
 
// TODO: реализовать метод, который не будет задваивать посты при перехода со страницы на страницу
  useEffect(() => {
    // TODO: убрать заглушку
    postsApi.getPosts(authUserId)
      .then(posts => {
        addPosts(posts);
      });
  }, [addPosts]);

  const onAddPost = (newPost) => {
    const newPostData = {
      user: authUserId,
      ...newPost
    }
    return postsApi.createPost(newPostData)
      .then(post => {
        addPosts([post]);
      });
  }

  const onDeletePost = (postId) => {
    return postsApi.deletePost(postId)
      .then(postId => {
        deletePost(postId);
      })
  }
  const onEditPost = () => {

  }
  let postsElements = posts.map((post, index) => 
    <Post 
      post={post}
      key={index}
      deletePost={onDeletePost}
      editPost={onEditPost}
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
        <PostCreator 
          onAddPost={onAddPost}
        /> 
        {postsElements}
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