# atom-linter-retext [![Build Status](https://travis-ci.org/benmarwick/atom-linter-retext.svg?branch=master)](https://travis-ci.org/benmarwick/atom-linter-retext)

A plugin for [Atom's][atom] [Linter][linter] providing an interface to [retext][retext]. Retext is a natural language processor that includes checkers for bad prose.

This package will provide these checkers:

- [cliches](https://github.com/dunckr/retext-cliches): Checks phrases for cliches
- [equality](https://github.com/retextjs/retext-equality): checks for possible insensitive, inconsiderate language
- [intensify](https://github.com/retextjs/retext-intensify): check for weak and mitigating wording
- [profanities](https://github.com/retextjs/retext-profanities): check for profane and vulgar wording

It does not include [readability](https://github.com/retextjs/retext-readability), because that works at sentence-level while the others work at word- or short-phrase-level. The absence of this checker is the main difference with [camjc/atom-linter-retext](https://github.com/camjc/atom-linter-retext)

## Installation

With [**apm**][apm], from GitHub:

```sh
apm install benmarwick/atom-linter-retext
```

## Contributing

Issues regarding **atom-linter-retext** should be opened in this
[repository][linter-issues].
Please raise issues with **retext** on its [repository][retext-issues].

## License

[MIT][license] © [Cameron Chamberlain][author1] & [Ben Marwick][author2]

Based on atom-linter-alex:
[MIT][license] © [Titus Wormer][author]

<!-- Definitions. -->

[atom]: https://atom.io

[linter]: https://github.com/AtomLinter/Linter

[retext]: https://github.com/wooorm/retext

[apm]: https://github.com/atom/apm

[license]: LICENSE

[author1]: http://camjc.com
[author2]: https://github.com/benmarwick

[linter-issues]: https://github.com/camjc/atom-linter-retext/issues

[retext-issues]: https://github.com/wooorm/retext/issues
