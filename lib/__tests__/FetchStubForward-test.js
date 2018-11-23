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
const configForward = {
    forward: true,
    requests: []
};
const configNoForward = {
    forward: false,
    requests: []
};
describe('Forward Test', () => {
    it('should not forward request', () => __awaiter(this, void 0, void 0, function* () {
        src_1.default.load(configNoForward);
        const inputRequest = new Request("https://api.punkapi.com/v2/beers?beer_name=punk_ipa");
        try {
            const response = yield fetch(inputRequest);
        }
        catch (e) {
            expect(e).toBeInstanceOf(src_1.MissingDescriptorError);
        }
    }));
    it('should forward request', () => __awaiter(this, void 0, void 0, function* () {
        src_1.default.load(configForward);
        const inputRequest = new Request("https://api.punkapi.com/v2/beers?beer_name=punk_ipa");
        const response = yield fetch(inputRequest);
        expect(response.status).toBe(200);
    }));
});
