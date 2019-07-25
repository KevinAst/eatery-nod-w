import DiscoveryServiceAPI from '../discoveryService/DiscoveryServiceAPI';
import verify              from 'util/verify';
import isString            from 'lodash.isstring';
import featureFlags        from 'featureFlags';

import {discoverySearchPage1,   // NOTE: tight coupling with EateryServiceMock (IT's OK ... were a MOCK :-)
        discoverySearchPage2,
        eateriesMockDB}    from '../../../eateries/subFeatures/eateryServiceMock/EateryServiceMock';

/**
 * DiscoveryServiceMock is the **mock** DiscoveryServiceAPI
 * derivation.
 *
 * ... see DiscoveryServiceAPI for complete description
 */
export default class DiscoveryServiceMock extends DiscoveryServiceAPI {

  constructor() {
    super();
    !featureFlags.useWIFI && console.log('***eatery-nod-w*** mocking DiscoveryService (via DiscoveryServiceMock)');
  }

  async searchDiscoveries({loc,           // ... see DiscoveryServiceAPI
                           searchText='',
                           distance=5,
                           minprice='1',
                           ...unknownArgs}={}) {
    // validate parameters
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

    // return mocked discoveries (first page)
    // console.log(`xx RETURNING following discoverySearch: `, discoverySearchPage1);
    return discoverySearchPage1;
  }


  async searchDiscoveriesNextPage(pagetoken) { // ... see DiscoveryServiceAPI
    // validate parameters
    // NOTE: same as production
    const check = verify.prefix('DiscoveryServiceMock.searchDiscoveriesNextPage() parameter violation: ');
    check(pagetoken, 'pagetoken is required');
    check(isString(pagetoken), `supplied pagetoken (${pagetoken}) must be a string`);

    // return mocked discoveries (second page)
    // console.log(`xx RETURNING following discoverySearch: `, discoverySearchPage2);
    return discoverySearchPage2;
  }


  async fetchEateryDetail(eateryId) { // ... see DiscoveryServiceAPI
    // return mocked discovery
    // console.log(`xx fetchEateryDetail(${eateryId}) ... returning: `, eateriesMockDB[eateryId]);
    return eateriesMockDB[eateryId];
  }

} // end of ... DiscoveryServiceMock class definition
