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
const Helpers_1 = require("./Helpers");
const url_1 = require("url");
class RequestMatcher {
    constructor(config) {
        this.config = config;
    }
    getResponse(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let input;
            if (args[0] instanceof Request) {
                input = args[0];
            }
            else if (typeof args[0] === "string") {
                input = new Request(args[0], args[1]);
            }
            else {
                return null;
            }
            let descriptors = this.config.requests;
            let d = null;
            for (let i = 0; i < descriptors.length; i++) {
                d = descriptors[i];
                if (yield matches(input, d))
                    break;
                else
                    d = null;
            }
            if (!d)
                return null;
            let responseBody = d.responseJson;
            let stringBody = JSON.stringify(responseBody);
            let response = new Response(stringBody);
            return response;
        });
    }
}
exports.RequestMatcher = RequestMatcher;
function matches(input, match) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!match || !input) {
            Helpers_1.logError("Missing descriptor or input request");
            return false;
        }
        if (input.method.toUpperCase() != match.method.toString().toUpperCase()) {
            return false;
        }
        let matchesUrl = matchUrl(input.url, match.path);
        if (!matchesUrl) {
            return false;
        }
        let matchesBody = yield matchBody(input, match.bodyPatterns);
        if (!matchesBody) {
            return false;
        }
        return true;
    });
}
exports.matches = matches;
function matchUrl(inputUrlString, matchPath) {
    if (!matchPath) {
        return true;
    }
    let inputUrl;
    try {
        inputUrl = url_1.parse(inputUrlString, true);
    }
    catch (error) {
        Helpers_1.logError(`Error while parsing input request url: ${inputUrlString}`);
        return false;
    }
    const baseHost = "http://localhost:8081";
    const matchUrl = url_1.parse(baseHost, true);
    matchUrl.pathname = matchPath.base;
    if (inputUrl.pathname != matchUrl.pathname) {
        return false;
    }
    const matchesQueries = matchQueries(inputUrl, matchPath.queries);
    if (!matchesQueries)
        return false;
    return true;
}
exports.matchUrl = matchUrl;
function matchQueries(inputUrl, matchQueries) {
    if (!matchQueries) {
        return true;
    }
    const inputParams = inputUrl.query;
    for (let key in matchQueries) {
        if (matchQueries.hasOwnProperty(key)) {
            const value = matchQueries[key];
            const inputValues = inputParams[key];
            if (!inputValues || inputValues.indexOf(value) == -1)
                return false;
        }
    }
    return true;
}
exports.matchQueries = matchQueries;
function matchBody(input, matchBody) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!matchBody) {
            return true;
        }
        let inputBody = yield input.text();
        if (!inputBody) {
            return false;
        }
        if (matchBody.contains && inputBody.indexOf(matchBody.contains) == -1) {
            return false;
        }
        if (matchBody.matches && !inputBody.match(matchBody.matches)) {
            return false;
        }
        return true;
    });
}
exports.matchBody = matchBody;
function retrieveResponseFile(responsePath) {
    return {
        file: responsePath
    };
}
exports.retrieveResponseFile = retrieveResponseFile;
