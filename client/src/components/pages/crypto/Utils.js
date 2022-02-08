// all possible currencies which are available
export const currency = ["$"];

// rounds big numbers to fixed number and adds appropriate suffix
export const roundBigNumbers = (num, fixed) => {
  if (num === null) {
    return null;
  } // terminate early
  if (num === 0) {
    return "0";
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var b = num.toPrecision(2).split("e"), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c =
      k < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, k * 3)).toFixed(fixed), // divide by power
    d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
    e = d + ["", "K", "M", "B", "T"][k]; // append power
  return e;
};

/* 
Returns percentage in either color green or red, fixed to two decimals and 
some additional styling
*/
export const percentageChange = (percentage, fontWeight) => {
  if (percentage == null)
    return (
      <p className="coin-percentage" style={{ fontWeight: `${fontWeight}` }}>
        Unknown
      </p>
    );

  return percentage < 0 ? (
    <p className="coin-percentage red" style={{ fontWeight: `${fontWeight}` }}>
      {percentage.toFixed(2)}%
    </p>
  ) : (
    <p
      className="coin-percentage green"
      style={{ fontWeight: `${fontWeight}` }}
    >
      +{percentage.toFixed(2)}%
    </p>
  );
};
