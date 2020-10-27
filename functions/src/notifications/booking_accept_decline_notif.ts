import * as functions from "firebase-functions";
import notifHelper from "./helper";

const bookingAcceptDeclineNotif = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (snap) => {
    const isAcceptedBefore = snap.before.data().is_accepted;
    const isDeclinedBefore = snap.before.data().is_declined;

    const {
      is_accepted,
      is_declined,
      user_ref,
      hotel_ref,
      id,
    } = snap.after.data();

    if (isAcceptedBefore !== is_accepted && isDeclinedBefore !== is_declined) {
      const hotelSnap = await hotel_ref.get();
      const userSnap = await user_ref.get();

      if (hotelSnap.exists && userSnap.exists) {
        const hotelData = hotelSnap.data();
        const userData = userSnap.data();

        if (
          typeof hotelData !== "undefined" &&
          typeof userData !== "undefined"
        ) {
          console.log(
            `User ${userData.first_name} and hotel ${hotelData.name} found`
          );

          if (is_accepted && !is_declined) {
            console.log("Booking is accepted!");

            const fcm = notifHelper.prepareAcceptDeclineNotif(
              hotelData,
              id,
              true
            );

            const notifTokens = await notifHelper.getNotifTokens(user_ref);

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
              type: 0,
              is_read: false,
              booking_id: snap.after.id,
              hotel_ref: hotel_ref,
              last_updated: Date.now(),
            };

            await notifHelper.addNotifToCollection(
              user_ref,
              notifData,
              hotelData.owner_id,
              userData.uid
            );
          } else {
            console.log("Booking is declined");

            const fcm = notifHelper.prepareAcceptDeclineNotif(
              hotelData,
              id,
              false
            );

            const notifTokens = await notifHelper.getNotifTokens(user_ref);

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
              type: 1,
              is_read: false,
              user_ref: user_ref,
              hotel_ref: hotel_ref,
              booking_id: snap.after.id,
              last_updated: Date.now(),
            };

            await notifHelper.addNotifToCollection(
              user_ref,
              notifData,
              hotelData.owner_id,
              userData.uid
            );
          }
        }
      }
    }
  });

export default bookingAcceptDeclineNotif;
