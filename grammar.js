/**
 * @file Moonbit + Html (JSX-like) parser
 * @author Arcelyth <arcelyth@tutamail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "mbx",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
