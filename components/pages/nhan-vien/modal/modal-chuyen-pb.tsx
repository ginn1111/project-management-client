import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Modal, { IModalProps } from '@/components/ui/modal';
import ReactSelect from '@/components/ui/react-select';
import { DepartmentServices } from '@/lib';
import { AxiosError } from 'axios';
import { isNull } from 'lodash';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';

const ModalChuyenPB = (
	props: Omit<IModalProps<Partial<IEmployee>>, 'children'>
) => {
	const { data, onRefresh, ...rest } = props;
	const { control, setValue, watch, reset, getValues, handleSubmit } =
		useForm();

	const { mutate, isLoading } = useMutation({
		mutationFn: ({
			idDepartment,
			idEmployee,
			data,
		}: {
			idDepartment: string;
			idEmployee: string;
			data: Partial<
				Omit<IEmployeesOfDepartment, 'department'> & { idOld: string }
			>;
		}) => DepartmentServices.addToEmployee(idDepartment, idEmployee, data),
		onSuccess: () => {
			toast.success('Thêm nhân viên vào phòng ban thành công');
			onRefresh?.();
		},
		onError: (error: AxiosError) => {
			toast.error(error.response?.data as string);
		},
		onSettled: () => {
			rest.onClose();
		},
	});

	const {
		data: departmentData,
		isFetching,
		refetch,
	} = useQuery({
		queryFn: () => DepartmentServices.getList(''),
		queryKey: ['department/get-list'],
		enabled: false,
	});

	const nowDepartment = data?.departments?.find((department) =>
		isNull(department.endDate)
	);

	useEffect(() => {
		if (rest.open) {
			refetch();

			setValue('nowDepartment', nowDepartment?.department?.id);
		} else {
			reset();
		}
	}, [rest.open]);

	const handleSuccess = () => {
		if (!data?.id) {
			toast.error('Mã nhân viên không tồn tại!');
			return;
		}
		const idDepartment = getValues('newDepartment');
		const idEmployee = data?.id!;
		const idOld = nowDepartment?.id;

		mutate({ idDepartment, idEmployee, data: { idOld } });
	};

	return (
		<Modal {...rest} loading={isFetching || isLoading}>
			<form
				className="flex flex-col gap-4 min-h-[300px]"
				onSubmit={handleSubmit(handleSuccess)}
			>
				{nowDepartment ? (
					<ReactSelect
						control={control}
						labelProps={{ required: true }}
						title="Phòng ban hiện tại"
						name="nowDepartment"
						options={[
							{
								value: nowDepartment?.department.id,
								label: nowDepartment?.department.name,
							},
						]}
					/>
				) : (
					<Alert className="text-info border-info bg-info-light">
						<AlertTitle className="flex items-center gap-2">
							<AlertCircle className="w-4 h-4" />
							Info
						</AlertTitle>
						<AlertDescription>Nhân viên chưa vào phòng ban!</AlertDescription>
					</Alert>
				)}
				<ReactSelect
					control={control}
					labelProps={{ required: true }}
					title={
						data?.departments?.length
							? 'Phòng ban được chuyển đến'
							: 'Phòng ban'
					}
					name="newDepartment"
					options={
						departmentData?.data?.departments
							?.filter(
								({ id }: { id: string }) => watch('nowDepartment') !== id
							)
							?.map(({ id, name }: IDepartment) => ({
								label: name,
								value: id,
							})) ?? []
					}
					placeholder="phòng ban mới"
				/>

				<div className="flex items-center justify-end gap-4 mt-auto">
					<Button onClick={rest.onClose} variant="outline">
						Đóng
					</Button>
					<Button>Xác nhận</Button>
				</div>
			</form>
		</Modal>
	);
};

export default ModalChuyenPB;
