import authOptions from '@/app/api/auth/[...nextauth]/options';
import QuanLyDuAn from '@/components/pages/quan-ly-du-an';
import {
	EmployeeProjectServices,
	ProjectServices,
	ProposeResourceServices,
	ResourceProjectServices,
	ReviewProjectServices,
	WorkProjectServices,
} from '@/lib';
import { AxiosResponse } from 'axios';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

type Tab =
	| 'works-board'
	| 'works-calendar'
	| 'employee'
	| 'propose'
	| 'project'
	| 'resource'
	| 'report';

const getData: Record<
	Tab,
	(
		idProject: string,
		searchParams: string,
		accessToken?: string
	) => Promise<AxiosResponse>
> = {
	'works-board': (idProject: string, _: unknown, accessToken?: string) =>
		WorkProjectServices.getList({ idProject }, accessToken),
	'works-calendar': (idProject: string, _: unknown, accessToken?: string) =>
		WorkProjectServices.getList({ idProject }, accessToken),
	employee: (idProject: string, searchParams: string, accessToken?: string) =>
		EmployeeProjectServices.getList({ idProject, searchParams }, accessToken),

	propose: (idProject: string, searchParams: string, accessToken?: string) =>
		ProposeResourceServices.getList({ idProject, searchParams }, accessToken),
	resource: (idProject: string, searchParams: string, accessToken?: string) =>
		ResourceProjectServices.getList({ idProject, searchParams }, accessToken),
	project: (idProject: string, _: string, accessToken?: string) =>
		ReviewProjectServices.getListByHeadOfDepartment(idProject, accessToken),
	report: (idProject: string, searchParams: string, accessToken?: string) =>
		ProjectServices.getReport(idProject, searchParams, accessToken),
};

const DuAn = async ({
	params,
	searchParams,
}: IRouterParams<
	{ id: string },
	{
		tab?: Tab;
		page?: string;
		limit?: string;
	}
>) => {
	const { id } = params;
	const { tab } = searchParams;
	const session = await getServerSession(authOptions);

	const [data, projectData, inProjectData] = await Promise.all([
		getData[tab ?? 'works-board']?.(
			id,
			`page=${(parseInt(searchParams.page as any) || 1) - 1}&limit=${
				parseInt(searchParams.limit as any) || 10
			}`,
			session?.user.accessToken
		),
		ProjectServices.getDetail(id, session?.user.accessToken),
		ProjectServices.inProject(id, session?.user.accessToken),
	]);

	const isHeadOrCreator = inProjectData?.data?.isHeadOrCreator;

	if (!isHeadOrCreator && tab && tab !== 'works-board') {
		redirect('/');
	}

	return (
		<div className="flex overflow-x-auto">
			<QuanLyDuAn
				data={data?.data}
				project={projectData?.data}
				isHead={isHeadOrCreator}
			/>
		</div>
	);
};

export default DuAn;
