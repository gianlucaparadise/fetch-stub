/**
 * Http method types
 */
export type HttpMethod =
	"DELETE" |
	"GET" |
	"HEAD" |
	"OPTIONS" |
	"POST" |
	"PUT";

/**
 * Map of the query string parameters
 */
export type QueryMatcher = {
	[key: string]: string
}

/**
 * This describes a path to match
 */
export type PathMatcher = {
	/**
	 * Path name of the url
	 */
	base: string,
	/**
	 * Query string params that must be among the input request query
	 */
	queries?: QueryMatcher
}

/**
 * This describe a body to match
 */
export type BodyMatcher = {
	/**
	 * Exact string to search in the request body
	 */
	contains?: string,
	/**
	 * RegEx to test against the request body
	 */
	matches?: string
}

/**
 * This describes a request to match
 */
export type RequestDescriptor = {
	method: HttpMethod,
	path?: PathMatcher,
	bodyPatterns?: BodyMatcher,
	responseJson: object,
	responseFile?: string
}

export type MockConfig = {
	/**
	 * true if you want to send request if a local response is not found. If missing is false.
	 */
	forward?: boolean,
	/**
	 * Base Path of the response files paths.
	 * An exception is thrown when you have a descriptor that requires a response
 	 * file, but you didn't set `mockFolder`.
	 */
	mockFolder?: string,
	/**
	 * List of request match rules
	 */
	requests: RequestDescriptor[]
}

/**
 * This function gets called when FetchStub has matched a descriptor with response file and needs
 * to read it. This is strictly related to your js environment.
 */
export type ResponseFileRetriever = (mockFolder: string, responsePath: string) => Promise<object>;

export type ExtraConfig = {
	/**
	 * Function that reads the response file.
	 * If not specified, `defaultResponseFileRetriever` is used.
	 * An exception is thrown when you have a descriptor that requires a response
	 * file, but you didn't set `responseFileRetriever`.
	 */
	responseFileRetriever?: ResponseFileRetriever
}

/**
 * This interface abstracts the library-dependent logics to keep code reusable
 */
export interface IRequest {
	/**
	 * HTTP method. Example: 'GET'
	 */
	method: string;
	/**
	 * Request url
	 */
	url: string;
	/**
	 * Request body as string
	 */
	text(): Promise<string>;
}

//#region EXCEPTIONS

/**
 * This exception is thrown when you have problems in your MockConfig file
 */
export class MockConfigError extends Error { }

/**
 * This exception is thrown when you try to load FetchStub,
 * but you haven't installed 'whatwg-fetch'.
 * Use: require('whatwg-fetch')
 */
export class FetchNotInstalledError extends Error { }

/**
 * This exception is thrown when FetchStub has no descriptor that matches with
 * the current request and `forward` is set to `false`.
 * This error extends `TypeError` because `whatwg-fetch` throws a `TypeError`
 * when a Network request fails
 */
export class MissingDescriptorError extends TypeError { }

//#endregion