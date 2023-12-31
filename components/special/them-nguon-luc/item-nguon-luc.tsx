import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';

const ItemNguonLuc = (props: Partial<IResource & IResourceProject>) => {
	const { name, id, amount = 0 } = props;

	const useFormContextReturn = useFormContext();

	return (
		<div className="flex items-center gap-4 my-4">
			<Checkbox
				disabled={amount === 0 || !props.isActive}
				id={id}
				onCheckedChange={(checked) => {
					if (checked) {
						useFormContextReturn.setValue(`${id}.number`, amount);
					} else {
						useFormContextReturn.setValue(`${id}.number`, undefined);
					}
					useFormContextReturn.setValue(`${id}.active`, checked);
				}}
				checked={!!useFormContextReturn.watch(`${id}.active`)}
			/>
			<div className="flex gap-2 items-center justify-between w-full">
				<Label htmlFor={id} className="mb-0">
					{name}{' '}
					{amount === 0 ? (
						' - hết hàng'
					) : !props.isActive ? (
						<>
							- <span className="text-destructive">tạm dừng sử dụng</span>
						</>
					) : (
						''
					)}
				</Label>
				<Input
					{...useFormContextReturn.register(`${id}.number`, {
						valueAsNumber: true,
						onChange: (e) => {
							if (!useFormContextReturn.getValues(`${id}.active`)) {
								useFormContextReturn.setValue(`${id}.active`, true);
							}
							const stripValue = e.target.value.replaceAll(/-/g, '');
							if (parseInt(stripValue) > amount) {
								useFormContextReturn.setValue(`${id}.number`, amount);
							} else {
								useFormContextReturn.setValue(
									`${id}.number`,
									parseInt(stripValue) || 1
								);
							}
						},
					})}
					value={useFormContextReturn.watch(`${id}.number`)}
					placeholder="số lượng"
					type="number"
					className="inline-block basis-[100px] mr-2 h-[30px] text-[13px]"
					disabled={amount === 0 || !props.isActive}
				/>
			</div>
		</div>
	);
};

export default ItemNguonLuc;
