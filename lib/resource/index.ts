import { privateRequest } from '../axios';

const PREFIX_URL = '/resource';

export const getList = (searchParams: string, accessToken?: string) =>
	privateRequest.get(`${PREFIX_URL}?${searchParams}`, {
		headers: {
			['x-authorization']: `Bearer ${accessToken}`,
		},
	});

export const create = ({
	idResourceType,
	name,
	amount,
	note,
}: Partial<IResource>) =>
	privateRequest.post(`${PREFIX_URL}/add`, {
		idResourceType,
		name,
		amount,
		note,
	});

export const update = ({ id, name, idResourceType, amount, note }: IResource) =>
	privateRequest.patch(`${PREFIX_URL}/${id}`, {
		idResourceType,
		name,
		amount,
		note,
	});
