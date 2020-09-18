import notifications from "./notifications/notification";
import admin = require("firebase-admin");

admin.initializeApp();

exports.bookingReceivedNotif = notifications.bookingReceivedNotif;

exports.bookingAcceptDeclineNotif = notifications.bookingAcceptDeclineNotif;
