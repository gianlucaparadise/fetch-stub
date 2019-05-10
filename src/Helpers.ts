export function logError(obj: any) {
	if (typeof obj === "number" || typeof obj === "string") {
		console.error("FetchStub - " + obj);
	}
	else {
		console.error(obj);
	}
}

export const pathJoin = (...args: string[]) => {
	return args.map((part, i) => {
	  if (i === 0){
		return part.trim().replace(/[\/]*$/g, '')
	  } else {
		return part.trim().replace(/(^[\/]*|[\/]*$)/g, '')
	  }
	}).filter(x=>x.length).join('/');
  }