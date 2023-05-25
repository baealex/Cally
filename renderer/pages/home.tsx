import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Movement } from '../components/movement';
import { Calendar } from '../components/calendar';
import { Modal } from '../components/modal';
import { Toggle } from '../components/toggle';
import { configStore } from '../store/config';
import { useStore } from 'badland-react';
import { ipcRenderer } from 'electron';

function Home() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [{
    canMove,
    top,
    left,
    right,
    bottom,
    year,
    month,
    image,
    defaultColor,
    pointColor,
    backgroundColor,
    backgroundOpacity,
  }, setState] = useStore(configStore);

  const [isOpenedSetting, setIsOpenedSetting] = React.useState(false);

  useEffect(() => {
    ipcRenderer.send('config-load-request')
    ipcRenderer.on('config-load', async (event, arg) => {
      await setState(arg)
      setIsLoaded(true)
    })
  }, []);

  if (!isLoaded) {
    return null
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
        <Calendar
          year={year}
          month={month}
          defaultColor={defaultColor}
          pointColor={pointColor}
          backgroundColor={backgroundColor}
          backgroundOpacity={backgroundOpacity}
          onDateClick={(date) => { }}
          onDateChange={(year, month) => setState({ year, month })} />
      </Movement>
      <div className="settings" onClick={() => setIsOpenedSetting(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3.269C14 2.568 13.432 2 12.731 2H11.27C10.568 2 10 2.568 10 3.269v0c0 .578-.396 1.074-.935 1.286-.085.034-.17.07-.253.106-.531.23-1.162.16-1.572-.249v0a1.269 1.269 0 0 0-1.794 0L4.412 5.446a1.269 1.269 0 0 0 0 1.794v0c.41.41.48 1.04.248 1.572a7.946 7.946 0 0 0-.105.253c-.212.539-.708.935-1.286.935v0C2.568 10 2 10.568 2 11.269v1.462C2 13.432 2.568 14 3.269 14v0c.578 0 1.074.396 1.286.935.034.085.07.17.105.253.231.531.161 1.162-.248 1.572v0a1.269 1.269 0 0 0 0 1.794l1.034 1.034a1.269 1.269 0 0 0 1.794 0v0c.41-.41 1.04-.48 1.572-.249.083.037.168.072.253.106.539.212.935.708.935 1.286v0c0 .701.568 1.269 1.269 1.269h1.462c.701 0 1.269-.568 1.269-1.269v0c0-.578.396-1.074.935-1.287.085-.033.17-.068.253-.104.531-.232 1.162-.161 1.571.248v0a1.269 1.269 0 0 0 1.795 0l1.034-1.034a1.269 1.269 0 0 0 0-1.794v0c-.41-.41-.48-1.04-.249-1.572.037-.083.072-.168.106-.253.212-.539.708-.935 1.286-.935v0c.701 0 1.269-.568 1.269-1.269V11.27c0-.701-.568-1.269-1.269-1.269v0c-.578 0-1.074-.396-1.287-.935a7.755 7.755 0 0 0-.105-.253c-.23-.531-.16-1.162.249-1.572v0a1.269 1.269 0 0 0 0-1.794l-1.034-1.034a1.269 1.269 0 0 0-1.794 0v0c-.41.41-1.04.48-1.572.249a7.913 7.913 0 0 0-.253-.106C14.396 4.343 14 3.847 14 3.27v0z" /><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" /></svg>
      </div>
      {isOpenedSetting && (
        <Modal onClose={() => setIsOpenedSetting(false)}>
          <div className="setting-title">
            달력 스타일
          </div>
          <div className="calendar-style">
            <div className="calendar-style-item"></div>
            <div className="calendar-style-item"></div>
            <div className="calendar-style-item"></div>
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
                  console.log(e.target?.result);
                  setState({ image: e.target?.result as ArrayBuffer });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </Modal>
      )}
      <style jsx>{`
        :global(body) {
          background: url(${image ? image : '/images/example.jpg'}) no-repeat center center fixed;
          background-size: cover;
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
        }
      `}</style>
    </>
  );
};

export default Home;
