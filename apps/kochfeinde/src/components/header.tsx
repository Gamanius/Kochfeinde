import { Link } from "@tanstack/react-router";
import { useBreadcrumbs } from "./breadcrumbs";

export default function Header() {
    const { crumbs } = useBreadcrumbs()

    return <>
        <header className="grid grid-cols-[1fr_min-content_1fr] justify-center p-2 bg-base-200 border-b border-b-base-300 gap-2 items-center">
            <Link to="/" className="font-bold">
                Kochfeinde
            </Link>
            {crumbs.length > 0 && (
                <div className="breadcrumbs text-sm">
                    <ul>
                        {crumbs.map((crumb, i) => (
                            <li key={i}>
                                {crumb.path && i < crumbs.length - 1 ? (
                                    <Link to={crumb.path}>{crumb.label}</Link>
                                ) : (
                                    <span>{crumb.label}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    </>
}