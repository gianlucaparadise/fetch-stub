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
		},
		{
			method: 'GET',
			path: {
				base: '/simple/query',
				queries: {
					gianni: "mar io"
				}
			},
			responseFile: 'simpleQuery'
		},
		{
			method: 'POST',
			path: {
				base: '/simple/post'
			},
			bodyPatterns: {
				matches: '[\'"]mar[\'"]\s*:\s*[\'"]io[\'"]'
			},
			responseFile: 'simplePost'
		}
	]
};

FetchStub.load(config);

describe('FetchStub Config tests', () => {
	it('should match simple get request', async () => {
		const inputRequest = new Request('http://example.com/simple/api');
		const response = await fetch(inputRequest);

		expect(response).not.toBeNull();

		const body = await response.json();
		expect(body).toEqual({ file: 'simpleGet' });
	});

	it('should match simple get request with querystring', async () => {
		const inputRequest = new Request('http://example.com/simple/query?gianni=mar+io');
		const response = await fetch(inputRequest);

		expect(response).not.toBeNull();

		const body = await response.json();
		expect(body).toEqual({ file: 'simpleQuery' });
	});

	it('should match simple post request', async () => {
		const bodyInput = {
			mar: "io"
		};
		const bodyString = JSON.stringify(bodyInput);
		const inputRequest = new Request('http://example.com/simple/post', { method: 'POST', body: bodyString });
		const response = await fetch(inputRequest);

		expect(response).not.toBeNull();

		const body = await response.json();
		expect(body).toEqual({ file: 'simplePost' });
	});

	it('should not match simple post request', async () => {
		const bodyInput = {
			mar: "io"
		};
		const bodyString = JSON.stringify(bodyInput);
		const inputRequest = new Request('http://example.com/simple/post/null', { method: 'POST', body: bodyString });

		try {
			// this will throw a 404
			const response = await fetch(inputRequest);
		} catch (error) {
			expect(error).not.toBeNull();
		}
	});
});