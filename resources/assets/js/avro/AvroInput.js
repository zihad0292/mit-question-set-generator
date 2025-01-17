/**
 * Created by Rajesh on 1/29/18.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import avro from "./avro-lib";

const AVRO_SUGGESTION_URL = "/api/avro-suggestion";

class AvroInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      //suggestion : '',
      stack: "",
      suggestionList: [""],
      selectedIndex: 0,
      suggestionLeft: 0,
      suggestionTop: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleBlurChange = this.handleBlurChange.bind(this);
    this.renderAvroSuggestion = this.renderAvroSuggestion.bind(this);
    this.updateSuggestionPos = this.updateSuggestionPos.bind(this);
    this.setSuggestions = this.setSuggestions.bind(this);
    this.fetchAvroSuggestion = this.fetchAvroSuggestion.bind(this);
    this.hideSuggestions = this.hideSuggestions.bind(this);
    this.onItemClickHandler = this.onItemClickHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      value: this.props.value
    });

    this.updateSuggestionPos();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  fetchAvroSuggestion() {
    let { stack } = this.state;

    if (stack.length > 2) {
      axios
        .get(`${AVRO_SUGGESTION_URL}?q=${stack}`)
        .then(response => {
          let d = response.data;
          if (d.status === 200) {
            let tempSuggestions = d.result.words;
            let sliced = tempSuggestions.slice(0, 9);
            sliced.push(stack);
            this.setState({
              suggestionList: sliced
            });
          }
        })
        .catch(error => {
          console.log("URL Not Available");
        });
    }
  }

  handleChange(event) {
    let currentVal = event.target.value;
    let tempSuggestions = this.state.suggestionList;
    tempSuggestions[0] = avro.parse(this.state.stack);

    this.setState(
      {
        value: currentVal,
        //suggestion: avro.parse(this.state.stack),
        suggestionList: tempSuggestions
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.value);
        }
      }
    );

    if (this.state.value === "") {
      this.updateSuggestionPos();
    }
  }

  handleKeyPress(event) {
    let { stack, value, suggestionList, selectedIndex } = this.state;

    if (this.props.enabled && !event.ctrlKey && !event.altKey) {
      if (
        (event.keyCode >= 48 && event.keyCode <= 90) ||
        (event.keyCode >= 186 && event.keyCode <= 222)
      ) {
        this.setState(
          {
            stack:
              this.getCurrentStack(value, this.textInput.selectionStart) +
              event.key
          },
          () => this.fetchAvroSuggestion()
        );
      } else if (event.keyCode === 32 || event.keyCode === 13) {
        if (stack.length > 0) {
          this.setSuggestions();
          if (event.keyCode === 13 && stack.length > 0) {
            event.preventDefault();
          }
        }
      } else if (
        suggestionList.length > 1 &&
        (event.keyCode === 38 || event.keyCode === 40)
      ) {
        if (event.keyCode === 38) {
          if (selectedIndex === 0) {
            this.setState({ selectedIndex: suggestionList.length - 1 });
          } else {
            this.setState({ selectedIndex: selectedIndex - 1 });
          }
        } else if (event.keyCode === 40) {
          if (selectedIndex === suggestionList.length - 1) {
            this.setState({ selectedIndex: 0 });
          } else {
            this.setState({ selectedIndex: selectedIndex + 1 });
          }
        }
        if (stack.length > 0) event.preventDefault();
      } else if (event.keyCode === 8) {
        this.setState({
          stack: stack.slice(0, -1)
        });

        if (stack === "") this.updateSuggestionPos();
      }
    }
  }

  handleBlurChange(event) {
    setTimeout(this.hideSuggestions, 250);
  }

  setSuggestions() {
    let { stack, value, suggestionList, selectedIndex } = this.state;

    let tempSelection = this.textInput.selectionStart;
    let end = this.getStackRange(stack, value, tempSelection);

    let finalVal = "";

    if (stack.length > 0 && stack !== " ") {
      let firstSection = value.substring(0, tempSelection);
      let valWithoutStack = firstSection.slice(0, -stack.length);
      let lastSection = value.substr(tempSelection, value.length);
      finalVal = valWithoutStack + suggestionList[selectedIndex] + lastSection;
      end = valWithoutStack.length + suggestionList[selectedIndex].length;
    } else {
      finalVal = avro.parse(value);
    }

    let tempSuggestions = this.state.suggestionList;
    tempSuggestions[0] = "";

    this.setState(
      {
        value: finalVal,
        stack: "",
        selectedIndex: 0,
        suggestionList: tempSuggestions
      },
      () => {
        this.textInput.selectionStart = this.textInput.selectionEnd = end;
        if (this.props.onChange) this.props.onChange(this.state.value);
      }
    );

    this.updateSuggestionPos();
  }

  hideSuggestions() {
    let tempSuggestions = this.state.suggestionList;
    tempSuggestions[0] = "";

    this.setState({
      stack: "",
      suggestionList: tempSuggestions,
      selectedIndex: 0
    });
  }

  getCurrentStack(value, selection) {
    let subString = value.substring(0, selection);
    let words = subString.split(/\n| /);
    return words[words.length - 1];
  }

  getStackRange(stack, val, selection) {
    if (stack.length > 0) {
      let subValue = val.substring(0, selection);
      let valWithoutStack = subValue.slice(0, -stack.length);
      let withParsedStack = valWithoutStack + avro.parse(stack);
      return withParsedStack.length;
    } else {
      return selection;
    }
  }

  onItemClickHandler(item, index) {
    this.setState(
      {
        selectedIndex: index
      },
      () => this.setSuggestions()
    );
  }

  updateSuggestionPos() {
    let { x, y } = getCursorXY(this.textInput, this.textInput.selectionStart);
    let offsetY = 10;

    if (x > this.textInput.offsetWidth) x = this.textInput.offsetWidth;
    if (y > this.textInput.offsetHeight) y = this.textInput.offsetHeight;

    this.setState({
      suggestionLeft: x,
      suggestionTop: y + this.textInput.offsetTop + offsetY
    });
  }

  renderAvroSuggestion() {
    let {
      suggestionLeft,
      suggestionTop,
      suggestionList,
      selectedIndex
    } = this.state;

    let renderSuggestionList = () => {
      return suggestionList
        .filter((item, idx) => {
          if (idx < 10) return item;
        })
        .map((item, idx) => {
          let itemStyle =
            idx === selectedIndex ? styles.suggestionActiveStyle : {};
          return (
            <li
              key={idx}
              style={{ ...styles.suggestionListItem, ...itemStyle }}
              onClick={() => this.onItemClickHandler(this, idx)}
            >
              {item}
            </li>
          );
        });
    };

    if (suggestionList[0].length > 0) {
      return (
        <span
          style={{
            ...styles.suggestionAbsolute,
            ...this.props.suggestionStyle,
            left: suggestionLeft + "px",
            top: suggestionTop + "px"
          }}
        >
          <ul style={styles.suggestionListStyle}>{renderSuggestionList()}</ul>
        </span>
      );
    }
  }

  render() {
    let input;
    let { suggestionStyle, enabled, ...othersProp } = this.props;
    if (othersProp.type === "textarea") {
      input = (
        <textarea
          {...othersProp}
          value={this.state.value}
          placeholder={othersProp.placeholder}
          onKeyDown={this.handleKeyPress}
          onChange={this.handleChange}
          ref={input => {
            this.textInput = input;
          }}
          style={{ ...styles.inputStyle, ...othersProp.style }}
        />
      );
    } else {
      input = (
        <input
          {...othersProp}
          type='text'
          value={this.state.value}
          placeholder={othersProp.placeholder}
          onKeyDown={this.handleKeyPress}
          onChange={this.handleChange}
          onBlur={this.handleBlurChange}
          ref={input => {
            this.textInput = input;
          }}
          style={{ ...styles.inputStyle, ...othersProp.style }}
        />
      );
    }

    return (
      <div style={styles.inputHolder}>
        {input}
        <br />
        {this.renderAvroSuggestion()}
      </div>
    );
  }
}

AvroInput.propTypes = {
  type: PropTypes.oneOf(["text", "textarea"]),
  placeholder: PropTypes.string,
  enabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  suggestionStyle: PropTypes.object
};

AvroInput.defaultProps = {
  type: "text",
  placeholder: "Avro Input",
  value: "",
  style: {},
  suggestionStyle: {}
};

const styles = {
  inputHolder: {
    position: "relative",
    overflow: "visible"
  },
  inputStyle: {
    width: "100%",
    overflow: "hidden",
    marginTop: "15px",
    font: "inherit",
    width: "100%",
    borderRadius: "8px",
    margin: "0",
    display: "block",
    padding: "18.5px 14px",
    minWidth: "0",
    background: "none",
    boxSizing: "border-box"
  },
  suggestionAbsolute: {
    position: "absolute",
    background: "#efefef",
    padding: "0",
    marginTop: "13px",
    fontSize: "13px",
    zIndex: 1001,
    boxShadow: "0 0 2px rgba(0,0,0,.2)"
  },
  suggestionListStyle: {
    listStyle: "none",
    paddingLeft: 0,
    margin: 0
  },
  suggestionListItem: {
    textAlign: "left",
    padding: "5px 15px",
    fontSize: "14px",
    cursor: "pointer"
  },
  suggestionActiveStyle: {
    background: "#8cc152",
    color: "#ffffff"
  }
};

/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */
const getCursorXY = (input, selectionPoint) => {
  const { offsetLeft: inputX, offsetTop: inputY } = input;

  // create a dummy element that will be a clone of our input
  const div = document.createElement("div");
  // get the computed style of the input and clone it onto the dummy element
  const copyStyle = getComputedStyle(input);
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop];
  }
  // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
  const swap = ".";
  const inputValue =
    input.tagName === "INPUT" ? input.value.replace(/ /g, swap) : input.value;
  // set the div content to that of the textarea up until selection
  const textContent = inputValue.substr(0, selectionPoint);
  // set the text content of the dummy element div
  div.textContent = textContent;
  if (input.tagName === "TEXTAREA") div.style.height = "auto";
  // if a single line input then the div needs to be single line and not break out like a text area
  if (input.tagName === "INPUT") div.style.width = "auto";
  // create a marker element to obtain caret position
  const span = document.createElement("span");
  // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
  span.textContent = inputValue.substr(selectionPoint) || ".";
  // append the span marker to the div
  div.appendChild(span);
  // append the dummy element to the body
  document.body.appendChild(div);
  // get the marker position, this is the caret position top and left relative to the input
  const { offsetLeft: spanX, offsetTop: spanY } = span;
  // lastly, remove that dummy element
  // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
  document.body.removeChild(div);
  // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
  return {
    x: inputX + spanX,
    y: inputY + spanY
  };
};

export default AvroInput;
