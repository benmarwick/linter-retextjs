/**
 * @author Cameron Chamberlain & Ben Marwick
 * @copyright 2016 Cameron Chamberlain, based on atom-linter-alex 2015 Titus Wormer.
 * @license MIT
 * @module linter:retextjs
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
let simplify;
let decamelize;
let passive;
let repeatedwords;
let contractions;
let usage;
let indefinitearticle;
// let overuse;
let diacritics;

/*
 * Constants.
 */

const config = atom.config;

/**
 * Activate.
 */
function activate() {
  deps.install('linter-retextjs');
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
    const settings = config.get('linter-retextjs');

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
        simplify = require('retext-simplify');
        decamelize = require('decamelize');
        passive = require('retext-passive');
        repeatedwords = require('retext-repeated-words');
        contractions = require('retext-contractions');
        usage = require('retext-usage');
        indefinitearticle = require('retext-indefinite-article');
        // overuse = require('retext-overuse');
        diacritics = require('retext-diacritics');
      }

      let text = editor.getText();

      let ignore = [];
      const isProse = editor.getRootScopeDescriptor().scopes.some((scope) =>
        scope.indexOf('plain') > -1 || scope.indexOf('gfm') > -1);

      if (!isProse) {
        ignore = settings.ignoreProgrammingWords;


        // Make code mimic prose.
        // Unfortunately decamelize offsets the column reported when it adds a space.
        text = decamelize(text, ' ')
          .replace(/>|<|#|@|:|!|\/|'|,|\||{|}|-|=|\(|\)|\[|\]|\*/g, ' ')
          .replace(/;/g, '.');
      }

      try {
        retext()
          .use(cliches)
          .use(equality)
          .use(intensify, { ignore })
          .use(profanities)
          .use(simplify, { ignore })
          .use(passive)
          .use(repeatedwords)
          .use(contractions)
          .use(usage)
          .use(indefinitearticle)
          // .use(overuse)
          .use(diacritics)
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
    grammarScopes: config.get('linter-retextjs').grammars,
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
    ignoreProgrammingWords: {
      description: 'Ignore an array of words in code contexts.',
      type: 'array',
      default: [
        'function',
        'provide',
        'require',
        'some',
        'then',
        'try',
        'type',
      ],
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
