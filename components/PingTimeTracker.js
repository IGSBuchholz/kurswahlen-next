// PingTimeTracker [v1.0.0]

import React, { useState, useMemo, forwardRef } from 'react'
import * as HoverCardPrimitives from '@radix-ui/react-hover-card'
import dayjs from 'dayjs'

const RESOLUTIONS = ['12h', '1h', '1m']

function getBinStart(time, resolution) {
    switch (resolution) {
        case '12h': {
            const hour = time.hour()
            const binHour = hour < 12 ? 0 : 12
            return time.hour(binHour).minute(0).second(0).millisecond(0)
        }
        case '1h':
            return time.minute(0).second(0).millisecond(0)
        case '1m':
            return time.second(0).millisecond(0)
        default:
            return time
    }
}

function Block({ color, tooltip, hoverEffect, onClick }) {
    const [open, setOpen] = useState(false)
    return (
        <HoverCardPrimitives.Root
            open={open}
            onOpenChange={setOpen}
            openDelay={0}
            closeDelay={0}
            tremor-id="tremor-raw"
        >
            <HoverCardPrimitives.Trigger asChild>
                <div
                    onClick={() => {
                        onClick && onClick()
                        setOpen(true)
                    }}
                    className="size-full overflow-hidden px-[0.5px] transition first:rounded-l-[4px] first:pl-0 last:rounded-r-[4px] last:pr-0 sm:px-px cursor-pointer"
                >
                    <div
                        className={
                            'size-full rounded-[1px] ' +
                            color + hoverEffect ? ' hover:opacity-50' : ''
                        }
                    />
                </div>
            </HoverCardPrimitives.Trigger>
            <HoverCardPrimitives.Portal>
                <HoverCardPrimitives.Content
                    sideOffset={10}
                    side="top"
                    align="center"
                    avoidCollisions
                    className={
                        'w-auto rounded-md px-2 py-1 text-sm shadow-md ' +
                        'text-white dark:text-gray-900 ' +
                        'bg-gray-900 dark:bg-gray-50'
                    }
                >
                    {tooltip}
                </HoverCardPrimitives.Content>
            </HoverCardPrimitives.Portal>
        </HoverCardPrimitives.Root>
    )
}

const Tracker = forwardRef(({ data = [], hoverEffect, className, ...props }, ref) => {
    const [resolution, setResolution] = useState('12h')
    const [periodStart, setPeriodStart] = useState(null)

    const bins = useMemo(() => {
        const map = new Map()
        data.forEach(item => {
            const time = dayjs(item.addedAt)
            if (
                periodStart &&
                resolution !== '12h' &&
                !time.isBetween(
                    periodStart,
                    periodStart.add(resolution === '1h' ? 1 : 12, 'hour'),
                    null,
                    '[)'
                )
            ) return

            const binStart = getBinStart(time, resolution)
            const key = binStart.toISOString()
            const arr = map.get(key) || []
            arr.push(item)
            map.set(key, arr)
        })

        return Array.from(map.entries())
            .map(([iso, items]) => ({ start: dayjs(iso), items }))
            .sort((a, b) => a.start.valueOf() - b.start.valueOf())
    }, [data, periodStart, resolution])

    function handleBinClick(binStart) {
        const idx = RESOLUTIONS.indexOf(resolution)
        if (idx < RESOLUTIONS.length - 1) {
            setResolution(RESOLUTIONS[idx + 1])
            setPeriodStart(binStart)
        }
    }

    function handleBack() {
        const idx = RESOLUTIONS.indexOf(resolution)
        if (idx > 0) {
            const parentRes = RESOLUTIONS[idx - 1]
            setResolution(parentRes)
            if (parentRes === '12h') setPeriodStart(null)
            else if (parentRes === '1h' && periodStart)
                setPeriodStart(getBinStart(periodStart, '1h'))
        }
    }

    return (
        <div {...props} ref={ref}>
            {resolution !== '12h' && (
                <button
                    onClick={handleBack}
                    className="mb-2 px-2 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700"
                >
                    ← Back to {RESOLUTIONS[RESOLUTIONS.indexOf(resolution) - 1]} view
                </button>
            )}

            <div className={('group flex h-8 w-full items-center')}>
                {bins.map(({ start, items }) => {
                    const avgPing =
                        items.reduce((sum, cur) => sum + cur.entry.pingTimeMs, 0) /
                        items.length

                    let color = 'bg-green-500'
                    if (avgPing > 200) color = 'bg-red-500'
                    else if (avgPing > 50) color = 'bg-yellow-500'

                    return (
                        <Block
                            key={start.toISOString()}
                            color={color}
                            tooltip={`${start.format('YYYY-MM-DD HH:mm')} — ${items.length} pts, avg ${Math.round(
                                avgPing
                            )}ms`}
                            hoverEffect={hoverEffect}
                            onClick={() => handleBinClick(start)}
                        />
                    )
                })}
            </div>
        </div>
    )
})

Tracker.displayName = 'Tracker'

export { Tracker as PingTimeTracker }
