import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';

import { Toggle } from '../components/toggle';
import { configStore } from '../store/config';
import { useStore } from 'badland-react';

function Setting() {
    const [isLoaded, setIsLoaded] = React.useState(false);

    const [state, handleSetState] = useStore(configStore);
    const {
        canMove,
        defaultColor,
        pointColor,
        backgroundColor,
        backgroundOpacity
    } = state;

    const setState = async (state: Partial<typeof configStore.state>) => {
        await handleSetState((prevState) => ({
            ...prevState,
            ...state
        }));
        if (isLoaded) {
            ipcRenderer.send('config-change', configStore.state);
        }
    };

    useEffect(() => {
        ipcRenderer.send('config-load-request');

        ipcRenderer.on('config-load', async (event, arg) => {
            await setState(arg);
            setIsLoaded(true);
        });
    }, []);

    if (!isLoaded) {
        return null;
    }

    return (
        <>
            <div className="setting-title">
                달력 스타일
            </div>
            <div className="calendar-style">
                <div className="calendar-style-item" onClick={() => setState({ style: 'table' })}>
                    Table
                </div>
                <div className="calendar-style-item" onClick={() => setState({ style: 'line' })}>
                    Line
                </div>
                <div className="calendar-style-item">
                    To be continued...
                </div>
            </div>
            <div className="setting-title">
                달력 위치 고정
            </div>
            <Toggle
                defaultChecked={canMove}
                onChange={(canMove) => setState({ canMove })}
            />
            <div className="setting-title">
                달력 기본 색상
            </div>
            <input
                type="color"
                value={defaultColor}
                onChange={(e) => setState({ defaultColor: e.target.value })}
            />
            <div className="setting-title">
                달력 포인트 색상
            </div>
            <input
                type="color"
                value={pointColor}
                onChange={(e) => setState({ pointColor: e.target.value })}
            />
            <div className="setting-title">
                달력 배경 색상
            </div>
            <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setState({ backgroundColor: e.target.value })}
            />
            <div className="setting-title">
                달력 배경 투명도
            </div>
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={backgroundOpacity}
                onChange={(e) => setState({ backgroundOpacity: e.target.value })}
            />
            <div className="setting-title">
                이미지 변경
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            setState({ image: e.target?.result as ArrayBuffer });
                        };
                        reader.readAsDataURL(file);
                    }
                }}
            />
            <style jsx>{`
                .setting-title {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .calendar-style {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-gap: 10px;
                    margin-bottom: 20px;
                }

                .calendar-style-item {
                    width: 100%;
                    height: 200px;
                    border-radius: 10px;
                    background: #ccc;
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-end;
                    font-size: 0.8rem;
                    font-weight: bold;
                    padding: 8px 16px;
                    cursor: pointer;
                }

                .calendar-style-item:nth-child(1) {
                    background: url('/images/1.jpg') no-repeat center center;
                    background-size: cover;
                }

                .calendar-style-item:nth-child(2) {
                    background: url('/images/2.jpg') no-repeat center center;
                    background-size: cover;
                }
            `}</style>
        </>
    );
}

export default Setting;
