import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAjoglKxE4RwLxoiO3Yjfpju_cq1PGDi0A",
  authDomain: "tbeguildimagehosting.firebaseapp.com",
  databaseURL: "https://tbeguildimagehosting.firebaseio.com",
  projectId: "tbeguildimagehosting",
  storageBucket: "tbeguildimagehosting.appspot.com",
  messagingSenderId: "785263791733",
  appId: "1:785263791733:web:34078209572fae5496b23c",
  measurementId: "G-WJYHVSL07Z",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
