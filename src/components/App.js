import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

const App = (props) => {
  return (



    <div>
        <div className="ui fixed inverted menu">
          <div className="ui container">
            <IndexLink className="ui item" to="/">Stark</IndexLink> 
            <Link className="ui item"  to="/About">About</Link> 
             <Link className="ui item" to="/editor"> Code Editor </Link>
          </div>
        </div>

      {props.children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
