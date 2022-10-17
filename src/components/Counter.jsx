function Counter({ disabled, id, value, handleDecrement, handleIncrement }) {
  return (
    <div className="col-span-2 flex gap-1 flex-col items-center">
      <p id={`${id}-label`} className="text-xl capitalize">
        {id} length
      </p>
      <div className="flex gap-2 place-items-center">
        <button
          id={`${id}-decrement`}
          className="text-4xl disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDecrement}
          disabled={disabled || value <= 1}
        >
          ⬇️
        </button>
        <span id={`${id}-length`} className="text-3xl flex-grow-0">
          {value}
        </span>
        <button
          id={`${id}-increment`}
          className="text-4xl disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleIncrement}
          disabled={disabled || value >= 60}
        >
          ⬆️
        </button>
      </div>
    </div>
  );
}

export default Counter;
