export const selectUsers = (state) => {
  return state.usersPage.user;
};

export const getPageSize = (state) => {
  return state.usersPage.pageSize;
};

export const getTotalUsersCount = (state) => {
  return state.usersPage.totalUsersCount
};

export const getCurrentPage = (state) => {
  return state.usersPage.currentPage
};

export const getIsFetching = (state) => {
  return state.usersPage.currentPage
};

export const getFollowingInProgress = (state) => {
  return state.usersPage.followingInProgress
};



