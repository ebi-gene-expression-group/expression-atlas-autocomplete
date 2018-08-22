import React from 'react'
import PropTypes from 'prop-types'

const _option = (label) => {
  return <option key={label} value={label}>{label}</option>
}

const SpeciesSelect = ({statusMessage, topSpecies, allSpecies, separator, onChange, selectedValue}) =>
  <div>
    <label>Species</label>
    { statusMessage ?
      <select disabled={`true`}>{_option(statusMessage)}</select> :

      <select onChange={onChange} value={selectedValue}>
        <option value={``}>Any</option>
        {topSpecies.length && topSpecies.map(_option)}
        {topSpecies.length && <option value={`-`} disabled={`true`}>{Math.random() < 0.999 ? `━━━━━━━━━━━━` : `(╯°□°）╯︵ ┻━┻`}</option>}
        {allSpecies.map(_option)}
      </select>
    }
  </div>

SpeciesSelect.propTypes = {
  topSpecies: PropTypes.arrayOf(PropTypes.string).isRequired,
  allSpecies: PropTypes.arrayOf(PropTypes.string).isRequired,
  statusMessage: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.string
}

export default SpeciesSelect
