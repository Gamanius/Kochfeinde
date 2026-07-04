import { Link } from "@tanstack/react-router";
import Logo from "./Logo"
import { Sun, Moon, Monitor, User, UserCog, LogOut, LogIn, SunMoon, SunIcon, MonitorCog } from 'lucide-react';
import { useTRPC } from "#/query/trcp";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export default function Header() {
    const trpc = useTRPC()
    const query = useQueryClient()
    const {data: user} = useSuspenseQuery(trpc.auth.get.queryOptions())
    const mut = useMutation(trpc.auth.logout.mutationOptions({
        onSettled: () => {
            query.invalidateQueries(trpc.auth.get.queryOptions())
        }
    }));

    return <>
        <header className="grid grid-cols-[1fr_1fr] justify-center p-2 bg-base-200 border-b border-b-base-300 gap-2 items-center">
            <span className="flex">
                <Link to="/" className="font-bold flex justify-center items-center">
                <Logo/>
                <h1>
                    Kochfeinde
                </h1>
                </Link>
            </span>

            <span className="flex w-full justify-end">
                <button className="btn btn-ghost btn-square mr-2" popoverTarget="theme-selector" style={{anchorName: "--theme-selector"}}>
                    <SunMoon />
                </button>

                {user === null ? <>
                <div className="hover:aura hover:aura-rainbow p-0.5">
                    <Link to="/login" className="btn btn-ghost btn-square bg-base-100">
                        <LogIn />
                    </Link>
                </div>
                </> : <>
                    <button className="btn" popoverTarget="header-user" style={{ anchorName: "--header-user" } /* as React.CSSProperties */}>
                        <User/> {user.displayname}
                    </button>
                </>}
            </span>

            <ul className="dropdown dropdown-end menu w-40 rounded-box bg-base-100 shadow-sm" 
            popover="auto" id="theme-selector" style={{ positionAnchor: "--theme-selector" } /* as React.CSSProperties */ }>
                <style>{`
                .theme-option:has(.theme-controller:checked) {
                    background-color: var(--color-primary);
                    color: var(--color-primary-content);
                }
                `}</style>
                <li>
                <label className="theme-option btn btn-sm btn-block btn-ghost justify-start">
                    <input type="radio" name="theme-dropdown" className="theme-controller hidden" aria-label="Default" value="default" />
                    <MonitorCog size={16} /> Default
                </label>
                </li>
                <li>
                <label className="theme-option btn btn-sm btn-block btn-ghost justify-start">
                    <input type="radio" name="theme-dropdown" className="theme-controller hidden" aria-label="Light" value="light" />
                    <Sun size={16} /> Light
                </label>
                </li>
                <li>
                <label className="theme-option btn btn-sm btn-block btn-ghost justify-start">
                    <input type="radio" name="theme-dropdown" className="theme-controller hidden" aria-label="Dark" value="dark" />
                    <Moon size={16} /> Dark
                </label>
                </li>
            </ul>

            <ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
            popover="auto" id="header-user" style={{ positionAnchor: "--header-user" } /* as React.CSSProperties */ }>
                <li><Link to="/profile"> <UserCog/> Einstellungen</Link></li>
                <li><button onClick={() => mut.mutate()}> <LogOut/> Ausloggen</button></li>
            </ul>
        </header>
    </>
}