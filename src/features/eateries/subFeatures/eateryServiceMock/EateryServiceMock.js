import geodist          from 'geodist';
import EateryServiceAPI from '../eateryService/EateryServiceAPI';

/**
 * EateryServiceMock is the **mock** EateryServiceAPI derivation.
 * 
 * NOTE: This represents a persistent service of a real-time DB, where
 *       the monitored DB is retained between service invocations.
 */
export default class EateryServiceMock extends EateryServiceAPI {

  /**
   * Our persistent monitor that manages various aspects of a given pool.
   */
  curPoolMonitor = { // current "pool" monitor (initially a placebo) ... similar concept to production
    pool:      null, // type: string
    monitorCB: null, // type: client CB function
    eateries:  null, // the actual set of eateries in our pool
  };


  monitorDbEateryPool(pool, baseLoc, monitorCB) { // ... see EateryServiceAPI

    // define our initial pool of eateries (a subset of eateriesMockDB)
    const eateries = initialEateryPoolIds.reduce( (hash, id) => {
      hash[id] = eateriesMockDB[id];
      return hash;
    }, {});

    // create a new monitor (retaining needed info for subsequent visibility)
    this.curPoolMonitor = {
      pool,
      monitorCB,
      eateries,
    };

    // supplement eateries with distance from the supplied baseLoc (as the crow flies)
    // ... this mock logic is similar to that of production, but we cheat and do it to our entire DB
    //     as a result it doesn't have to be done again
    for (const eateryId in eateriesMockDB) {
      const eatery = eateriesMockDB[eateryId];
      eatery.distance = geodist([eatery.loc.lat, eatery.loc.lng], [baseLoc.lat, baseLoc.lng]);
    }

    // notify our supplied monitorCB
    // ... NOTE: the API returns void ... it truly is NOT a promise
    monitorCB(eateries);

  }


  addEatery(eatery) { // ... see EateryServiceAPI

    // utilize promise as per API ... resolves: void
    return new Promise( (resolve, reject) => {

      // verify we are monitoring a pool
      // ... NOTE: same as production service
      if (!this.curPoolMonitor.pool) {
        return reject(
          // unexpected condition
          new Error('***ERROR*** (within app logic) EateryServiceMock.addEatery(): may only be called once a successful monitorDbEateryPool() has completed.')
            .defineAttemptingToMsg('add an Eatery to the DB')
        );
      }

      // add the eatery to our DB pool
      // NOTE: this must be immutable to allow redux to recognize the change
      // console.log(`xx addEatery: `, eatery);
      this.curPoolMonitor.eateries = {
        ...this.curPoolMonitor.eateries,
        [eatery.id]: eatery
      };

      // notify our monitorCB
      this.curPoolMonitor.monitorCB(this.curPoolMonitor.eateries);
    });
  }


  removeEatery(eateryId) { // ... see EateryServiceAPI

    // utilize promise as per API ... resolves: void
    return new Promise( (resolve, reject) => {

      // verify we are monitoring a pool
      // ... NOTE: same as production service
      if (!this.curPoolMonitor.pool) {
        return reject(
          // unexpected condition
          new Error('***ERROR*** (within app logic) EateryServiceMock.removeEatery(): may only be called once a successful monitorDbEateryPool() has completed.')
            .defineAttemptingToMsg('remove an Eatery from the DB')
        );
      }


      // remove the eatery to our DB pool
      // NOTE: this must be immutable to allow redux to recoginize the change
      // console.log(`xx removeEatery: ${eateryId}`);
      const eateries = Object.assign({}, this.curPoolMonitor.eateries);
      delete eateries[eateryId];
      this.curPoolMonitor.eateries = eateries;

      // notify our monitorCB
      this.curPoolMonitor.monitorCB(this.curPoolMonitor.eateries);

    });
  }

};


