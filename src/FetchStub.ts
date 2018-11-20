import { MockConfig, FetchNotInstalledError, NoConfigError, ReloadError } from './types'
import { logError } from './Helpers'
import { RequestMatcher } from './RequestMatcher'

let globalAny = (global as any)
let trueFetch = globalAny.fetch; // saving real fetch function

export class FetchStub {

	private static hasLoaded: boolean = false;

	/**
	 * Start mock server with given configuration
	 */
	static load(config: MockConfig) {
		if (!globalAny.fetch) {
			logError('Fetch not installed in global.')
			throw new FetchNotInstalledError('Fetch not installed in global.')
		}

		if (this.hasLoaded) {
			logError('FetchStub has already been loaded')
			throw new ReloadError('FetchStub has already been loaded')
		}

		if (!config) {
			logError("Config file not found.")
			throw new NoConfigError("Config file not found.")
		}

		let requestMatcher = new RequestMatcher(config);

		wrapFetch(requestMatcher);
		this.hasLoaded = true;
	}

	/**
	 * Disable mock server and start using normal fetch
	 */
	static unload() {
		globalAny.fetch = trueFetch;
		FetchStub.hasLoaded = false;
		//require('whatwg-fetch');
	}
}

function wrapFetch(requestMatcher: RequestMatcher) {
	globalAny.fetch = (function (fetch, requestMatcher) {
		return function (...args: any[]) {

			return new Promise(async (resolve, reject) => {
				let response = await requestMatcher.getResponse(args);

				if (response) {
					resolve(response);
				}
				else {
					// if forward:
					// 		todo: check if this is necessary before forwarding
					// 		input.bodyUsed = false; 
					//   	return fetch(...args);
					// else:
					reject(new Error("404 - Not Found"));
				}
			});
		};
	})(globalAny.fetch, requestMatcher);
}