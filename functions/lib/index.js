"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = require("./notifications/notification");
const admin = require("firebase-admin");
admin.initializeApp();
exports.bookingReceivedNotif = notification_1.default.bookingReceivedNotif;
exports.bookingAcceptDeclineNotif = notification_1.default.bookingAcceptDeclineNotif;
exports.screenshotSubmittedNotif = notification_1.default.screenshotSubmittedNotif;
//# sourceMappingURL=index.js.map