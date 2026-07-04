import type React from "react";
import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
	title: string | React.ReactNode;
	className?: string;
}>;

export default function Card({ title, children, className }: CardProps) {
	return (
		<div className={`card shadow-lg m-4 ${className}`}>
			<div className="card-body">
				<h2 className="card-title">{title}</h2>
				{children}
			</div>
		</div>
	);
}