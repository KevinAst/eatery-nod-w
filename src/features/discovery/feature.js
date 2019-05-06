import {createFeature}       from 'feature-u';
import _discovery            from './featureName';
import                            './actions'; // _discoveryAct TODO: QUIRKINESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (discoveryFilterFormMeta)
import reducer               from './state';
import logic                 from './logic';
import route                 from './route';
import DiscoveryLeftNavItem  from './comp/DiscoveryLeftNavItem';
import DiscoveriesTitle      from './comp/DiscoveriesTitle';
import DiscoveriesFooter     from './comp/DiscoveriesFooter';

// feature: discovery
//          manage and promotes the discovery view (a list of
//          "discoveries" from GooglePlaces).  Eateries can be
//          added/removed within the pool by simply
//          checking/unchecking the discoveries (full details in README)
export default createFeature({
  name: _discovery,

  // our public face ...
  fassets: {
    defineUse: {
      [`AppMotif.LeftNavItem.cc6_${_discovery}`]: DiscoveryLeftNavItem, // inject our entry into the leftNav

      // auxiliary view content for the discoveries view
      [`AppMotif.auxViewContent.${_discovery}`]: {
        TitleComp:  DiscoveriesTitle,
        FooterComp: DiscoveriesFooter,
      },
    },
  },

  reducer,
  logic,
  route,
});
