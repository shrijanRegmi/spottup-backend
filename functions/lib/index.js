"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = require("./notifications/notification");
const admin = require("firebase-admin");
admin.initializeApp();
exports.bookingReceivedNotif =
    notification_1.default.bookingReceivedNotif.bookingReceivedNotif;
exports.tourBookingReceivedNotif =
    notification_1.default.bookingReceivedNotif.tourBookingReceivedNotif;
exports.vehicleBookingReceivedNotif =
    notification_1.default.bookingReceivedNotif.vehicleBookingReceivedNotif;
exports.bookingAcceptDeclineNotif =
    notification_1.default.bookingAcceptDeclineNotif.bookingAcceptDeclineNotif;
exports.tourAcceptDeclineNotif =
    notification_1.default.bookingAcceptDeclineNotif.tourAcceptDeclineNotif;
exports.vehicleAcceptDeclineNotif =
    notification_1.default.bookingAcceptDeclineNotif.vehicleAcceptDeclineNotif;
exports.screenshotSubmittedNotif =
    notification_1.default.screenshotSubmittedNotif.screenshotSubmittedNotif;
exports.tourScreenshotSubmittedNotif =
    notification_1.default.screenshotSubmittedNotif.tourScreenshotSubmittedNotif;
exports.vehicleScreenshotSubmittedNotif =
    notification_1.default.screenshotSubmittedNotif.vehicleScreenshotSubmittedNotif;
//# sourceMappingURL=index.js.map