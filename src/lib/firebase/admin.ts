import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Server-only Firebase Admin SDK — privileged access via a service account, used to
// write to Firestore and manage Storage objects from API routes. Never import this
// from a "use client" component; the service account key must stay server-side.
//
// Mirrors the global-singleton pattern in src/db/index.ts so Next.js dev-mode hot
// reloads don't re-initialize the app (and throw "app already exists") on every edit.
const globalForFirebaseAdmin = global as unknown as { firebaseAdminApp: App | undefined };

function getAdminApp(): App {
  if (globalForFirebaseAdmin.firebaseAdminApp) return globalForFirebaseAdmin.firebaseAdminApp;
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawKey
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.",
    );
  }

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  globalForFirebaseAdmin.firebaseAdminApp = app;
  return app;
}

// Exported as lazy getters, not eagerly-evaluated consts: firebase-admin's cert()
// synchronously parses the private key PEM at call time and throws if it's not valid
// (unlike pg.Pool, which only connects lazily on first query). With placeholder env
// values — the convention this repo's .env already uses everywhere else — an eager
// export would run cert() the moment this module is imported, which happens during
// Next.js's build-time page-data collection for the API route and would break the
// production build even though no request was ever actually served. Deferring the
// call until a route handler actually runs keeps placeholder values build-safe, the
// same way an unset DATABASE_URL doesn't fail the build until something queries it.
export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminBucket() {
  return getStorage(getAdminApp()).bucket();
}
