import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'

import URI from 'urijs'

class AtlasAutocomplete extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedItem: this.props.initialValue,
      selectedSpecies: this.props.defaultSpecies,
      currentSuggestions: []
    }

    this.updateSuggestions = this._updateSuggestions.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedItem: nextProps.initialValue
    })
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
        console.error(`Error parsing JSON: ${ex}`)
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

    const {wrapperClassName} = this.props

    return(
      <div className={wrapperClassName}>
        <label>Gene ID, gene name or gene feature</label>
        <Autocomplete
          wrapperStyle={{display: ``}}
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
              <div key={`${item.term}_${item.category}`} style={{ background: isHighlighted ? `lightgray` : `white`, padding: `2px 10px` }}>
                <span dangerouslySetInnerHTML={{__html: `${item.term} (${item.category})`}} />
              </div>)}}
          menuStyle={menuStyle} />
      </div>
    )
  }
}

AtlasAutocomplete.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
  onSelect: PropTypes.func,
  wrapperClassName: PropTypes.string,
  defaultSpecies: PropTypes.string
}

AtlasAutocomplete.defaultProps = {
  initialValue: ``,
  onSelect: () => {},
  wrapperClassName: ``,
  defaultSpecies: ``
}

export default AtlasAutocomplete
