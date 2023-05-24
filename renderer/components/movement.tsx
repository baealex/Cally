import { createStore } from 'badland'
import { useValue } from 'badland-react'
import { useEffect, useRef } from 'react'

interface MovementState {
    canMove: boolean
    left: number
    top: number
    onMove: (left: number, top: number) => void
    children?: React.ReactNode
}

export const Movement = ({
    canMove,
    left,
    top,
    onMove,
    children
}: MovementState) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            if (canMove) {
                let move = false
                let initX = 0
                let initY = 0

                const handleMouseDown = (e: MouseEvent) => {
                    move = true
                    initX = e.clientX - ref.current.offsetLeft
                    initY = e.clientY - ref.current.offsetTop
                }

                const handleMouseMove = (e: MouseEvent) => {
                    if (move) {
                        ref.current.style.cursor = 'grabbing'
                        const left = e.clientX - initX
                        const top = e.clientY - initY
                        if (left >= 0 && left <= window.innerWidth - ref.current.offsetWidth) {
                            ref.current.style.left = `${left}px`
                        }
                        if (top >= 0 && top <= window.innerHeight - ref.current.offsetHeight) {
                            ref.current.style.top = `${top}px`
                        }
                    }
                }

                const handleResize = () => {
                    if (ref.current.offsetLeft >= window.innerWidth - ref.current.offsetWidth) {
                        ref.current.style.left = `${window.innerWidth - ref.current.offsetWidth}px`
                    }
                    if (ref.current.offsetTop >= window.innerHeight - ref.current.offsetHeight) {
                        ref.current.style.top = `${window.innerHeight - ref.current.offsetHeight}px`
                    }
                }

                const handleMouseUp = () => {
                    move = false
                    onMove(ref.current.offsetLeft, ref.current.offsetTop)
                }

                ref.current.style.cursor = 'grab'
                ref.current.addEventListener('mousedown', handleMouseDown)
                window.addEventListener('mousemove', handleMouseMove)
                window.addEventListener('resize', handleResize)
                ref.current.addEventListener('mouseup', handleMouseUp)
                return () => {
                    ref.current.removeEventListener('mousedown', handleMouseDown)
                    window.removeEventListener('mousemove', handleMouseMove)
                    window.removeEventListener('resize', handleResize)
                    ref.current.removeEventListener('mouseup', handleMouseUp)
                }
            } else {
                ref.current.style.cursor = 'default'
                ref.current.style.left = `${left}px`
                ref.current.style.top = `${top}px`
            }
        }
    }, [ref, canMove])
    
    return (
        <>
            <div ref={ref} className="movement">
                {children}
            </div>
            <style jsx>{`
                .movement {
                    position: absolute;
                    border: ${canMove ? 'none' : 'none'};
                }
            `}</style>
        </>
    )
}