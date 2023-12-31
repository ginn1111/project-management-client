import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal, { IModalProps } from '@/components/ui/modal';
import Label from '@/components/ui/my-label';
import { Textarea } from '@/components/ui/textarea';
import { WorkProjectServices } from '@/lib';
import { betweenTime, getEmployeeFromProposePj } from '@/utils/helpers';
import { TaskSchema } from '@/yup-schema/task';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

interface IModalTaoCongViec
	extends Omit<IModalProps<Partial<IWorkProject | ITaskOfWork>>, 'children'> {
	open: boolean;
	title: ReactNode;
	onClose: () => void;
	isEdit?: boolean;
}

const ModalTaoCongViec = (props: IModalTaoCongViec) => {
	const { data, isEdit, ...rest } = props;
	const { data: session } = useSession();
	const params = useParams();
	const { user } = session ?? {};

	const form = useForm({
		resolver: yupResolver(
			TaskSchema(isEdit, (data as ITaskOfWork)?.finishDateETWork)
		) as any,
	});

	const { mutate: createTask, isLoading } = useMutation({
		mutationFn: WorkProjectServices.createTask,
		onSuccess: () => {
			toast.success(`${isEdit ? 'Chỉnh sửa' : 'Thêm'} công việc thành công`);
		},
		onError: (error: AxiosError) => {
			toast.error(error.response?.data as string);
		},
		onSettled: () => {
			rest.onClose();
			rest.onRefresh?.();
		},
	});

	const { mutate: updateTask, isLoading: updating } = useMutation({
		mutationFn: WorkProjectServices.updateTask,
		onSuccess: () => {
			toast.success(`${isEdit ? 'Chỉnh sửa' : 'Thêm'} công việc thành công`);
		},
		onError: (error: AxiosError) => {
			toast.error(error.response?.data as string);
		},
		onSettled: () => {
			rest.onClose();
			rest.onRefresh?.();
		},
	});

	useEffect(() => {
		if (rest.open && isEdit) {
			const resetData = {
				name: (data as ITaskOfWork)?.task.name,
				note: data?.note,
				startDate: dayjs(data?.startDate).isValid()
					? dayjs(data?.startDate).format('YYYY-MM-DDTHH:mm')
					: undefined,
				finishDateET: dayjs(data?.finishDateET).isValid()
					? dayjs(data?.finishDateET).format('YYYY-MM-DDTHH:mm')
					: undefined,
			};
			form.reset(resetData);
		} else {
			form.reset();
		}
	}, [rest.open]);

	const handleCheckValidDate = (startDate?: string, finishDateET?: string) => {
		const workTimes: [Dayjs, Dayjs] = [
			dayjs(data?.startDateWork),
			dayjs(data?.finishDateETWork),
		];
		const startDateChange = !dayjs(data?.startDate).isSame(startDate, 'm');
		const endDateChange = !dayjs(data?.finishDateET).isSame(finishDateET, 'm');

		const errorMsg1 = betweenTime(
			dayjs(startDate as any),
			workTimes,
			'm',
			'đầu việc'
		);

		const errorMsg2 = betweenTime(
			dayjs(finishDateET as any),
			workTimes,
			'm',
			'đầu việc',
			'kết thúc dự kiến'
		);

		if (startDateChange && errorMsg1) {
			toast.error(errorMsg1);
			return;
		}

		if (endDateChange && errorMsg2) {
			toast.error(errorMsg2);
			return;
		}

		return true;
	};

	const handleUpdate: SubmitErrorHandler<Partial<ITaskOfWork>> = (values) => {
		if (
			!handleCheckValidDate(values.startDate as any, values.finishDateET as any)
		) {
			return;
		}
		const payload = {
			...values,
			id: (data as ITaskOfWork)?.id,
			idProject: params.id,
		};
		// if (isEdit) {
		// 	delete payload.startDate;
		// 	delete payload.finishDateET;
		// }
		updateTask(payload as any);
	};

	const handleSuccess: SubmitHandler<Partial<ITaskOfWork>> = (values) => {
		if (
			!handleCheckValidDate(values.startDate as any, values.finishDateET as any)
		) {
			return;
		}
		const empOfWork = (data as IWorkProject)?.worksOfEmployee.find(
			(w) =>
				getEmployeeFromProposePj(w?.employee?.proposeProject)?.id ===
				user?.info.id
		);

		const payload = {
			id: data?.id,
			idProject: (data as IWorkProject)?.idProject,
			idEmployee: empOfWork?.employee?.id,
			...values,
		};

		createTask(payload);
	};

	const handleError: SubmitErrorHandler<Partial<ITaskOfWork>> = (errors) => {
		const keys = Object.keys(errors) as (keyof ITaskOfWork)[];
		toast.error(errors[keys[0]]?.message as ReactNode);
	};

	return (
		<Modal {...rest} loading={isLoading || updating}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(
					isEdit ? handleUpdate : handleSuccess,
					handleError
				)}
			>
				<div>
					<Label required>Tên công việc</Label>
					<Input {...form.register('name')} placeholder="tên công việc" />
				</div>
				<div>
					<Label required>Ngày bắt đầu</Label>
					<Input {...form.register('startDate')} type="datetime-local" />
				</div>
				<div>
					<Label required>Ngày hoàn thành dự kiến</Label>
					<Input {...form.register('finishDateET')} type="datetime-local" />
				</div>
				<div>
					<Label>Mô tả</Label>
					<Textarea {...form.register('note')} placeholder="Mô tả" rows={5} />
				</div>

				<div className="flex items-center justify-end gap-4 mt-4">
					<Button type="button" onClick={rest.onClose} variant="outline">
						Đóng
					</Button>
					<Button>Xác nhận</Button>
				</div>
			</form>
		</Modal>
	);
};

export default ModalTaoCongViec;
