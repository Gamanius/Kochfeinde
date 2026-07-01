import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, redirect } from "@tanstack/react-router"
import Card from "../card"
import MarkdownIt from "markdown-it"
import DOMPurify from 'dompurify';

export default function RecipeSite({slug}:{slug:string}) {
    const trcp = useTRPC()
    const md = MarkdownIt();
    const res = useSuspenseQuery(trcp.recipe.get.queryOptions({slug}))

    return <article className="flex justify-center min-w-full">
        <div className="mx-4  p-10 min-w-96 shadow-2xl ">
            <div className="flex justify-between border-b pb-2">
                <h2 className="">
                    {res.data.name}
                </h2> 
                            <Link to="/recipe/$slug/edit" params={{slug: slug}} className="btn btn-medium">
                Edit
            </Link>
            </div>
            <div dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(md.render(res.data.markdown))
            }}></div>
        </div>
        {/* <Card title={res.data.name}>
            <Link to="/recipe/$slug/edit" params={{slug: slug}} className="btn btn-medium">
                Edit
            </Link>
            <div dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(md.render(res.data.markdown))
            }}>

            </div>
        </Card> */}
      
    </article>
}