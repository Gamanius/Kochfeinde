import { Link } from "@tanstack/react-router";
import Logo from "./Logo"
import { Sun, Moon, User, UserCog, LogOut, LogIn, SunMoon, MonitorCog, List } from 'lucide-react';
import { useTRPC } from "#/query/trcp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ListDropdown from "./list/listDropdown";
import { useRecipeListStore } from "./list/listContext";

export default function Header() {
    const trpc = useTRPC()
    const query = useQueryClient()
    const user = useQuery(trpc.auth.get.queryOptions())
    const mut = useMutation(trpc.auth.logout.mutationOptions({
        onSettled: () => {
            query.invalidateQueries(trpc.auth.get.queryOptions())
        }
    }));

    const amount = useRecipeListStore((s) => Object.keys(s.list).length)
    const restoredR = localStorage.getItem('kochfeinde_shopping_r')


    return <>
        <header className="grid grid-cols-[min-content_1fr] justify-center p-2 bg-base-200 border-b border-b-base-300 gap-2 items-center">
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

                {amount === 0 && restoredR === null ||
                <div className="indicator mr-2">
                    {amount === 0 ||
                    <span className="indicator-item badge badge-sm mr-1 mt-1 badge-primary">{amount}</span>
                    }
                    <button className="btn btn-square btn-ghost" popoverTarget="recipe-list" style={{anchorName: "--recipe-list"}}>
                        <List></List>
                    </button>
                </div>
                }

                {user.data === null || user.data === undefined ? <>
                <div className="hover:aura hover:aura-rainbow p-0.5">
                    {user.isLoading ? <span className="loading loading-infinity btn btn-disabled"></span> : 
                    <Link to="/login" className="btn btn-ghost btn-square bg-base-100">
                        <LogIn />
                    </Link>
                    }
                </div>
                </> : <>
                    <button className="btn btn-ghost sm:btn" popoverTarget="header-user" style={{ anchorName: "--header-user" } /* as React.CSSProperties */}>
                        <User/> <span className="hidden sm:inline">{user.data.displayname}</span>
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
            
            {
                amount === 0 && restoredR === null ||
                <ListDropdown/>
            }
        </header>
    </>
}