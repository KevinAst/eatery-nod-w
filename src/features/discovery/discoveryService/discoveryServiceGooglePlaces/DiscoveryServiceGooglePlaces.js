import DiscoveryServiceAPI from '../DiscoveryServiceAPI';
import apiKey              from './config/googlePlacesApiKey';
import verify              from '../../../../util/verify';
import isString            from 'lodash.isstring';

// ***
// *** INTERNAL NOTE: sample Google Places search:
// ***
//     - Near By Place Search:
//       https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.752209,-89.986610&radius=8000&type=restaurant&key=YOUR_API_KEY
//     - Place Details:
//       https://maps.googleapis.com/maps/api/place/details/json?placeid=xxx&key=YOUR_API_KEY


// ***
// *** Various Internal Constants
// ***

const googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
const esc                 = encodeURIComponent; // alias of standard JS function

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
                     pagetoken=null, // internal (private/hidden) argument used by searchDiscoveriesNextPage()
                     ...unknownArgs}={}) {
    
    // ***
    // *** validate parameters
    // ***

    const check = verify.prefix('DiscoveryServiceGooglePlaces.searchDiscoveries() parameter violation: ');

    if (!pagetoken) { // when NOT a searchDiscoveriesNextPage() service request, validate parameters
      check(loc,                            'loc is required ... [lat,lng]'); // TODO: verify loc is array of two numbers
      
      check(isString(searchText),           `supplied searchText (${searchText}) must be a string`);
      
      check(distance,                       'distance is required ... (1-31) miles');
      check(distance>=1 && distance<=31,    `supplied distance (${distance}) must be between 1-31 miles`);
      
      check(minprice,                       'minprice is required ... (0-4)');
      check(minprice>='0' && minprice<='4', `supplied minprice (${minprice}) must be between 0-4`);
      
      const unknownArgKeys = Object.keys(unknownArgs);
      check(unknownArgKeys.length===0,      `unrecognized named parameter(s): ${unknownArgKeys}`);
    }


    // ***
    // *** define the selection criteria used in our GooglePlaces retrieval
    // ***

    let selCrit = null;

    if (pagetoken) { // next-page requests ... from searchDiscoveriesNextPage()
      selCrit = {
        pagetoken,
        key: apiKey
      };
    }
    else {
      selCrit = {
        // ... supplied by client (via params)
        location: loc,
        radius:   miles2meters(distance),
        minprice,

        // ... hard coded by our "eatery" requirements
        type:     'restaurant',
        key:      apiKey
      };

      // ... searchText is optional
      if (searchText) {
        selCrit.keyword = searchText;
      }
    }

    // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.input.selCrit.js
    // console.log(`xx sample.searchEateries.input.selCrit: `, selCrit);


    // ***
    // *** define our URL, injecting the selCrit as a queryStr
    // ***

    const queryStr  = Object.keys(selCrit).map( k => `${esc(k)}=${esc(selCrit[k])}` ).join('&');
    const searchUrl = `${googlePlacesBaseUrl}/nearbysearch/json?${queryStr}`;

    // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.input.queryStr.txt
    // console.log(`xx sample.searchEateries.input.queryStr: `, queryStr);

    // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.input.searchUrl.txt
    // console.log(`xx sample.searchEateries.input.searchUrl: `, searchUrl);


    // ***
    // *** issue our network retrieval, returning our promise
    // ***

    return fetch(searchUrl)
      .then( checkHttpResponseStatus ) // validate the http response status
      .then( validResp => {
        // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.output.validResp.txt
        // console.log(`xx sample.searchEateries.output.validResp: `, validResp);

        // convert payload to JSON
        // ... this is a promise (hence the usage of an additional .then())
        return validResp.json();
      })
      .then( payloadJson => {
        // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.output.payloadJson.js
        // console.log(`xx sample.searchEateries.output.payloadJson: `, JSON.stringify(payloadJson));

        // insure the GooglePlaces status field is acceptable
        if (payloadJson.status !== 'OK' && payloadJson.status !== 'ZERO_RESULTS') {
          const errMsg = payloadJson.error_message ? ` - ${payloadJson.error_message}` : '';
          // console.log(`xx *** ERROR-BY-GooglePlaces-STATUS *** GooglePlaces searchEateries: `, JSON.stringify(payloadJson));
          throw new Error(`*** ERROR-BY-GooglePlaces-STATUS *** payloadJson.status: ${payloadJson.status}${errMsg}`);
        }

        // convert to discoveries
        const discoveriesJson = gp2discoveries(payloadJson);
        // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.output.eateryResultsJson.js
        // console.log(`xx DiscoveryServiceGooglePlaces.searchDiscoveries() -and- MOCK RECORDING (N/A) ... returning discoveries: ${JSON.stringify(discoveriesJson)}`);

        return discoveriesJson;
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
    
    // pass request through to searchDiscoveries()
    return this.searchDiscoveries({pagetoken});
  }


  /**
   * Fetch (i.e. retreive) the details of a fully populated eatery using the
   * supplied eateryId.
   * 
   * @param {string} eateryId the id for the detailed entry to retrieve
   * (same id as returned in Discovery)
   * 
   * @return {promise} a promise resolving the Eatery
   */
  fetchEateryDetail(eateryId) {

    // ***
    // *** define the parameters used in our GooglePlaces retrieval
    // ***

    const params = {
      // ... supplied by client (via params)
      placeid: eateryId,

      // ... hard coded
      key:      apiKey
    };

    // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.input.params.js
    // console.log(`xx sample.getEateryDetail.input.params: `, params);


    // ***
    // *** define our URL, injecting the params as a queryStr
    // ***

    const queryStr  = Object.keys(params).map( k => `${esc(k)}=${esc(params[k])}` ).join('&');
    const url = `${googlePlacesBaseUrl}/details/json?${queryStr}`;

    // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.input.queryStr.txt
    // console.log(`xx sample.getEateryDetail.input.queryStr: `, queryStr);

    // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.input.url.txt
    // console.log(`xx sample.getEateryDetail.input.url: `, url);


    // ***
    // *** issue our network retrieval, returning our promise
    // ***

    return fetch(url)
      .then( checkHttpResponseStatus ) // validate the http response status
      .then( validResp => {
        // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.output.validResp.txt
        // console.log(`xx sample.getEateryDetail.output.validResp: `, validResp);

        // convert payload to JSON
        // ... this is a promise (hence the usage of an additional .then())
        return validResp.json();
      })
      .then( payloadJson => {

        // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.output.payloadJson.js
        // console.log(`xx sample.getEateryDetail.output.payloadJson: `, JSON.stringify(payloadJson));

        // interpret GooglePlaces status error conditions
        if (payloadJson.status !== 'OK') {
          const errMsg = payloadJson.error_message ? ` - ${payloadJson.error_message}` : '';
          // console.log(`xx *** ERROR-BY-GooglePlaces-STATUS *** GooglePlaces getEateryDetail: `, JSON.stringify(payloadJson));
          throw new Error(`*** ERROR-BY-GooglePlaces-STATUS *** payloadJson.status: ${payloadJson.status}${errMsg}`);
        }

        // convert to eatery
        const eatery = gp2eatery(payloadJson.result);
        // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.output.eatery.js
        // console.log(`xx sample.getEateryDetail.output.eatery: `, JSON.stringify(eatery));

        return eatery;
      });

  }

} // end of ... DiscoveryServiceGooglePlaces class definition





/**
 * Convert GooglePlaces response to a list of discoveries.
 * 
 * @param {Object} gpResp the raw GooglePlaces response from
 * searchDiscoveries().
 * 
 * @return {Object} eatery-nod data structure containing discoveries.
 */
function gp2discoveries(gpResp) {
  return {
    pagetoken:   gpResp.next_page_token || null, // non-exist if NO additional pages (i.e. undefined)
    discoveries: gpResp.results.map( result => gp2eatery(result) )
  };
}


/**
 * Convert GooglePlaces response to either an eatery or discovery
 * object (controlled by gpResp).
 * 
 * @param {Object} gpResp the GooglePlaces response from either
 * searchDiscoveries() or fetchEateryDetail().
 * 
 * @return {Discovery|Eatery} either a Discovery or Eatery object.
 */
function gp2eatery(gpResult) {
  return {
    id:      gpResult.place_id,
    name:    gpResult.name,
    phone:   gpResult.formatted_phone_number || 'not-in-search',
    loc:     gpResult.geometry.location,
    addr:    gpResult.formatted_address || gpResult.vicinity, // eatery (i.e. detail) vs. discovery (i.e. search index)
    navUrl:  gpResult.url     || 'not-in-search',
    website: gpResult.website || 'not-in-search',
  };
}


/**
 * Convert supplied miles to meters.
 */
function miles2meters(miles) {
  return miles * 1609.34;
}


/**
 * Validate http response status.
 */
function checkHttpResponseStatus(resp) {

  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.output.resp.txt
  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.output.resp.txt
  // console.log(`xx sample.searchEateries.output.resp: `, resp);

  if (resp.status >= 200 && resp.status < 300) {
    return resp; // valid
  } 
  else { // invalid
    const errMsg = resp.statusText ? ` - ${resp.statusText}` : '';
    let   err    = new Error(`*** ERROR-BY-HTTP-STATUS *** HTTP Fetch Status: ${resp.status}${errMsg}`);
    err.response = resp;
    throw err;
  }
}
