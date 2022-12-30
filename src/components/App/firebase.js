import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"
import "firebase/storage"
import firebaseConfig from "../../config/firebaseConfig";

const app = firebase.initializeApp(firebaseConfig);
const firestore = app.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { firebase, firestore, auth, storage };