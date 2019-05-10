import { logError, pathJoin } from '../Helpers';
import { ResponseFileRetriever } from '../types';

export const defaultResponseFileRetriever: ResponseFileRetriever = async function (mockFolder: string, responsePath: string): Promise<object> {
	// todo: understand how to read file across all javascript environments (NodeJs, React Native, Browser)
	const filePath = pathJoin(mockFolder, responsePath);

	try {
		const result = require(`${filePath}`);
		return Promise.resolve(result);
	}
	catch (err) {
		logError(err);
		return Promise.reject(err);
	}
}