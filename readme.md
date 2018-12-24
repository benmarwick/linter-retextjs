# linter-retextjs [![Build Status](https://travis-ci.org/benmarwick/linter-retextjs.svg?branch=master)](https://travis-ci.org/benmarwick/linter-retextjs)

A plugin for [Atom's][atom] [Linter][linter] providing an interface to [retext][retext]. Retext is a natural language processor that includes plugins to check for bad prose. The full list of retext plugins is [here](https://github.com/retextjs/retext/blob/master/doc/plugins.md#list-of-plugins).

This package provides these checkers:

- [cliches](https://github.com/dunckr/retext-cliches): Checks phrases for cliches
- [equality](https://github.com/retextjs/retext-equality): checks for possible insensitive, inconsiderate language
- [intensify](https://github.com/retextjs/retext-intensify): check for weak and mitigating wording
- [profanities](https://github.com/retextjs/retext-profanities): check for profane and vulgar wording
- [passive](https://github.com/retextjs/retext-passive): check for passive voice
- [repeated words](https://github.com/retextjs/retext-repeated-words): check for repeated words
- [simplify](https://github.com/retextjs/retext-simplify): check phrases for simpler alternatives
- [contractions](https://github.com/retextjs/retext-contractions): check apostrophe use in contractions
- [usage](https://github.com/kostasx/retext-usage): warn about incorrect English usage
- [indefinite article](https://github.com/retextjs/retext-indefinite-article): check if indefinite articles (`a`, `an`) are used correctly
- [overuse](https://github.com/dunckr/retext-overuse): check words for overuse
- [diacritics](https://github.com/retextjs/retext-diacritics): check for proper use of diacritics

It does not include [readability](https://github.com/retextjs/retext-readability), because that works at sentence-level while the others work at word- or short-phrase-level. The absence of this checker, and the addition of several others, are the main differences with [camjc/atom-linter-retext](https://github.com/camjc/atom-linter-retext)

## Installation

### Command Line

1. Install [Atom 1.22](https://atom.io) or newer
2. In the terminal, install the package via apm:

    ```sh
    apm install linter-retextjs
    ```

### GUI

1. Install [Atom](https://atom.io)
1. Launch Atom
1. Open Settings View using <kbd>Cmd+,</kbd> on macOS or <kbd>Ctrl+,</kbd> on other platforms
1. Click the Install tab on the left side
1. Enter `linter-retextjs` in the search box and press <kbd>Enter</kbd>
1. Click the "Install" button that appears

### Running locally

Clone and install from your disc to experiment with modifications:

    ```
    git clone https://github.com/benmarwick/linter-retextjs.git
    cd linter-retextjs
    apm install
    ```

## Contributing

Issues regarding **linter-retextjs** should be opened in this
[repository][linter-issues].
Please raise issues with **retext** on its [repository][retext-issues].

## License

[MIT][license] © [Cameron Chamberlain][author1] & [Ben Marwick][author2]

Based on atom-linter-alex:
[MIT][license] © [Titus Wormer][author3]

<!-- Definitions. -->

[atom]: https://atom.io

[linter]: https://github.com/AtomLinter/Linter

[retext]: https://github.com/wooorm/retext

[apm]: https://github.com/atom/apm

[license]: LICENSE

[author1]: http://camjc.com
[author2]: https://github.com/benmarwick
[author3]: https://wooorm.com/

[linter-issues]: https://github.com/benmarwick/linter-retextjs/issues

[retext-issues]: https://github.com/wooorm/retext/issues
