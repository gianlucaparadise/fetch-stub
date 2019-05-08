import { logError } from '../Helpers';
import { ResponseFileRetriever } from '../types';

import * as path from 'path';

export const defaultResponseFileRetriever: ResponseFileRetriever = async function (mockFolder: string, responsePath: string): Promise<object> {
	// todo: understand how to read file across all javascript environments (NodeJs, React Native, Browser)
	const filePath = path.join(mockFolder, responsePath);

	try {
		const result = require(`${filePath}`);
		return Promise.resolve(result);
	}
	catch (err) {
		logError(err);
		return Promise.reject(err);
	}
}