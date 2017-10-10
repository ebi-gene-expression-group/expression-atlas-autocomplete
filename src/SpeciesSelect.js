import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'

const fetchResponseJson = async (base, endpoint) => {
  const response = await fetch(URI(endpoint, base).toString())
  const responseJson = await response.json()
  return responseJson
}

const _option = (label) => {
  return <option key={label} value={label}>{label}</option>
}

class SpeciesSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      errorMessage: null,
      species: {
        topSpecies: [],
        separator: ``,
        allSpecies: []
      }
    }

    this._fetchAndSetState = this._fetchAndSetState.bind(this)
  }

  render() {
    return (
      <div>
        <label>Species</label>
        { this.state.loading ?
            <select disabled={`true`}>{_option(`Fetching species…`)}</select> :

          this.state.errorMessage ?
            <select disabled={`true`}>{_option(this.state.errorMessage)}</select> :

            <select onChange={this.props.onChange}>
              <option value={``}>Any</option>
              {this.state.species.topSpecies.map(_option)}
              <option value={`-`} disabled={`true`}>{this.state.species.separator}</option>
              {this.state.species.allSpecies.map(_option)}
            </select>
        }
      </div>
    )
  }

  _fetchAndSetState(baseUrl, relUrl) {
  this.setState({
    loading: true
  })
  return fetchResponseJson  (baseUrl, relUrl)
    .then((responseJson) => {
      this.setState({
        species: responseJson,
        loading: false,
        errorMessage: null
      })
    })
    .catch((reason) => {
      this.setState({
        errorMessage: `${reason.name}: ${reason.message}`,
        loading: false
      })
    })
  }

  componentDidMount() {
    return this._fetchAndSetState(this.props.atlasUrl, `json/suggestions/species`)
  }
}

SpeciesSelect.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default SpeciesSelect
