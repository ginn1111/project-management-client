import * as yup from 'yup';

export const QualificationSchema = yup.object<any>({
  name: yup.string().required('Tên không được để trống'),
});
