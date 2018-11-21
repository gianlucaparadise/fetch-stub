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
                base: '/simple/api'
            },
            responseFile: 'simpleGet'
        }
    ]
};
if (!global.fetch) {
    console.log('Fetch not installed in global.');
}
else {
    console.log("Fetch in global");
}
if (!window.fetch) {
    console.log('Fetch not installed in window.');
}
else {
    console.log("Fetch in window");
}
describe('FetchStub Config tests', () => {
    it('fetch should have stub property', () => {
        src_1.default.load(config);
        expect(fetch.isStub).toBe(true);
    });
    it('should load and unload FetchStub', () => __awaiter(this, void 0, void 0, function* () {
        src_1.default.load(config);
        const inputRequest = new Request('http://example.com/simple/api');
        const responseStub = yield fetch(inputRequest);
        expect(responseStub).not.toBeNull();
        const bodyStub = yield responseStub.json();
        expect(bodyStub).toEqual({ file: 'simpleGet' });
        src_1.default.unload();
        try {
            const responseWeb = yield fetch(inputRequest);
        }
        catch (error) {
            expect(error).not.toBeNull();
        }
    }));
});
