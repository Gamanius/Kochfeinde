import { Link } from "@tanstack/react-router";
import Logo from "./Logo"
import { Sun, Moon, Monitor, User, UserCog, LogOut, LogIn } from 'lucide-react';
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

            <span className="justify-self-end">
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

            <ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
            popover="auto" id="header-user" style={{ positionAnchor: "--header-user" } /* as React.CSSProperties */ }>
                <li><Link to="/profile"> <UserCog/> Einstellungen</Link></li>
                <li><button onClick={() => mut.mutate()}> <LogOut/> Ausloggen</button></li>
            </ul>
        </header>
    </>
}