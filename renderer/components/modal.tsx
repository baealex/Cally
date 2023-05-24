import { useRef } from "react"

interface ModalProp {
    children?: React.ReactNode
    onClose: () => void
}

export const Modal = ({
    children,
    onClose
}: ModalProp) => {
    const ref = useRef<HTMLDivElement>(null)

    const handleClick = (e: React.MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            onClose()
        }
    }

    return (
        <>
            <div className="modal" onClick={handleClick}>
                <div className="modal__content" ref={ref}>
                    <div className="modal__content__header">
                        <button className="modal__content__header__close" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20L4 4m16 0L4 20"/></svg>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
            <style jsx>{`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .modal__content__header {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                }

                .modal__content__header__close {
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    color: inherit;
                }

                .modal__content__header__close svg {
                    width: 16px;
                    height: 16px;
                }

                .modal__content {
                    width: 760px;
                    max-width: calc(100% - 40px);
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 20px;
                }
            `}</style>
        </>
    )
}