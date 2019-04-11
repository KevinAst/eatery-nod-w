import React  from 'react';
import Fade   from '@material-ui/core/Fade';
import Slide  from '@material-ui/core/Slide';
import Zoom   from '@material-ui/core/Zoom';

//***
//*** Common Transition components used throughout our app :-)
//***

export function TransitionFade(props) {
  return <Fade timeout="1000" {...props} />;
}

export function TransitionSlide(props) {
  return <Slide direction="right" timeout="1000" {...props} />;
}

export function TransitionZoom(props) {
  return <Zoom timeout="1000" {...props} />;
}
