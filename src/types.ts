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
	 * Base Path of the response files paths
	 */
	mockFolder?: string,
	/**
	 * Function that reads the response file
	 */
	responseFileRetriever?: ResponseFileRetriever,
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

// EXCEPTIONS

/**
 * This exception is thrown when you try to load FetchStub without a config file
 */
export class NoConfigError extends Error { }

/**
 * This exception is thrown when you try to load FetchStub,
 * but you haven't installed 'whatwg-fetch'.
 * Use: require('whatwg-fetch')
 */
export class FetchNotInstalledError extends Error { }

// /**
//  * This exception is thrown when you try to load FetchStub twice
//  */
// export class ReloadError extends Error { }

/**
 * This exception is thrown when FetchStub has no descriptor that matches with
 * the current request and `forward` is set to `false`.
 * This error extends `TypeError` because `whatwg-fetch` throws a `TypeError`
 * when a Network request fails
 */
export class MissingDescriptorError extends TypeError { }

/**
 * This exception is thrown when you have a descriptor that requires a response
 * file, but you didn't set `mockFolder`. The `mockFolder` property is the base path
 * of all the response files.
 */
export class MissingMockFolderError extends TypeError { }

export class MissingFileRetrieverError extends TypeError { }