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
    requests: RequestDescriptor[];
};
export declare class NoConfigError extends Error {
}
export declare class FetchNotInstalledError extends Error {
}
