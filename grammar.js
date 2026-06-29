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

  // TODO
  //  extras: $ => [
  //    $.html_comment,
  //  ],

  rules: {
    _expression: ($, original) => choice(original, $.mbx_element),

    _mbx_element: ($) => choice($.mbx_element, $.mbx_self_closing_element),

    mbx_element: ($) =>
      seq(
        field("open_tag", $.mbx_opening_element),
        repeat($._mbx_child),
        field("close_tag", $.mbx_closing_element),
      ),

    html_character_reference: (_) =>
      /&(#([xX][0-9a-fA-F]{1,6}|[0-9]{1,5})|[A-Za-z]{1,30});/,

    mbx_expression: ($) => seq("{", optional(choice($._expression)), "}"),

    mbx_text: $ => /[^<>{}\n]+/,

    _mbx_child: ($) => choice($.mbx_text, $._mbx_element, $.mbx_expression),

    mbx_opening_element: ($) =>
      prec.dynamic(
        -1,
        seq(
          "<",
          optional(
            seq(
              field("name", $._mbx_element_name),
              repeat(field("attribute", $._mbx_attribute)),
            ),
          ),
          ">",
        ),
      ),

    mbx_identifier: (_) => /[a-zA-Z_$][a-zA-Z\d_$]*-[a-zA-Z\d_$\-]*/,

    _mbx_identifier: ($) =>
      choice(alias($.mbx_identifier, $.identifier), $.identifier),

    nested_identifier: ($) =>
      prec(
        11,
        seq(
          field(
            "object",
            choice(
              $.identifier,
              alias($.nested_identifier, $.member_expression),
            ),
          ),
          ".",
          field("property", alias($.identifier, $.property_identifier)),
        ),
      ),

    mbx_namespace_name: ($) => seq($._mbx_identifier, ":", $._mbx_identifier),

    _mbx_element_name: ($) =>
      choice(
        $._mbx_identifier,
        alias($.nested_identifier, $.member_expression),
        $.mbx_namespace_name,
      ),

    mbx_closing_element: ($) =>
      seq("</", optional(field("name", $._mbx_element_name)), ">"),

    mbx_self_closing_element: ($) =>
      seq(
        "<",
        field("name", $._mbx_element_name),
        repeat(field("attribute", $._mbx_attribute)),
        "/>",
      ),

    _mbx_attribute: ($) => choice($.mbx_attribute, $.mbx_expression),

    _mbx_attribute_name: ($) =>
      choice(
        alias($._mbx_identifier, $.property_identifier),
        $.mbx_namespace_name,
      ),

    mbx_attribute: ($) =>
      seq($._mbx_attribute_name, optional(seq("=", $._mbx_attribute_value))),

    _mbx_string: ($) =>
      choice(
        seq(
          '"',
          repeat(
            choice(
              alias($.unescaped_double_mbx_string_fragment, $.string_fragment),
              $.html_character_reference,
            ),
          ),
          '"',
        ),
        seq(
          "'",
          repeat(
            choice(
              alias($.unescaped_single_mbx_string_fragment, $.string_fragment),
              $.html_character_reference,
            ),
          ),
          "'",
        ),
      ),

    unescaped_double_mbx_string_fragment: (_) =>
      token.immediate(prec(1, /([^"&]|&[^#A-Za-z])+/)),

    unescaped_single_mbx_string_fragment: (_) =>
      token.immediate(prec(1, /([^'&]|&[^#A-Za-z])+/)),

    _mbx_attribute_value: ($) =>
      choice(alias($._mbx_string, $.string), $.mbx_expression, $._mbx_element),
  },
});
