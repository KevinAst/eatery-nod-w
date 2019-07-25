import ReactDOMServer from 'react-dom/server';
import {launchApp}    from 'feature-u';
import diag$          from 'util/diag$';
import logActions     from 'features/common/diagnostic/logActions/feature'; // enable eatery-nod "logActions" feature
import sandbox        from 'features/common/diagnostic/sandbox/feature';    // enable eatery-nod "sandbox" feature (in left-nav)
import configureFeatureUIntegrationTests  from 'util/configureFeatureUIntegrationTests';


/**
 * Configure eatery-nod diagnostics (non-production code).
 */
export default function configureEateryNodDiagnostics(reducerAspect, logicAspect, routeAspect) {

  // --- eatery-nod sandbox ... ------------------------------------------
  diag$.skip('enable eatery-nod "sandbox" feature (in left-nav)', () => {
    sandbox.enabled = true;
  });

  // --- eatery-nod logging ... ------------------------------------------
  diag$.skip('enable eatery-nod "logActions" feature', () => {
    logActions.enabled = true;
  });

  // --- feature-u logging probes of eatery-nod app ... ------------------
  diag$.skip('enable feature-u logging', () => {
    launchApp.diag.logf.enable();
  });
  diag$.skip('show feature-u react elms as object blobs', () => {
    launchApp.diag.logf.elm2html = (elm) => elm;
  });
  diag$.skip('show feature-u react elms as html markup', () => {
    // NOTE: UNTESTED: react-native / expo had issues resolving this in node
    launchApp.diag.logf.elm2html = (elm) => ReactDOMServer.renderToStaticMarkup(elm);
  });

  // --- feature-u integration tests ... ---------------------------------
  diag$.skip('perform feature-u integration tests', () => {
    configureFeatureUIntegrationTests(reducerAspect, logicAspect, routeAspect);
  });
}
