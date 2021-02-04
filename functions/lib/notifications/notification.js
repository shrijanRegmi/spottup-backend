"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const booking_recieved_notif_1 = require("./booking_recieved_notif");
const booking_accept_decline_notif_1 = require("./booking_accept_decline_notif");
const screenshots_submitted_notif_1 = require("./screenshots_submitted_notif");
const dynamic_link_notif_1 = require("./dynamic_link_notif");
const withdraw_notif_1 = require("./withdraw_notif");
exports.default = {
    bookingReceivedNotif: booking_recieved_notif_1.default,
    bookingAcceptDeclineNotif: booking_accept_decline_notif_1.default,
    screenshotSubmittedNotif: screenshots_submitted_notif_1.default,
    dynamicLinkNotif: dynamic_link_notif_1.default,
    withdrawNotif: withdraw_notif_1.default,
};
//# sourceMappingURL=notification.js.map