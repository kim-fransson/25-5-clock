import { useEffect, useReducer, useState } from "react";
import { useTimer } from "react-timer-hook";

import beep from "../assets/beep-beep.wav";
import Counter from "./Counter";

const COUNTER_ACTIONS = {
  BREAK_INCREMENT: "break-increment",
  BREAK_DECREMENT: "break-decrement",
  SESSION_INCREMENT: "session-increment",
  SESSION_DECREMENT: "session-decrement",
};

const CLOCK_ACTIONS = {
  RESET: "reset",
};

const DEFAULT_STATES = {
  breakLength: 5,
  sessionLength: 25,
};

const counterReducer = (state, { type, payload }) => {
  switch (type) {
    case COUNTER_ACTIONS.BREAK_INCREMENT:
      const breakLengthIncr = state.breakLength + 1;
      if (payload.label === "Break") {
        payload.timer.restart(getStartTime(breakLengthIncr), false);
      }
      return { ...state, breakLength: breakLengthIncr };
    case COUNTER_ACTIONS.BREAK_DECREMENT:
      const breakLengthDecr = state.breakLength - 1;
      if (payload.label === "Break") {
        payload.timer.restart(getStartTime(breakLengthDecr), false);
      }
      return {
        ...state,
        breakLength: breakLengthDecr,
      };
    case COUNTER_ACTIONS.SESSION_INCREMENT:
      const sessionLengthIncr = state.sessionLength + 1;
      if (payload.label === "Session") {
        payload.timer.restart(getStartTime(sessionLengthIncr), false);
      }
      return {
        ...state,
        sessionLength: sessionLengthIncr,
      };
    case COUNTER_ACTIONS.SESSION_DECREMENT:
      const sessionLengthDecr = state.sessionLength - 1;
      if (payload.label === "Session") {
        payload.timer.restart(getStartTime(sessionLengthDecr), false);
      }
      return {
        ...state,
        sessionLength: sessionLengthDecr,
      };
    case CLOCK_ACTIONS.RESET:
      stopBeep();
      payload.timer.restart(getDefaultSessionTime(), false);
      payload.setLabel("Session");
      return DEFAULT_STATES;
  }
};

function Clock() {
  const [label, setLabel] = useState("Session");
  const [isDone, setIsDone] = useState(false);
  const [{ breakLength, sessionLength }, dispatch] = useReducer(
    counterReducer,
    DEFAULT_STATES
  );

  useEffect(() => {
    if (isDone) {
      playBeep();
      if (label === "Session") {
        setLabel("Break");
        timer.restart(getDefaultBreakTime(), true);
      } else {
        setLabel("Session");
        timer.restart(getDefaultSessionTime(), true);
      }
      setIsDone(false);
    }
  }, [isDone]);

  const timer = useTimer({
    expiryTimestamp: getDefaultSessionTime(),
    autoStart: false,
    onExpire: () => {
      setIsDone(true);
    },
  });

  return (
    <div className="border-4 gap-y-4 rounded-lg shadow-lg bg-slate-700 border-gray-900 py-4 mx-auto max-w-[500px] grid-cols-4 grid text-white">
      <h1 className="col-span-full text-center text-4xl">
        25 + 5 <span className="font-semibold text-red-600">Clock</span>
      </h1>
      <Counter
        disabled={timer.isRunning}
        id="break"
        value={breakLength}
        handleDecrement={() =>
          dispatch({
            type: COUNTER_ACTIONS.BREAK_DECREMENT,
            payload: { timer, label },
          })
        }
        handleIncrement={() =>
          dispatch({
            type: COUNTER_ACTIONS.BREAK_INCREMENT,
            payload: { timer, label },
          })
        }
      />
      <Counter
        disabled={timer.isRunning}
        id="session"
        value={sessionLength}
        handleDecrement={() =>
          dispatch({
            type: COUNTER_ACTIONS.SESSION_DECREMENT,
            payload: { timer, label },
          })
        }
        handleIncrement={() =>
          dispatch({
            type: COUNTER_ACTIONS.SESSION_INCREMENT,
            payload: { timer, label },
          })
        }
      />
      <div className="col-span-full flex flex-col items-center border-4 rounded-full w-40 h-40 justify-center mx-auto">
        <p id="timer-label" className="text-3xl">
          {label}
        </p>
        <span id="time-left" className="text-2xl">
          {display(timer)}
        </span>
      </div>
      <div className="gap-4 col-span-full flex justify-center">
        <button
          id="start_stop"
          className="text-4xl"
          onClick={() => {
            toggle(timer);
          }}
        >
          ⏯
        </button>
        <button
          id="reset"
          className="text-4xl"
          onClick={() =>
            dispatch({
              type: CLOCK_ACTIONS.RESET,
              payload: { timer, setLabel },
            })
          }
        >
          ⟳
        </button>
      </div>
      <audio id="beep" src={beep} autoPlay={false}></audio>
    </div>
  );
}

const playBeep = () => {
  document.getElementById("beep").play();
};

const stopBeep = () => {
  const audio = document.getElementById("beep");
  audio.pause();
  audio.currentTime = 0;
};

const toggle = (timer) => {
  timer.isRunning ? timer.pause() : timer.resume();
};

const display = (timer) => {
  return `${displayMinutes(timer.hours, timer.minutes)}:${displaySeconds(
    timer.seconds
  )}`;
};

const displayMinutes = (hours, minutes) => {
  if (hours === 1) {
    return "60";
  }

  if (minutes < 10) {
    return `0${minutes}`;
  }

  return minutes;
};

const displaySeconds = (seconds) => {
  return seconds < 10 ? `0${seconds}` : seconds;
};

const getDefaultSessionTime = () => {
  return getStartTime(DEFAULT_STATES.sessionLength);
  // const time = new Date();
  // time.setSeconds(time.getSeconds() + 5);
  // return time;
};

const getDefaultBreakTime = () => {
  return getStartTime(DEFAULT_STATES.breakLength);
  // const time = new Date();
  // time.setSeconds(time.getSeconds() + 5);
  // return time;
};

const getStartTime = (minutes) => {
  const time = new Date();
  time.setMinutes(time.getMinutes() + minutes);
  return time;
};

export default Clock;
