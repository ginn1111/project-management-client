import FilterChucVu from '@/components/pages/quan-ly-chuc-vu/filter-chuc-vu';
import TableChucVu from '@/components/pages/quan-ly-chuc-vu/table-chuc-vu';
import { PositionServices } from '@/lib';
import { getUserInfoFromNextAuth } from '@/utils/get-user-from-next-auth';
import { Suspense } from 'react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const ChucVu = async ({ searchParams }: { searchParams: ISearchParams }) => {
	const user = await getUserInfoFromNextAuth();

	const positionData = await PositionServices.getList(
		`page=${(parseInt(searchParams.page as any) || 1) - 1}&limit=${
			parseInt(searchParams.limit as any) || 10
		}&search=${searchParams.search ?? ''}`,
		user?.accessToken
	);
	return (
		<div className="m-2 rounded-sm p-2">
			<FilterChucVu />
			<div className="mt-4">
				<Suspense fallback={<p>Loading...</p>}>
					<TableChucVu data={positionData.data} />
				</Suspense>
			</div>
		</div>
	);
};

export default ChucVu;
