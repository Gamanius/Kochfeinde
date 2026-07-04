import MarkdownIt from "markdown-it";
import sanitizeHtml from 'sanitize-html';

function addCheckboxes(html: string): string {
    return html
    .replace(/<li>(.*)<\/li>/g, "<li><span>$1</span></li>")
    .replace(/<li>\s*/g, '<li><input type="checkbox"> ')
}

export function renderRecipe(input: string) : string {
    const md = MarkdownIt();

    return addCheckboxes(sanitizeHtml(md.render(input)))
}