function Clock() {
  return (
    <div className="border-4 gap-y-4 rounded-lg shadow-lg bg-slate-700 border-gray-900 py-4 mx-auto max-w-[500px] grid-cols-4 grid text-white">
      <h1 className="col-span-full text-center text-4xl">
        25 + 5 <span className="font-semibold text-red-600">Clock</span>
      </h1>
      <div className="col-span-2 flex gap-1 flex-col items-center">
        <p id="break-label" className="text-xl">
          Break Length
        </p>
        <div className="flex gap-2 items-center">
          <button id="break-decrement" className="text-4xl">
            ⬇️
          </button>
          <span id="break-length" className="text-3xl">
            5
          </span>
          <button id="break-increment" className="text-4xl">
            ⬆️
          </button>
        </div>
      </div>
      <div className="col-span-2 flex flex-col items-center gap-1">
        <p id="session-label" className="text-xl">
          Session Length
        </p>
        <div className="flex gap-2 items-center">
          <button id="session-decrement" className="text-4xl">
            ⬇️
          </button>
          <span id="session-length" className="text-3xl">
            25
          </span>
          <button id="session-increment" className="text-4xl">
            ⬆️
          </button>
        </div>
      </div>
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
        <button id="reset" className="text-4xl">
          ⟳
        </button>
      </div>
    </div>
  );
}

export default Clock;
