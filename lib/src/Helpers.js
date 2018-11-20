"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logError(obj) {
    if (typeof obj === "number" || typeof obj === "string") {
        console.error("FetchStub - " + obj);
    }
    else {
        console.error(obj);
    }
}
exports.logError = logError;
