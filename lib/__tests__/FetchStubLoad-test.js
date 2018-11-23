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
const src_1 = require("../src");
require("whatwg-fetch");
const config = {
    requests: [
        {
            method: 'GET',
            path: {
                base: '/v2/beers',
                queries: {
                    beer_name: 'punk_ipa'
                }
            },
            responseJson: {
                description: 'good beer'
            }
        }
    ]
};
describe('FetchStub Config tests', () => {
    it('fetch should have stub property', () => {
        src_1.default.load(config);
        expect(fetch.isStub).toBe(true);
    });
    it('should load and unload FetchStub', () => __awaiter(this, void 0, void 0, function* () {
        src_1.default.load(config);
        const inputRequest = new Request('https://api.punkapi.com/v2/beers?beer_name=punk_ipa');
        const stubResponseBody = { description: 'good beer' };
        const responseStub = yield fetch(inputRequest);
        expect(responseStub).not.toBeNull();
        const bodyStub = yield responseStub.json();
        expect(bodyStub).toEqual(stubResponseBody);
        src_1.default.unload();
        const responseWeb = yield fetch(inputRequest);
        expect(responseWeb).not.toBeNull();
        const bodyWeb = yield responseWeb.json();
        expect(bodyWeb).not.toEqual(stubResponseBody);
    }));
});
