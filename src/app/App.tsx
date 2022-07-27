import { useEffect, useState } from "react";
import clouds from "../assets/clouds.png";
import mario from "../assets/mario.gif";
import pipe from "../assets/pipe.png";
import gameOver from "../assets/game-over.png";
import "./App.css";

const STATUS = {
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
};

const avatarByStatus: any = {
  PLAYING: mario,
  GAME_OVER: gameOver,
};

interface DataTypes {
  status: string;
  points: number;
  pipe?: {
    x: number;
  };
  clouds?: {
    x: number;
  };
}

export default function App() {
  const [jump, setJump] = useState<boolean>(false);
  const [data, setData] = useState<DataTypes>({
    status: STATUS.PLAYING,
    points: 0,
  });
  const isStatusPlaying = data.status === STATUS.PLAYING;

  const handleJump = () => {
    setJump(true);
    setTimeout(() => setJump(false), 500);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleJump);
  }, []);

  const getPositionElement = (element: string) =>
    document.querySelector(element)?.getBoundingClientRect();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const cloudsX = getPositionElement(".clouds")?.x || 0;
      const pipeX = getPositionElement(".pipe")?.x || 0;
      const marioY = getPositionElement(".mario")?.y || 0;

      if (pipeX > 154 && pipeX < 250 && marioY > 565) {
        setData({
          ...data,
          status: STATUS.GAME_OVER,
          pipe: { x: pipeX },
          clouds: { x: cloudsX },
        });
        return;
      }
      if (pipeX > 154 && pipeX < 250 && marioY < 565) {
        setData({
          ...data,
          points: data.points + 1,
        });
      }
    }, 10);
    return () => clearInterval(intervalId);
  }, [data]);

  return (
    <div className="app">
      <div className="wrapper">
        <img
          className={`clouds ${isStatusPlaying && "clouds-animation"}`}
          src={clouds}
          alt="Clouds"
          style={
            isStatusPlaying
              ? {}
              : { transform: `translateX(${data.clouds?.x}px)` }
          }
        />
        <div className={`wrapper-mario ${jump && "jump-animation"}`}>
          <img
            className="mario"
            src={avatarByStatus[data.status]}
            alt="Mario"
          />
        </div>
      </div>
      <img
        className={`pipe ${isStatusPlaying && "pipe-animation"}`}
        src={pipe}
        alt="Pipe"
        style={
          isStatusPlaying ? {} : { transform: `translateX(${data.pipe?.x}px)` }
        }
      />
      <div className="floor">Pontos: {(data.points / 18).toFixed(0)}</div>
    </div>
  );
}
