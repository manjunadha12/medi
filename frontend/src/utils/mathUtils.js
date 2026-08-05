/**
 * Safely converts any value to a number. Returns fallback if result is NaN.
 */
export const safeNum = (val, fallback = 0) => {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

/**
 * Formats a number with commas for Indian currency style.
 */
export const formatCurrency = (val) => {
  const num = safeNum(val);
  return num.toLocaleString('en-IN');
};
