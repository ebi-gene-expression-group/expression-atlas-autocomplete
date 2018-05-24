import React from 'react'
import TestRenderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import URI from 'urijs'
import fetchMock from 'fetch-mock'

import Autocomplete from 'react-autocomplete'
import AtlasAutocomplete from '../src/AtlasAutocomplete'

Enzyme.configure({ adapter: new Adapter() })

describe(`AtlasAutocomplete`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  const props = {
    atlasUrl: `https://www.ebi.ac.uk/gxa/sc/`,
    allSpecies: [`Zigerion`, `Cromulon`, `Meeseek`, `Gromflomite`],
    topSpecies: [`Meeseek`],
    suggesterEndpoint: `json/suggestions`,
    enableSpeciesFilter: true,
    speciesFilterStatusMessage: ``,
  }

  test(`pass all species to suggestions endpoint if none is selected`, () => {
    fetchMock.get(`*`, `[]`)
    const wrapper = mount(<AtlasAutocomplete {...props} />)
    const event = {target: { value: `pickle` } }
    wrapper.find(`input`).simulate(`change`, event)

    const fetchUri = URI(fetchMock.calls()[0][0])
    expect(fetchUri.search(true)).toHaveProperty(`species`, props.allSpecies.join())
  })

  test(`matches snapshot`, () => {
    const testRenderer = TestRenderer.create(<AtlasAutocomplete {...props} />)
    const tree = testRenderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
