import { Button } from '@mui/material';
import { useState } from 'react';
import { firestore, storage, firebase } from '../App/firebase';
import './ImageUpload.css'

const ImageUpload = ({ username="ds" }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes * 1000));
                setProgress(progress);
            }, (error) => {
                console.error(error);
                alert(error.message)
            }, () => {
                storage.ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // upload image to database
                        firestore.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        );
    }

    return (
        <div className='imageUpload'>
            <progress className='imageUpload__progress' value={progress} max="100" />
            <input
                type="text"
                placeholder='Enter a caption'
                onChange={event => setCaption(event.target.value)}
                value={caption}
            />
            <input
                type="file"
                onChange={handleChange}
            />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload