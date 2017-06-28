import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'

import URI from 'urijs'

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
  }

  _updateSuggestions(event, value) {
    this.setState({
      selectedItem: value
    })

    const suggesterUrl = URI(this.props.suggesterEndpoint, this.props.atlasUrl).search({
      query: value,
      species: `homo_sapiens`
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
      <Autocomplete value={this.state.selectedItem}
                    items={this.state.currentSuggestions}
                    getItemValue={(item) => item.category}
                    onSelect={(value) => this.setState({ selectedItem: value, currentSuggestions: [] })}
                    onChange={this.updateSuggestions}

                    renderItem={(item, isHighlighted) =>
                      <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                        {item.value} ({item.category})
                      </div>}

      />
    )
  }
}

AtlasAutocomplete.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired
}

export default AtlasAutocomplete
