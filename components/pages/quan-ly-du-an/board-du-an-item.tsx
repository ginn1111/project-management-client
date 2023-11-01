import IconClock from '@/components/Icon/IconClock';
import IconEllipsis from '@/components/Icon/IconEllipsis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ModalConfirm from '@/components/ui/modal/modal-confirm';
import useModal from '@/hooks/useModal';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { AlertCircle } from 'lucide-react';
import ModalChiTietCongViec from './modal-du-an-item/modal-chi-tiet-cong-viec';
import ModalChinhSuaCongViec from './modal-du-an-item/modal-chinh-sua-cong-viec';
import ModalLichSu from './modal-du-an-item/modal-lich-su';
import ModalPhanQuyen from './modal-du-an-item/modal-phan-quyen';
import ModalThemNguonLuc from './modal-du-an-item/modal-them-nguon-luc';

dayjs.extend(duration);

const LABEL_COLOR = {
	progress: 'bg-secondary2',
	done: 'bg-success',
	failed: 'bg-danger',
} as const;

const LABEL: { [k in keyof typeof LABEL_COLOR]: string } = {
	progress: 'Đang thực hiện',
	done: 'Đã hoàn thành',
	failed: 'Quá hạn',
};

const BoardDuAnItem = (props: ITaskOfWork) => {
	const { note, finishDateET, task } = props;
	const { name } = task ?? {};
	const {
		modal: modalState,
		handleCloseModal,
		handleOpenModal,
	} = useModal({
		modalCS: { open: false },
		modalLS: { open: false },
		modalPQ: { open: false },
		modalCT: { open: false },
		modalDone: { open: false },
		modalNL: { open: false },
	});

	const duration = dayjs.duration(dayjs(finishDateET).diff(dayjs()));
	const _duration = {
		day: duration.days(),
		month: duration.months(),
		year: duration.years(),
		hour: duration.hours(),
	};

	return (
		<li className="w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light p-5 justify-start">
			<div className="flex justify-between mb-5 items-center">
				<h6 className="text-black font-semibold text-base dark:text-white-light">
					{name}
				</h6>
				{/* <span
					className={cn(
						'uppercase badge bg-primary/10 py-1.5',
						LABEL_COLOR[status]
					)}
				>
					{LABEL[status]}
				</span> */}
			</div>
			<p>{note}</p>
			<div className="flex items-center justify-between mt-3">
				<div className="flex items-center rounded-full bg-danger/20 px-2 py-1 text-xs font-semibold text-danger w-max">
					<IconClock className="w-3 h-3 mr-1" />
					{_duration.year ? _duration.year + 'năm' : null}{' '}
					{_duration.month ? _duration.month + 'tháng' : null}{' '}
					{_duration.day ? _duration.day + 'ngày' : null}{' '}
					{_duration.hour ? _duration.hour + 'giờ' : null} {' còn lại'}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="outline" size="sm">
							<IconEllipsis />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => handleOpenModal('modalDone')}>
							Hoàn thành
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenModal('modalCS')}>
							Chỉnh sửa
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenModal('modalCT')}>
							Chi tiết
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenModal('modalPQ')}>
							Phân quyền
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenModal('modalNL')}>
							Thêm nguồn lực
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenModal('modalLS')}>
							Lịch sử
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<ModalPhanQuyen
				data={{}}
				open={modalState.modalPQ.open}
				title="Phân quyền"
				onClose={() => handleCloseModal('modalPQ')}
			/>
			<ModalChinhSuaCongViec
				data={{}}
				open={modalState.modalCS.open}
				title="Chỉnh sửa công việc"
				onClose={() => handleCloseModal('modalCS')}
			/>
			<ModalChiTietCongViec
				data={{}}
				open={modalState.modalCT.open}
				title="Khảo sát dự án 1"
				onClose={() => handleCloseModal('modalCT')}
			/>
			<ModalLichSu
				data={{}}
				open={modalState.modalLS.open}
				title="Lịch sử"
				onClose={() => handleCloseModal('modalLS')}
			/>
			<ModalConfirm
				variant="default"
				msgCTA="Xác nhận hoàn thành"
				title="Bạn chắc chắn muốn hoàn thành?"
				message={
					<Alert className="border-warning text-warning">
						<AlertCircle color="#fbbf24" className="w-4 h-4" />
						<AlertTitle>Warning</AlertTitle>
						<AlertDescription>
							Sau khi hoàn thành, bạn sẽ không được chỉnh sửa!
						</AlertDescription>
					</Alert>
				}
				open={modalState.modalDone.open}
				onAccept={() => alert('Done task')}
				onClose={() => handleCloseModal('modalDone')}
			/>
			<ModalThemNguonLuc
				open={modalState.modalNL.open}
				onClose={() => handleCloseModal('modalNL')}
				title="Thêm nguồn lực cho công việc"
			/>
		</li>
	);
};

export default BoardDuAnItem;
