import { db } from "../src/lib/firebase";

async function main() {
  const snap = await db
    .collection("newsletter_subscribers")
    .orderBy("subscribedAt", "desc")
    .get();

  if (snap.empty) {
    console.log("No subscribers found.");
    return;
  }

  console.log(`\n${snap.size} subscriber(s) found:\n`);
  console.log(
    "Email".padEnd(40),
    "Source".padEnd(12),
    "Consent".padEnd(10),
    "Subscribed At"
  );
  console.log("-".repeat(85));

  snap.forEach((doc) => {
    const d = doc.data();
    console.log(
      (d.email ?? "—").padEnd(40),
      (d.source ?? "—").padEnd(12),
      String(d.consent ?? false).padEnd(10),
      d.subscribedAt ?? "—"
    );
  });

  console.log();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
