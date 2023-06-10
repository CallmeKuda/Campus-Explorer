import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig={
    apiKey: "AIzaSyBD_LYduWEAsaCK2G6qqMDHHNdet-a-T5w",
    authDomain: "map-assignment-387610.firebaseapp.com",
    projectId: "map-assignment-387610",
    storageBucket: "map-assignment-387610.appspot.com",
    messagingSenderId: "388950014962",
    appId: "1:388950014962:web:bb4c873a585446f0da896b",
    measurementId: "G-QKHJE9HPSB"
}
if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
export{firebase};