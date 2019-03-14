import React              from 'react';
import ReactDOM           from 'react-dom';
import CssBaseline        from '@material-ui/core/CssBaseline';
import Notify             from './util/notify';
import TempJunk           from './TempJunk';
import * as serviceWorker from './util/serviceWorker';

function App() {
  return (
    <React.Fragment>
      <Notify/>      {/* ?? required in root  */}
      <CssBaseline/> {/* ?? required in root  */}
      <TempJunk/>    {/* ?? temp for now */}
    </React.Fragment>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
