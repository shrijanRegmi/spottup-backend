"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const helper_1 = require("./helper");
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
                const fcmMessage = helper_1.default.prepareDynamicLinkNotif(senderData);
                const notifTokens = await helper_1.default.getNotifTokens(ownerRef);
                await helper_1.default.sendNotification(notifTokens, fcmMessage);
            }
        }
    }
});
exports.default = dynamicLinkNotif;
//# sourceMappingURL=dynamic_link_notif.js.map