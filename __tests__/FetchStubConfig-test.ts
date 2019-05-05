import FetchStub, { MockConfig, MissingDescriptorError } from "../src";
import * as expectedFileResponse from './mock/simpleFileResponse.json';

import 'whatwg-fetch'

const config: MockConfig = {
	mockFolder: __dirname,
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
		},
		{
			method: 'GET',
			path: {
				base: '/simple/api/file'
			},
			responseJson: {},
			responseFile: "mock/simpleFileResponse.json"
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
		expect(body).toEqual({ result: 'simpleGet' });
	});

	it('should match simple get request with querystring', async () => {
		const inputRequest = new Request('http://example.com/simple/query?gianni=mar+io');
		const response = await fetch(inputRequest);

		expect(response).not.toBeNull();

		const body = await response.json();
		expect(body).toEqual({ result: 'simpleQuery' });
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
		expect(body).toEqual({ result: 'simplePost' });
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
			expect(error).toBeInstanceOf(MissingDescriptorError);
		}
	});
});

describe('Response File check', () => {
	it('should match file', async () => {
		const inputRequest = new Request('http://example.com/simple/api/file');
		const response = await fetch(inputRequest);

		expect(response).not.toBeNull();

		// This is using default file reader
		const body = await response.json();
		expect(body).toEqual(expectedFileResponse);
	});
});