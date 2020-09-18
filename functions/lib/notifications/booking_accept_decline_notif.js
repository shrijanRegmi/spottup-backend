"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const helper_1 = require("./helper");
const bookingAcceptDeclineNotif = functions.firestore
    .document("bookings/{bookingId}")
    .onUpdate(async (snap) => {
    const { is_accepted, is_declined, user_ref, hotel_ref, id, } = snap.after.data();
    const hotelSnap = await hotel_ref.get();
    if (hotelSnap.exists) {
        const hotelData = hotelSnap.data();
        if (typeof hotelData !== "undefined") {
            if (is_accepted && !is_declined) {
                console.log("Booking is accepted!");
                const fcm = helper_1.default.prepareAcceptDeclineNotif(hotelData, id, true);
                const notifTokens = await helper_1.default.getNotifTokens(user_ref);
                await helper_1.default.sendNotification(notifTokens, fcm);
                const userSnap = await user_ref.get();
                if (userSnap.exists) {
                    const userData = userSnap.data();
                    if (typeof userData !== "undefined") {
                        console.log("Adding notification to notification collection");
                        // add notification to notification collection
                        const notifRef = user_ref
                            .collection("notifications")
                            .doc();
                        const notifData = {
                            id: notifRef.id,
                            hotel_data: {
                                id: hotelData.id,
                                name: hotelData.name,
                                dp: hotelData.dp,
                            },
                            user_data: {
                                uid: userData.uid,
                                first_name: userData.first_name,
                                last_name: userData.last_name,
                            },
                            type: 0,
                            is_read: false,
                            hotel_ref: hotel_ref,
                            last_updated: Date.now(),
                        };
                        await notifRef.set(notifData);
                    }
                }
            }
            else {
                console.log("Booking is declined");
                const fcm = helper_1.default.prepareAcceptDeclineNotif(hotelData, id, false);
                const notifTokens = await helper_1.default.getNotifTokens(user_ref);
                await helper_1.default.sendNotification(notifTokens, fcm);
                const userSnap = await user_ref.get();
                if (userSnap.exists) {
                    const userData = userSnap.data();
                    if (typeof userData !== "undefined") {
                        console.log("Adding notification to notification collection");
                        // add notification to notification collection
                        const notifRef = user_ref
                            .collection("notifications")
                            .doc();
                        const notifData = {
                            id: notifRef.id,
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
                            type: 1,
                            is_read: false,
                            user_ref: user_ref,
                            hotel_ref: hotel_ref,
                            last_updated: Date.now(),
                        };
                        await notifRef.set(notifData);
                    }
                }
            }
        }
    }
});
exports.default = bookingAcceptDeclineNotif;
//# sourceMappingURL=booking_accept_decline_notif.js.map