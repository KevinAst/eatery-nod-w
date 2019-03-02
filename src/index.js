import React    from 'react';
import ReactDOM from 'react-dom';
import Button   from '@material-ui/core/Button';
import * as serviceWorker from './util/serviceWorker';

function App() {
  return (
    <Button variant="contained" color="primary">
      Hello Eatery Nod
    </Button>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
