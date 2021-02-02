import notifications from "./notifications/notification";
import admin = require("firebase-admin");

admin.initializeApp();

exports.bookingReceivedNotif =
  notifications.bookingReceivedNotif.bookingReceivedNotif;
exports.tourBookingReceivedNotif =
  notifications.bookingReceivedNotif.tourBookingReceivedNotif;
exports.vehicleBookingReceivedNotif =
  notifications.bookingReceivedNotif.vehicleBookingReceivedNotif;
exports.dynamicLinkNotif = notifications.dynamicLinkNotif;

exports.bookingAcceptDeclineNotif =
  notifications.bookingAcceptDeclineNotif.bookingAcceptDeclineNotif;
exports.tourAcceptDeclineNotif =
  notifications.bookingAcceptDeclineNotif.tourAcceptDeclineNotif;
exports.vehicleAcceptDeclineNotif =
  notifications.bookingAcceptDeclineNotif.vehicleAcceptDeclineNotif;

exports.screenshotSubmittedNotif =
  notifications.screenshotSubmittedNotif.screenshotSubmittedNotif;
exports.tourScreenshotSubmittedNotif =
  notifications.screenshotSubmittedNotif.tourScreenshotSubmittedNotif;
exports.vehicleScreenshotSubmittedNotif =
  notifications.screenshotSubmittedNotif.vehicleScreenshotSubmittedNotif;
