import axios from 'axios';

import config from '../config';
const {
	token,
	api: { discord },
} = config;
export default abstract class BaseService {
	httpClient = axios.create({
		baseURL: discord,
		headers: { Authorization: `Bot ${token}` },
	});
}
