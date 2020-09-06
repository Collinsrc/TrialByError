import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7zgIiHOS_FqNPk-Q32Oo4TWP1xagVsjM",
  authDomain: "trialbyerrorimagehosting.firebaseapp.com",
  databaseURL: "https://trialbyerrorimagehosting.firebaseio.com",
  projectId: "trialbyerrorimagehosting",
  storageBucket: "trialbyerrorimagehosting.appspot.com",
  messagingSenderId: "493276150775",
  appId: "1:493276150775:web:def7e7e2e00a0fa05d4cf2",
  measurementId: "G-7LVVZRZJ86",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
