import admin from "firebase-admin";

if (
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL
) {
  throw new Error(
    "Missing required Firebase configuration environment variables"
  );
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { admin, db };