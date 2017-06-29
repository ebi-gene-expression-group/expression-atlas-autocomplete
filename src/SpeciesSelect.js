import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-refetch'

import URI from 'urijs'

class SpeciesSelect extends React.Component {
  constructor(props) {
    super(props)
  }

  _option(label) {
    return <option key={label} value={label}>{label}</option>
  }

  render() {
    const {speciesFetch} = this.props

    if (speciesFetch.fulfilled) {
      return (
        <div>
          <label>Species</label>
          <select onChange={this.props.onChange}>
            <option value={``}>Any</option>
            {speciesFetch.value.topSpecies.map(this._option)}
            <option value={`-`} disabled={`true`}>{speciesFetch.value.separator}</option>
            {speciesFetch.value.allSpecies.map(this._option)}
          </select>
        </div>
      )
    } else if (speciesFetch.pending) {
      return (
        <div>
          <label>Species</label>
          <select>{this._option(`Waiting…`)}</select>
        </div>
      )
    } else {
      return (
        <div>
          <label>Species</label>
          <select>{this._option(`Error!`)}</select>
        </div>
      )
    }
  }
}

SpeciesSelect.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default connect((props) => ({
  speciesFetch: URI(`json/suggestions/species`, props.atlasUrl).toString()
}))(SpeciesSelect)
