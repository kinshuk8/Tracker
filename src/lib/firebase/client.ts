"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Public config — safe to expose in the browser bundle (standard Firebase practice).
// Real values come from NEXT_PUBLIC_* env vars; see the pitch2product backend plan
// for what to set them to (Firebase Console > Project Settings > General > Your apps).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForBuildSafety",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pitch2product.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pitch2product",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pitch2product.firebasestorage.app",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:675428764583:web:dummy",
};

// Guard against re-initializing on every hot reload / re-import in the browser.
function getClientApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

export const app = getClientApp();
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);
