const Document = require('next/document').default;
const React = require('react');

class MyDocument extends Document {
  render() {
    const { Html, Head, Main, NextScript } = require('next/document');
    return (
      React.createElement(Html, null,
        React.createElement(Head, null),
        React.createElement('body', null,
          React.createElement(Main, null),
          React.createElement(NextScript, null)
        )
      )
    );
  }
}

module.exports = MyDocument;
