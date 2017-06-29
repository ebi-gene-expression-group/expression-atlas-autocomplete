'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRefetch = require('react-refetch');

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpeciesSelect = function (_React$Component) {
  _inherits(SpeciesSelect, _React$Component);

  function SpeciesSelect(props) {
    _classCallCheck(this, SpeciesSelect);

    return _possibleConstructorReturn(this, (SpeciesSelect.__proto__ || Object.getPrototypeOf(SpeciesSelect)).call(this, props));
  }

  _createClass(SpeciesSelect, [{
    key: '_option',
    value: function _option(label) {
      return _react2.default.createElement(
        'option',
        { key: label, value: label },
        label
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var speciesFetch = this.props.speciesFetch;


      if (speciesFetch.fulfilled) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            null,
            'Species'
          ),
          _react2.default.createElement(
            'select',
            { onChange: this.props.onChange },
            _react2.default.createElement(
              'option',
              { value: '' },
              'Any'
            ),
            speciesFetch.value.topSpecies.map(this._option),
            _react2.default.createElement(
              'option',
              { value: '-', disabled: 'true' },
              speciesFetch.value.separator
            ),
            speciesFetch.value.allSpecies.map(this._option)
          )
        );
      } else if (speciesFetch.pending) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            null,
            'Species'
          ),
          _react2.default.createElement(
            'select',
            null,
            this._option('Waiting\u2026')
          )
        );
      } else {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            null,
            'Species'
          ),
          _react2.default.createElement(
            'select',
            null,
            this._option('Error!')
          )
        );
      }
    }
  }]);

  return SpeciesSelect;
}(_react2.default.Component);

SpeciesSelect.propTypes = {
  atlasUrl: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRefetch.connect)(function (props) {
  return {
    speciesFetch: (0, _urijs2.default)('json/suggestions/species', props.atlasUrl).toString()
  };
})(SpeciesSelect);