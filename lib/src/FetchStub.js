"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const Helpers_1 = require("./Helpers");
const RequestMatcher_1 = require("./RequestMatcher");
const DefaultFileReader_1 = require("./readers/DefaultFileReader");
let globalAny = global;
class FetchStub {
    static load(config, extraConfigs) {
        if (!globalAny.fetch) {
            Helpers_1.logError('Fetch not installed in global.');
            throw new types_1.FetchNotInstalledError('Fetch not installed in global.');
        }
        if (!config) {
            Helpers_1.logError("Config file not found.");
            throw new types_1.MockConfigError("Config file not found.");
        }
        if (!globalAny.fetch.isStub) {
            wrapFetch();
        }
        let myExtraConfigs = Object.assign({
            responseFileRetriever: DefaultFileReader_1.defaultResponseFileRetriever
        }, extraConfigs);
        let requestMatcher = new RequestMatcher_1.RequestMatcher(config, myExtraConfigs);
        globalAny.fetch.requestMatcher = requestMatcher;
        globalAny.fetch.isStubEnabled = true;
    }
    static unload() {
        if (!globalAny.fetch || !globalAny.fetch.isStub) {
            Helpers_1.logError("Stub is not loaded: nothing to unload");
            return false;
        }
        globalAny.fetch.isStubEnabled = false;
        return true;
    }
}
exports.FetchStub = FetchStub;
function wrapFetch() {
    globalAny.fetch = (function (fetch) {
        return function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (globalAny.fetch.isStub && !globalAny.fetch.isStubEnabled) {
                    return fetch(...args);
                }
                const requestMatcher = globalAny.fetch.requestMatcher;
                let response = yield requestMatcher.getResponse(args);
                if (response) {
                    return Promise.resolve(response);
                }
                if (!requestMatcher.config.forward) {
                    return Promise.reject(new types_1.MissingDescriptorError("404 - Not Found"));
                }
                try {
                    let responseWeb = yield fetch(...args);
                    return Promise.resolve(responseWeb);
                }
                catch (e) {
                    return Promise.reject(e);
                }
            });
        };
    })(globalAny.fetch);
    globalAny.fetch.isStub = true;
}
