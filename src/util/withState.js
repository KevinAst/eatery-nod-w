import {connect} from 'react-redux';
import verify    from 'util/verify';

/**
 * Promotes a "wrapped" Component (an HoC - Higher-order Component)
 * that injects redux state props into a `component`, as specified by
 * the various named parameters.
 * 
 * This is a simple wrapper around redux connect(), promoting the
 * following improvements:
 *
 * 1. Removes the ambiguity of `connect()` _(connect to what?)_ by
 *    using a more explicit function name: `withState()`
 *
 * 2. By employing "named" parameters:
 *    - it is self documenting
 *    - the quirkiness of parameter variability is removed
 *      ... no more `undefined` positional parameters
 *    - parameter order is up to the client
 *
 * 3. Provides a "convenient" way to directly emit the
 *    HoC, by directly passing the `component`.
 *
 *    When the `component` is **not supplied**, it
 *    operates in the original way - returning the
 *    HoF _(allowing for "functional composition")_.
 *
 * Central to this process, a Higher-order Function (HoF) is created
 * that encapsulates this "mapping knowledge".  Ultimately, this
 * HoF must be invoked (passing the `component`), which exposes the HoC
 * (the "wrapped" Component).
 * 
 * ```js
 * + withStateHoF(component): HoC
 * ```
 * 
 * There are two ways to use `withState()`:
 * 
 * 1. By directly passing the `component` parameter, the HoC will be
 *    returned _(internally invoking the HoF)_.  This is the most
 *    common use case.
 * 
 * 2. By omitting the `component` parameter, the HoF will be
 *    returned.  This is useful to facilitate "functional composition"
 *    _(in functional programming)_.  In this case it is the client's
 *    responsibility to invoke the HoF _(either directly or
 *    indirectly)_ in order to expose the HoC.
 * 
 * **Please Note** this function uses named parameters.
 *
 * @param {function}        [mapStateToProps]    same as redux connect() docs.
 * @param {object|function} [mapDispatchToProps] same as redux connect() docs.
 * @param {function}        [mergeProps]         same as redux connect() docs.
 * @param {object}          [options]            same as redux connect() docs.
 * @param {ReactComp}       [component]         optionally, the React Component
 *                                               to be wrapped _(see discussion above)_.
 *    
 * @returns {HoC|HoF} either the HoC (the "wrapped" Component) when
 * `component` is supplied, otherwise the HoF _(see discussion
 * above)_.
 *
 * **Examples**:
 * ```js
 *   // auto wrap a MainPage Component ...
 *   export default withState({
 *     component: MainPage, // NOTE: auto wrap MainPage
 *     mapStateToProps(appState) {
 *       return {
 *         deviceStatus: appState.device.status,
 *       };
 *     },
 *     mapDispatchToProps(dispatch, ownProps) {
 *       return {
 *         changeView(view) {
 *           dispatch( actions.view.change(view) );
 *           app.leftNav.close();
 *         },
 *         handleFilterDiscovery() {
 *           dispatch( actions.discovery.filter.open() );
 *           app.leftNav.close();
 *         },
 *       };
 *     },
 *   });
 *
 *
 *   // immediatly invoke the HoF, wrapping MyComp ...
 *   export default withState({
 *     mapStateToProps(appState) {
 *       return {
 *         deviceStatus: appState.device.status,
 *       };
 *     },
 *   })(MyComp); // NOTE: immediatly invoke the HoF, emitting the wrapped MyComp
 * ```
 */
export default function withState({mapStateToProps,
                                   mapDispatchToProps,
                                   mergeProps,
                                   options,
                                   component,
                                   ...unknownArgs}={}) {
  // validate params
  const check = verify.prefix('withState() parameter violation: ');

  // ... all map params are optional
  // ... options param is optional
  // ... component
  if (component) {
    check(typeof component == 'function',
          'component, when supplied, must be a React Component - to be wrapped');
  }
  // ... unrecognized named parameter
  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length === 0,
        `unrecognized named parameter(s): ${unknownArgKeys}`);
  // ... unrecognized positional parameter
  check(arguments.length === 1,
        'unrecognized positional parameters (only named parameters can be specified)');

  // define our HoF that when invoked will expose our HoC wrapper
  // ... this "second level of indirection" encapsulates the knowledge of our "mapping"
  const withStateHoF = connect(mapStateToProps, mapDispatchToProps, mergeProps, options);

  // either return the HoC "wrapped" Component or HoF
  // ... depending on whether the component parameter is supplied
  return component ? withStateHoF(component) : withStateHoF;
}
