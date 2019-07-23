import firebase         from 'firebase/app';
import                       'firebase/database';
import geodist          from 'geodist';
import EateryServiceAPI from '../eateryService/EateryServiceAPI';

/**
 * EateryServiceFirebase is the **real** EateryServiceAPI derivation
 * using the Firebase service APIs.
 * 
 * NOTE: This represents a persistent service of a real-time DB, where
 *       the monitored DB is retained between service invocations.
 */
export default class EateryServiceFirebase extends EateryServiceAPI {

  /**
   * Our persistent monitor that manages various aspects of a given pool.
   */
  curPoolMonitor = {       // current "pool" monitor (initially a placebo)
    pool:   null,          // type: string
    dbRef:  null,          // type: firebase.database.Reference
    wrapUp: () => 'no-op', // type: function(): void ... cleanup existing monitored resources
  };


  /**
   * Monitor a set of eateries, within our real-time DB, as defined by
   * the supplied pool.  The real-time monitor is triggered both from
   * an initial population, and when data changes.
   * 
   * @param {string} pool the eatery pool identifier to monitor
   * (e.g. 'DateNightPool').
   * 
   * @param {(struct: {lat, lng})} baseLoc the location from which to
   * calculate the distance to each eatery
   * 
   * @param {function} monitorCB the callback function that
   * communicates the set of monitored eateries.  This function is
   * called both for an initial data population, and whenever data
   * changes.  It has the following signature:
   *  + monitorCB(eateries): void
   */
  monitorDbEateryPool(pool, baseLoc, monitorCB) {

    // close prior monitor (if any)
    this.curPoolMonitor.wrapUp();

    // create a new monitor (retaining needed info for subsequent visibility)
    this.curPoolMonitor = {
      pool,
      dbRef: firebase.database().ref(`/pools/${pool}`),
      wrapUp() {
        this.dbRef.off('value');
      }
    };

    // listen for eatery data changes in the specified pool
    this.curPoolMonitor.dbRef.on('value', (snapshot) => {

      // conditional logic accommodates an empty pool
      // ... a firebase DB philosophy is that it will NOT store empty data (or collections)
      const eateries = snapshot.val() !== null ? snapshot.val() : {};

      // supplement eateries with distance from the supplied baseLoc (as the crow flies)
      for (const eateryId in eateries) {
        const eatery = eateries[eateryId];
        eatery.distance = geodist([eatery.loc.lat, eatery.loc.lng], [baseLoc.lat, baseLoc.lng]);
      }

      // notify our supplied monitorCB
      // console.log(`xx EateryServiceFirebase.monitorDbEateryPool() -and- MOCK RECORDING ... eateries changed for pool '${this.curPoolMonitor.pool}': ${JSON.stringify(eateries)}`);
      monitorCB(eateries);

    });
  }


  /**
   * Add new Eatery to the DB being monitored.
   *
   * This method can only be called, once a successful
   * monitorDbEateryPool() has been established, because of the
   * persistent nature of this service.
   * 
   * @param {Eatery} eatery the eatery entry to add
   * 
   * @returns {void via promise} a void promise, resolved when add
   * complete and captures async errors.
   */
  addEatery(eatery) {
    return new Promise( (resolve, reject) => {

      // verify we are monitoring a pool
      if (!this.curPoolMonitor.pool) {
        return reject(
          // unexpected condition
          new Error('***ERROR*** (within app logic) EateryServiceFirebase.addEatery(): may only be called once a successful monitorDbEateryPool() has completed.')
            .defineAttemptingToMsg('add an Eatery to the DB')
        );
      }

      // add the eatery to our DB pool
      // console.log(`xx EateryServiceFirebase.addEatery() adding eatery: /pools/${this.curPoolMonitor.pool}/${eatery.id}`);

      const dbRef = firebase.database().ref(`/pools/${this.curPoolMonitor.pool}/${eatery.id}`);
      dbRef.set(eatery)
           .then( () => { // a void resolve indicates the add is complete
           })
           .catch( err => { // unexpected error
             return reject(err.defineAttemptingToMsg(`add eatery (${eatery.id}) to pool ${this.curPoolMonitor.pool}`));
           });
    });
  }


  /**
   * Remove the supplied eateryId from the DB being monitored.
   *
   * This method can only be called, once a successful
   * monitorDbEateryPool() has been established, because of the
   * persistent nature of this service.
   * 
   * @param {number} eateryId the eatery id to remove
   * 
   * @returns {void via promise} a void promise, resolved when remove
   * complete and captures async errors.
   */
  removeEatery(eateryId) {
    return new Promise( (resolve, reject) => {

      // verify we are monitoring a pool
      if (!this.curPoolMonitor.pool) {
        return reject(
          // unexpected condition
          new Error('***ERROR*** (within app logic) EateryServiceFirebase.removeEatery(): may only be called once a successful monitorDbEateryPool() has completed.')
            .defineAttemptingToMsg('remove an Eatery from the DB')
        );
      }

      // remove the eatery to our DB pool
      // console.log(`xx EateryServiceFirebase.removeEatery() removing eatery: /pools/${this.curPoolMonitor.pool}/${eateryId}`);

      const dbRef = firebase.database().ref(`/pools/${this.curPoolMonitor.pool}/${eateryId}`);
      dbRef.set(null)
           .then( () => { // a void resolve indicates the remove is complete
           })
           .catch( err => { // unexpected error
             return reject(err.defineAttemptingToMsg(`remove eatery (${eateryId}) from pool ${this.curPoolMonitor.pool}`));
           });
    });
  }

};
