"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoConfigError extends Error {
}
exports.NoConfigError = NoConfigError;
class FetchNotInstalledError extends Error {
}
exports.FetchNotInstalledError = FetchNotInstalledError;
class MissingDescriptorError extends TypeError {
}
exports.MissingDescriptorError = MissingDescriptorError;
class MissingMockFolderError extends TypeError {
}
exports.MissingMockFolderError = MissingMockFolderError;
class MissingFileRetrieverError extends TypeError {
}
exports.MissingFileRetrieverError = MissingFileRetrieverError;
