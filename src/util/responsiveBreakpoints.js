import {useTheme}     from '@material-ui/core/styles';
import useMediaQuery  from '@material-ui/core/useMediaQuery';


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
 * TODO: ?? also tap into responsive state
 * NOTE: This algorithm also considers the "reactive" state, allowing
 *       the user to "opt out" of wider-screen formats.
 *
 * @return {boolean} see description (above)
 */
export function useForTabletPlus() {
  const theme        = useTheme();
  const isTabletPlus = useMediaQuery(theme.breakpoints.up('md')); // breakpoints: xs/sm/md/lg/xl

  return isTabletPlus;
}
