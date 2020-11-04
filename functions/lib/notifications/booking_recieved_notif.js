"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const helper_1 = require("./helper");
const bookingReceivedNotif = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snap) => {
    if (snap.data().type == 0) {
        const { hotel_ref, user_ref, owner_id } = snap.data();
        const hotelSnap = await hotel_ref.get();
        const userSnap = await user_ref.get();
        if (hotelSnap.exists && userSnap.exists) {
            const hotelData = hotelSnap.data();
            const userData = userSnap.data();
            const hotelId = hotelSnap.id;
            if (typeof hotelId !== "undefined" &&
                owner_id !== "" &&
                typeof hotelData !== "undefined" &&
                typeof userData !== "undefined") {
                console.log(`User ${userData.first_name} and hotel ${hotelData.name} found`);
                const fcmMessage = helper_1.default.prepareBookingNotification(hotelData, userData, snap.id);
                const hotelOwnerRef = admin
                    .firestore()
                    .collection("users")
                    .doc(owner_id);
                const notifTokens = await helper_1.default.getNotifTokens(hotelOwnerRef);
                await helper_1.default.sendNotification(notifTokens, fcmMessage);
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
                    },
                    type: 2,
                    is_read: false,
                    hotel_ref: hotel_ref,
                    user_ref: user_ref,
                    booking_id: snap.id,
                    last_updated: Date.now(),
                    booking_for: 0,
                };
                await helper_1.default.addNotifToCollection(hotelOwnerRef, notifData, owner_id, userData.uid);
            }
        }
    }
    return null;
});
const tourBookingReceivedNotif = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snap) => {
    if (snap.data().type == 1) {
        const { tour_ref, user_ref, owner_id } = snap.data();
        const hotelSnap = await tour_ref.get();
        const userSnap = await user_ref.get();
        if (hotelSnap.exists && userSnap.exists) {
            const hotelData = hotelSnap.data();
            const userData = userSnap.data();
            const hotelId = hotelSnap.id;
            if (typeof hotelId !== "undefined" &&
                owner_id !== "" &&
                typeof hotelData !== "undefined" &&
                typeof userData !== "undefined") {
                console.log(`User ${userData.first_name} and tour ${hotelData.name} found`);
                const fcmMessage = helper_1.default.prepareBookingNotification(hotelData, userData, snap.id);
                const hotelOwnerRef = admin
                    .firestore()
                    .collection("users")
                    .doc(owner_id);
                const notifTokens = await helper_1.default.getNotifTokens(hotelOwnerRef);
                await helper_1.default.sendNotification(notifTokens, fcmMessage);
                // add notification to notification collection
                const notifData = {
                    tour_data: {
                        id: hotelData.id,
                        name: hotelData.name,
                        dp: hotelData.dp,
                    },
                    user_data: {
                        uid: userData.uid,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                    },
                    type: 2,
                    is_read: false,
                    tour_ref: tour_ref,
                    user_ref: user_ref,
                    booking_id: snap.id,
                    last_updated: Date.now(),
                    booking_for: 1,
                };
                await helper_1.default.addNotifToCollection(hotelOwnerRef, notifData, owner_id, userData.uid);
            }
        }
    }
    return null;
});
const vehicleBookingReceivedNotif = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snap) => {
    if (snap.data().type == 2) {
        const { vehicle_ref, user_ref, owner_id } = snap.data();
        const hotelSnap = await vehicle_ref.get();
        const userSnap = await user_ref.get();
        if (hotelSnap.exists && userSnap.exists) {
            const hotelData = hotelSnap.data();
            const userData = userSnap.data();
            const hotelId = hotelSnap.id;
            if (typeof hotelId !== "undefined" &&
                owner_id !== "" &&
                typeof hotelData !== "undefined" &&
                typeof userData !== "undefined") {
                console.log(`User ${userData.first_name} and tour ${hotelData.name} found`);
                const fcmMessage = helper_1.default.prepareBookingNotification(hotelData, userData, snap.id);
                const hotelOwnerRef = admin
                    .firestore()
                    .collection("users")
                    .doc(owner_id);
                const notifTokens = await helper_1.default.getNotifTokens(hotelOwnerRef);
                await helper_1.default.sendNotification(notifTokens, fcmMessage);
                // add notification to notification collection
                const notifData = {
                    vehicle_data: {
                        id: hotelData.id,
                        name: hotelData.name,
                        dp: hotelData.dp,
                    },
                    user_data: {
                        uid: userData.uid,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                    },
                    type: 2,
                    is_read: false,
                    vehicle_ref: vehicle_ref,
                    user_ref: user_ref,
                    booking_id: snap.id,
                    last_updated: Date.now(),
                    booking_for: 2,
                };
                await helper_1.default.addNotifToCollection(hotelOwnerRef, notifData, owner_id, userData.uid);
            }
        }
    }
    return null;
});
exports.default = {
    bookingReceivedNotif,
    tourBookingReceivedNotif,
    vehicleBookingReceivedNotif,
};
//# sourceMappingURL=booking_recieved_notif.js.map