// @ts-nocheck
import {useEffect} from "react";
import Profile from "@components/Profile/Profile";
import { useParams } from "react-router-dom";
import ProfileRouteConnect from './ProfileRoute.connect';
import {useAuthContext} from '@features/auth/auth.context';


function ProfileRoute({
  user,
  getUser
}) {
  const params = useParams();
  const {state: {user: {_id: authedUserId}}} = useAuthContext();

  useEffect(() => {
    getUser(params.userId);
  }, [])
  
  // componentDidMount() {
  //   let userId = this.props.match.params.userId
  //   if (!userId) {
  //     userId = this.props.authUserId;
  //   }
  //   this.props.getUserProfile(userId);
  //   this.props.getUserStatus(userId);
  // }
  if (!user) return null;
  
  return (
    <>
      <Profile
        // {...props}
        user={user}
        isForCurrentUser={authedUserId === user.id}
        // status={this.props.status}
        status=''
        // updateStatus={this.props.updateUserStatus}
        updateStatus={() => {}}
      />
    </>
  )
}

// let mapStateToProps = (state) => ({ //TODO: переписать, когда буду настраивать авторизацию
//     profile: state.userData.profile,
//     status: state.userData.status,
//     // authUserId: state.auth.userId,
//     // isAuth: state.auth.isAuth
// });

// export default compose(
//   connect(mapStateToProps, {getUserProfile, getUserStatus, updateUserStatus})
// )(ProfileRoute);

export default ProfileRouteConnect(ProfileRoute);