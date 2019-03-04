import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/storage';

 // Initialize Firebase
var config = {
	apiKey: "AIzaSyAWtBoDMb8Faeifm3I7aBWu5KridUXjn8U",
	authDomain: "cropchien-8d428.firebaseapp.com",
	databaseURL: "https://cropchien-8d428.firebaseio.com",
	projectId: "cropchien-8d428",
	storageBucket: "cropchien-8d428.appspot.com",
	messagingSenderId: "1039159003562"
};

firebase.initializeApp(config)

// Initialize Cloud Firestore through Firebase
let db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
db.enablePersistence({experimentalTabSynchronization:true})
const storage = firebase.storage()
export default {
  db,
  storage
}