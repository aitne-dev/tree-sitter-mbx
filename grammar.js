/**
 * @file Moonbit + Html (JSX-like) parser
 * @author Arcelyth <arcelyth@tutamail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
const moonbit = require("tree-sitter-moonbit/grammar");

module.exports = grammar(moonbit, {
  name: "mbx",
  rules: {
    _expression: ($, original) => choice(original, $.mbx_element),
    mbx_element: ($) => ' '
  },
});


