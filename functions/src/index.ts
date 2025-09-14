/**
 * See a full list of supported triggers at:
 * https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

// Limiter le nombre d'instances (contrôle des coûts/perf)
setGlobalOptions({ maxInstances: 10 });

/**
 * Simple endpoint de santé: GET /ping -> "ok"
 * - Log de la requête
 * - CORS permissif (utile pour tester rapidement)
 * - 405 si autre méthode que GET
 */
export const ping = onRequest((req, res) => {
  // CORS basique
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).send("");
    return;
  }
  res.set("Access-Control-Allow-Origin", "*");

  // Log utile pour le debug
  logger.info("Ping called", {
    method: req.method,
    path: req.path,
    query: req.query,
  });

  // Autoriser uniquement GET pour cet endpoint
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  res.status(200).send("ok");
});
