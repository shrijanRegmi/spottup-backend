"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const helper_1 = require("./helper");
const screenshotSubmittedNotif = functions.firestore
    .document("bookings/{bookingId}")
    .onUpdate(async (snap) => {
    const screenshotBefore = snap.before.data().screenshots;
    const { screenshots, hotel_ref, user_ref, id, owner_id, } = snap.after.data();
    if (screenshotBefore !== screenshots) {
        const hotelSnap = await hotel_ref.get();
        const userSnap = await user_ref.get();
        if (hotelSnap.exists && userSnap.exists) {
            const hotelData = hotelSnap.data();
            const userData = userSnap.data();
            if (typeof hotelData !== "undefined" &&
                typeof userData !== "undefined") {
                console.log(`User ${userData.uid} and hotel ${hotelData.name} found`);
                if (typeof owner_id !== "undefined") {
                    const hotelOwnerRef = admin
                        .firestore()
                        .collection("users")
                        .doc(owner_id);
                    const fcm = helper_1.default.prepareScreenshotReceivedNotif(hotelData, userData, id);
                    const notifTokens = await helper_1.default.getNotifTokens(hotelOwnerRef);
                    await helper_1.default.sendNotification(notifTokens, fcm);
                    // add notification to notification collection
                    const notifData = {
                        hotel_data: {
                            id: hotelData.id,
                            name: hotelData.name,
                            dp: hotelData.dp,
                        },
                        user_data: {
                            uid: userData.uid,
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                            photo_url: userData.photo_url,
                        },
                        type: 3,
                        is_read: false,
                        booking_id: snap.after.id,
                        hotel_ref: hotel_ref,
                        last_updated: Date.now(),
                    };
                    await helper_1.default.addNotifToCollection(hotelOwnerRef, notifData, owner_id, userData.uid);
                }
            }
        }
    }
});
exports.default = screenshotSubmittedNotif;
//# sourceMappingURL=screenshots_submitted_notif.js.map