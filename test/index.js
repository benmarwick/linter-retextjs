'use strict'

/* global atom */

var path = require('path')
var test = require('tape')
var lint = require('..')

test('linter-retextjs', function(t) {
  t.plan(1)

  atom.workspace.destroyActivePaneItem()

  Promise.resolve()
    .then(function() {
      return atom.packages.activatePackage('language-gfm')
    })
    .then(function() {
      return atom.workspace.open(path.join(__dirname, 'invalid.md'))
    })
    .then(function(editor) {
      return lint.provideLinter().lint(editor)
    })
    .then(function(messages) {
      t.deepEqual(
        messages.map(flatten),
        [
          '`primitive` may be insensitive, use `simple`, `indigenous`, `hunter-gatherer` instead (retext-equality:savage)',
          '`dude` may be insensitive, use `person`, `friend`, `pal`, `folk`, `individual` instead (retext-equality:gal-guy)',
          'Don’t use `should`, it lessens impact (retext-intensify:hedge)',
           'Replace `majorly` with `extremely` (retext-usage:majorly)',
           'Use `a` before `nut`, not `an` (retext-indefinite-article)'
        ],
        'should emit messages'
      )
    }, t.ifErr)
})

function flatten(message) {
  return message.excerpt
}
