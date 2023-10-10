import IconXCircle from '@/components/Icon/IconXCircle';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import Modal, { IModalProps } from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import dayjs from 'dayjs';

interface IModalDuAn<T> extends Omit<IModalProps, 'children'> {
  data: T;
}

const ModalChiTietCongViec = <T,>(props: IModalDuAn<T>) => {
  const { ...rest } = props;
  return (
    <Modal {...rest}>
      <div className="space-y-4">
        <div>
          <Label>Ngày hoàn thành</Label>
          <DatePicker />
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
          <Label>Mô tả</Label>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem
            nihil enim aut nobis fugit impedit a iste sit asperiores ipsa, porro
            facere consectetur debitis distinctio. Ab itaque deserunt sed odio?
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="bg-primary2-light text-primary2 max-w-max px-2 py-1 rounded-md outline-offset-2 outline outline-solid outline-primary2">
          Đang thực hiện
        </p>
        <Button variant="outline" onClick={rest.onClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default ModalChiTietCongViec;