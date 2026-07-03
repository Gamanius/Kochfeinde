import { Link } from "@tanstack/react-router";
import Logo from "./Logo"
import { Sun, Moon, Monitor } from 'lucide-react';

export default function Header() {
    return <>
        <header className="grid grid-cols-[1fr_min-content_1fr] justify-center p-2 bg-base-200 border-b border-b-base-300 gap-2 items-center">
            <span className="flex">
                <Link to="/" className="font-bold flex justify-center">
                <Logo/>
                    Kochfeinde
                </Link>
            </span>
        </header>
    </>
}