/**
 * A asynchronous diagnostic delay for a specified amount of time,
 * optionally resulting in error.
 *
 * This utility is merely a promise-wrapped `setTimeout()`.
 *
 * @param {number} ms - the number of milliseconds to delay.
 *
 * @param {string} [resultingErrMsg] - an error message that when
 * supplied will result in an error resolution (once the delay has
 * expired).
 *
 * @return {string} an indication of what has transpired (ex:
 * '*** delay() *** delayed ${ms} ms');
 *
 * @throws {Error} when resultingErrMsg is supplied.
 */
export default function delay(ms, resultingErrMsg=null) {
  return new Promise( (resolve, reject) => {
    const msg = `*** delay() *** delayed ${ms} ms`;
    setTimeout(() => {
      if (resultingErrMsg) {
        const err = new Error(resultingErrMsg);
        // console.log(`${msg} ... resulting in Error: `, err)
        reject(err);
      }
      else {
        // console.log(msg)
        resolve(msg);
      }
    }, ms);
  });
}
