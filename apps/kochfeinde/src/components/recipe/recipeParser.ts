import MarkdownIt from "markdown-it";
import sanitizeHtml from 'sanitize-html';

function addCheckboxes(html: string): string {
    return html
    .replace(/<li>(.*)<\/li>/g, "<li><span>$1</span></li>")
    .replace(/<li>\s*/g, '<li><input type="checkbox"> ')
}

function scaleNumbers(md: string, scale: number) : string {
    return md.replace(/(\d+[.,]\d+|\d+)(?!\d*[.,]\d*!|\d*!)/gm, e => {
        return `${String(parseFloat(e.replace(",", ".")) * scale)}`
    }).replace(/(\d+[.,]\d+|\d+)!/gm, e => {
        return e.slice(0, -1)
    })
}

export function renderRecipe(input: string, scale: number = 1 ) : string {
    const md = MarkdownIt();

    return addCheckboxes(sanitizeHtml(md.render(scaleNumbers(input, scale))))
}