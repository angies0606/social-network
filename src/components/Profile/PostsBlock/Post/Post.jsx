
import classes from "./Post.module.css";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@ui-kit/Avatar/Avatar";
import IconButton from "@ui-kit/IconButton/IconButton";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CardActions from "@mui/material/CardActions";
import CommentIcon from "@mui/icons-material/Comment";
import Menu from "@ui-kit/Menu/Menu.jsx";
import MenuItem from "@mui/material/MenuItem";
import PostCreator from "../PostCreator/PostCreator";
import { TextField } from "@mui/material";
import {useState, useMemo, useEffect, useCallback} from "react";
import DateBar from "@ui-kit/DateBar/DateBar";
import Likes from "@ui-kit/Likes/Likes.jsx";
import CommentsCreator from "@components/CommentsCreator/CommentsCreator";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import Separator from "@ui-kit/Separator/Separator";
import Comment from "@components/Comment/Comment";
import {postsApi, usersApi, imagesApi} from "@api/api-n";
import classNames from "classnames";
import { XCircleFill } from "react-bootstrap-icons";
import DeleteImage from "@ui-kit/DeleteImage/DeleteImage";
import ImageDialog from "@ui-kit/ImageDialog/ImageDialog";
import ImageUrlPreview from "@ui-kit/ImagePreview/ImageUrlPreview";
import Expander from "@features/Expander/Expander";
import Dialog from "@ui-kit/Dialog/Dialog";

const imageDialogTitles = {
  add: 'Вы хотите добавить изображение?',
  change: 'Вы хотите изменить изображение?'
}

