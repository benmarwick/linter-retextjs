/**
 * @author Cameron Chamberlain
 * @copyright 2016 Cameron Chamberlain, based on atom-linter-alex 2015 Titus Wormer.
 * @license MIT
 * @module atom:linter:retext
 * @fileoverview Linter.
 */

/* global atom Promise */
/* eslint-env node */

'use strict';

/*
 * Dependencies (retext is lazy-loaded later).
 */

const deps = require('atom-package-deps');
const minimatch = require('minimatch');
let retext;

let cliches;
let equality;
let intensify;
let profanities;
let readability;
let simplify;

let decamelize;

/*
 * Constants.
 */

const config = atom.config;

/**
 * Activate.
 */
function activate() {
  deps.install('linter-retext');
}

/**
 * Atom meets retext to catch suboptimal writing.
 *
 * @return {LinterConfiguration} - Configuration.
 */
function linter() {
  const CODE_EXPRESSION = /`([^`]+)`/g;

  /**
   * Transform a (stringified) vfile range to a linter
   * nested-tuple.
   *
   * @param {Object} location - Positional information.
   * @return {Array.<Array.<number>>} - Linter range.
   */
  function toRange(location) {
    return [
      [
        Number(location.start.line) - 1,
        Number(location.start.column) - 1,
      ], [
        Number(location.end.line) - 1,
        Number(location.end.column) - 1,
      ],
    ];
  }

  /**
   * Transform a reason for warning from retext into
   * beautiful HTML.
   *
   * @param {string} reason - Messsage in plain-text.
   * @return {string} - Messsage in HTML.
   */
  function toHTML(reason) {
    return reason.replace(CODE_EXPRESSION, '<code>$1</code>');
  }

  /**
   * Transform VFile messages
   * nested-tuple.
   *
   * @see https://github.com/wooorm/vfile#vfilemessage
   *
   * @param {VFileMessage} message - Virtual file error.
   * @return {Object} - Linter error.
   */
  function transform(message) {
    return {
      type: 'Info',
      html: toHTML(message.reason),
      filePath: this.getPath(),
      range: toRange(message.location),
    };
  }

  /**
   * Handle on-the-fly or on-save (depending on the
   * global atom-linter settings) events. Yeah!
   *
   * Loads `retext` on first invocation.
   *
   * @see https://github.com/atom-community/linter/wiki/Linter-API#messages
   *
   * @param {AtomTextEditor} editor - Access to editor.
   * @return {Promise.<Message, Error>} - Promise
   *  resolved with a list of linter-errors or an error.
   */
  function onchange(editor) {
    const settings = config.get('linter-retext');

    if (minimatch(editor.getPath(), settings.ignoreFiles)) {
      return [];
    }

    return new Promise((resolve, reject) => {
      let messages;

      if (!retext || !decamelize) {
        retext = require('retext');

        cliches = require('retext-cliches');
        equality = require('retext-equality');
        intensify = require('retext-intensify');
        profanities = require('retext-profanities');
        readability = require('retext-readability');
        simplify = require('retext-simplify');
        decamelize = require('decamelize');
      }

      let text = editor.getText();

      let intensifyIgnore = [];
      let simplifyIgnore = [];
      const readabilityOptions = {};
      const isProse = editor.getRootScopeDescriptor().scopes.some((scope) =>
        scope.indexOf('plain') > -1 || scope.indexOf('gfm') > -1);

      if (!isProse) {
        intensifyIgnore = [
          'then',
          'try',
          'some',
        ];

        simplifyIgnore = [
          'function',
          'provide',
          'require',
          'type',
        ];
        readabilityOptions.threshold = 8;

        text = decamelize(text, ' ')
          .replace(/>|<|#|@|:|!|\/|'|,|\||{|}|-|=|\(|\)|\[|\]|\*/g, ' ')
          .replace(/;/g, '.');
      }

      try {
        retext()
          .use(cliches)
          .use(equality)
          .use(intensify, { ignore: intensifyIgnore })
          .use(profanities)
          .use(readability, readabilityOptions)
          .use(simplify, { ignore: simplifyIgnore })
          .process(text, (err, file) => {
            if (err) {
              reject(err);
              return;
            }

            messages = file.messages;
          });
      } catch (err) {
        reject(err);
        return;
      }

      resolve((messages || []).map(transform, editor));
    });
  }

  return {
    grammarScopes: config.get('linter-retext').grammars,
    name: 'retext',
    scope: 'file',
    lintOnFly: true,
    lint: onchange,
  };
}

/*
 * Expose.
 */

module.exports = {
  config: {
    ignoreFiles: {
      description: 'Disable files matching (minimatch) glob',
      type: 'string',
      default: '',
    },
    grammars: {
      description: 'List of scopes for languages to ' +
          'checked. Note: setting new sources overwrites the ' +
          'defaults.',
      type: 'array',
      default: [
        '*',
      ],
    },
  },
  provideLinter: linter,
  activate,
};
