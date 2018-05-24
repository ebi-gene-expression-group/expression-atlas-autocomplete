import React from 'react'
import TestRenderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SpeciesSelect from '../src/SpeciesSelect'

Enzyme.configure({ adapter: new Adapter() })

const props = {
  topSpecies: [`Meeseek`],
  allSpecies: [`Zigerion`, `Cromulon`, `Meeseek`, `Gromflomite`],
  statusMessage: ``,
  onChange: () => {},
  selectedValue: ``
}

describe(`SpeciesSelect`, () => {
  test(`displays a status message, and nothing else, if it’s not empty`, () => {
    const statusMessage = `loading`
    const wrapper = mount(<SpeciesSelect {...props} statusMessage={statusMessage}/>)
    expect(wrapper.find(`option`)).toHaveLength(1)
    expect(wrapper.find(`option`).first().text()).toBe(statusMessage)
  })

  test(`shows a separator if at least one top species is provided`, () => {
    const wrapper = mount(<SpeciesSelect {...props} />)
    expect(wrapper.find(`option`)
        .map((rw) => rw.html())
        .map((staticHtml) => staticHtml.match(/value=\"(.*?)\"/)[1]))
      .toContain(`-`)
  })

  test(`doesn’t show a separator if no top species are provided`, () => {
    const wrapper = mount(<SpeciesSelect {...props} topSpecies={[]}/>)
    expect(wrapper.find(`option`)
        .map((rw) => rw.html())
        .map((staticHtml) => staticHtml.match(/value=\"(.*?)\"/)[1]))
      .not.toContain(`-`)
  })

  test(`shows all species plus “Any” at the top`, () => {
    const wrapper = mount(<SpeciesSelect {...props} />)
    expect(wrapper.find(`option`).first().text()).toBe(`Any`)

  })

  test(`matches snapshot`, () => {
    const testRenderer = TestRenderer.create(<SpeciesSelect {...props} />)
    const tree = testRenderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
