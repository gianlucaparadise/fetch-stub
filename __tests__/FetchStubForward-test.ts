import FetchStub, { MockConfig, MissingDescriptorError } from "../src";

import 'whatwg-fetch'

const configForward: MockConfig = {
	forward: true,
	requests: [
	]
};

const configNoForward: MockConfig = {
	forward: false,
	requests: [
	]
};

describe('Forward Test', () => {
	it('should not forward request', async () => {
		FetchStub.load(configNoForward);

		const inputRequest = new Request("https://api.punkapi.com/v2/beers?beer_name=punk_ipa");
		try {
			const response = await fetch(inputRequest);
		}
		catch (e) {
			expect(e).toBeInstanceOf(MissingDescriptorError);
		}
	});
	it('should forward request', async () => {
		FetchStub.load(configForward);

		const inputRequest = new Request("https://api.punkapi.com/v2/beers?beer_name=punk_ipa");
		const response = await fetch(inputRequest);

		expect(response.status).toBe(200);
	});
});