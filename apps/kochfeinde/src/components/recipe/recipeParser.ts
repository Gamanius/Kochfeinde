import MarkdownIt from "markdown-it";
import sanitizeHtml from 'sanitize-html';

function addCheckboxes(html: string): string {
    return html
    .replace(/<li>(.*)<\/li>/g, "<li><span>$1</span></li>")
    .replace(/<li>\s*/g, '<li><input type="checkbox"> ')
}

export function scaleNumbers(md: string, scale: number) : string {
    return md.replace(/(\d+[.,]\d+|\d+)(?!\d*[.,]\d*!|\d*!)/gm, e => {
        return `${String(parseFloat(e.replace(",", ".")) * scale)}`
    }).replace(/(\d+[.,]\d+|\d+)!/gm, e => {
        return e.slice(0, -1)
    })
}

/**
 * Strips brackets from custom ingredient patterns like `- 2.5 EL [Zucker]` that are
 * not followed by a link `(...)`, so they render as plain text instead of
 * literal brackets in the markdown output.
 */
function stripCustomIngredientBrackets(md: string): string {
    return md.replace(/^(-\s+\d*[,.]?\d*\s*[^\d\n]*)\s+\[([^\]]*)\](?!\s*\()/gm, "$1 $2")
}

export function renderRecipe(input: string, scale: number = 1 ) : string {
    const md = MarkdownIt();
    const preprocessed = stripCustomIngredientBrackets(scaleNumbers(input, scale))

    return addCheckboxes(sanitizeHtml(md.render(preprocessed)))
}