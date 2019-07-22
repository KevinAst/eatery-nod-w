/**
 * A diagnostic delay promise for the specified amount of time,
 * optionally resulting in error.
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
