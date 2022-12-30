/* eslint-disable no-unused-vars */
import './App.css';
import Post from '../Post/Post';
import { useState, useEffect } from 'react';
import { firestore, auth } from './firebase';
import { Box, Button, Input, Modal } from '@mui/material';
import ImageUpload from '../ImageUpload/ImageUpload';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

const App = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCloseSighIn = () => setOpenSignIn(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser)
                setUser(auth);
            } else {
                setUser(null);
            }
        });
        return () => {
            unsubscribe();
        }
    }, [user, username]);

    useEffect(() => {
        firestore.collection('posts').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    }, [posts]);

    const signUp = (event) => {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username
                })
            })
            .catch((error) => alert(error.message));
        setOpen(false);
    }

    const signIn = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .then()
            .catch((error) => alert(error.message));
        setOpenSignIn(false);
    }
    return (
        <div className="app">


            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <center>
                        <img className='app__headerImage'
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                            alt="instagram-logo" />
                    </center>
                    <form className='app__signup'>
                        <Input
                            placeholder='username'
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            placeholder='e-mail'
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={signUp}>Sign up</Button>
                    </form>
                </Box>
            </Modal>
            <Modal open={openSignIn} onClose={handleCloseSighIn}>
                <Box sx={style}>
                    <center>
                        <img
                            className='app__headerImage'
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                            alt="instagram-logo"
                        />
                    </center>
                    <form className='app__signin'>
                        <Input
                            placeholder='e-mail'
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={signIn}>Sign in</Button>
                    </form>
                </Box>
            </Modal>
            <div className="app__header">
                <img
                    className='app__headerImage'
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt="instagram-logo"
                />
                {
                    user ? (
                        <Button onClick={() => auth.signOut()}>Logout</Button>
                    ) : (
                        <div className="app__loginContainer">
                            <Button onClick={() => setOpenSignIn(true)}>SIGN IN</Button>
                            <Button onClick={() => setOpen(true)}>SIGN UP</Button>
                        </div>

                    )
                }

            </div>
            <div className="app__posts">
                <div className="app__postsLeft">
                    {posts.map(({ id, post }) => (
                        <Post
                            key={id}
                            postId={id}
                            user={user}
                            username={post.username}
                            caption={post.caption}
                            imageUrl={post.imageUrl}
                        />
                    ))}
                </div>
                <div className="app__postsRight">
                    {/* This probably won't work in React18 */}
                    {/* <InstagramEmbed
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={ () => {} }
                        onSuccess={() => {}}
                        onFailure={() => {}}
                        onAfterRender={() => {}}
                        /> */}
                </div>
            </div>

            {/* {
                user?.displayName ? ( */}
            <ImageUpload username={user?.displayName} />
            {/* ) : (<h3>Sorry you need to log in</h3>)
            } */}
        </div>
    );
}

export default App;
