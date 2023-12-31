import { privateRequest } from '../axios';

const PREFIX_URL = '/account';

export const create = (account: Partial<IAccount>) =>
	privateRequest.post(`${PREFIX_URL}/add`, {
		...account,
	});

export const getList = (searchParams: string, accessToken?: string) =>
	privateRequest.get(`${PREFIX_URL}?${searchParams}`, {
		headers: {
			['x-authorization']: `Bearer ${accessToken}`,
		},
	});

export const update = (payload: Partial<IAccount>) =>
	privateRequest.patch(`${PREFIX_URL}/update`, { ...payload });

export const getDetail = (username: string) =>
	privateRequest.post(`${PREFIX_URL}/detail`, { username });

export const addToEmployee = ({ idEmployee, ...rest }: Partial<IAccount>) =>
	privateRequest.post(`${PREFIX_URL}/${idEmployee}`, {
		...rest,
	});

export const active = (payload: Partial<IAccount>) =>
	privateRequest.post(`${PREFIX_URL}/active`, { ...payload });
