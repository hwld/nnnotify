export const delay = (minMs = 100, maxMs = 500) => {
  const ms = Math.floor(Math.random() * (maxMs - minMs) + minMs);

  return new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
};
