import admin = require("firebase-admin");
import * as functions from "firebase-functions";
import notifHelper from "./helper";

const screenshotSubmittedNotif = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (snap) => {
    if (snap.after.data().type == 0) {
      const screenshotBefore = snap.before.data().screenshots;

      const {
        screenshots,
        hotel_ref,
        user_ref,
        id,
        owner_id,
      } = snap.after.data();

      if (screenshotBefore !== screenshots) {
        const hotelSnap: FirebaseFirestore.DocumentSnapshot = await hotel_ref.get();
        const userSnap: FirebaseFirestore.DocumentSnapshot = await user_ref.get();

        if (hotelSnap.exists && userSnap.exists) {
          const hotelData = hotelSnap.data();
          const userData = userSnap.data();

          if (
            typeof hotelData !== "undefined" &&
            typeof userData !== "undefined"
          ) {
            console.log(
              `User ${userData.uid} and hotel ${hotelData.name} found`
            );

            if (typeof owner_id !== "undefined") {
              const hotelOwnerRef = admin
                .firestore()
                .collection("users")
                .doc(owner_id);

              const fcm = notifHelper.prepareScreenshotReceivedNotif(
                hotelData,
                userData,
                id
              );

              const notifTokens = await notifHelper.getNotifTokens(
                hotelOwnerRef
              );

              await notifHelper.sendNotification(notifTokens, fcm);

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
                booking_for: 0,
              };

              await notifHelper.addNotifToCollection(
                hotelOwnerRef,
                notifData,
                owner_id,
                userData.uid
              );
            }
          }
        }
      }
    }
  });

const tourScreenshotSubmittedNotif = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (snap) => {
    if (snap.after.data().type == 1) {
      const screenshotBefore = snap.before.data().screenshots;

      const {
        screenshots,
        tour_ref,
        user_ref,
        id,
        owner_id,
      } = snap.after.data();

      if (screenshotBefore !== screenshots) {
        const hotelSnap: FirebaseFirestore.DocumentSnapshot = await tour_ref.get();
        const userSnap: FirebaseFirestore.DocumentSnapshot = await user_ref.get();

        if (hotelSnap.exists && userSnap.exists) {
          const hotelData = hotelSnap.data();
          const userData = userSnap.data();

          if (
            typeof hotelData !== "undefined" &&
            typeof userData !== "undefined"
          ) {
            console.log(
              `User ${userData.uid} and hotel ${hotelData.name} found`
            );

            if (typeof owner_id !== "undefined") {
              const hotelOwnerRef = admin
                .firestore()
                .collection("users")
                .doc(owner_id);

              const fcm = notifHelper.prepareScreenshotReceivedNotif(
                hotelData,
                userData,
                id
              );

              const notifTokens = await notifHelper.getNotifTokens(
                hotelOwnerRef
              );

              await notifHelper.sendNotification(notifTokens, fcm);

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
                  photo_url: userData.photo_url,
                },
                type: 3,
                is_read: false,
                booking_id: snap.after.id,
                tour_ref: tour_ref,
                last_updated: Date.now(),
                booking_for: 1,
              };

              await notifHelper.addNotifToCollection(
                hotelOwnerRef,
                notifData,
                owner_id,
                userData.uid
              );
            }
          }
        }
      }
    }
  });

const vehicleScreenshotSubmittedNotif = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (snap) => {
    if (snap.after.data().type == 2) {
      const screenshotBefore = snap.before.data().screenshots;

      const {
        screenshots,
        vehicle_ref,
        user_ref,
        id,
        owner_id,
      } = snap.after.data();

      if (screenshotBefore !== screenshots) {
        const hotelSnap: FirebaseFirestore.DocumentSnapshot = await vehicle_ref.get();
        const userSnap: FirebaseFirestore.DocumentSnapshot = await user_ref.get();

        if (hotelSnap.exists && userSnap.exists) {
          const hotelData = hotelSnap.data();
          const userData = userSnap.data();

          if (
            typeof hotelData !== "undefined" &&
            typeof userData !== "undefined"
          ) {
            console.log(
              `User ${userData.uid} and hotel ${hotelData.name} found`
            );

            if (typeof owner_id !== "undefined") {
              const hotelOwnerRef = admin
                .firestore()
                .collection("users")
                .doc(owner_id);

              const fcm = notifHelper.prepareScreenshotReceivedNotif(
                hotelData,
                userData,
                id
              );

              const notifTokens = await notifHelper.getNotifTokens(
                hotelOwnerRef
              );

              await notifHelper.sendNotification(notifTokens, fcm);

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
                  photo_url: userData.photo_url,
                },
                type: 3,
                is_read: false,
                booking_id: snap.after.id,
                vehicle_ref: vehicle_ref,
                last_updated: Date.now(),
                booking_for: 2,
              };

              await notifHelper.addNotifToCollection(
                hotelOwnerRef,
                notifData,
                owner_id,
                userData.uid
              );
            }
          }
        }
      }
    }
  });

export default {
  screenshotSubmittedNotif,
  tourScreenshotSubmittedNotif,
  vehicleScreenshotSubmittedNotif,
};
