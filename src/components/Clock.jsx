import { useEffect, useReducer, useRef } from "react";

import Counter from "./Counter";

const COUNTER_ACTIONS = {
  BREAK_INCREMENT: "break-increment",
  BREAK_DECREMENT: "break-decrement",
  SESSION_INCREMENT: "session-increment",
  SESSION_DECREMENT: "session-decrement",
};

const CLOCK_ACTIONS = {
  RESET: "reset",
  TOGGLE_TIMER: "toggle-timer",
};

const INTERVAL_ACTIONS = {
  SECOND_DECREMENT: "second-decrement",
};

const DEFAULT_STATES = {
  breakLength: 5,
  sessionLength: 25,
  remainingTime: 25 * 60,
  isRunning: false,
  mode: "Session",
};

const counterReducer = (state, { type, payload }) => {
  switch (type) {
    case COUNTER_ACTIONS.BREAK_INCREMENT:
      const breakLengthIncr = state.breakLength + 1;
      if (breakLengthIncr > 60) {
        return state;
      }
      return {
        ...state,
        breakLength: breakLengthIncr,
        remainingTime:
          payload.mode === "Break" ? breakLengthIncr * 60 : state.remainingTime,
      };
    case COUNTER_ACTIONS.BREAK_DECREMENT:
      const breakLengthDecr = state.breakLength - 1;
      if (breakLengthDecr < 1) {
        return state;
      }
      return {
        ...state,
        breakLength: breakLengthDecr,
        remainingTime:
          payload.mode === "Break" ? breakLengthDecr * 60 : state.remainingTime,
      };
    case COUNTER_ACTIONS.SESSION_INCREMENT:
      const sessionLengthIncr = state.sessionLength + 1;
      if (sessionLengthIncr > 60) {
        return state;
      }
      return {
        ...state,
        sessionLength: sessionLengthIncr,
        remainingTime:
          payload.mode === "Session"
            ? sessionLengthIncr * 60
            : state.remainingTime,
      };
    case COUNTER_ACTIONS.SESSION_DECREMENT:
      const sessionLengthDecr = state.sessionLength - 1;
      if (sessionLengthDecr < 1) {
        return state;
      }

      return {
        ...state,
        sessionLength: sessionLengthDecr,
        remainingTime:
          payload.mode === "Session"
            ? sessionLengthDecr * 60
            : state.remainingTime,
      };
    case CLOCK_ACTIONS.RESET:
      payload.alarm.current.pause();
      payload.alarm.current.currentTime = 0;
      return DEFAULT_STATES;
    case INTERVAL_ACTIONS.SECOND_DECREMENT:
      if (state.remainingTime === 0) {
        payload.alarm.current.currentTime = 0;
        payload.alarm.current.play();
        const currentMode = state.mode;
        return {
          ...state,
          mode: currentMode === "Session" ? "Break" : "Session",
          remainingTime:
            currentMode === "Session"
              ? state.breakLength * 60
              : state.sessionLength * 60,
        };
      }
      return {
        ...state,
        remainingTime: state.remainingTime - 1,
      };
    case CLOCK_ACTIONS.TOGGLE_TIMER:
      return {
        ...state,
        isRunning: !state.isRunning,
      };
  }
};

function Clock() {
  const alarm = useRef();

  const [
    { breakLength, sessionLength, remainingTime, isRunning, mode },
    dispatch,
  ] = useReducer(counterReducer, DEFAULT_STATES);

  // move to own file
  const useInterval = (callback, delay) => {
    const callbackRef = useRef();

    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
      if (delay !== null) {
        let id = setInterval(callbackRef.current, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useInterval(
    () => {
      if (isRunning) {
        dispatch({
          type: INTERVAL_ACTIONS.SECOND_DECREMENT,
          payload: { alarm },
        });
      }
    },
    isRunning ? 1000 : null
  );

  return (
    <div className="border-4 gap-y-4 rounded-lg shadow-lg bg-slate-700 border-gray-900 py-4 mx-auto max-w-[500px] grid-cols-4 grid text-white">
      <h1 className="col-span-full text-center text-4xl">
        25 + 5 <span className="font-semibold text-red-600">Clock</span>
      </h1>
      <Counter
        disabled={isRunning}
        id="break"
        value={breakLength}
        handleDecrement={() =>
          dispatch({
            type: COUNTER_ACTIONS.BREAK_DECREMENT,
            payload: { mode },
          })
        }
        handleIncrement={() =>
          dispatch({
            type: COUNTER_ACTIONS.BREAK_INCREMENT,
            payload: { mode },
          })
        }
      />
      <Counter
        disabled={isRunning}
        id="session"
        value={sessionLength}
        handleDecrement={() =>
          dispatch({
            type: COUNTER_ACTIONS.SESSION_DECREMENT,
            payload: { mode },
          })
        }
        handleIncrement={() =>
          dispatch({
            type: COUNTER_ACTIONS.SESSION_INCREMENT,
            payload: { mode },
          })
        }
      />
      <div className="col-span-full flex flex-col items-center border-4 rounded-full w-40 h-40 justify-center mx-auto">
        <p id="timer-label" className="text-3xl">
          {mode}
        </p>
        <span id="time-left" className="text-2xl">
          {display(remainingTime)}
        </span>
      </div>
      <div className="gap-4 col-span-full flex justify-center">
        <button
          id="start_stop"
          className="text-4xl"
          onClick={() => dispatch({ type: CLOCK_ACTIONS.TOGGLE_TIMER })}
        >
          ⏯
        </button>
        <button
          id="reset"
          className="text-4xl"
          onClick={() =>
            dispatch({ type: CLOCK_ACTIONS.RESET, payload: { alarm } })
          }
        >
          ⟳
        </button>
      </div>
      <audio
        id="beep"
        ref={alarm}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        type="audio"
      ></audio>
    </div>
  );
}

const display = (seconds) => {
  return `${displayMinutes(parseInt(seconds / 60, 10))}:${displaySeconds(
    parseInt(seconds, 10)
  )}`;
};

const displayMinutes = (minutes) => {
  if (minutes < 10) {
    return `0${minutes}`;
  }

  return minutes;
};

const displaySeconds = (seconds) => {
  const format = seconds % 60;
  if (format === 0) {
    return "00";
  }
  return format < 10 ? `0${format}` : format;
};

export default Clock;
