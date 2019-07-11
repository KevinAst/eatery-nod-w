/**
 * A diagnostic delay promise for the specified amount of time.
 */
export default function delay(seconds, resultingErrMsg=null) {
  return new Promise( (resolve, reject) => {
    const msg = `*** delay() *** delayed ${seconds} seconds`;
    setTimeout(() => {
      if (resultingErrMsg) {
        const err = new Error(resultingErrMsg);
        console.log(`${msg} ... resulting in Error: `, err)
        reject(err);
      }
      else {
        console.log(msg)
        resolve(msg);
      }
    }, seconds*1000);
  });
}
