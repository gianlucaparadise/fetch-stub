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
            responseJson: {
                result: 'simpleGet'
            }
        },
        {
            method: 'GET',
            path: {
                base: '/simple/query',
                queries: {
                    gianni: "mar io"
                }
            },
            responseJson: {
                result: 'simpleQuery'
            }
        },
        {
            method: 'POST',
            path: {
                base: '/simple/post'
            },
            bodyPatterns: {
                matches: '[\'"]mar[\'"]\s*:\s*[\'"]io[\'"]'
            },
            responseJson: {
                result: 'simplePost'
            }
        }
    ]
};
src_1.default.load(config);
describe('FetchStub Config tests', () => {
    it('should match simple get request', () => __awaiter(this, void 0, void 0, function* () {
        const inputRequest = new Request('http://example.com/simple/api');
        const response = yield fetch(inputRequest);
        expect(response).not.toBeNull();
        const body = yield response.json();
        expect(body).toEqual({ result: 'simpleGet' });
    }));
    it('should match simple get request with querystring', () => __awaiter(this, void 0, void 0, function* () {
        const inputRequest = new Request('http://example.com/simple/query?gianni=mar+io');
        const response = yield fetch(inputRequest);
        expect(response).not.toBeNull();
        const body = yield response.json();
        expect(body).toEqual({ result: 'simpleQuery' });
    }));
    it('should match simple post request', () => __awaiter(this, void 0, void 0, function* () {
        const bodyInput = {
            mar: "io"
        };
        const bodyString = JSON.stringify(bodyInput);
        const inputRequest = new Request('http://example.com/simple/post', { method: 'POST', body: bodyString });
        const response = yield fetch(inputRequest);
        expect(response).not.toBeNull();
        const body = yield response.json();
        expect(body).toEqual({ result: 'simplePost' });
    }));
    it('should not match simple post request', () => __awaiter(this, void 0, void 0, function* () {
        const bodyInput = {
            mar: "io"
        };
        const bodyString = JSON.stringify(bodyInput);
        const inputRequest = new Request('http://example.com/simple/post/null', { method: 'POST', body: bodyString });
        try {
            const response = yield fetch(inputRequest);
        }
        catch (error) {
            expect(error).not.toBeNull();
        }
    }));
});
