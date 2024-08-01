import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "insta-clone-e5e1c.firebaseapp.com",
  projectId: "insta-clone-e5e1c",
  storageBucket: "insta-clone-e5e1c.appspot.com",
  messagingSenderId: "776822087650",
  appId: "1:776822087650:web:706529c0609b86f5ede3bb",
};

const app = initializeApp(firebaseConfig);

export default app;
