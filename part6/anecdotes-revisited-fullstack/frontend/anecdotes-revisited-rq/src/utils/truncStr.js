/**
 * Returns the given string truncated to the required length minus 3 ellipsis,
 * otherwise, returns the string as it is if its length less than the required length.
 *
 * @param {number} netLength - The required final length
 * @returns {string}
 */
export const truncStr = (str, netLength = 80) => {
  if (str.length > netLength) {
    return `${str.slice(0, netLength - 3)}...`;
  }
  return str;
};

export default truncStr;
