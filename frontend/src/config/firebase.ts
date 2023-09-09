// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { GithubAuthProvider, OAuthProvider, TwitterAuthProvider, connectAuthEmulator, getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import {  connectFirestoreEmulator, getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "firetask-f0935.firebaseapp.com",
  projectId: "firetask-f0935",
  storageBucket: "firetask-f0935.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const firestore = getFirestore(app);

if(import.meta.env.NODE_ENV === 'test') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

export enum PROVIDERS_IDS {
  GOOGLE = 'google.com',
  MICROSOFT = 'microsoft.com',
  TWITTER = 'twitter.com',
  GITHUB = 'github.com',
  PASSWORD = 'password'
}

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

const microsoftProvider = new OAuthProvider('microsoft.com');
const twitterProvider = new TwitterAuthProvider();
const githubProvider = new GithubAuthProvider();

githubProvider.addScope('user');

export function getProvider(providerId: string) {
  switch (providerId) {
    case PROVIDERS_IDS.GOOGLE:
      return googleProvider;
    case PROVIDERS_IDS.MICROSOFT:
      return microsoftProvider;
    case PROVIDERS_IDS.TWITTER:
      return twitterProvider;
    case PROVIDERS_IDS.GITHUB:
      return githubProvider;
    default:
      throw new Error('Provider not supported');
  }
}