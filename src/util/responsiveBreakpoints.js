import {useTheme}           from '@material-ui/core/styles';
import useMediaQuery        from '@material-ui/core/useMediaQuery';
import {useSelector}        from 'react-redux'
import {getResponsiveMode}  from 'features/common/baseUI/state'


/**
 * A react hook promoting a boolean indicator (true/false) as to
 * whether the device's width represents a typical cell phone.
 * 
 * @return {boolean} see description (above)
 */
export function useForCellPhone() {
  const theme       = useTheme();
  const isCellPhone = useMediaQuery(theme.breakpoints.down('xs')); // available breakpoints: xs/sm/md/lg/xl

  return isCellPhone;
}


/**
 * A react hook promoting a boolean indicator (true/false) as to
 * whether the device's width is sufficient to be considered a tablet
 * (or greater - such as a desktop).
 *
 * @return {boolean} see description (above)
 *
 * @deprecated ... currently NOT used
 */
export function useForTabletPlus() {
  const theme        = useTheme();
  const isTabletPlus = useMediaQuery(theme.breakpoints.up('md')); // breakpoints: xs/sm/md/lg/xl

  return isTabletPlus;
}


/**
 * A react hook promoting a boolean indicator (true/false) as to
 * whether the device's width is sufficient to be filled with more
 * content (such as a tablet or desktop).
 *
 * This algorithm is based on the breakpoint defined in the
 * reactiveMOde state, which can be controlled by the user -AND-
 * disabled.
 *
 * @return {boolean} see description (above)
 */

export function useForWiderDevice() {
  const responsiveMode  = useSelector( (appState) => getResponsiveMode(appState), [] );
  const theme           = useTheme();
  const isWiderDevice   = useMediaQuery(theme.breakpoints.up(responsiveMode)); // NOTE: theme.breakpoints.up('off'): false

  return isWiderDevice;
}
