'use strict'

/* eslint-env node, browser */
/* global atom */

var CompositeDisposable = require('atom').CompositeDisposable

exports.activate = activate
exports.deactivate = deactivate
exports.provideLinter = provideLinter

// Internal variables.
var load = loadOnce
var minimatch
var engine
var unified
var markdown
var frontmatter
var english
var remark2retext
var cliches
var equality
var intensify
var profanities
var simplify
var passive
var repeatedwords
var contractions
var usage
var indefinitearticle
var diacritics
var idleCallbacks = []
var subscriptions = new CompositeDisposable()
var config = {}

function lint(editor) {
  load()

  if (config.ignoreFiles && minimatch(editor.getPath(), config.ignoreFiles)) {
    return []
  }


  return engine({
    processor: unified,
    detectIgnore: config.detectIgnore,
    detectConfig: config.detectConfig,
    rcName: '.retextjsrc',
    packageField: 'retextjs',
    ignoreName: '.retextjsignore',
    defaultConfig: transform(),
    configTransform: transform
  })(editor)
}


function provideLinter() {
  return {
    grammarScopes: config.scopes,
    name: 'retextjs',
    scope: 'file',
    lintsOnChange: true,
    lint: lint
  }
}

function activate() {
  var schema = require('./package').configSchema
  var id = window.requestIdleCallback(install)
  idleCallbacks.push(id)

  Object.keys(schema).forEach(function(key) {
    subscriptions.add(atom.config.observe('linter-retextjs.' + key, setter))

    function setter(value) {
      config[key] = value
    }
  })



  function install() {
    idleCallbacks.splice(idleCallbacks.indexOf(id), 1)

    // Install package dependencies
    if (!atom.inSpecMode()) {
      require('atom-package-deps').install('linter-retextjs')
    }

    // Load required modules.
    load()
  }
}

function deactivate() {
  idleCallbacks.forEach(removeIdleCallback)
  idleCallbacks = []

  subscriptions.dispose()

  function removeIdleCallback(id) {
    window.cancelIdleCallback(id)
  }
}

function loadOnce() {
  engine = require('unified-engine-atom')
  unified = require('unified')
  english = require('retext-english')
  markdown = require('remark-parse')
  frontmatter = require('remark-frontmatter')
  remark2retext = require('remark-retext')
  minimatch = require('minimatch')
  cliches = require('retext-cliches')
  equality = require('retext-equality')
  intensify = require('retext-intensify')
  profanities = require('retext-profanities')
  simplify = require('retext-simplify')
  passive = require('retext-passive')
  repeatedwords = require('retext-repeated-words')
  contractions = require('retext-contractions')
  usage = require('retext-usage')
  indefinitearticle = require('retext-indefinite-article')
  // overuse = require('retext-overuse');
  diacritics = require('retext-diacritics')
  load = noop
}

function noop() {}

function transform(options) {
  var settings = options || {}

  return {
    plugins: [
      markdown,
      [frontmatter, ['yaml', 'toml']],
      [
        remark2retext,
        unified()
          .use(english)
          .use(profanities)
          .use(cliches)
          .use(equality)
          .use(intensify)
          .use(profanities)
          .use(simplify)
          .use(passive)
          .use(repeatedwords)
          .use(contractions)
          .use(usage)
          .use(indefinitearticle)
          // .use(overuse)
          .use(diacritics)
          .use(equality, {noBinary: settings.noBinary})
      ],
      severity
    ]
  }
}

function severity() {
  var map = {
    0: null,
    1: false,
    2: true,
    undefined: false
  }

  return transformer

  function transformer(tree, file) {
    file.messages.forEach(transform)
  }

  function transform(message) {
    message.fatal = map[message.profanitySeverity]
  }
}
