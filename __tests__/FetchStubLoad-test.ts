import FetchStub, { MockConfig } from "../src";

import 'whatwg-fetch'

const config: MockConfig = {
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

// if (!(global as any).fetch) {
// 	console.log('Fetch not installed in global.');
// }
// else {
// 	console.log("Fetch in global");
// }

// if (!window.fetch) {
// 	console.log('Fetch not installed in window.');
// }
// else {
// 	console.log("Fetch in window");
// }

describe('FetchStub Config tests', () => {
	// TODO: understand how to test this
	// it('should fail when fetch is missing', () => {
	// 	expect(() => {
	// 		FetchStub.load(config);
	// 	}).toThrow(FetchNotInstalledError);
	// });

	it('fetch should have stub property', () => {
		FetchStub.load(config);
		expect((fetch as any).isStub).toBe(true);
	});

	// N.B. this must be the last test because unloads FetchStub
	it('should load and unload FetchStub', async () => {
		FetchStub.load(config);

		const inputRequest = new Request('https://api.punkapi.com/v2/beers?beer_name=punk_ipa');
		const stubResponseBody = { description: 'good beer' };

		// Here fetch is in stub, I expect the mocked response
		const responseStub = await fetch(inputRequest);
		expect(responseStub).not.toBeNull();

		const bodyStub = await responseStub.json();
		expect(bodyStub).toEqual(stubResponseBody);

		FetchStub.unload();

		// Here I'm not using stub, I expect the real response from punkApi
		const responseWeb = await fetch(inputRequest);
		expect(responseWeb).not.toBeNull();

		const bodyWeb = await responseWeb.json();
		expect(bodyWeb).not.toEqual(stubResponseBody);
	});
});