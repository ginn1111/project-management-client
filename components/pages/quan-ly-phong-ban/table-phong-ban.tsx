'use client';

import IconEllipsis from '@/components/Icon/IconEllipsis';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ModalConfirm from '@/components/ui/modal/modal-confirm';
import useModal from '@/hooks/useModal';
import useQueryParams from '@/hooks/useQueryParams';
import { DataTable } from 'mantine-datatable';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import ModalThemPhongBan from './modal/modal-them-phong-ban';
import { DepartmentServices } from '@/lib';

interface ITablePhongBan {
  data: { departments: IDepartment[]; totalItems: number };
}

const TablePhongBan = (props: ITablePhongBan) => {
  const router = useRouter();
  const { data } = props;
  const { handlePush, searchParams } = useQueryParams({
    initSearchParams: { page: 1, limit: 10, search: '' },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (id: string) => DepartmentServices.remove(id),
  });

  const { modal, handleOpenModal, handleCloseModal } = useModal({
    modalCHV: { open: false, position: {} },
    modalRM: { open: false, id: '' },
  });

  const columns = [
    {
      accessor: 'name',
      title: 'Tên phòng ban',
    },
    {
      accessor: 'note',
      title: 'Ghi chú',
    },
    {
      accessor: '',
      width: 70,
      render: (row: IPosition) => (
        <DropdownMenu modal>
          <DropdownMenuTrigger>
            <IconEllipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="-translate-x-[10px]">
            <DropdownMenuItem
              onClick={() => handleOpenModal('modalCHV', { position: row })}
            >
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleOpenModal('modalRM', { id: row?.id })}
              className="text-danger hover:!text-danger"
            >
              Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="datatables">
        <DataTable
          noRecordsText="Không có dữ liệu"
          highlightOnHover
          className="table-hover whitespace-nowrap"
          records={data.departments}
          columns={columns}
          totalRecords={data.totalItems}
          recordsPerPage={parseInt(searchParams.limit)}
          page={parseInt(searchParams.page)}
          onPageChange={(p) => {
            handlePush({ page: p });
          }}
          recordsPerPageOptions={[10, 20, 30, 50, 100]}
          onRecordsPerPageChange={(limit) => {
            handlePush({ limit, page: 1 });
          }}
          minHeight={200}
          paginationText={({ from, to, totalRecords }) =>
            `Từ ${from} đến ${to} của ${totalRecords}`
          }
        />
      </div>
      <ModalConfirm
        loading={isLoading}
        title="Xoá phòng ban"
        message="Bạn có muốn xoá phòng ban này?"
        onAccept={() => {
          mutate(modal.modalRM.id);
          handleCloseModal('modalRM');
          toast.success('Xoá phòng ban thành công');
          router.refresh();
        }}
        onClose={() => handleCloseModal('modalRM')}
        open={modal.modalRM.open}
      />
      <ModalThemPhongBan
        open={modal.modalCHV.open}
        data={modal.modalCHV.position}
        onClose={() => handleCloseModal('modalCHV')}
        title="Sửa phòng ban"
        onRefresh={() => router.refresh()}
        isEdit
      />
    </>
  );
};

export default TablePhongBan;
