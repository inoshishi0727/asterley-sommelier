// Deletes all sommelier_conversations documents and their messages subcollections.
// Run from backend/: npx tsx src/scripts/clear-conversations.ts
import * as dotenv from "dotenv";
dotenv.config();

import { db } from "../lib/firebase";

const CONVERSATIONS = "sommelier_conversations";
const BATCH_SIZE = 400;

async function deleteSubcollection(docRef: FirebaseFirestore.DocumentReference) {
  const messagesSnap = await docRef.collection("messages").get();
  const docs = messagesSnap.docs;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    docs.slice(i, i + BATCH_SIZE).forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
}

async function main() {
  const snap = await db.collection(CONVERSATIONS).get();
  const total = snap.docs.length;

  if (total === 0) {
    console.log("No conversations found.");
    return;
  }

  console.log(`Deleting ${total} conversation(s) and their messages…`);

  for (let i = 0; i < snap.docs.length; i += BATCH_SIZE) {
    const chunk = snap.docs.slice(i, i + BATCH_SIZE);
    for (const doc of chunk) {
      await deleteSubcollection(doc.ref);
    }
    const batch = db.batch();
    chunk.forEach(d => batch.delete(d.ref));
    await batch.commit();
    console.log(`  deleted ${Math.min(i + BATCH_SIZE, total)}/${total}`);
  }

  console.log("Done. All conversations cleared.");
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
