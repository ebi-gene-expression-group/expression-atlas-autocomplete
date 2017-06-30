import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-refetch'

import URI from 'urijs'

const _option = (label) => {
  return <option key={label} value={label}>{label}</option>
}

const SpeciesSelect = (props) => {
  const {speciesFetch} = props

  return (
    <div>
      <label>Species</label>
      { speciesFetch.fulfilled ?
        <select onChange={props.onChange}>
          <option value={``}>Any</option>
          {speciesFetch.value.topSpecies.map(_option)}
          <option value={`-`} disabled={`true`}>{speciesFetch.value.separator}</option>
          {speciesFetch.value.allSpecies.map(_option)}
        </select> :

        speciesFetch.pending ?
          <select disabled={`true`}>{_option(`Fetching species…`)}</select> :

          <select disabled={`true`}>{_option(`Error fetching species`)}</select>
      }
    </div>
  )
}

SpeciesSelect.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default connect((props) => ({
  speciesFetch: URI(`json/suggestions/species`, props.atlasUrl).toString()
}))(SpeciesSelect)
