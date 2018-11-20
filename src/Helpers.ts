export function logError(obj: any) {
	if (typeof obj === "number" || typeof obj === "string") {
		console.error("FetchStub - " + obj);
	}
	else {
		console.error(obj);
	}
}