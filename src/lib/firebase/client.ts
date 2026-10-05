"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Public config — safe to expose in the browser bundle (standard Firebase practice).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCvtpRAfKsE9YsTRwpRa5YPAeNyKAefYIo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pitch2product.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pitch2product",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pitch2product.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "675428764583",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:675428764583:web:1410b3802eba3ab96d8482",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-9Y3G64YEDZ",
};

// Guard against re-initializing on every hot reload / re-import in the browser.
function getClientApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

export const app: FirebaseApp = getClientApp();
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

// Safe Analytics initialization for browser environments
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

