import { createStore } from 'badland'
import { useValue } from 'badland-react'
import { useEffect, useRef, useState } from 'react'

interface MovementState {
    canMove: boolean
    top: number | null
    left: number | null
    right: number | null
    bottom: number | null
    onMove: (directions: {
        top: number | null
        left: number | null
        right: number | null
        bottom: number | null
    }) => void
    children?: React.ReactNode
}

enum Position {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

export const Movement = ({
    canMove,
    top,
    left,
    right,
    bottom,
    onMove,
    children
}: MovementState) => {
    const ref = useRef<HTMLDivElement>(null)

    const position = useRef<Position>(Position.TOP_LEFT)

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

                        const centerX = ref.current.offsetLeft + ref.current.offsetWidth / 2
                        const centerY = ref.current.offsetTop + ref.current.offsetHeight / 2

                        if (centerX < window.innerWidth / 2) {
                            if (centerY < window.innerHeight / 2) {
                                position.current = Position.TOP_LEFT
                            } else {
                                position.current = Position.BOTTOM_LEFT
                            }
                        } else {
                            if (centerY < window.innerHeight / 2) {
                                position.current = Position.TOP_RIGHT
                            } else {
                                position.current = Position.BOTTOM_RIGHT
                            }
                        }

                        if (position.current === Position.TOP_LEFT ||
                            position.current === Position.BOTTOM_LEFT
                        ) {
                            if (e.clientX - initX >= 0) {
                                ref.current.style.left = `${e.clientX - initX}px`
                                ref.current.style.right = 'auto'
                            } else {
                                ref.current.style.left = '0px'
                                ref.current.style.right = 'auto'
                            }
                        }
                        if (position.current === Position.TOP_LEFT ||
                            position.current === Position.TOP_RIGHT) {
                            if (e.clientY - initY >= 0) {
                                ref.current.style.top = `${e.clientY - initY}px`
                                ref.current.style.bottom = 'auto'
                            } else {
                                ref.current.style.top = '0px'
                                ref.current.style.bottom = 'auto'
                            }
                        }
                        if (position.current === Position.BOTTOM_RIGHT ||
                            position.current === Position.TOP_RIGHT) {
                            if (window.innerWidth - e.clientX - ref.current.offsetWidth + initX > 0) {
                                ref.current.style.right = `${window.innerWidth - e.clientX - ref.current.offsetWidth + initX}px`
                                ref.current.style.left = 'auto'
                            } else {
                                ref.current.style.right = '0px'
                                ref.current.style.left = 'auto'
                            }
                        }
                        if (position.current === Position.BOTTOM_LEFT ||
                            position.current === Position.BOTTOM_RIGHT) {
                            if (window.innerHeight - e.clientY - ref.current.offsetHeight + initY > 0) {
                                ref.current.style.bottom = `${window.innerHeight - e.clientY - ref.current.offsetHeight + initY}px`
                                ref.current.style.top = 'auto'
                            } else {
                                ref.current.style.bottom = '0px'
                                ref.current.style.top = 'auto'
                            }
                        }
                    }
                }

                const handleMouseUp = () => {
                    move = false
                    onMove({
                        top: (
                            position.current === Position.TOP_LEFT ||
                            position.current === Position.TOP_RIGHT)
                            ? ref.current.offsetTop : null,
                        left: (
                            position.current === Position.TOP_LEFT ||
                            position.current === Position.BOTTOM_LEFT)
                            ? ref.current.offsetLeft : null,
                        right: (
                            position.current === Position.TOP_RIGHT ||
                            position.current === Position.BOTTOM_RIGHT)
                            ? window.innerWidth - ref.current.offsetLeft - ref.current.offsetWidth : null,
                        bottom: (
                            position.current === Position.BOTTOM_LEFT ||
                            position.current === Position.BOTTOM_RIGHT)
                            ? window.innerHeight - ref.current.offsetTop - ref.current.offsetHeight : null
                    })
                }

                const handleResize = () => {
                    const centerX = ref.current.offsetLeft + ref.current.offsetWidth / 2
                    const centerY = ref.current.offsetTop + ref.current.offsetHeight / 2

                    if (centerX < window.innerWidth / 2) {
                        if (centerY < window.innerHeight / 2) {
                            position.current = Position.TOP_LEFT
                        } else {
                            position.current = Position.BOTTOM_LEFT
                        }
                    } else {
                        if (centerY < window.innerHeight / 2) {
                            position.current = Position.TOP_RIGHT
                        } else {
                            position.current = Position.BOTTOM_RIGHT
                        }
                    }

                    onMove({
                        top: (
                            position.current === Position.TOP_LEFT ||
                            position.current === Position.TOP_RIGHT)
                            ? ref.current.offsetTop : null,
                        left: (
                            position.current === Position.TOP_LEFT ||
                            position.current === Position.BOTTOM_LEFT)
                            ? ref.current.offsetLeft : null,
                        right: (
                            position.current === Position.TOP_RIGHT ||
                            position.current === Position.BOTTOM_RIGHT)
                            ? window.innerWidth - ref.current.offsetLeft - ref.current.offsetWidth : null,
                        bottom: (
                            position.current === Position.BOTTOM_LEFT ||
                            position.current === Position.BOTTOM_RIGHT)
                            ? window.innerHeight - ref.current.offsetTop - ref.current.offsetHeight : null
                    })
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
            }
        }
    }, [ref, canMove])

    useEffect(() => {
        if (ref.current) {
            if (top !== null) {
                ref.current.style.top = `${top}px`
                ref.current.style.bottom = 'auto'
            }
            if (left !== null) {
                ref.current.style.left = `${left}px`
                ref.current.style.right = 'auto'
            }
            if (right !== null) {
                ref.current.style.right = `${right}px`
                ref.current.style.left = 'auto'
            }
            if (bottom !== null) {
                ref.current.style.bottom = `${bottom}px`
                ref.current.style.top = 'auto'
            }
        }
    }, [ref, top, left, right, bottom])

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