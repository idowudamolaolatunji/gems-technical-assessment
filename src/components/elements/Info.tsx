import React from 'react';
import { AiFillInfoCircle } from "react-icons/ai";

interface Props {
	text?: string | React.ReactNode;
	showIcon?: boolean;
}

export default function Info({ text, showIcon = true }: Props) {
	return (
		<span className="info--item">
			{showIcon && <AiFillInfoCircle />}
			<p>{text}</p>
		</span>
	);
}
