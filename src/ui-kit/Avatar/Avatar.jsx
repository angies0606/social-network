import MUIAvatar from "@mui/material/Avatar";

function Avatar ({
  userAvatar = '',
  avatarHeight = null,
  avatarWidth = null,
  className = null
}) {
  return (
    <MUIAvatar  
      src={userAvatar}
      sx={{ width: avatarWidth, height: avatarHeight}}
    />
  )
}

export default Avatar;