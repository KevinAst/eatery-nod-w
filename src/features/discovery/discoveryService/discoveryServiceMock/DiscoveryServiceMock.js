import DiscoveryServiceAPI from '../DiscoveryServiceAPI';
import verify              from 'util/verify';
import isString            from 'lodash.isstring';

import {discoverySearchPage1,   // NOTE: tight coupling with EateryServiceMock (IT's OK ... were a MOCK :-)
        discoverySearchPage2,
        eateriesMockDB}    from '../../../eateries/eateryService/eateryServiceMock/EateryServiceMock';

/**
 * DiscoveryServiceMock is the **mock** DiscoveryServiceAPI
 * derivation.
 *
 * ... see DiscoveryServiceAPI for complete description
 */
export default class DiscoveryServiceMock extends DiscoveryServiceAPI {

  searchDiscoveries({loc,           // ... see DiscoveryServiceAPI
                     searchText='',
                     distance=5,
                     minprice='1',
                     ...unknownArgs}={}) {
    
    // ***
    // *** validate parameters
    // ***

    // NOTE: same as production
    const check = verify.prefix('DiscoveryServiceMock.searchDiscoveries() parameter violation: ');

    check(loc,                            'loc is required ... [lat,lng]'); // TODO: verify loc is array of two numbers
      
    check(isString(searchText),           `supplied searchText (${searchText}) must be a string`);
      
    check(distance,                       'distance is required ... (1-31) miles');
    check(distance>=1 && distance<=31,    `supplied distance (${distance}) must be between 1-31 miles`);
      
    check(minprice,                       'minprice is required ... (0-4)');
    check(minprice>='0' && minprice<='4', `supplied minprice (${minprice}) must be between 0-4`);
      
    const unknownArgKeys = Object.keys(unknownArgs);
    check(unknownArgKeys.length===0,      `unrecognized named parameter(s): ${unknownArgKeys}`);

    return new Promise( (resolve, reject) => {
      // console.log(`xx RETURNING following discoverySearch: `, discoverySearchPage1);
      return resolve(discoverySearchPage1);
    });

  }


  searchDiscoveriesNextPage(pagetoken) { // ... see DiscoveryServiceAPI

    // NOTE: same as production
    const check = verify.prefix('DiscoveryServiceMock.searchDiscoveriesNextPage() parameter violation: ');
    check(pagetoken, 'pagetoken is required');
    check(isString(pagetoken), `supplied pagetoken (${pagetoken}) must be a string`);

    return new Promise( (resolve, reject) => {
      // console.log(`xx RETURNING following discoverySearch: `, discoverySearchPage2);
      return resolve(discoverySearchPage2);
    });
  }


  fetchEateryDetail(eateryId) { // ... see DiscoveryServiceAPI

    return new Promise( (resolve, reject) => {
      // console.log(`xx fetchEateryDetail(${eateryId}) ... returning: `, eateriesMockDB[eateryId]);
      return resolve(eateriesMockDB[eateryId]);
    });

  }

} // end of ... DiscoveryServiceMock class definition
