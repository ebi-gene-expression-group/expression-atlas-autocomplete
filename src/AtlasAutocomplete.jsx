import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'

import URI from 'urijs'

import SpeciesSelect from './SpeciesSelect.jsx'

class AtlasAutocomplete extends React.Component {
  constructor(props) {
     super(props)

     this.state = {
      selectedItem: ``,
      term: ``,
      species: ``,
      currentSuggestions: []
    }

    this.updateSuggestions = this._updateSuggestions.bind(this)
    this.speciesSelectOnChange = this._speciesSelectOnChange.bind(this)
  }

  _speciesSelectOnChange(event) {
    this.setState({ species: event.target.value })
  }

  _updateSuggestions(event, value) {
    this.setState({
      selectedItem: value
    })

    const suggesterUrl = URI(this.props.suggesterEndpoint, this.props.atlasUrl).search({
      query: value,
      species: this.state.species
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
        console.log('parsing failed', ex)
      })
  }

  render() {
    return(
      <div className={`row`}>
        <div className={`small-8 columns`}>
          <label>Gene ID, gene name or gene feature</label>
          <Autocomplete wrapperStyle={{display: ``}}
                        inputProps={{type: `text`}}
                        value={this.state.selectedItem}
                        items={this.state.currentSuggestions}
                        getItemValue={(item) => item.category}
                        onSelect={(value) => this.setState({ selectedItem: value, currentSuggestions: [] })}
                        onChange={this.updateSuggestions}

                        renderItem={(item, isHighlighted) => {
                          const innerHtml = {__html: `${item.value} (${item.category})`}
                          return (
                            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                              <span dangerouslySetInnerHTML={innerHtml} />
                            </div>)}} />
        </div>
        
        <div className={`small-4 columns`}>
          <SpeciesSelect atlasUrl={this.props.atlasUrl} onChange={this.speciesSelectOnChange}/>
        </div>
      </div>
    )
  }
}

AtlasAutocomplete.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired
}

export default AtlasAutocomplete