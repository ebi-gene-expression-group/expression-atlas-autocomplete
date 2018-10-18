import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'

import URI from 'urijs'

import SpeciesSelect from './SpeciesSelect.js'

class AtlasAutocomplete extends React.Component {
  constructor(props) {
     super(props)

     this.state = {
      selectedItem: this.props.initialValue,
      selectedSpecies: this.props.defaultSpecies,
      currentSuggestions: []
    }

    this.updateSuggestions = this._updateSuggestions.bind(this)
    this.speciesSelectOnChange = this._speciesSelectOnChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
          selectedItem: nextProps.initialValue
      })
  }

  _speciesSelectOnChange(event) {
    this.setState({ selectedSpecies: event.target.value })
  }

  _updateSuggestions(event, value) {
    this.setState({
      selectedItem: value
    })

    const suggesterUrl = URI(this.props.suggesterEndpoint, this.props.atlasUrl).search({
      query: value,
      species: this.state.selectedSpecies ? this.state.selectedSpecies : this.props.allSpecies.join()
    }).toString()

    fetch(suggesterUrl)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.setState({
          currentSuggestions: json
        })
      })
      .catch((ex) => {
        console.log(`Error parsing JSON: ${ex}`)
      })
  }

  render() {
    const menuStyle = {
      borderRadius: `3px`,
      boxShadow: `0 2px 12px rgba(0, 0, 0, 0.1)`,
      fontSize: `90%`,
      overflow: `auto`,
      maxHeight: `20rem`,  // approx. as many lines as 20/2
      position: `absolute`,
      top: `auto`,
      zIndex: `1`
    }

    const {allSpecies} = this.props
    const {wrapperClassName, autocompleteClassName} = this.props
    const {enableSpeciesFilter, speciesFilterClassName, speciesFilterStatusMessage, topSpecies, separator} = this.props

    return(
      <div className={wrapperClassName}>
        <div className={autocompleteClassName}>
          <label>Gene ID, gene name or gene feature</label>
          <Autocomplete wrapperStyle={{display: ``}}
                        inputProps={{type: `text`, name: `geneId`}}

                        value={this.state.selectedItem}
                        items={this.state.currentSuggestions}

                        getItemValue={(item) => item.category}
                        onSelect={(value) => {this.setState({
                            selectedItem: value, currentSuggestions: [] })
                            this.props.onSelect(value)}
                        }
                        onChange={this.updateSuggestions}

                        renderItem={(item, isHighlighted) => {
                          return (
                            <div key={`${item.value}_${item.category}`} style={{ background: isHighlighted ? `lightgray` : `white`, padding: `2px 10px` }}>
                              <span dangerouslySetInnerHTML={{__html: `${item.value} (${item.category})`}} />
                            </div>)}}

                        menuStyle={menuStyle} />
        </div>

          {enableSpeciesFilter &&
              <div className={speciesFilterClassName}>
                <SpeciesSelect statusMessage={speciesFilterStatusMessage}
                               allSpecies={allSpecies}
                               topSpecies={topSpecies}
                               onChange={this.speciesSelectOnChange}
                               selectedValue={this.state.selectedSpecies} />
              </div>
          }
            return (
              <div key={`${item.term}_${item.category}`} style={{ background: isHighlighted ? `lightgray` : `white`, padding: `2px 10px` }}>
                <span dangerouslySetInnerHTML={{__html: `${item.term} (${item.category})`}} />
              </div>)}}
      </div>
    )
  }
}

AtlasAutocomplete.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  allSpecies: PropTypes.arrayOf(PropTypes.string),
  topSpecies: PropTypes.arrayOf(PropTypes.string),
  suggesterEndpoint: PropTypes.string.isRequired,
  enableSpeciesFilter: PropTypes.bool,
  initialValue: PropTypes.string,
  onSelect: PropTypes.func,
  wrapperClassName: PropTypes.string,
  autocompleteClassName: PropTypes.string,
  speciesFilterClassName: PropTypes.string,
  speciesFilterStatusMessage: PropTypes.string.isRequired,
  defaultSpecies: PropTypes.string
}

AtlasAutocomplete.defaultProps = {
  allSpecies: [],
  topSpecies: [],
  enableSpeciesFilter: false,
  initialValue: ``,
  onSelect: () => {},
  wrapperClassName: ``,
  autocompleteClassName: ``,
  speciesFilterClassName: ``,
  defaultSpecies: ``
}

export default AtlasAutocomplete
