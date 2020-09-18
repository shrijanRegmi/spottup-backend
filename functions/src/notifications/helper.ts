import admin = require("firebase-admin");

function prepareBookingNotification(
  hotelData: FirebaseFirestore.DocumentData,
  userData: FirebaseFirestore.DocumentData,
  bookingId: String
) {
  const { first_name, last_name } = userData;
  const hotelName = hotelData.name;

  return {
    notification: {
      title: "Congrats! Booking Received",
      body: `${first_name} ${last_name} just booked ${hotelName}`,
    },
    data: {
      screen: "booking-received-screen",
      id: bookingId,
    },
    android: {
      notification: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
    },
    token: "",
  };
}

function prepareAcceptDeclineNotif(
  hotelData: FirebaseFirestore.DocumentData,
  bookingId: String,
  isAccepted: boolean
) {
  const { name } = hotelData;
  const notifTitle = isAccepted
    ? "Congratulations! your booking was accepted"
    : "Sorry! your booking was declined";
  const notifBody = isAccepted
    ? `${name} just accepted your booking. Tap to see details`
    : `${name} just declined your booking. Tap to see details`;

  return {
    notification: {
      title: notifTitle,
      body: notifBody,
    },
    data: {
      screen: "booking-accept-decline-screen",
      id: bookingId,
    },
    android: {
      notification: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
    },
    token: "",
  };
}

async function getNotifTokens(
  userRef: FirebaseFirestore.DocumentReference
): Promise<string[]> {
  try {
    const tokens = [];
    const deviceRef = await userRef.collection("devices").get();

    for (const doc of deviceRef.docs) {
      const { token } = doc.data();
      tokens.push(token);
    }

    console.log("Success: getting notification tokens");
    return tokens;
  } catch (error) {
    console.log("Error!!!: getting notification tokens");
    return [];
  }
}

async function sendNotification(notifTokens: string[], notification: any) {
  try {
    let result;

    if (notifTokens.length !== 0) {
      for (const notifToken of notifTokens) {
        notification.token = notifToken;
        result = await admin.messaging().send(notification);
        console.log("Success: sending notification");
      }
    } else {
      console.log("Tokens not found");
      result = "404";
    }

    return result;
  } catch (error) {
    console.log("Error!!!: sending notification", error);
    return null;
  }
}

export default {
  prepareBookingNotification,
  prepareAcceptDeclineNotif,
  getNotifTokens,
  sendNotification,
};
