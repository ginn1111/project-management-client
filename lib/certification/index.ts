import { privateRequest } from '../axios';

const PREFIX_URL = '/certificate';

export const create = (certificate: Partial<ICertsEmployee>) =>
	privateRequest.post(`${PREFIX_URL}/add`, {
		...certificate,
	});

export const getList = (idEmp: string) => {
	return privateRequest.get(`${PREFIX_URL}/${idEmp}/employee`);
};

export const update = ({
	id,
	...rest
}: Partial<ICertsEmployee & ICertification>) =>
	privateRequest.patch(`${PREFIX_URL}/${id}/update`, { ...rest });

export const getDetail = (id: string) =>
	privateRequest.get(`${PREFIX_URL}/${id}`);
