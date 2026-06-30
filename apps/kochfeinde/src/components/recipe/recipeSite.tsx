import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import Card from "../card"
import MarkdownIt from "markdown-it"
import DOMPurify from 'dompurify';

export default function RecipeSite({slug}:{slug:string}) {
    const trcp = useTRPC()
    const md = MarkdownIt();
    const res = useSuspenseQuery(trcp.recipe.get.queryOptions({slug}))

    return <article className="prose">
        <Card title={res.data.name}>
            <Link to="/recipe/$slug/edit" params={{slug: slug}} className="btn btn-medium">
                Edit
            </Link>
            <div dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(md.render(res.data.markdown))
            }}>

            </div>
        </Card>
      
    </article>
}