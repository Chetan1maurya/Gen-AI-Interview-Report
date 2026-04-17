import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIta6LAw5r40pjg8MKgDr3H98lgvDkUJ4",
  authDomain: "drive-58608.firebaseapp.com",
  projectId: "drive-58608",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();