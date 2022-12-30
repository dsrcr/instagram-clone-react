import { Avatar } from '@mui/material'
import './Post.css'
const Post = ({ username, caption, imageUrl }) => {
    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar className='post__avatar' alt='dsrcr' src='/static/images/avatar/1.jpg' />
                <h3>{username}</h3>
            </div>
            <img src={imageUrl} alt="postimage" className="post__image" />
            <h4 className='post__text'><strong>{username} </strong>{caption}</h4>
        </div>
    )
}

export default Post