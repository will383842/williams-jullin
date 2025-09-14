// grant-admin.mjs
// Utilisation : node grant-admin.mjs TON_UID

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// charge la clé service
const serviceAccountPath = join(__dirname, "serviceAccountKey.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

// récupère l'UID passé en argument
const UID = process.argv[2];
if (!UID) {
  console.error("❌ UID manquant. Utilise: node grant-admin.mjs <UID>");
  process.exit(1);
}

// initialise l'app admin
initializeApp({ credential: cert(serviceAccount) });

// applique la claim admin
try {
  await getAuth().setCustomUserClaims(UID, { admin: true });
  const user = await getAuth().getUser(UID);
  console.log("✅ Admin activé pour:", user.email, "UID:", UID);
  console.log("Claims actuels:", user.customClaims);
  process.exit(0);
} catch (err) {
  console.error("❌ Erreur:", err);
  process.exit(1);
}
