'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAutocomplete = require('react-autocomplete');

var _reactAutocomplete2 = _interopRequireDefault(_reactAutocomplete);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _SpeciesSelect = require('./SpeciesSelect.js');

var _SpeciesSelect2 = _interopRequireDefault(_SpeciesSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtlasAutocomplete = function (_React$Component) {
  _inherits(AtlasAutocomplete, _React$Component);

  function AtlasAutocomplete(props) {
    _classCallCheck(this, AtlasAutocomplete);

    var _this = _possibleConstructorReturn(this, (AtlasAutocomplete.__proto__ || Object.getPrototypeOf(AtlasAutocomplete)).call(this, props));

    _this.state = {
      selectedItem: _this.props.initialValue,
      species: '',
      currentSuggestions: []
    };

    _this.updateSuggestions = _this._updateSuggestions.bind(_this);
    _this.speciesSelectOnChange = _this._speciesSelectOnChange.bind(_this);
    return _this;
  }

  _createClass(AtlasAutocomplete, [{
    key: '_speciesSelectOnChange',
    value: function _speciesSelectOnChange(event) {
      this.setState({ species: event.target.value });
    }
  }, {
    key: '_updateSuggestions',
    value: function _updateSuggestions(event, value) {
      var _this2 = this;

      this.setState({
        selectedItem: value
      });

      var suggesterUrl = (0, _urijs2.default)(this.props.suggesterEndpoint, this.props.atlasUrl).search({
        query: value,
        species: this.state.species
      }).toString();

      fetch(suggesterUrl).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this2.setState({
          currentSuggestions: json
        });
      }).catch(function (ex) {
        console.log('Error parsing JSON: ' + ex);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var menuStyle = {
        borderRadius: '3px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        fontSize: '90%',
        overflow: 'auto',
        maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
        position: 'absolute',
        top: 'auto',
        zIndex: '1'
      };

      return _react2.default.createElement(
        'div',
        { className: 'row margin-bottom-none' },
        _react2.default.createElement(
          'div',
          { className: this.props.geneBoxStyle ? this.props.geneBoxStyle : 'columns small-8' },
          _react2.default.createElement(
            'label',
            null,
            'Gene ID, gene name or gene feature'
          ),
          _react2.default.createElement(_reactAutocomplete2.default, { wrapperStyle: { display: '' },
            inputProps: { type: 'text', className: 'margin-bottom-none', name: 'geneId' },

            value: this.state.selectedItem !== "" ? this.state.selectedItem : this.props.initialValue,
            items: this.state.currentSuggestions,

            getItemValue: function getItemValue(item) {
              return item.category;
            },
            onSelect: function onSelect(value) {
              _this3.setState({
                selectedItem: value, currentSuggestions: [] });
              _this3.props.onSelect(value);
            },
            onChange: this.updateSuggestions,

            renderItem: function renderItem(item, isHighlighted) {
              return _react2.default.createElement(
                'div',
                { style: { background: isHighlighted ? 'lightgray' : 'white', padding: '2px 10px' } },
                _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: item.value + ' (' + item.category + ')' } })
              );
            },

            menuStyle: menuStyle })
        ),
        this.props.showOnlyGeneAutocomplete ? "" : _react2.default.createElement(
          'div',
          { className: 'small-4 columns' },
          _react2.default.createElement(_SpeciesSelect2.default, { atlasUrl: this.props.atlasUrl, onChange: this.speciesSelectOnChange })
        )
      );
    }
  }]);

  return AtlasAutocomplete;
}(_react2.default.Component);

AtlasAutocomplete.propTypes = {
  atlasUrl: _propTypes2.default.string.isRequired,
  suggesterEndpoint: _propTypes2.default.string.isRequired,
  initialValue: _propTypes2.default.string,
  showOnlyGeneAutocomplete: _propTypes2.default.bool,
  geneBoxStyle: _propTypes2.default.string,
  onSelect: _propTypes2.default.func
};

AtlasAutocomplete.defaultProps = {
  initialValue: ''
};

exports.default = AtlasAutocomplete;