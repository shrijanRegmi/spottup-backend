import admin = require("firebase-admin");
import * as functions from "firebase-functions";
import notifHelper from "./helper";

const dynamicLinkNotif = functions.firestore
  .document("users/{userId}/dynamic_users/{linkId}")
  .onCreate(async (snap, context) => {
    if (snap.exists) {
      const ownerId = context.params.userId;
      const senderId = context.params.linkId;

      const ref = admin.firestore();

      const ownerRef = ref.doc(`users/${ownerId}`);
      const senderRef = ref.doc(`users/${senderId}`);
      const senderSnap = await senderRef.get();

      if (senderSnap.exists) {
        const senderData = senderSnap.data();

        if (typeof senderData !== "undefined") {
          const fcmMessage = notifHelper.prepareDynamicLinkNotif(senderData);

          const notifTokens = await notifHelper.getNotifTokens(ownerRef);

          await notifHelper.sendNotification(notifTokens, fcmMessage);
        }
      }
    }
  });

export default dynamicLinkNotif;
