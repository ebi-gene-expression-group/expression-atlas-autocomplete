'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRefetch = require('react-refetch');

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _option = function _option(label) {
  return _react2.default.createElement(
    'option',
    { key: label, value: label },
    label
  );
};

var SpeciesSelect = function SpeciesSelect(props) {
  var speciesFetch = props.speciesFetch;


  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'label',
      null,
      'Species'
    ),
    speciesFetch.fulfilled ? _react2.default.createElement(
      'select',
      { onChange: props.onChange },
      _react2.default.createElement(
        'option',
        { value: '' },
        'Any'
      ),
      speciesFetch.value.topSpecies.map(_option),
      _react2.default.createElement(
        'option',
        { value: '-', disabled: 'true' },
        speciesFetch.value.separator
      ),
      speciesFetch.value.allSpecies.map(_option)
    ) : speciesFetch.pending ? _react2.default.createElement(
      'select',
      { disabled: 'true' },
      _option('Fetching species\u2026')
    ) : _react2.default.createElement(
      'select',
      { disabled: 'true' },
      _option('Error fetching species')
    )
  );
};

SpeciesSelect.propTypes = {
  atlasUrl: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRefetch.connect)(function (props) {
  return {
    speciesFetch: (0, _urijs2.default)('json/suggestions/species', props.atlasUrl).toString()
  };
})(SpeciesSelect);