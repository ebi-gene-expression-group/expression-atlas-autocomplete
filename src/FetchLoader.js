import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import AtlasAutocomplete from './AtlasAutocomplete'

const _fetch = async (host, resource) => {
  const url = URI(resource, host).segment(`species`).toString()
  const response = await fetch(url)
  // The promise returned by fetch may be fulfilled with a 4xx or 5xx return code...
  if (response.ok) {
    return await response.json()
  }
  throw new Error(`${url} => ${response.status}`)
}

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

  _fetchAndSetState(host, resource) {
    this.setState({ loading: true })

    // then and catch methods are run “at the end of the current run of the JavaScript event loop” according to section
    // ‘Timing’ in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises, so state.loading will
    // be true when the promise is handled. Strictly speaking, the right thing to do would be to call _fetch in a
    // callback passed as the second argument to setState, but if we wanted to also return the promise to test the
    // component we’d need to declare a variable outside, set it within the callback, and return it... not pretty!

    return _fetch(host, resource).then(
      (responseJson) =>
        this.setState({
          data: responseJson,
          loading: false,
          error: null
        })
      )
      .catch(
        (error) =>
          this.setState({
            data: null,
            loading: false,
            error: {
              description: `There was a problem communicating with the server. Please try again later.`,
              name: error.name,
              message: error.message
            }
          })
      )
  }

  componentDidMount() {
    return this._fetchAndSetState(this.props.atlasUrl, this.props.suggesterEndpoint)
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
  autocompleteClassName: PropTypes.string,
  enableSpeciesFilter: PropTypes.bool,
  speciesFilterClassName: PropTypes.string,
  defaultSpecies: PropTypes.string
}

export default FetchLoader
