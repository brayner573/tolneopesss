// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCK689qDC94UAo2fCqkeWU-z_Q3HD_yKEY",
  authDomain: "torneo-de-dotita.firebaseapp.com",
  projectId: "torneo-de-dotita",
  storageBucket: "torneo-de-dotita.appspot.com",
  messagingSenderId: "958554768082",
  appId: "1:958554768082:web:fb613bce7b756bdd7da30b"
};

// INICIALIZAR FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