const Post = ({
  post,
  deletePost,
  editPost,
  editPostImage,
  profileUser,
  profileUserId,
  putComments,
  setLike,
  // addLike,
  // removeLike,
  comments,
  deleteComment,
  authedUser,
  isProgress
}) => {
  const [changeMode, setChangeMode] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isPostReady, setIsPostReady] = useState(false);
  const [isCommentsReady, setCommentsReady] = useState(false);
  const [isImageInPost, setIsImageInPost] = useState(false);
  const [editingImageUrl, setEditingImageUrl] = useState(null);
  const [editingImageFile, setEditingImageFile] = useState(null); 
  const [imageNeedsDeleting, setImageNeedsDeleting] = useState(null);
  const [wasPostImageChanged, setWasPostImageChanged] = useState(false);
  // const [imageFileThatNeedDeleting, setImageFileThatNeedDeleting] = useState(null);
  const [imageDialogTitle, setImageDialogTitle] = useState(null);
  const [isImageDialogOpened, setIsImageDialogOpened] = useState(false);
  const [isMessageDialogOpened, setIsMessageDialogOpened] = useState(false);
  // Получаем данные о владельце поста и комментов
  // useEffect(() => {
  //   usersApi.getUser
  // }, [post])
  // const startProgress = useCallback(() => {
  //   setIsProgress(true);
  // }, [setIsProgress]);

  // const endProgress = useCallback(() => {
  //   setIsProgress(false);
  // }, [setIsProgress]); 
  
  useEffect(() => {
    if(isImageInPost) {
      setImageDialogTitle(imageDialogTitles.change);
    } else {
      setImageDialogTitle(imageDialogTitles.add);
    }
  }, [isImageInPost])

  const textField = useMemo(() => {
    return <TextField 
      // className={classes.PostCreator__TextField}
      // placeholder="Что у Вас нового?"
      fullWidth
      multiline
      rows={4}
    />;
  }, []);

  useEffect(() => {
    if(expanded) {
      onGetComments(post._id);
    }
  }, [expanded])

  if(!post) return null;

  const onPostEdit = () => {
    setChangeMode(true);
    if(post.image) {
      setIsImageInPost(true);
      setEditingImageUrl(post.image);
    }
  }

  const onAddComment = (commentData) => {
    return postsApi.addComment({
      postId: post._id, 
      ...commentData
    })
      .then(data => {
        putComments(data);
      })
  }

  const onGetComments = (postId) => {
    setCommentsReady(false);
    return postsApi.getComments(postId)
      .then(data => {
        putComments(data);
        setCommentsReady(true);
      })
        // .then(() => {});
  }

  const onDeleteComment = (commentId) => {
    return postsApi.deleteComment(commentId)
      .then(comment => {
        deleteComment(comment);
      })
  }

  const onAddLike = () => {
    return postsApi.addLike(post._id)
      .then(payload => {
        setLike(payload);
      })
  }

  const onRemoveLike = () => {
    return postsApi.removeLike(post._id)
    .then(payload => {
      setLike(payload);
    })
  }
  
  const uploadImage = () => {
    const formData = new FormData();
    formData.append('img', editingImageFile);
    return imagesApi.addImage(formData)
      .then(response => {
        return response.imageUrl
      })
  }

  const deletePostImage = () => {
    return postsApi.deleteImage(post._id)
      .then(newPost => {
        return newPost;
      })
  }
  
  const onConfirmEdit = (postData) => {
    let editedPost = {
      ...postData,
      _id: post._id,
    };

    return Promise.resolve((post.image !== editingImageUrl) && !imageNeedsDeleting && editingImageUrl
            ? uploadImage()
                .then(imageUrl => {
                  editedPost.image = imageUrl
                })
            : (post.image !== editingImageUrl) && imageNeedsDeleting && post.image && !editingImageUrl
            ? deletePostImage()
                .then(newPost => {
                  editedPost = {
                    ...newPost
                  }
                })
            : (post.image !== editingImageUrl) && imageNeedsDeleting && post.image && editingImageUrl
            ? deletePostImage()
                .then(() => {
                  return uploadImage()
                    .then(imageUrl => {
                      editedPost.image = imageUrl
                    })
                })
            : null
            ).then(() => {
              return editPost(editedPost)
                .then(() => {
                  setEditingImageUrl(null);
                  setEditingImageFile(null);
                  setImageNeedsDeleting(null);
                  setWasPostImageChanged(false);
                  setIsImageInPost(false);
                  setChangeMode(false);
                })
            })
  }

  const onPostDeleteConfirm = () => {
    // setChangeMode(true);
    deletePost(post._id).
      then(() => {
        setIsMessageDialogOpened(false);
      })
  }

  const onDeleteImage = () => {
    if(editingImageUrl === post.image) {
      setImageNeedsDeleting(editingImageUrl);
    }
    setWasPostImageChanged(true);
    setIsImageInPost(false);
    setEditingImageFile(null);
    setEditingImageUrl(null);
  }

  const onPostImageChange = (image) => {
    const imageUrl = window.URL.createObjectURL(image);
    setEditingImageFile(image);
    setEditingImageUrl(imageUrl);
    setIsImageInPost(true); 
    setWasPostImageChanged(true);
    return Promise.resolve();
  }

  const onImageDialogOpen = () => {
    setIsImageDialogOpened(true);
  }

  const onCloseImageDialog = () => {
    setIsImageDialogOpened(false);
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const isShownData = isPostReady && !post;
  
  return (
    <>
      {/* {isShownData &&  */}
        <Card 
        className = {classes.Post__Card}
        sx={{}}
      >
        <CardHeader
          avatar={
            <Avatar 
              userAvatar={profileUser.avatar}
              // avatarHeight={} 
              // avatarWidth={}
            />
          }
          action={
            post.user === authedUser._id ? 
              <Menu changeMode={changeMode}> 
                <MenuItem onClick={onPostEdit}>Редактировать</MenuItem>
                <MenuItem onClick={() => (setIsMessageDialogOpened(true))}>Удалить</MenuItem>
              </Menu>
            : null
          }
          title={profileUser.nickname}
          subheader={<DateBar creationDate={post.createdAt} updateDate={post.updatedAt}/>}
        />
          
          {changeMode && isImageInPost ? 
              <ImageUrlPreview
                imageUrl={editingImageUrl}
                deleteImage={onDeleteImage}
                className={classes.Card__CardMediaBox}
                isDeleteShown={true}
                isPostImage={true}
              />: null
          }
          
          {!changeMode && post.image ?
            <div className={classes.Card__CardMediaBox}>
              <CardMedia
                component="img"
                image={post.image}
                className={classes.Card__CardMedia}
              />
            </div> : null
          }
         
        <CardContent className={classes.Post__CardContent} >
          {!changeMode &&
            <Typography variant="body1" className={classes.Post__PostText}>
              {post.text}
            </Typography> 
          }
          {changeMode &&
            <PostCreator
              onPostConfirm={onConfirmEdit}
              postText={post.text}
              cancelChange={() => setChangeMode(false)}
              isShowCancelButton
              buttonContent={'Изменить'}
              textField={textField}
              isImageInPost={isImageInPost}
              // onPostImageChange={onPostImageChange}
              openImageDialog={onImageDialogOpen}
              wasPostImageChanged={wasPostImageChanged}
              editingImageUrl={editingImageUrl}
              post={post}
            />
          }
        </CardContent>
        <div className={classes.Card__CardActionsBox}>    
          <CardActions disableSpacing>
            <Likes
              addLike={onAddLike}
              likes={post.nLikes}
              profileUserId={profileUserId}
              isLiked={post.isLiked}
              authedUserId={authedUser._id}
              removeLike={onRemoveLike}
              isProgress={isProgress}
            />
          </CardActions>
          <CardActions disableSpacing>
            <div>
              {post.nComments || ''} 
            </div> 
            <Expander
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
            >
              <CommentIcon className={classNames(classes.Post__CommentIcon, {
                [classes['Post__CommentIcon--expanded']]: expanded
              })}/> 
            </Expander>
          </CardActions>
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent
            className={classes.Post_CommentsCreatorBlock}
          >
            {isCommentsReady && comments?.map((comment, index) => {
              return (
                <div key={index}>
                  <Separator />
                  <Comment 
                    comment={comment}
                    deleteComment={onDeleteComment}
                    isProgress={isProgress}
                    authedUserId={authedUser._id}
                  />
                </div>
              )} 
            )}
          
            <Separator />

            <CommentsCreator 
              authedUser={authedUser}
              confirmed={onAddComment}
            />
          </CardContent>
        </Collapse>
      </Card>
      <ImageDialog 
        isShown={isImageDialogOpened}
        title={imageDialogTitle}
        closeDialog={onCloseImageDialog}
        isProgress={isProgress}
        onImageConfirm={onPostImageChange}
      />
      <Dialog
        isShown={isMessageDialogOpened}
        title={"Удаление поста"}
        message={"Вы действительно хотите удалить этот пост?"}
        isProgress={isProgress}
        onCancel={() => {setIsMessageDialogOpened(false)}}
        onConfirm={onPostDeleteConfirm}
      />
    </>
  )
}

export default Post;