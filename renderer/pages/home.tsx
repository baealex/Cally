import React, { useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';

import { CalendarLine } from '../components/calendar-line';
import { CalendarTable } from '../components/calendar-table';
import { Modal } from '../components/modal';
import { Movement } from '../components/movement';
import { Toggle } from '../components/toggle';
import { configStore } from '../store/config';
import { useStore } from 'badland-react';

function Home() {
    const [isLoaded, setIsLoaded] = React.useState(false);

    const [state, setState] = useStore(configStore);
    const {
        style,
        canMove,
        top,
        left,
        right,
        bottom,
        year,
        month,
        image
    } = state;

    const selectedDay = useRef<string>(null);
    const [isOpenedNote, setIsOpenedNote] = React.useState(false);
    const [noteData, setNoteData] = React.useState<{ [key: string]: string }>({});

    useEffect(() => {
        ipcRenderer.send('config-load-request');
        ipcRenderer.on('config-load', async (event, arg) => {
            await setState(arg);
            setIsLoaded(true);
        });

        ipcRenderer.send('note-load-request', {
            year,
            month
        });

        ipcRenderer.on('note-load', (event, arg) => {
            setNoteData(arg);
        });

        ipcRenderer.send('config-change-subscribe');

        ipcRenderer.on('config-change-response', (event, arg) => {
            console.log(arg);
            setState(arg);
        });
    }, []);

    const handleClickDate = (date: number) => {
        selectedDay.current = `${date}`;
        setIsOpenedNote(true);
    };

    const hnadleChangeDate = (year: number, month: number) => {
        ipcRenderer.send('note-load-request', {
            year,
            month
        });
        ipcRenderer.on('note-load', (event, arg) => {
            setNoteData(arg);
        });
        setState({
            year,
            month
        });
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <>
            <Movement
                canMove={canMove}
                top={top}
                left={left}
                right={right}
                bottom={bottom}
                onMove={(directions) => setState({ ...directions })}>
                {style === 'table' && (
                    <CalendarTable
                        {...state}
                        dataInclude={Object.keys(noteData)}
                        onDateClick={handleClickDate}
                        onDateChange={hnadleChangeDate}
                    />
                )}
                {style === 'line' && (
                    <CalendarLine
                        {...state}
                        dataInclude={Object.keys(noteData)}
                        onDateClick={handleClickDate}
                        onDateChange={hnadleChangeDate}
                    />
                )}
            </Movement>
            <div className="settings" onClick={() => ipcRenderer.send('open-setting')}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"><path d="M14 3.269C14 2.568 13.432 2 12.731 2H11.27C10.568 2 10 2.568 10 3.269v0c0 .578-.396 1.074-.935 1.286-.085.034-.17.07-.253.106-.531.23-1.162.16-1.572-.249v0a1.269 1.269 0 0 0-1.794 0L4.412 5.446a1.269 1.269 0 0 0 0 1.794v0c.41.41.48 1.04.248 1.572a7.946 7.946 0 0 0-.105.253c-.212.539-.708.935-1.286.935v0C2.568 10 2 10.568 2 11.269v1.462C2 13.432 2.568 14 3.269 14v0c.578 0 1.074.396 1.286.935.034.085.07.17.105.253.231.531.161 1.162-.248 1.572v0a1.269 1.269 0 0 0 0 1.794l1.034 1.034a1.269 1.269 0 0 0 1.794 0v0c.41-.41 1.04-.48 1.572-.249.083.037.168.072.253.106.539.212.935.708.935 1.286v0c0 .701.568 1.269 1.269 1.269h1.462c.701 0 1.269-.568 1.269-1.269v0c0-.578.396-1.074.935-1.287.085-.033.17-.068.253-.104.531-.232 1.162-.161 1.571.248v0a1.269 1.269 0 0 0 1.795 0l1.034-1.034a1.269 1.269 0 0 0 0-1.794v0c-.41-.41-.48-1.04-.249-1.572.037-.083.072-.168.106-.253.212-.539.708-.935 1.286-.935v0c.701 0 1.269-.568 1.269-1.269V11.27c0-.701-.568-1.269-1.269-1.269v0c-.578 0-1.074-.396-1.287-.935a7.755 7.755 0 0 0-.105-.253c-.23-.531-.16-1.162.249-1.572v0a1.269 1.269 0 0 0 0-1.794l-1.034-1.034a1.269 1.269 0 0 0-1.794 0v0c-.41.41-1.04.48-1.572.249a7.913 7.913 0 0 0-.253-.106C14.396 4.343 14 3.847 14 3.27v0z" /><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" /></svg>
            </div>
            {isOpenedNote && (
                <Modal onClose={() => setIsOpenedNote(false)}>
                    <div className="note-title">
                        {year}년 {month}월
                    </div>
                    <div className="note-content">
                        <textarea
                            className="note-textarea"
                            value={noteData[selectedDay.current]}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    const newNoteData = { ...noteData };
                                    delete newNoteData[selectedDay.current];
                                    setNoteData(newNoteData);
                                    return;
                                }
                                setNoteData({
                                    ...noteData,
                                    [selectedDay.current]: e.target.value
                                });
                            }}
                        />
                    </div>
                    <div className="note-buttons">
                        <button onClick={() => setIsOpenedNote(false)}>
                            취소
                        </button>
                        <button
                            onClick={() => {
                                ipcRenderer.send('note-save', {
                                    year,
                                    month,
                                    data: noteData
                                });
                                setIsOpenedNote(false);
                            }}>
                            저장
                        </button>
                    </div>
                </Modal>
            )}
            <style jsx>{`
                :global(body) {
                    background: url(${image ? image : '/images/default.jpg'}) no-repeat center center fixed;
                    background-size: cover;
                }

                .note-title {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .note-content {
                    width: 100%;
                    height: 300px;
                    border-radius: 10px;
                    background: #eee;
                }

                .note-textarea {
                    width: 100%;
                    height: 100%;
                    border: none;
                    outline: none;
                    resize: none;
                    background: transparent;
                    padding: 10px;
                    font-size: 16px;
                }

                .note-buttons {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 10px;
                }

                .note-buttons button {
                    width: 80px;
                    height: 30px;
                    border-radius: 5px;
                    border: none;
                    outline: none;
                    background: #000;
                    color: #fff;
                    cursor: pointer;
                    margin-left: 10px;
                }

                .settings {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 24px;
                    height: 24px;
                    margin: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                }
            `}</style>
        </>
    );
}

export default Home;
