import admin from "firebase-admin";
import { config } from "../config";

let app: admin.app.App | null = null;

function getApp(): admin.app.App {
  if (app) return app;

  if (admin.apps.length > 0) {
    app = admin.apps[0]!;
    return app;
  }

  const privateKey = config.firebasePrivateKey.replace(/\\n/g, "\n");

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebaseProjectId,
      clientEmail: config.firebaseClientEmail,
      privateKey,
    }),
  });

  return app;
}

export const db = (() => {
  const firestore = getApp().firestore();
  firestore.settings({ ignoreUndefinedProperties: true });
  return firestore;
})();

export { admin };
