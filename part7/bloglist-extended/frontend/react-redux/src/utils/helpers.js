export const invokeLocalStorage = (method, ...args) => {
  try {
    return localStorage[method](...args);
  } catch (error) {
    console.log(error?.toString() || error);
  }
};
