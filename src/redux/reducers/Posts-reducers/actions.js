export const PUT_POSTS = 'PUT_POSTS';
export function putPostsActionCreator(posts) {
  return {
    type: PUT_POSTS,
    data: posts
  };
}