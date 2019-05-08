import { logError } from '../Helpers';
import { ResponseFileRetriever } from '../types';

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
const readFileAsync = util.promisify(fs.readFile);

export const nodeResponseFileRetriever: ResponseFileRetriever = async function (mockFolder: string, responsePath: string): Promise<object> {
	// todo: understand how to read file across all javascript environments (NodeJs, React Native, Browser)
	const filePath = path.join(mockFolder, responsePath);

	try {
		const data = await readFileAsync(filePath, { encoding: 'utf-8' });
		const result = JSON.parse(data) as object;
		return Promise.resolve(result);
	}
	catch (err) {
		logError(err);
		return Promise.reject(err);
	}
}