export declare type HttpMethod = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT";
export declare type QueryMatcher = {
    [key: string]: string;
};
export declare type PathMatcher = {
    base: string;
    queries?: QueryMatcher;
};
export declare type BodyMatcher = {
    contains?: string;
    matches?: string;
};
export declare type RequestDescriptor = {
    method: HttpMethod;
    path?: PathMatcher;
    bodyPatterns?: BodyMatcher;
    responseJson: object;
    responseFile?: string;
};
export declare type MockConfig = {
    forward?: boolean;
    mockFolder?: string;
    responseFileRetriever?: ResponseFileRetriever;
    requests: RequestDescriptor[];
};
export declare type ResponseFileRetriever = (mockFolder: string, responsePath: string) => Promise<object>;
export declare class MockConfigError extends Error {
}
export declare class FetchNotInstalledError extends Error {
}
export declare class MissingDescriptorError extends TypeError {
}
