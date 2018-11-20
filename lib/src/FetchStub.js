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
let globalAny = global;
let trueFetch = globalAny.fetch;
class FetchStub {
    static load(config) {
        if (!globalAny.fetch) {
            Helpers_1.logError('Fetch not installed in global.');
            throw new types_1.FetchNotInstalledError('Fetch not installed in global.');
        }
        if (this.hasLoaded) {
            Helpers_1.logError('FetchStub has already been loaded');
            throw new types_1.ReloadError('FetchStub has already been loaded');
        }
        if (!config) {
            Helpers_1.logError("Config file not found.");
            throw new types_1.NoConfigError("Config file not found.");
        }
        let requestMatcher = new RequestMatcher_1.RequestMatcher(config);
        wrapFetch(requestMatcher);
        this.hasLoaded = true;
    }
    static unload() {
        globalAny.fetch = trueFetch;
        FetchStub.hasLoaded = false;
    }
}
FetchStub.hasLoaded = false;
exports.FetchStub = FetchStub;
function wrapFetch(requestMatcher) {
    globalAny.fetch = (function (fetch, requestMatcher) {
        return function (...args) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let response = yield requestMatcher.getResponse(args);
                if (response) {
                    resolve(response);
                }
                else {
                    reject(new Error("404 - Not Found"));
                }
            }));
        };
    })(globalAny.fetch, requestMatcher);
}
