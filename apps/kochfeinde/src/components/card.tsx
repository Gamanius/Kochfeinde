import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
	title: string;
}>;

export default function Card({ title, children }: CardProps) {
	return (
		<div className="card shadow-lg m-4">
			<div className="card-body">
				<h2 className="card-title">{title}</h2>
				{children}
			</div>
		</div>
	);
}