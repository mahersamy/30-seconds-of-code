"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const node_events_1 = require("node:events");
const confirmEmail_1 = require("../email/confirmEmail");
exports.emailEvent = new node_events_1.EventEmitter();
exports.emailEvent.on("confirmEmail", async (email, otp) => {
    await (0, confirmEmail_1.sendConfirmEmail)(email, otp);
});
