import FetchStub, { MockConfig } from "../src";

import 'whatwg-fetch'

const config: MockConfig = {
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

if (!(global as any).fetch) {
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

		const inputRequest = new Request('http://example.com/simple/api');

		// Here fetch is in stub, I expect the mocked answer
		const responseStub = await fetch(inputRequest);
		expect(responseStub).not.toBeNull();

		const bodyStub = await responseStub.json();
		expect(bodyStub).toEqual({ file: 'simpleGet' });

		FetchStub.unload();

		try {
			// this will throw a 404
			const responseWeb = await fetch(inputRequest);
		} catch (error) {
			expect(error).not.toBeNull();
		}
	});
});