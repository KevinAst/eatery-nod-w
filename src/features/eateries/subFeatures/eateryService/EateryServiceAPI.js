/**
 * EateryServiceAPI is a "pseudo" interface specifying the EateryService API
 * which all implementations (i.e. derivations) must conform.
 * 
 * NOTE: This represents a persistent service of a real-time DB, where
 *       the monitored DB is retained between service invocations.
 */
export default class EateryServiceAPI {

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
    throw new Error(`***ERROR*** ${this.constructor.name}.monitorDbEateryPool() is a required service method that has NOT been implemented`);
  }


  /**
   * Add new Eatery to the DB being monitored (asynchronously).
   *
   * This method can only be called, once a successful
   * monitorDbEateryPool() has been established, because of the
   * persistent nature of this service.
   * 
   * @param {Eatery} eatery the eatery entry to add
   */
  async addEatery(eatery) {
    throw new Error(`***ERROR*** ${this.constructor.name}.addEatery() is a required service method that has NOT been implemented`);
  }


  /**
   * Remove the supplied eateryId from the DB being monitored (asynchronously).
   *
   * This method can only be called, once a successful
   * monitorDbEateryPool() has been established, because of the
   * persistent nature of this service.
   * 
   * @param {number} eateryId the eatery id to remove
   */
  async removeEatery(eateryId) {
    throw new Error(`***ERROR*** ${this.constructor.name}.removeEatery() is a required service method that has NOT been implemented`);
  }

};
