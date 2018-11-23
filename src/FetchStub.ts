import { MockConfig, FetchNotInstalledError, NoConfigError, MissingDescriptorError } from './types'
import { logError } from './Helpers'
import { RequestMatcher } from './RequestMatcher'

let globalAny = (global as any)

export class FetchStub {

	/**
	 * Start mock server with given configuration
	 */
	static load(config: MockConfig) {
		if (!globalAny.fetch) {
			logError('Fetch not installed in global.');
			throw new FetchNotInstalledError('Fetch not installed in global.');
		}

		if (!config) {
			logError("Config file not found.");
			throw new NoConfigError("Config file not found.");
		}

		if (!globalAny.fetch.isStub) {
			// If I have already wrapped it, I just update the new config file
			wrapFetch();
		}

		let requestMatcher = new RequestMatcher(config);

		globalAny.fetch.requestMatcher = requestMatcher;
		globalAny.fetch.isStubEnabled = true;
	}

	/**
	 * Disable mock server and start using normal fetch
	 * @returns true if it has unloaded
	 */
	static unload(): boolean {
		if (!globalAny.fetch || !globalAny.fetch.isStub) {
			logError("Stub is not loaded: nothing to unload");
			return false;
		}
		globalAny.fetch.isStubEnabled = false;
		return true;
	}
}

function wrapFetch() {
	globalAny.fetch = (function (fetch) {
		return async function (...args: any[]) {
			if (globalAny.fetch.isStub && !globalAny.fetch.isStubEnabled) {
				// when stub is disabled, I use the real fetch
				return fetch(...args);
			}

			const requestMatcher: RequestMatcher = globalAny.fetch.requestMatcher;
			let response = await requestMatcher.getResponse(args);

			if (response) {
				return Promise.resolve(response);
			}

			if (!requestMatcher.config.forward) {
				return Promise.reject(new MissingDescriptorError("404 - Not Found"));
			}

			//#region Forwarding request
			try {
				let responseWeb = await fetch(...args);
				return Promise.resolve(responseWeb);
			}
			catch (e) {
				return Promise.reject(e);
			}
			//#endregion
		};
	})(globalAny.fetch);

	globalAny.fetch.isStub = true;
}