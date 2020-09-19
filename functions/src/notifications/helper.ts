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

    const adminTokens = await getAdminToken();

    for (const adminToken of adminTokens) {
      if (!tokens.includes(adminToken)) {
        tokens.push(adminToken);
      }
    }

    console.log("Success: getting notification tokens", tokens);
    return tokens;
  } catch (error) {
    console.log("Error!!!: getting notification tokens", error);
    return [];
  }
}

async function getAdminToken() {
  try {
    const adminTokens = [];

    const adminRef = admin
      .firestore()
      .collection("users")
      .where("admin", "==", true);

    const adminSnap = await adminRef.get();

    for (const adminDocs of adminSnap.docs) {
      const adminDeviceSnap = await adminDocs.ref.collection("devices").get();

      for (const deviceDocs of adminDeviceSnap.docs) {
        const { token } = deviceDocs.data();
        adminTokens.push(token);
      }
    }

    console.log("Success: getting admin token", adminTokens);
    return adminTokens;
  } catch (error) {
    console.log("Error!!!: getting admin token", error);
    return [];
  }
}

async function sendNotification(notifTokens: string[], notification: any) {
  try {
    let result;

    if (notifTokens.length !== 0) {
      console.log("Tokens found");
      for (const notifToken of notifTokens) {
        notification.token = notifToken;
        result = await admin.messaging().send(notification);
      }
    } else {
      console.log("Tokens not found");
      result = "404";
    }

    console.log("Success: sending notification");
    return result;
  } catch (error) {
    console.log("Error!!!: sending notification", error);
    return null;
  }
}

async function addNotifToCollection(
  userRef: FirebaseFirestore.DocumentReference,
  data: any,
  userId1: string,
  userId2: string
) {
  const notifRef: FirebaseFirestore.DocumentReference = userRef
    .collection("notifications")
    .doc();
  data.id = notifRef.id;

  try {
    await notifRef.set(data);

    console.log(
      `Success: Adding data in notif collection of ref ${notifRef.path}`
    );

    await addNotifToAdminCollection(data, userId1, userId2);
  } catch (error) {
    console.log(
      `Error!!!: Adding data in notif collection of ref ${notifRef.path}`,
      error
    );
  }
}

async function addNotifToAdminCollection(
  data: any,
  userId1: string,
  userId2: string
) {
  try {
    const adminRef = admin
      .firestore()
      .collection("users")
      .where("admin", "==", true);

    const adminSnap = await adminRef.get();

    if (adminSnap.docs.length === 0) {
      console.log("No admin found!");
    } else {
      for (const adminDocs of adminSnap.docs) {
        const { uid } = adminDocs.data();
        const notifRef: FirebaseFirestore.DocumentReference = adminDocs.ref
          .collection("notifications")
          .doc();

        data.id = notifRef.id;
        data.admin = true;

        if (typeof uid !== "undefined") {
          if (userId1 === uid || userId2 === uid) {
            console.log("This is admin, not adding data in notif collection");
          } else {
            await notifRef.set(data);
            console.log(
              `Success: Adding data in notif collection of ref ${notifRef.path}`
            );
          }
        }
      }
    }
  } catch (error) {
    console.log("Error!!!: Adding data in notif collection of admin");
  }
}

export default {
  prepareBookingNotification,
  prepareAcceptDeclineNotif,
  getNotifTokens,
  sendNotification,
  addNotifToCollection,
  addNotifToAdminCollection,
};
