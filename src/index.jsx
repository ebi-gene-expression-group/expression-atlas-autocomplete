import React from 'react';
import ReactDOM from 'react-dom';

import AtlasAutocomplete from './AtlasAutocomplete.jsx';

const render = function (options, target) {
  ReactDOM.render(<AtlasAutocomplete {...options} />, document.getElementById(target))
}

export {render}
