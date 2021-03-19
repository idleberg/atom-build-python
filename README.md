# build-python

[![apm](https://flat.badgen.net/apm/license/build-python)](https://atom.io/packages/build-python)
[![apm](https://flat.badgen.net/apm/v/build-python)](https://atom.io/packages/build-python)
[![apm](https://flat.badgen.net/apm/dl/build-python)](https://atom.io/packages/build-python)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/atom-build-python)](https://circleci.com/gh/idleberg/atom-build-python)
[![David](https://flat.badgen.net/david/dep/idleberg/atom-build-python)](https://david-dm.org/idleberg/atom-build-python)

[Atom Build](https://atombuild.github.io/) provider for `python`/`python3`/`py`, runs Python. Supports the [linter](https://atom.io/packages/linter) package for error highlighting.

## Installation

### apm

Install `build-python` from Atom's [Package Manager](http://flight-manual.atom.io/using-atom/sections/atom-packages/) or the command-line equivalent:

`$ apm install build-python`

### Using Git

Change to your Atom packages directory:

**Windows**

```powershell
# Powershell
$ cd $Env:USERPROFILE\.atom\packages
```

```cmd
:: Command Prompt
$ cd %USERPROFILE%\.atom\packages
```

**Linux & macOS**

```bash
$ cd ~/.atom/packages/
```

Clone repository as `build-python`:

```bash
$ git clone https://github.com/idleberg/atom-build-python build-python
```

Inside the cloned directory, install Node dependencies:

```bash
$ yarn || npm install
```

## Usage

### Build

Before you can build, select an active target with your preferred build option.

Available targets:

* `Python` — compile script
* `Python (compileall)` — compile script with `-m compileall`
* `Python (compileall, optimized)` — compile script with `-O -m compileall`
* `Python (user)` — compile script with custom settings (interpreter and/or arguments)

### Shortcuts

Here's a reminder of the default shortcuts you can use with this package:

**Select active target**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> or <kbd>F7</kbd>

**Build script**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> or <kbd>F9</kbd>

**Jump to error**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd> or <kbd>F4</kbd>

**Toggle build panel**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd> or <kbd>F8</kbd>

## License

This work is licensed under the [The MIT License](LICENSE).
