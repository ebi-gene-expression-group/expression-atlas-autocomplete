import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import AtlasAutocomplete from './AtlasAutocomplete'

class FetchLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null,
      loading: true,
      error: null
    }
  }

  render() {
    const {data, loading, error} = this.state

    return(
      error ?
        <AtlasAutocomplete {...data} {...this.props} speciesFilterStatusMessage={`${error.name}: ${error.message}`}/> :
        loading ?
          <AtlasAutocomplete {...data} {...this.props} speciesFilterStatusMessage={`Fetching species…`}/> :
        // promise fulfilled
          <AtlasAutocomplete {...data} {...this.props} speciesFilterStatusMessage={``}/>
    )
  }

  async componentDidMount() {
    this.setState({ loading: true })

    const url = URI(this.props.suggesterEndpoint, this.props.atlasUrl).segment(`species`).toString()
    const response = await fetch(url)

    try {
      // The promise returned by fetch may be fulfilled with a 4xx or 5xx return code...
      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      this.setState({
        data: await response.json(),
        loading: false,
        error: null
      })
    } catch(e) {
      this.setState({
        data: null,
        loading: false,
        error: {
          description: `There was a problem communicating with the server. Please try again later.`,
          name: e.name,
          message: e.message
        }
      })
    }
  }

  componentDidCatch(error, info) {
    this.setState({
      error: {
        description: `There was a problem rendering this component.`,
        name: error.name,
        message: `${error.message} – ${info}`
      }
    })
  }
}

FetchLoader.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
  onSelect: PropTypes.func,
  wrapperClassName: PropTypes.string,
  defaultSpecies: PropTypes.string
}

export default FetchLoader
