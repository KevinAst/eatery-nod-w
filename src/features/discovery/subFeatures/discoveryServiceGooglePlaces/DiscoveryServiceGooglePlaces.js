import DiscoveryServiceAPI from '../discoveryService/DiscoveryServiceAPI';
import verify              from 'util/verify';
import isString            from 'lodash.isstring';


/**
 * DiscoveryServiceGooglePlaces is the **real** DiscoveryServiceAPI
 * derivation using the GooglePlaces service APIs.
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
export default class DiscoveryServiceGooglePlaces extends DiscoveryServiceAPI {

  /**
   * Search/retrieve nearby restaurants, returning a set of
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
   * @return {discoveries via promise} a promise resolving to the
   * following discoveries structure:
   *   {
   *     pagetoken: 'use-in-next-request', // undefined for no more pages (or 60 entries limit)
   *     discoveries: [ <Discovery> ]
   *   }
   */
  searchDiscoveries({loc,
                     searchText='',
                     distance=5,
                     minprice='1',
                     ...unknownArgs}={}) {
    
    // ***
    // *** validate parameters
    // ***

    const check = verify.prefix('DiscoveryServiceGooglePlaces.searchDiscoveries() parameter violation: ');

    check(loc,                            'loc is required ... [lat,lng]'); // TODO: verify loc is array of two numbers
      
    check(isString(searchText),           `supplied searchText (${searchText}) must be a string`);
      
    check(distance,                       'distance is required ... (1-31) miles');
    check(distance>=1 && distance<=31,    `supplied distance (${distance}) must be between 1-31 miles`);
      
    check(minprice,                       'minprice is required ... (0-4)');
    check(minprice>='0' && minprice<='4', `supplied minprice (${minprice}) must be between 0-4`);
      
    const unknownArgKeys = Object.keys(unknownArgs);
    check(unknownArgKeys.length===0,      `unrecognized named parameter(s): ${unknownArgKeys}`);


    // ***
    // *** define the selection criteria used in our GooglePlaces retrieval
    // ***

    // a PlaceSearchRequest
    const selCrit = {
      // ... supplied by client (via params)
      location:      {lat: loc[0], lng: loc[1]},
      radius:        miles2meters(distance),
      minPriceLevel: minprice,

      // ... hard coded by our "eatery" requirements
      type:     'restaurant',
    };

    // ... searchText is optional
    if (searchText) {
      selCrit.keyword = searchText;
    }


    // ***
    // *** issue the Google PlacesService request
    // ***

    return new Promise( (resolve, reject) => {

      // retain _resolve/_reject in an outer scope 
      // ... because the SAME callback function instance is used on pagination
      // ... kinda hoaky (may be a better way)
      _resolve = resolve;
      _reject  = reject;

      try {
        googlePlacesService().nearbySearch(
          selCrit,
          (places, status, pagination) => {
            // places:     PlaceResult[]
            // status:     PlacesServiceStatus
            // pagination: PlaceSearchPagination ... hasNextPage(): true/false ... nextPage() with same callback

            const err = checkResponseStatus(status);
            if (err) {
              return _reject(err);
            }

            // retain pagination for subsequent requests
            _pagination = pagination.hasNextPage ? pagination : null;

            // process results
            const discoveriesJson = gp2discoveries(places, pagination);
            // console.log(`xx process discovery results: `, discoveriesJson);
            return _resolve(discoveriesJson);
          }
        );
      }
      catch(err) { // catch/expose internal errors in Google PlacesService
        // console.log('xx searchDiscoveries: ... caught unexpected error in in Google PlacesService: ', err);
        return _reject(err);
      }

    });
  }


  /**
   * Fetch the next-page of a previous searchDiscoveries() request.
   * 
   * @param pagetoken the next page token (supplied by prior
   * searchDiscoveries() invocation).
   * 
   * @return {discoveries via promise} a promise resolving to the
   * following discoveries structure (same as searchDiscoveries()):
   *   {
   *     pagetoken: 'use-in-next-request', // undefined for no more pages (or 60 entries limit)
   *     discoveries: [ <Discovery> ]
   *   }
   */
  searchDiscoveriesNextPage(pagetoken) {

    const check = verify.prefix('DiscoveryServiceGooglePlaces.searchDiscoveriesNextPage() parameter violation: ');
    check(pagetoken, 'pagetoken is required');
    check(isString(pagetoken), `supplied pagetoken (${pagetoken}) must be a string`);
    
    // process any pagetoken requests
    if (_pagination) {
      return new Promise( (resolve, reject) => {

        // retain _resolve/_reject in an outer scope 
        // ... because the SAME callback function instance is used on pagination
        // ... kinda hoaky (may be a better way)
        _resolve = resolve;
        _reject  = reject;

        _pagination.nextPage(); // NOTE: this uses the SAME callback in the original search (kinda weird)
      });
    }
    else {
      throw new Error('*** ERROR *** DiscoveryServiceGooglePlaces - Next page requested, when there are NO additional pages');
    }
  }


  /**
   * Fetch (i.e. retrieve) the details of a fully populated eatery using the
   * supplied eateryId.
   * 
   * @param {string} eateryId the id for the detailed entry to retrieve
   * (same id as returned in Discovery)
   * 
   * @return {promise} a promise resolving the Eatery
   */
  fetchEateryDetail(eateryId) {

    return new Promise( (resolve, reject) => {

      try {
        googlePlacesService().getDetails(
          {
            fields: [
              'place_id',
              'name',
              'formatted_phone_number',
              'geometry',
              'formatted_address',
              'url',
              'website',
            ],
            placeId: eateryId,
          },
          (place, status) => {
            // place:   PlaceResult
            // status:  PlacesServiceStatus

            const err = checkResponseStatus(status);
            if (err) {
              return reject(err);
            }

            // process results
            const eatery = gp2eatery(place);
            // console.log(`xx fetchEateryDetail: eatery result: `, eatery);
            return resolve(eatery);
          }
        );
      }
      catch(err) { // catch/expose internal errors in Google PlacesService
        // console.log('xx fetchEateryDetail: ... caught unexpected error in in Google PlacesService: ', err);
        return reject(err);
      }

    });
  }

} // end of ... DiscoveryServiceGooglePlaces class definition


