"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const helper_1 = require("./helper");
const withdrawNotif = functions.firestore
    .document("withdraws/{withdrawId}")
    .onCreate(async (snap, context) => {
    if (snap.exists) {
        const ref = admin.firestore();
        const { uid, amount, easy_paisa, bank_account_num } = snap.data();
        const userRef = ref.doc(`users/${uid}`);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
            const userData = userSnap.data();
            if (typeof userData !== "undefined") {
                const tokens = await helper_1.default.getAdminToken();
                const fcm = helper_1.default.prepareWithdrawNotif(userData);
                await helper_1.default.sendNotification(tokens, fcm);
                const notifData = {
                    user_data: {
                        uid: userData.uid,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        photo_url: userData.photo_url,
                    },
                    type: 4,
                    amount: amount,
                    easy_paisa: easy_paisa,
                    bank_account_num: bank_account_num,
                    is_read: false,
                    last_updated: Date.now(),
                };
                await helper_1.default.addNotifToAdminCollection(notifData, "", "");
            }
        }
    }
});
exports.default = withdrawNotif;
//# sourceMappingURL=withdraw_notif.js.map