import React from 'react'
import ReactDOM from 'react-dom'

import AtlasAutocomplete from '../src/index.jsx'

const render = function (options, target) {
  ReactDOM.render(<AtlasAutocomplete {...options} />, document.getElementById(target))
}

export {render}