"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockConfigError extends Error {
}
exports.MockConfigError = MockConfigError;
class FetchNotInstalledError extends Error {
}
exports.FetchNotInstalledError = FetchNotInstalledError;
class MissingDescriptorError extends TypeError {
}
exports.MissingDescriptorError = MissingDescriptorError;
