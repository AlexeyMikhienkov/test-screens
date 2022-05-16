export default function countSomeTime(time) {
  let promiseResolver;
  console.log("countTransitionTime", time)
  const promise = new Promise((resolve) => promiseResolver = resolve);
  setTimeout(() => promiseResolver(), time);

  return promise;
}
