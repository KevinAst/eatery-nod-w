import React  from 'react';
import Fade   from '@material-ui/core/Fade';
import Slide  from '@material-ui/core/Slide';
import Zoom   from '@material-ui/core/Zoom';

//***
//*** Common Transition components used throughout our app :-)
//***

export const TransitionFade  = React.forwardRef( (props, ref) => <Fade  ref={ref} timeout="1000"                   {...props} /> );
export const TransitionSlide = React.forwardRef( (props, ref) => <Slide ref={ref} direction="right" timeout="1000" {...props} /> );
export const TransitionZoom  = React.forwardRef( (props, ref) => <Zoom  ref={ref} timeout="1000"                   {...props} /> );