// our initial pool of eateries (a subset of eateriesMockDB)
const initialEateryPoolIds = [
  "ChIJ2_bmEw6vIIYRS7ztDnnLpNg",
  "ChIJaVmoJg6vIIYR9iB3FoxFfEQ",
  "ChIJ6yNtftWuIIYRJrESGu4C5fM",
  "ChIJ6zsQedWuIIYRYmlx6sWCkUw",
  "ChIJ-6rxFimpIIYRCrq8YVb3Ujs",
  "ChIJ6yVNhImlIIYR8tQxm8GDdi0",
  "ChIJ28cfCwymIIYRmTnBVitvmZ0",
  "ChIJ2ybOvA2mIIYRMRjz-wyjyu4",
  "ChIJgTgvHA6mIIYR8-Hw_kHU-f0",
  "ChIJryxqrxCmIIYRtUFAh4d96BY",
  "ChIJs_quaAymIIYRUwRs2-LHWqA",
  "ChIJu2hvxRGmIIYRaS0qajrz0ZE",
  "ChIJ6b-WfSOmIIYRHRWCCIzhh08",
  "ChIJRQDMLA2mIIYR-ZQnRWmSdnU",
  "ChIJ8dWgxgymIIYRyt8bRdLUXXU",
  "ChIJfV2h73KmIIYRRDpBV-crpB8",
  "ChIJvTnAEW6mIIYRqA7o0JRIRyA",
  "ChIJETttTjKkIIYRfnaTcqDqbnw",
  "ChIJO8UE__pZJ4YROei1_1_xklM",
  "ChIJ76kBGjFcJ4YRwmBQteVXEyk",
];

