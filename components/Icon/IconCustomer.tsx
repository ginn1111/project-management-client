import { FC } from 'react';

interface IconCustomerProps {
	className?: string;
}

const IConCustomer: FC<IconCustomerProps> = ({ className }) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle opacity="0.5" cx="15" cy="6" r="3" fill="#1C274C" />
			<ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="#1C274C" />
			<circle cx="9.00098" cy="6" r="4" fill="#1C274C" />
			<ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="#1C274C" />
		</svg>
	);
};

export default IConCustomer;
