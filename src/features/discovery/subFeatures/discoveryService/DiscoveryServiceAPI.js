/**
 * DiscoveryServiceAPI is a "pseudo" interface specifying the
 * DiscoveryService API which all implementations (i.e. derivations)
 * must conform.
 *
 * This service retrieves restaurant information from a geographical
 * data source, communicating results through two related objects:
 * Eatery and Discovery.  Because this service defines BOTH the
 * Discovery and Eatery objects, they are documented here.
 *
 * - Eatery (detailed restaurant info):
 *
 *   Eatery is a detailed restaurant object (containing complete
 *   details), and is retrieved one at a time (via an eateryId).
 * 
 *   Eatery: {
 *     id,       ... the eateryId
 *     name,
 *     phone,
 *     addr,
 *     loc: {lat, lng},
 *     navUrl,   ... suitable for navigation
 *     website,
 *   }
 *
 * - Discovery (summary restaurant info)
 *
 *   Discovery is a "lighter weight" version of Eatery (with fewer
 *   attributes), and is returned in search results (with multiple
 *   entries).
 *
 *   Discovery: {
 *     id,       ... the eateryId
 *     name,
 *     addr,
 *     loc: {lat, lng},
 *   }
 */
export default class DiscoveryServiceAPI {

  /**
   * Search/retrieve nearby restaurants (asynchronously), returning a set of
   * Discoveries (see class description).
   *
   * **Please Note**: this service uses named parameters.
   *
   * @param {[lat,lng]} loc the geo location to base the
   * nearby search on.
   *
   * @param {number} searchText an optional search text (ex:
   * restaurant name, or town, etc.).
   *
   * @param {number} distance the radius distance (in miles) to
   * search for (1-31), DEFAULT TO 5.
   *
   * @param {string} minprice the minimum price range '0'-'4'
   * (from most affordable to most expensive), DEFAULT TO '1'.
   * 
   * @return {discoveries} the following discoveries structure:
   *   {
   *     pagetoken: 'use-in-next-request', // undefined for no more pages (or 60 entries limit)
   *     discoveries: [ <Discovery> ]
   *   }
   */
  async searchDiscoveries({loc,
                           searchText='',
                           distance=5,
                           minprice='1',
                           ...unknownArgs}={}) {
    throw new Error(`***ERROR*** ${this.constructor.name}.searchDiscoveries() is a required service method that has NOT been implemented`);
  }


  /**
   * Fetch the next-page of a previous searchDiscoveries() request (asynchronously).
   * 
   * @param pagetoken the next page token (supplied by prior
   * searchDiscoveries() invocation).
   * 
   * @return {discoveries} the following discoveries structure (same as searchDiscoveries()):
   *   {
   *     pagetoken: 'use-in-next-request', // undefined for no more pages (or 60 entries limit)
   *     discoveries: [ <Discovery> ]
   *   }
   */
  async searchDiscoveriesNextPage(pagetoken) {
    throw new Error(`***ERROR*** ${this.constructor.name}.searchDiscoveriesNextPage() is a required service method that has NOT been implemented`);
  }


  /**
   * Asynchronously fetch (i.e. retrieve) the details of a fully populated eatery using the
   * supplied eateryId.
   * 
   * @param {string} eateryId the id for the detailed entry to retrieve
   * (same id as returned in Discovery)
   * 
   * @return {Eatery} an Eatery, fully populated
   */
  async fetchEateryDetail(eateryId) {
    throw new Error(`***ERROR*** ${this.constructor.name}.fetchEateryDetail() is a required service method that has NOT been implemented`);
  }

};
