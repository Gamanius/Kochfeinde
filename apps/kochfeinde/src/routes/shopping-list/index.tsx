import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTRPC } from '#/query/trcp'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import { parseIngredient } from '@kochfeinde/shared'
import { scaleNumbers } from '#/components/recipe/recipeParser'
import { Confetti  } from '#/components/list/confetti'
import type {ConfettiRef} from '#/components/list/confetti';

export const Route = createFileRoute('/shopping-list/')({
  validateSearch: (search: Record<string, string | undefined>) => ({
    r: search.r ?? '',
    m: search.m ?? '',
  }),
  ssr: false,
  component: RouteComponent,
})

function decodeBitmask(hex: string, length: number): boolean[] {
  if (!hex) return Array(length).fill(false)
  try {
    const bin = BigInt(`0x${hex}`).toString(2)
    // LSB (rightmost) = ingredient 0, so reverse
    const bits = bin.split('').reverse()
    return Array.from({ length }, (_, i) => bits[i] === '1')
  } catch {
    return Array(length).fill(false)
  }
}

function encodeBitmask(checked: boolean[]): string {
  if (checked.every(c => !c)) return ''
  // Reverse so LSB = ingredient 0
  let bits = checked.map(c => c ? '1' : '0').reverse().join('')
  // Trim leading zeros
  bits = bits.replace(/^0+/, '')
  if (bits.length === 0) return ''
  return BigInt(`0b${bits}`).toString(16)
}

function formatQuantity(qty: number | null): string {
  if (qty === null) return ''
  // Round to 2 decimal places, remove trailing zeros
  return qty % 1 === 0 ? qty.toString() : qty.toFixed(2).replace(/\.?0+$/, '')
}

const UNIT_LABELS: Record<string, string> = {
  LITER: 'l',
  GRAMM: 'g',
  PIECE: '',
}

function RouteComponent() {
    const { r: urlR, m: urlM } = Route.useSearch()
    const navigate = useNavigate()

    // Restore from localStorage when URL has no params
    const restoredR = !urlR ? localStorage.getItem('kochfeinde_shopping_r') || '' : ''
    const restoredM = !urlM ? localStorage.getItem('kochfeinde_shopping_m') || '' : ''

    const r = urlR || restoredR
    const m = urlM || restoredM

    // Redirect to restored URL on first render if needed
    useEffect(() => {
        if (restoredR) {
            navigate({
                to: '/shopping-list',
                search: { r: restoredR, m: restoredM },
                replace: true,
                resetScroll: false,
            })
        }
    }, [])

    const slugEntries = r ? r.split(',').filter(Boolean).map(part => {
        const [slug, amountStr] = part.split(':')
        return { slug, amount: amountStr ? parseInt(amountStr, 10) : 4 }
    }) : []

    // Save r and m to localStorage whenever they change
    useEffect(() => {
        if (r) localStorage.setItem('kochfeinde_shopping_r', r)
        else localStorage.removeItem('kochfeinde_shopping_r')
        if (m) localStorage.setItem('kochfeinde_shopping_m', m)
        else localStorage.removeItem('kochfeinde_shopping_m')
    }, [r, m])

    
    const trpc = useTRPC()
    
    const recipeQueries = useSuspenseQueries({
        queries: slugEntries.map(e => ({
            ...trpc.recipe.get.queryOptions({slug: e.slug})
        })),
    })

    const ings = parseIngredient(recipeQueries.reduce(
        (acc, curr, i) => acc + scaleNumbers(curr.data.markdown, slugEntries[i].amount/curr.data.portion_num),
        ""
    ))

    const checked = useMemo(() => decodeBitmask(m, ings.length), [m, ings.length])

    const confettiRef = useRef<ConfettiRef>(null)
    useEffect(() => {
        if (checked.every(a => a)) {
            const bursts = [
                { origin: { x: 0.5, y: 0.8 }, spread: 60, particleCount: 80 },
                { origin: { x: 0, y: 0.9 }, spread: 40, angle: 60, particleCount: 50 },
                { origin: { x: 0, y: 0.7 }, spread: 30, angle: 70, particleCount: 40 },
                { origin: { x: 1, y: 0.9 }, spread: 40, angle: 120, particleCount: 50 },
                { origin: { x: 1, y: 0.7 }, spread: 30, angle: 110, particleCount: 40 },
                { origin: { x: 0.5, y: 1 }, spread: 80, particleCount: 50 },
                { origin: { x: 0.5, y: 0.3 }, spread: 120, particleCount: 60 },
            ]
            bursts.forEach(b => confettiRef.current?.fire(b))
        }
    }, [confettiRef, checked])
    
    function toggleItem(index: number) {
        const newChecked = [...checked]
        newChecked[index] = !newChecked[index]
        const newM = encodeBitmask(newChecked)
        navigate({
            to: '/shopping-list',
            search: { r: r || '', m: newM || '0' },
            replace: true,
            resetScroll: false,
        })
    }

    return (
        <div className='flex justify-center min-w-full'>
            <div className="mx-4  p-10 max-w-4xl w-full shadow-2xl ">
                <div className='border-b mb-4'>
                    <h1>
                        Zutaten
                    </h1>
                    <div className='flex flex-wrap gap-2 mb-2'>
                        {recipeQueries.map((e, i) => {
                            return <span key={e.data.slug} className='flex h-auto badge badge-primary badge-lg'>
                                {e.data.name} ({slugEntries[i].amount} {e.data.portion_string})
                            </span>
                        })}
                    </div>
                </div>
                <ul className='space-y-2'>
                    {ings.map((e, i) => (
                        <li key={i} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-base-200 transition-colors ${checked[i] ? 'opacity-40 line-through' : ''}`}
                            onClick={() => toggleItem(i)}>
                            <input className={`checkbox`} type='checkbox' checked={checked[i]} readOnly>
                            </input>
                            <span className='flex-1'>{e.name}</span>
                            <span className='text-sm opacity-60'>{formatQuantity(e.quantity)}{UNIT_LABELS[e.unit] ? ` ${UNIT_LABELS[e.unit]}` : ''}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Confetti 
                manualstart={true}
                ref={confettiRef}
                className="absolute top-0 left-0 -z-1 size-full"/>
        </div>
    )
}
