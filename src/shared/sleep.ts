export function sleep(number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, number);
  });
}
