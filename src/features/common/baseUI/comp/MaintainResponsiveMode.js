import React,
       {useMemo,
        useCallback} from 'react';

import {useSelector,
        useDispatch} from 'react-redux'

import _baseUIAct           from '../actions';
import {getResponsiveMode}  from '../state';

import Chip          from '@material-ui/core/Chip';
import Divider       from '@material-ui/core/Divider';
import CheckedIcon    from '@material-ui/icons/Check';
import UserMenuItem  from 'features/common/baseUI/comp/UserMenuItem';

import {confirm}     from 'util/notify';


/**
 * MaintainResponsiveMode: our user-profile menu items (in the App Header)
 * 
 * NOTE: Because this is a "custom" component that is held in Menu
 *       (a ButtonBase MenuItem) it must be able to hold a ref ... hence
 *       the React.forwardRef()!
 *       see: https://material-ui.com/guides/migration-v3/#button
 *            https://material-ui.com/guides/composition/#caveat-with-refs
 *            AVOIDS following log:
 *            Warning: Function components cannot be given refs. Attempts to access
 *                     this ref will fail. Did you mean to use React.forwardRef()?
 * NOTE: Subsequent Discovery: I think this is really due to the fact that
 *       we were injecting <Divider/> too!
 *       This React.forwardRef() was NOT needed in src/features/common/auth/comp/AuthUserMenu.js,
 *       where it simply injected a series of <UserMenuItem>s in a React.Fragment ... hmmmm
 */
const MaintainResponsiveMode = React.forwardRef( (props, ref) => {

  const responsiveMode = useSelector((appState) => getResponsiveMode(appState), []);

  const ChipIcon = useMemo(() => responsiveMode==='off' ? ()=>null : CheckedIcon, [responsiveMode]);

  const dispatch                = useDispatch();
  const maintainResponsiveMode  = useCallback(() => {
    confirm.success({ 
      msg: `The eatery-nod-w app is designed with mobile devices in mind (i.e. cell phones).

When the "responsive" mode is enabled, selected screens will dynamically adjust to take advantage of the additional screen real estate.  As an example, a simple list can morph into a detailed table.

You can define the "responsive" boundary where additional content is manifest (based on the screen width), or disable it altogether.

Set the "responsive" boundary to:
(** is current)`,
      actions: [
        ...defineActions(responsiveMode, dispatch),
        { txt: 'Close' },
      ]
    });
  }, []);

  return (
    <span {...props} ref={ref}>
      <UserMenuItem onClick={maintainResponsiveMode}>
        <Chip label="responsive"
              icon={<ChipIcon/>}/>
      </UserMenuItem>
      <Divider/>
    </span>
  );
});  
export default MaintainResponsiveMode;


const breakpoints = [
//{name: 'Phone',      value: 'xs'},  // xs, extra-small:    0px ... breakpoint ranges are from this point TO the next range (inclusive)
  {name: 'Tablet',     value: 'sm'},  // sm, small:        600px
  {name: 'Desktop',    value: 'md'},  // md, medium:       960px
  {name: 'Landscape',  value: 'lg'},  // lg, large:       1280px
//{name: 'Super-Wide', value: 'xl'},  // xl, extra-large: 1920px
  {name: 'Disable',    value: 'off'},
];

const defineActions = (curResponsiveMode, dispatch) => breakpoints.map( (breakpoint) => ({
  txt:    `${ curResponsiveMode===breakpoint.value ? '**' : '' }${breakpoint.name}`,
  action: () => dispatch( _baseUIAct.setResponsiveMode(breakpoint.value) ),
}) );