// ***
// *** Retained pagination controls for subsequent page requests
// ***

let _pagination = null; // type: PlaceSearchPagination (null for none)
let _resolve    = null; // active promise resolution ... kinda hoaky, but pagination callback uses SAME function instance :-(
let _reject     = null; // ditto



let _googlePlacesService = null; // lazily loaded

/**
 * Return the Google PlacesService object.
 */
function googlePlacesService() {

  // use previously obtained object (if any)
  if (_googlePlacesService) {
    return _googlePlacesService;
  }

  // otherwise ... lazy load
  
  // NOTE: we must reference windows.google, to prevent babel "not defined" compiler error
  const google = window.google;

  if (!google) {
    throw new Error('*** ERROR *** DiscoveryServiceGooglePlaces - NO google object has been defined from our initialization');
  }

  // create/return our service
  // NOTE: we swallow visual results (intended for maps) using a dummy div (i.e. no map for me)
  return _googlePlacesService = new google.maps.places.PlacesService(document.createElement('div'));
}


/**
 * Convert GooglePlaces response to a list of discoveries.
 * 
 * @param {PlaceResult[]} places the GooglePlaces response.
 * 
 * @param {PlaceSearchPagination} pagination the GooglePlaces response.
 * 
 * @return {Object} eatery-nod data structure containing discoveries.
 */
function gp2discoveries(places, pagination) {
  return {
    pagetoken:   pagination.hasNextPage ? 'giveMeTheNextPagePlease' : null, // null for NO additional pages
    discoveries: places.map( place => gp2eatery(place) )
  };
}


/**
 * Convert GooglePlaces response to either an eatery or discovery
 * object (controlled by gpResp).
 * 
 * @param {PlaceResult} place the GooglePlaces response from either
 * searchDiscoveries() or fetchEateryDetail().
 * 
 * @return {Discovery|Eatery} either a Discovery or Eatery object.
 */
function gp2eatery(place) {
  return {
    id:      place.place_id,
    name:    place.name,
    phone:   place.formatted_phone_number || 'not-in-search',
    loc:     {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
    addr:    place.formatted_address || place.vicinity, // eatery (i.e. detail) vs. discovery (i.e. search index)
    navUrl:  place.url     || 'not-in-search',
    website: place.website || 'not-in-search',
  };
}


/**
 * Convert supplied miles to meters.
 */
function miles2meters(miles) {
  return miles * 1609.34;
}


/**
 * Validate response status.
 */
function checkResponseStatus(status) {
  // success
  if (status === 'OK' || status === 'ZERO_RESULTS') {
  }
  // error
  else {
    return new Error(`*** ERROR *** DiscoveryServiceGooglePlaces - Google Places ERROR STATUS: '${status}'`);
  }
}