// our MOCK eateries DB pool
export const eateriesMockDB = {
  "ChIJ-6rxFimpIIYRCrq8YVb3Ujs": {
    "addr": "2000 Lakeshore Dr Uc250, New Orleans, LA 70148, USA",
    "id": "ChIJ-6rxFimpIIYRCrq8YVb3Ujs",
    "loc": {
      "lat": 30.02439820000001,
      "lng": -90.0684455
    },
    "name": "Aramark",
    "navUrl": "https://maps.google.com/?cid=4274750946707028490",
    "phone": "(504) 280-6079",
    "website": "https://www.aramark.com/",
    "distance": 3
  },
  "ChIJ01VeXQymIIYRI6lnasCzx3M": {
    "addr": "724 Iberville St, New Orleans, LA 70130, USA",
    "id": "ChIJ01VeXQymIIYRI6lnasCzx3M",
    "loc": {
      "lat": 29.9543,
      "lng": -90.0689558
    },
    "name": "Acme Oyster House",
    "navUrl": "https://maps.google.com/?cid=8342834473727404323",
    "phone": "(504) 522-5973",
    "website": "http://www.acmeoyster.com/french-quarter/",
    "distance": 4
  },
  "ChIJ28cfCwymIIYRmTnBVitvmZ0": {
    "addr": "841 Iberville St, New Orleans, LA 70112, USA",
    "id": "ChIJ28cfCwymIIYRmTnBVitvmZ0",
    "loc": {
      "lat": 29.9553468,
      "lng": -90.0698063
    },
    "name": "Deanie's Seafood Restaurant in the French Quarter",
    "navUrl": "https://maps.google.com/?cid=11356230167321196953",
    "phone": "(504) 581-1316",
    "website": "https://www.deanies.com/",
    "distance": 4
  },
  "ChIJ2_bmEw6vIIYRS7ztDnnLpNg": {
    "addr": "900 Harrison Ave, New Orleans, LA 70124, USA",
    "id": "ChIJ2_bmEw6vIIYRS7ztDnnLpNg",
    "loc": {
      "lat": 30.003912,
      "lng": -90.103667
    },
    "name": "Mondo",
    "navUrl": "https://maps.google.com/?cid=15610825929174924363",
    "phone": "(504) 224-2633",
    "website": "http://www.mondoneworleans.com/",
    "distance": 1
  },
  "ChIJ2ybOvA2mIIYRMRjz-wyjyu4": {
    "addr": "307 Chartres St, New Orleans, LA 70130, USA",
    "id": "ChIJ2ybOvA2mIIYRMRjz-wyjyu4",
    "loc": {
      "lat": 29.9544808,
      "lng": -90.0665677
    },
    "name": "Café Fleur-De-Lis",
    "navUrl": "https://maps.google.com/?cid=17206744602484348977",
    "phone": "(504) 529-9641",
    "website": "http://cafefleurdelis.com/",
    "distance": 4
  },
  "ChIJ6U-QewymIIYRzP5x_fdjwEw": {
    "addr": "115 Bourbon St, New Orleans, LA 70130, USA",
    "id": "ChIJ6U-QewymIIYRzP5x_fdjwEw",
    "loc": {
      "lat": 29.954424,
      "lng": -90.0695719
    },
    "name": "Red Fish Grill",
    "navUrl": "https://maps.google.com/?cid=5530530259171147468",
    "phone": "(504) 598-1200",
    "website": "http://www.redfishgrill.com/",
    "distance": 4
  },
  "ChIJ6b-WfSOmIIYRHRWCCIzhh08": {
    "addr": "2601 Royal St, New Orleans, LA 70117, USA",
    "id": "ChIJ6b-WfSOmIIYRHRWCCIzhh08",
    "loc": {
      "lat": 29.96491200000001,
      "lng": -90.051209
    },
    "name": "Mimi's In the Marigny",
    "navUrl": "https://maps.google.com/?cid=5730797042406659357",
    "phone": "(504) 872-9868",
    "website": "http://mimismarigny.com/",
    "distance": 5
  },
  "ChIJ6yNtftWuIIYRJrESGu4C5fM": {
    "addr": "6100 Hamburg St Suite A, New Orleans, LA 70122, USA",
    "id": "ChIJ6yNtftWuIIYRJrESGu4C5fM",
    "loc": {
      "lat": 30.020369,
      "lng": -90.0767649
    },
    "name": "Yummy Sushi",
    "navUrl": "https://maps.google.com/?cid=17574456342546133286",
    "phone": "(504) 309-9401",
    "website": "not-in-search",
    "distance": 2
  },
  "ChIJ6yVNhImlIIYR8tQxm8GDdi0": {
    "addr": "315 S Broad Ave, New Orleans, LA 70119, USA",
    "id": "ChIJ6yVNhImlIIYR8tQxm8GDdi0",
    "loc": {
      "lat": 29.9636662,
      "lng": -90.0895056
    },
    "name": "Ruby Slipper Cafe",
    "navUrl": "https://maps.google.com/?cid=3275950646514275570",
    "phone": "(504) 525-9355",
    "website": "http://www.therubyslippercafe.net/",
    "distance": 3
  },
  "ChIJ6zsQedWuIIYRYmlx6sWCkUw": {
    "addr": "1522 Robert E Lee Blvd, New Orleans, LA 70122, USA",
    "id": "ChIJ6zsQedWuIIYRYmlx6sWCkUw",
    "loc": {
      "lat": 30.0207669,
      "lng": -90.07682419999999
    },
    "name": "The Füd Bar",
    "navUrl": "https://maps.google.com/?cid=5517334805059037538",
    "phone": "(504) 309-3284",
    "website": "http://www.eathappynola.com/",
    "distance": 2
  },
  "ChIJ76kBGjFcJ4YRwmBQteVXEyk": {
    "addr": "19130 Rogers Ln, Covington, LA 70433, USA",
    "id": "ChIJ76kBGjFcJ4YRwmBQteVXEyk",
    "loc": {
      "lat": 30.4735482,
      "lng": -90.0887137
    },
    "name": "The Chimes-Covington",
    "navUrl": "https://maps.google.com/?cid=2959806024213618882",
    "phone": "(985) 892-5396",
    "website": "http://www.thechimes.com/the-chimes-covington",
    "distance": 32
  },
  "ChIJ7SpQ6RGmIIYRsuU_zP71sBI": {
    "addr": "630 St Peter, New Orleans, LA 70116, USA",
    "id": "ChIJ7SpQ6RGmIIYRsuU_zP71sBI",
    "loc": {
      "lat": 29.9577089,
      "lng": -90.0645131
    },
    "name": "Gumbo Shop",
    "navUrl": "https://maps.google.com/?cid=1346846763281016242",
    "phone": "(504) 525-1486",
    "website": "http://gumboshop.com/",
    "distance": 4
  },
  "ChIJ8VL0ug2mIIYRDrOWNVA6nhY": {
    "addr": "307 Exchange Pl, New Orleans, LA 70130, USA",
    "id": "ChIJ8VL0ug2mIIYRDrOWNVA6nhY",
    "loc": {
      "lat": 29.9546927,
      "lng": -90.067018
    },
    "name": "Green Goddess",
    "navUrl": "https://maps.google.com/?cid=1629804231325561614",
    "phone": "(504) 301-3347",
    "website": "http://greengoddessrestaurant.com/",
    "distance": 4
  },
  "ChIJ8W3hFQymIIYRQObKMMNMyRo": {
    "addr": "808 Bienville St, New Orleans, LA 70112, USA",
    "id": "ChIJ8W3hFQymIIYRQObKMMNMyRo",
    "loc": {
      "lat": 29.9555463,
      "lng": -90.06883859999999
    },
    "name": "GW Fins",
    "navUrl": "https://maps.google.com/?cid=1930158316525905472",
    "phone": "(504) 581-3467",
    "website": "http://gwfins.com/",
    "distance": 4
  },
  "ChIJ8dWgxgymIIYRyt8bRdLUXXU": {
    "addr": "125 Camp St, New Orleans, LA 70130, USA",
    "id": "ChIJ8dWgxgymIIYRyt8bRdLUXXU",
    "loc": {
      "lat": 29.9520226,
      "lng": -90.0687354
    },
    "name": "Red Gravy",
    "navUrl": "https://maps.google.com/?cid=8457149674839334858",
    "phone": "(504) 561-8844",
    "website": "http://redgravycafe.com/",
    "distance": 5
  },
  "ChIJ9Uw1l75cJ4YRXJ2HT-BttUU": {
    "addr": "70456 LA-21 E, Covington, LA 70433, USA",
    "id": "ChIJ9Uw1l75cJ4YRXJ2HT-BttUU",
    "loc": {
      "lat": 30.4537876,
      "lng": -90.1340372
    },
    "name": "Subway Restaurants",
    "navUrl": "https://maps.google.com/?cid=5023041769576045916",
    "phone": "(985) 875-0624",
    "website": "http://order.subway.com/Stores/Redirect.aspx?s=28364&sa=0&f=r&utm_source=google&utm_medium=local&utm_term=0&utm_content=28364&utm_campaign=fwh-local-remote-order&cid=0:0:0:0:0:0&segment_code=0",
    "distance": 30
  },
  "ChIJDVhB0w2mIIYRZVLScBsQtTo": {
    "addr": "739 Conti St, New Orleans, LA 70130, USA",
    "id": "ChIJDVhB0w2mIIYRZVLScBsQtTo",
    "loc": {
      "lat": 29.956247,
      "lng": -90.067626
    },
    "name": "Oceana Grill",
    "navUrl": "https://maps.google.com/?cid=4230305135027442277",
    "phone": "(504) 525-6002",
    "website": "http://www.oceanagrill.com/",
    "distance": 4
  },
  "ChIJDxnIrtelIIYR8sJkRU4JuTM": {
    "addr": "1732 St Charles Ave, New Orleans, LA 70130, USA",
    "id": "ChIJDxnIrtelIIYR8sJkRU4JuTM",
    "loc": {
      "lat": 29.9369517,
      "lng": -90.076805
    },
    "name": "The Avenue Pub",
    "navUrl": "https://maps.google.com/?cid=3727020398402126578",
    "phone": "(504) 586-9243",
    "website": "http://theavenuepub.com/",
    "distance": 5
  },
  "ChIJDyC9Ig6mIIYRDWmrSR08N54": {
    "addr": "718 St Peter, New Orleans, LA 70116, USA",
    "id": "ChIJDyC9Ig6mIIYRDWmrSR08N54",
    "loc": {
      "lat": 29.9582008,
      "lng": -90.0652973
    },
    "name": "Pat O'Brien's",
    "navUrl": "https://maps.google.com/?cid=11400647078199388429",
    "phone": "(504) 525-4823",
    "website": "http://www.patobriens.com/",
    "distance": 4
  },
  "ChIJETttTjKkIIYRfnaTcqDqbnw": {
    "addr": "3128 Magazine St, New Orleans, LA 70115, USA",
    "id": "ChIJETttTjKkIIYRfnaTcqDqbnw",
    "loc": {
      "lat": 29.924039,
      "lng": -90.086011
    },
    "name": "The Rum House",
    "navUrl": "https://maps.google.com/?cid=8966361882979169918",
    "phone": "(504) 941-7560",
    "website": "http://www.therumhouse.com/",
    "distance": 6
  },
  "ChIJFYDeXQymIIYRh1Cion6Ta9I": {
    "addr": "716 Iberville St, New Orleans, LA 70130, USA",
    "id": "ChIJFYDeXQymIIYRh1Cion6Ta9I",
    "loc": {
      "lat": 29.954206,
      "lng": -90.068728
    },
    "name": "Dickie Brennan's Steakhouse",
    "navUrl": "https://maps.google.com/?cid=15162374742576615559",
    "phone": "(504) 522-2467",
    "website": "http://www.dickiebrennanssteakhouse.com/",
    "distance": 4
  },
  "ChIJG_d8TP5eJ4YR6wK6RwXBFkc": {
    "addr": "72011 Holly St, Abita Springs, LA 70420, USA",
    "id": "ChIJG_d8TP5eJ4YR6wK6RwXBFkc",
    "loc": {
      "lat": 30.47869790000001,
      "lng": -90.0391606
    },
    "name": "Abita Brew Pub",
    "navUrl": "https://maps.google.com/?cid=5122493854602887915",
    "phone": "(985) 892-5837",
    "website": "http://www.abitabrewpub.com/",
    "distance": 32
  },
  "ChIJO8UE__pZJ4YROei1_1_xklM": {
    "addr": "1917 Lakeshore Dr, Mandeville, LA 70448, USA",
    "id": "ChIJO8UE__pZJ4YROei1_1_xklM",
    "loc": {
      "lat": 30.3524862,
      "lng": -90.0674878
    },
    "name": "Rips On the Lake",
    "navUrl": "https://maps.google.com/?cid=6022141046362073145",
    "phone": "(985) 727-2829",
    "website": "http://www.ripsonthelake.com/",
    "distance": 23
  },
  "ChIJRQDMLA2mIIYR-ZQnRWmSdnU": {
    "addr": "200 Magazine St, New Orleans, LA 70130, USA",
    "id": "ChIJRQDMLA2mIIYR-ZQnRWmSdnU",
    "loc": {
      "lat": 29.9510068,
      "lng": -90.0674083
    },
    "name": "The Ruby Slipper Cafe",
    "navUrl": "https://maps.google.com/?cid=8464113530518869241",
    "phone": "(504) 525-9355",
    "website": "http://www.therubyslippercafe.net/",
    "distance": 5
  },
  "ChIJT4MvDBKmIIYRFjCBCX693Yc": {
    "addr": "534 St Louis St, New Orleans, LA 70130, USA",
    "id": "ChIJT4MvDBKmIIYRFjCBCX693Yc",
    "loc": {
      "lat": 29.955558,
      "lng": -90.065077
    },
    "name": "NOLA Restaurant",
    "navUrl": "https://maps.google.com/?cid=9790189513996316694",
    "phone": "(504) 522-6652",
    "website": "http://emerilsrestaurants.com/nola",
    "distance": 4
  },
  "ChIJTz6VoQumIIYRAXvVrezBp-U": {
    "addr": "123 Baronne St, New Orleans, LA 70112, USA",
    "id": "ChIJTz6VoQumIIYRAXvVrezBp-U",
    "loc": {
      "lat": 29.9538764,
      "lng": -90.0716274
    },
    "name": "Domenica",
    "navUrl": "https://maps.google.com/?cid=16548408578069068545",
    "phone": "(504) 648-6020",
    "website": "http://www.domenicarestaurant.com/",
    "distance": 4
  },
  "ChIJW3d2Wc2lIIYRu-qs_NaSOkg": {
    "addr": "1403 Washington Ave, New Orleans, LA 70130, USA",
    "id": "ChIJW3d2Wc2lIIYRu-qs_NaSOkg",
    "loc": {
      "lat": 29.9287839,
      "lng": -90.08421849999999
    },
    "name": "Commander's Palace",
    "navUrl": "https://maps.google.com/?cid=5204633771439876795",
    "phone": "(504) 899-8221",
    "website": "https://www.commanderspalace.com/",
    "distance": 6
  },
  "ChIJWegGCA6mIIYRYAiMKN4T4CM": {
    "addr": "713 St Louis St, New Orleans, LA 70130, USA",
    "id": "ChIJWegGCA6mIIYRYAiMKN4T4CM",
    "loc": {
      "lat": 29.95674039999999,
      "lng": -90.06639969999999
    },
    "name": "Antoine's Restaurant",
    "navUrl": "https://maps.google.com/?cid=2585088030994597984",
    "phone": "(504) 581-4422",
    "website": "http://www.antoines.com/",
    "distance": 4
  },
  "ChIJX0qVUw2mIIYRNZcBBOu8Xfs": {
    "addr": "365 Canal St Suite 220, New Orleans, LA 70130, USA",
    "id": "ChIJX0qVUw2mIIYRNZcBBOu8Xfs",
    "loc": {
      "lat": 29.95115109999999,
      "lng": -90.0653869
    },
    "name": "Morton's The Steakhouse",
    "navUrl": "https://maps.google.com/?cid=18112840993924552501",
    "phone": "(504) 566-0221",
    "website": "http://www.mortons.com/neworleans/",
    "distance": 5
  },
  "ChIJXUB3oBGmIIYRDRcvPi-pdDM": {
    "addr": "547 St Ann St, New Orleans, LA 70116, USA",
    "id": "ChIJXUB3oBGmIIYRDRcvPi-pdDM",
    "loc": {
      "lat": 29.95826729999999,
      "lng": -90.0629094
    },
    "name": "Stanley Restaurant",
    "navUrl": "https://maps.google.com/?cid=3707774413604591373",
    "phone": "(504) 587-0093",
    "website": "http://stanleyrestaurant.com/",
    "distance": 4
  },
  "ChIJXXjcfZhcJ4YRWnFiE4ofXes": {
    "addr": "6025 Pinnacle Pkwy, Covington, LA 70433, USA",
    "id": "ChIJXXjcfZhcJ4YRWnFiE4ofXes",
    "loc": {
      "lat": 30.444494,
      "lng": -90.12936499999999
    },
    "name": "Texas Roadhouse",
    "navUrl": "https://maps.google.com/?cid=16959746449638322522",
    "phone": "(985) 867-8008",
    "website": "https://www.texasroadhouse.com/restaurant-locations/louisiana/covington",
    "distance": 30
  },
  "ChIJYbYLMBimIIYR_jUx5ds4Quo": {
    "addr": "536 Frenchmen St, New Orleans, LA 70116, USA",
    "id": "ChIJYbYLMBimIIYR_jUx5ds4Quo",
    "loc": {
      "lat": 29.9632722,
      "lng": -90.0578685
    },
    "name": "Three Muses",
    "navUrl": "https://maps.google.com/?cid=16880116870432241150",
    "phone": "(504) 252-4801",
    "website": "http://www.3musesnola.com/",
    "distance": 4
  },
  "ChIJaS5FoBGmIIYRTXOjqm3XxI0": {
    "addr": "801 Chartres St, New Orleans, LA 70116, USA",
    "id": "ChIJaS5FoBGmIIYRTXOjqm3XxI0",
    "loc": {
      "lat": 29.9583835,
      "lng": -90.063105
    },
    "name": "Muriel's Jackson Square",
    "navUrl": "https://maps.google.com/?cid=10215526720797373261",
    "phone": "(504) 568-1885",
    "website": "http://www.muriels.com/",
    "distance": 4
  },
  "ChIJaVmoJg6vIIYR9iB3FoxFfEQ": {
    "addr": "6300 Argonne Blvd, New Orleans, LA 70124, USA",
    "id": "ChIJaVmoJg6vIIYR9iB3FoxFfEQ",
    "loc": {
      "lat": 30.004869,
      "lng": -90.102976
    },
    "name": "The Velvet Cactus",
    "navUrl": "https://maps.google.com/?cid=4934895759665864950",
    "phone": "(504) 301-2083",
    "website": "http://www.thevelvetcactus.com/",
    "distance": 1
  },
  "ChIJf-CSq3SmIIYR1QNnxY9r5wo": {
    "addr": "333 St Charles Ave, New Orleans, LA 70130, USA",
    "id": "ChIJf-CSq3SmIIYR1QNnxY9r5wo",
    "loc": {
      "lat": 29.950587,
      "lng": -90.07044619999999
    },
    "name": "Luke",
    "navUrl": "https://maps.google.com/?cid=785714925235798997",
    "phone": "(504) 378-2840",
    "website": "http://www.lukeneworleans.com/",
    "distance": 5
  },
  "ChIJfV2h73KmIIYRRDpBV-crpB8": {
    "addr": "401 Poydras St, New Orleans, LA 70130, USA",
    "id": "ChIJfV2h73KmIIYRRDpBV-crpB8",
    "loc": {
      "lat": 29.949065,
      "lng": -90.06708809999999
    },
    "name": "Mother's Restaurant",
    "navUrl": "https://maps.google.com/?cid=2279995583957645892",
    "phone": "(504) 523-9656",
    "website": "http://www.mothersrestaurant.net/",
    "distance": 5
  },
  "ChIJgTgvHA6mIIYR8-Hw_kHU-f0": {
    "addr": "613 Royal St, New Orleans, LA 70130, USA",
    "id": "ChIJgTgvHA6mIIYR8-Hw_kHU-f0",
    "loc": {
      "lat": 29.9575423,
      "lng": -90.0652683
    },
    "name": "The Court of Two Sisters",
    "navUrl": "https://maps.google.com/?cid=18300891940711883251",
    "phone": "(504) 522-7261",
    "website": "http://www.courtoftwosisters.com/",
    "distance": 4
  },
  "ChIJi2AxW3SmIIYRmML7jsbqtb8": {
    "addr": "701 St Charles Ave, New Orleans, LA 70130, USA",
    "id": "ChIJi2AxW3SmIIYRmML7jsbqtb8",
    "loc": {
      "lat": 29.947316,
      "lng": -90.07156100000002
    },
    "name": "Herbsaint",
    "navUrl": "https://maps.google.com/?cid=13814205570552152728",
    "phone": "(504) 524-4114",
    "website": "http://www.herbsaint.com/",
    "distance": 5
  },
  "ChIJiUWE9A2mIIYRngo31C8qPSw": {
    "addr": "416 Chartres St, New Orleans, LA 70130, USA",
    "id": "ChIJiUWE9A2mIIYRngo31C8qPSw",
    "loc": {
      "lat": 29.955348,
      "lng": -90.0655
    },
    "name": "K-Paul's Louisiana Kitchen",
    "navUrl": "https://maps.google.com/?cid=3187750496160385694",
    "phone": "(504) 596-2530",
    "website": "http://www.kpauls.com/",
    "distance": 4
  },
  "ChIJnUfNIiOmIIYRibUzWhx-PBg": {
    "addr": "2440 Chartres St, New Orleans, LA 70117, USA",
    "id": "ChIJnUfNIiOmIIYRibUzWhx-PBg",
    "loc": {
      "lat": 29.9636919,
      "lng": -90.0529387
    },
    "name": "New Orleans Cake Café & Bakery",
    "navUrl": "https://maps.google.com/?cid=1746409415750432137",
    "phone": "(504) 943-0010",
    "website": "http://www.nolacakes.com/",
    "distance": 5
  },
  "ChIJnYiUJxtcJ4YRkAFmz9vshEU": {
    "addr": "1202 N Hwy 190, Covington, LA 70433, USA",
    "id": "ChIJnYiUJxtcJ4YRkAFmz9vshEU",
    "loc": {
      "lat": 30.44807140000001,
      "lng": -90.0815896
    },
    "name": "Acme Oyster House",
    "navUrl": "https://maps.google.com/?cid=5009389114364395920",
    "phone": "(985) 246-6155",
    "website": "http://www.acmeoyster.com/",
    "distance": 30
  },
  "ChIJp6mGj3GmIIYRfS0qjpoGsmo": {
    "addr": "800 Tchoupitoulas St, New Orleans, LA 70130, USA",
    "id": "ChIJp6mGj3GmIIYRfS0qjpoGsmo",
    "loc": {
      "lat": 29.944616,
      "lng": -90.067286
    },
    "name": "Emeril's New Orleans",
    "navUrl": "https://maps.google.com/?cid=7688214774754717053",
    "phone": "(504) 528-9393",
    "website": "http://emerilsrestaurants.com/emerils-new-orleans",
    "distance": 5
  },
  "ChIJpdlCODylIIYRyeE-wYHtahE": {
    "addr": "626 S Carrollton Ave, New Orleans, LA 70118, USA",
    "id": "ChIJpdlCODylIIYRyeE-wYHtahE",
    "loc": {
      "lat": 29.94384989999999,
      "lng": -90.1339165
    },
    "name": "The Camellia Grill",
    "navUrl": "https://maps.google.com/?cid=1255076587724792265",
    "phone": "(504) 309-2679",
    "website": "https://www.facebook.com/pages/Camellia-Grill/104113072958918?rf=250301408353469",
    "distance": 4
  },
  "ChIJryxqrxCmIIYRtUFAh4d96BY": {
    "addr": "1201 Royal St, New Orleans, LA 70116, USA",
    "id": "ChIJryxqrxCmIIYRtUFAh4d96BY",
    "loc": {
      "lat": 29.96209660000001,
      "lng": -90.06116809999999
    },
    "name": "Verti Marte",
    "navUrl": "https://maps.google.com/?cid=1650707284474479029",
    "phone": "(504) 525-4767",
    "website": "not-in-search",
    "distance": 4
  },
  "ChIJs_quaAymIIYRUwRs2-LHWqA": {
    "addr": "144 Bourbon St, New Orleans, LA 70130, USA",
    "id": "ChIJs_quaAymIIYRUwRs2-LHWqA",
    "loc": {
      "lat": 29.9545625,
      "lng": -90.0691287
    },
    "name": "Bourbon House",
    "navUrl": "https://maps.google.com/?cid=11554767571130254419",
    "phone": "(504) 522-0111",
    "website": "http://www.bourbonhouse.com/",
    "distance": 4
  },
  "ChIJt2f3WgymIIYRb1B1S_gWc3I": {
    "addr": "201 Royal St, New Orleans, LA 70130, USA",
    "id": "ChIJt2f3WgymIIYRb1B1S_gWc3I",
    "loc": {
      "lat": 29.9543868,
      "lng": -90.0683629
    },
    "name": "Mr. B's Bistro",
    "navUrl": "https://maps.google.com/?cid=8246960598319190127",
    "phone": "(504) 523-2078",
    "website": "http://www.mrbsbistro.com/",
    "distance": 4
  },
  "ChIJu2hvxRGmIIYRaS0qajrz0ZE": {
    "addr": "717 Orleans St, New Orleans, LA 70116, USA",
    "id": "ChIJu2hvxRGmIIYRaS0qajrz0ZE",
    "loc": {
      "lat": 29.95864749999999,
      "lng": -90.0645742
    },
    "name": "Roux on Orleans Restaurant",
    "navUrl": "https://maps.google.com/?cid=10507446837846879593",
    "phone": "(504) 571-4604",
    "website": "http://www.bourbonorleans.com/restaurant-dining.php",
    "distance": 4
  },
  "ChIJuwqeNamlIIYRiCYSjKciG5c": {
    "addr": "4905 Freret St, New Orleans, LA 70115, USA",
    "id": "ChIJuwqeNamlIIYRiCYSjKciG5c",
    "loc": {
      "lat": 29.935024,
      "lng": -90.1074596
    },
    "name": "Cure",
    "navUrl": "https://maps.google.com/?cid=10888334627103188616",
    "phone": "(504) 302-2357",
    "website": "http://curenola.com/",
    "distance": 5
  },
  "ChIJv2VvX3GmIIYRlCIIn4WtIYY": {
    "addr": "800 Magazine St, New Orleans, LA 70130, USA",
    "id": "ChIJv2VvX3GmIIYRlCIIn4WtIYY",
    "loc": {
      "lat": 29.945088,
      "lng": -90.069051
    },
    "name": "Pêche Seafood Grill",
    "navUrl": "https://maps.google.com/?cid=9665197064724161172",
    "phone": "(504) 522-1744",
    "website": "https://www.pecherestaurant.com/",
    "distance": 5
  },
  "ChIJvTnAEW6mIIYRqA7o0JRIRyA": {
    "addr": "201 Julia St, New Orleans, LA 70130, USA",
    "id": "ChIJvTnAEW6mIIYRqA7o0JRIRyA",
    "loc": {
      "lat": 29.9444575,
      "lng": -90.0647824
    },
    "name": "Mulate's | The Original Cajun Restaurant",
    "navUrl": "https://maps.google.com/?cid=2325907536557379240",
    "phone": "(504) 522-1492",
    "website": "https://www.mulates.com/",
    "distance": 5
  },
  "ChIJzXUQJhimIIYR7wBw72LWWZs": {
    "addr": "508 Frenchmen St, New Orleans, LA 70116, USA",
    "id": "ChIJzXUQJhimIIYR7wBw72LWWZs",
    "loc": {
      "lat": 29.962781,
      "lng": -90.057801
    },
    "name": "The Maison",
    "navUrl": "https://maps.google.com/?cid=11194214069218312431",
    "phone": "(504) 371-5543",
    "website": "http://www.maisonfrenchmen.com/",
    "distance": 4
  },
};


// our discovery list (used by DiscoveryServiceMock)
export const discoverySearchPage1 = {
  pagetoken: 'THERE_IS_MORE',
  discoveries: []
};
export const discoverySearchPage2 = {
  pagetoken: null, // no mo pages
  discoveries: []
};
const discoveryPagingDivision_eateryId = "ChIJTz6VoQumIIYRAXvVrezBp-U";
let divisionHit = false;
for (const eateryId in eateriesMockDB) {
  const eatery = eateriesMockDB[eateryId];
  if (eatery.id === discoveryPagingDivision_eateryId)
    divisionHit = true;
  if (!divisionHit) 
    discoverySearchPage1.discoveries.push(eatery);
  else
    discoverySearchPage2.discoveries.push(eatery);
}
