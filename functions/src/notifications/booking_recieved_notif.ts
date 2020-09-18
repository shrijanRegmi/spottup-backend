import admin = require("firebase-admin");
import * as functions from "firebase-functions";
import notifHelper from "./helper";

const bookingReceivedNotif = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snap) => {
    const { hotel_ref, user_ref, owner_id } = snap.data();

    const hotelSnap: FirebaseFirestore.DocumentSnapshot = await hotel_ref.get();
    const userSnap: FirebaseFirestore.DocumentSnapshot = await user_ref.get();

    if (hotelSnap.exists && userSnap.exists) {
      const hotelData = hotelSnap.data();
      const userData = userSnap.data();

      const hotelId = hotelSnap.id;

      if (
        typeof hotelId !== "undefined" &&
        owner_id !== "" &&
        typeof hotelData !== "undefined" &&
        typeof userData !== "undefined"
      ) {
        console.log(
          `User ${userData.first_name} and hotel ${hotelData.name} found`
        );

        const fcmMessage = notifHelper.prepareBookingNotification(
          hotelData,
          userData,
          snap.id
        );

        const hotelOwnerRef = admin
          .firestore()
          .collection("users")
          .doc(owner_id);

        const notifTokens = await notifHelper.getNotifTokens(hotelOwnerRef);

        console.log(`Starting to send notification to ${userData.first_name}`);
        await notifHelper.sendNotification(notifTokens, fcmMessage);

        // add notification to notification collection
        const notifRef: FirebaseFirestore.DocumentReference = hotelOwnerRef
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
          type: 2,
          is_read: false,
          hotel_ref: hotel_ref,
          user_ref: user_ref,
          booking_id: snap.id,
          last_updated: Date.now(),
        };

        await notifRef.set(notifData);
      }
    }
    return null;
  });

export default bookingReceivedNotif;
