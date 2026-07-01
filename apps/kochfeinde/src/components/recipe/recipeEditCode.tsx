import { useCallback, useState } from 'react';
import CodeMirror, { keymap, Prec } from '@uiw/react-codemirror';
import { autocompletion } from "@codemirror/autocomplete";
import type {CompletionResult, CompletionContext } from "@codemirror/autocomplete";
import type { KeyBinding } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import markdownit from 'markdown-it'
import DOMPurify from 'dompurify';
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "#/query/trcp";
import { useDebouncedCallback } from "use-debounce";
import { parseIngredient } from '@kochfeinde/shared';

const boldKeymap: KeyBinding = {
    key: "Ctrl-b",
    run: (view) => {
        const { state, dispatch } = view;
        const { from, to } = state.selection.main;
        const selected = state.sliceDoc(from, to);
        dispatch({
            changes: { from, to, insert: `**${selected || ""}**` },
            selection: { anchor: from + 2, head: from + 2 + selected.length },
        });
        return true;
    },
};

const italicKeymap: KeyBinding = {
    key: "Ctrl-i",
    run: (view) => {
        const { state, dispatch } = view;
        const { from, to } = state.selection.main;
        const selected = state.sliceDoc(from, to);
        dispatch({
            changes: { from, to, insert: `*${selected || ""}*` },
            selection: { anchor: from + 1, head: from + 1 + selected.length },
        });
        return true;
    },
};

const linkKeymap: KeyBinding = {
    key: "Ctrl-k",
    run: (view) => {
        const { state, dispatch } = view;
        const pos = state.selection.main.head;
        dispatch({
            changes: { from: pos, insert: "[](url)" },
            selection: { anchor: pos + 1, head: pos + 1 },
        });
        return true;
    },
};

export default function RecipeEditCode({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const trpc = useTRPC();
    const query = useQueryClient();
    const md = markdownit();

    const debouncedFetch = useDebouncedCallback(
        () => query.fetchQuery(trpc.ingredient.list.queryOptions()),
        250,
    );

    const completionSource = useCallback(async (context: CompletionContext): Promise<CompletionResult | null> => {
        const word = context.matchBefore(/[\w]*$/);
        if (!word || (word.from === word.to && !context.explicit)) return null;
        try {
            const ingredients = await debouncedFetch() ?? [];
            const filtered = ingredients.filter((i) =>
                i.name.toLowerCase().includes(word.text.toLowerCase()),
            );
            return {
                from: word.from,
                options: filtered.map((i) => ({
                    label: `[${i.name}](/ingredient/${i.slug})`,
                    detail: i.slug,
                    type: "keyword",
                })),
            };
        } catch {
            return null;
        }
    }, [debouncedFetch]);

    const parsedingredients = parseIngredient(value)

    const handleChange = useCallback((val: string) => {
        onChange(val);
    }, [onChange]);

    return (
        <div className='grid grid-cols-2 gap-2'>
            <div>
            <CodeMirror
                value={value}
                theme={"dark"}
                onChange={handleChange}
                extensions={[
                    autocompletion({ override: [completionSource] }),
                    markdown({ base: markdownLanguage }),
                    Prec.highest(
                        keymap.of([boldKeymap, italicKeymap, linkKeymap])
                    ),
                ]}
            />
            <h4>
                Gefundene Zutaten:
            </h4>
            <ul>
                {parsedingredients.map(i => (
                    <li>
                        {i.quantity} {i.unit} ingredient/{i.ingredient_slug}
                    </li>
                ))}
            </ul>

            </div>

            <article
                className='prose border-l border-base-300 pl-4'
                dangerouslySetInnerHTML={{ __html: (md.render(value)) }}
            />
        </div>
    );
}
