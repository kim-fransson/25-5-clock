import { useReducer } from "react";
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

const counterReducer = (state, { type }) => {
  switch (type) {
    case COUNTER_ACTIONS.BREAK_INCREMENT:
      return { ...state, breakLength: state.breakLength++ };
    case COUNTER_ACTIONS.BREAK_DECREMENT:
      return { ...state, breakLength: state.breakLength-- };
    case COUNTER_ACTIONS.SESSION_INCREMENT:
      return { ...state, sessionLength: state.sessionLength++ };
    case COUNTER_ACTIONS.SESSION_DECREMENT:
      return { ...state, sessionLength: state.sessionLength-- };
    case CLOCK_ACTIONS.RESET:
      return DEFAULT_STATES;
  }
};

function Clock() {
  const [{ breakLength, sessionLength }, dispatch] = useReducer(
    counterReducer,
    {
      breakLength: 5,
      sessionLength: 25,
    }
  );

  return (
    <div className="border-4 gap-y-4 rounded-lg shadow-lg bg-slate-700 border-gray-900 py-4 mx-auto max-w-[500px] grid-cols-4 grid text-white">
      <h1 className="col-span-full text-center text-4xl">
        25 + 5 <span className="font-semibold text-red-600">Clock</span>
      </h1>
      <Counter
        id="break"
        value={breakLength}
        handleDecrement={() =>
          dispatch({ type: COUNTER_ACTIONS.BREAK_DECREMENT })
        }
        handleIncrement={() =>
          dispatch({ type: COUNTER_ACTIONS.BREAK_INCREMENT })
        }
      />
      <Counter
        id="session"
        value={sessionLength}
        handleDecrement={() =>
          dispatch({ type: COUNTER_ACTIONS.SESSION_DECREMENT })
        }
        handleIncrement={() =>
          dispatch({ type: COUNTER_ACTIONS.SESSION_INCREMENT })
        }
      />
      <div className="col-span-full flex flex-col items-center border-4 rounded-full w-40 h-40 justify-center mx-auto">
        <p id="timer-label" className="text-3xl">
          Session
        </p>
        <span id="time-left" className="text-2xl">
          25:00
        </span>
      </div>
      <div className="gap-4 col-span-full flex justify-center">
        <button id="start_stop" className="text-4xl">
          ⏯
        </button>
        <button
          id="reset"
          className="text-4xl"
          onClick={() => dispatch({ type: CLOCK_ACTIONS.RESET })}
        >
          ⟳
        </button>
      </div>
    </div>
  );
}

export default Clock;
