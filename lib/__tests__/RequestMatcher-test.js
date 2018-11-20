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
require("whatwg-fetch");
const url_1 = require("url");
const RequestMatcher_1 = require("../src/RequestMatcher");
describe('QueryMatcher', () => {
    it('should match simple query strings', () => {
        let urlString = "http://test.com/path?query=string&pippo=pluto";
        let inputUrl = url_1.parse(urlString, true);
        let matchQuery = {};
        matchQuery["pippo"] = "pluto";
        let result = RequestMatcher_1.matchQueries(inputUrl, matchQuery);
        expect(result).toEqual(true);
    });
    it('should not match query strings', () => {
        let urlString = "http://test.com/path?query=string&pippo=pluto";
        let inputUrl = url_1.parse(urlString, true);
        let matchQuery = {};
        matchQuery["pippo"] = "pluto";
        matchQuery["mar"] = "io";
        let result = RequestMatcher_1.matchQueries(inputUrl, matchQuery);
        expect(result).toEqual(false);
    });
    it('should match query string with duplicate key', () => {
        let urlString = "http://test.com/path?pippo=plu+to&query=string&query=param";
        let inputUrl = url_1.parse(urlString, true);
        let matchQuery = {};
        matchQuery["query"] = "param";
        matchQuery["pippo"] = "plu to";
        let result = RequestMatcher_1.matchQueries(inputUrl, matchQuery);
        expect(result).toEqual(true);
    });
});
describe('UrlMatcher', () => {
    it('should match simple url', () => {
        let inputUrl = "http://test.com/simple/path";
        let matchPath = {
            base: '/simple/path'
        };
        let result = RequestMatcher_1.matchUrl(inputUrl, matchPath);
        expect(result).toEqual(true);
    });
    it('should not match url', () => {
        let inputUrl = "http://test.com/simple/path/longer";
        let matchPath = {
            base: '/simple/path'
        };
        let result = RequestMatcher_1.matchUrl(inputUrl, matchPath);
        expect(result).toEqual(false);
    });
    it('should match url ignoring query string', () => {
        let inputUrl = "http://test.com/simple/path?mario=pluto";
        let matchPath = {
            base: '/simple/path'
        };
        let result = RequestMatcher_1.matchUrl(inputUrl, matchPath);
        expect(result).toEqual(true);
    });
    it('should not match url missing query string', () => {
        let inputUrl = "http://test.com/simple/path";
        let matchPath = {
            base: '/simple/path',
            queries: {
                mario: "pluto"
            }
        };
        let result = RequestMatcher_1.matchUrl(inputUrl, matchPath);
        expect(result).toEqual(false);
    });
    it('should match url and query string', () => {
        let inputUrl = "http://test.com/simple/path?mario=pluto";
        let matchPath = {
            base: '/simple/path',
            queries: {
                mario: "pluto"
            }
        };
        let result = RequestMatcher_1.matchUrl(inputUrl, matchPath);
        expect(result).toEqual(true);
    });
});
describe('BodyMatcher', () => {
    it('should match simple body', () => __awaiter(this, void 0, void 0, function* () {
        const baseUrl = 'http://test.com/path';
        const body = {
            mar: "yo",
            id: "580"
        };
        const bodyString = JSON.stringify(body);
        const inputRequest = new Request(baseUrl, { method: 'POST', body: bodyString });
        const bodyMatcher = {
            contains: "580"
        };
        const result = yield RequestMatcher_1.matchBody(inputRequest, bodyMatcher);
        expect(result).toEqual(true);
    }));
    it('should match simple body regex', () => __awaiter(this, void 0, void 0, function* () {
        const baseUrl = 'http://test.com/path';
        const body = {
            mar: "yo",
            id: "580"
        };
        const bodyString = JSON.stringify(body);
        const inputRequest = new Request(baseUrl, { method: 'POST', body: bodyString });
        const bodyMatcher = {
            matches: "['\"]id['\"]\s*:\s*['\"]580['\"]"
        };
        const result = yield RequestMatcher_1.matchBody(inputRequest, bodyMatcher);
        expect(result).toEqual(true);
    }));
    it('should not match simple body regex and contains', () => __awaiter(this, void 0, void 0, function* () {
        const baseUrl = 'http://test.com/path';
        const body = {
            mar: "yo",
            id: "580"
        };
        const bodyString = JSON.stringify(body);
        const inputRequest = new Request(baseUrl, { method: 'POST', body: bodyString });
        const bodyMatcher = {
            contains: "'yo'",
            matches: "['\"]id['\"]\s*:\s*['\"]580['\"]"
        };
        const result = yield RequestMatcher_1.matchBody(inputRequest, bodyMatcher);
        expect(result).toEqual(false);
    }));
});
