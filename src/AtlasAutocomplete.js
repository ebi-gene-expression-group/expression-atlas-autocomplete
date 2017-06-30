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
        console.log(`Error parsing JSON: ${ex}`)
      })
  }

  render() {
    const menuStyle = {
      borderRadius: `3px`,
      boxShadow: `0 2px 12px rgba(0, 0, 0, 0.1)`,
      fontSize: `90%`,
      overflow: `auto`,
      maxHeight: `50%`,  // TODO: don't cheat, let it flow to the bottom
      position: `absolute`,
      top: `auto`,
      zIndex: `1`
    }

    return(
      <div className={`row margin-bottom-none`}>
        <div className={`small-8 columns`}>
          <label>Gene ID, gene name or gene feature</label>
          <Autocomplete wrapperStyle={{display: ``}}
                        inputProps={{type: `text`, className: `margin-bottom-none`, name: `geneId`}}

                        value={this.state.selectedItem}
                        items={this.state.currentSuggestions}

                        getItemValue={(item) => item.category}
                        onSelect={(value) => this.setState({ selectedItem: value, currentSuggestions: [] })}
                        onChange={this.updateSuggestions}

                        renderItem={(item, isHighlighted) => {
                          return (
                            <div style={{ background: isHighlighted ? `lightgray` : `white`, padding: `2px 10px` }}>
                              <span dangerouslySetInnerHTML={{__html: `${item.value} (${item.category})`}} />
                            </div>)}}

                        menuStyle={menuStyle} />
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
  suggesterEndpoint: PropTypes.string.isRequired,
  initialValue: PropTypes.string
}

AtlasAutocomplete.defaultProps = {
  initialValue: ``
}

export default AtlasAutocomplete