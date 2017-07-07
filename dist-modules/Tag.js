'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDnd = require('react-dnd');

var _flow = require('lodash/flow');

var _flow2 = _interopRequireDefault(_flow);

var _Chip = require('material-ui/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemTypes = { TAG: 'tag' };

var tagSource = {
  beginDrag: function beginDrag(props) {
    return { id: props.tag.id, index: props.index };
  },
  canDrag: function canDrag(props) {
    return props.moveTag && !props.readOnly;
  }
};

var tagTarget = {
  hover: function hover(props, monitor, component) {
    var dragIndex = monitor.getItem().index;
    var hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    var hoverBoundingRect = (0, _reactDom.findDOMNode)(component).getBoundingClientRect();

    // Get horizontal middle
    var hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Determine mouse position
    var clientOffset = monitor.getClientOffset();

    // Get pixels to the left side
    var hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Only perform the move when the mouse has crossed half of the items width

    // Dragging to the right
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    // Dragging to the left
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }

    // Time to actually perform the action
    props.moveTag(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
  canDrop: function canDrop(props) {
    return !props.readOnly;
  }
};

var dragSource = function dragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

var dropCollect = function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

var style = {
  margin: 4,
  cursor: 'move'
};

function RemoveComponent(props) {
  if (props.readOnly) {
    return _react2.default.createElement('span', null);
  }

  if (props.removeComponent) {
    var _Component = props.removeComponent;
    return _react2.default.createElement(_Component, props);
  }

  return _react2.default.createElement(
    'a',
    { onClick: props.onClick, className: props.className },
    String.fromCharCode(215)
  );
}

var Tag = function (_Component2) {
  _inherits(Tag, _Component2);

  function Tag() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Tag);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tag.__proto__ || Object.getPrototypeOf(Tag)).call.apply(_ref, [this].concat(args))), _this), _this.render = function () {
      var _this2 = _this,
          props = _this2.props;

      var label = props.tag[props.labelField];
      var connectDragSource = props.connectDragSource,
          isDragging = props.isDragging,
          connectDropTarget = props.connectDropTarget,
          readOnly = props.readOnly;


      var tagComponent = _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _Chip2.default,
          {
            onRequestDelete: function onRequestDelete() {
              console.log("hi");
              props.onDelete();
            },
            style: _extends({ opacity: isDragging ? 0 : 1 }, style),
            className: props.classNames.tag },
          label
        )
      );
      return connectDragSource(connectDropTarget(tagComponent));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return Tag;
}(_react.Component);

Tag.PropTypes = {
  labelField: _propTypes2.default.string,
  onDelete: _propTypes2.default.func.isRequired,
  tag: _propTypes2.default.object.isRequired,
  moveTag: _propTypes2.default.func,
  removeComponent: _propTypes2.default.func,
  classNames: _propTypes2.default.object,
  readOnly: _propTypes2.default.bool,
  connectDragSource: _propTypes2.default.func.isRequired,
  isDragging: _propTypes2.default.bool.isRequired,
  connectDropTarget: _propTypes2.default.func.isRequired
};

Tag.defaultProps = {
  labelField: 'text',
  readOnly: false
};

exports.default = (0, _flow2.default)((0, _reactDnd.DragSource)(ItemTypes.TAG, tagSource, dragSource), (0, _reactDnd.DropTarget)(ItemTypes.TAG, tagTarget, dropCollect))(Tag);