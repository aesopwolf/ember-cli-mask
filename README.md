# ember-cli-mask

Demo: https://aesopwolf.github.io/ember-cli-mask

_ember-cli-mask_ is an ember component that adds masking to `<input>` elements.

This component is a port of https://github.com/borbit/react-mask-mixin and has zero dependencies (no jQuery).

![Demo](https://raw.githubusercontent.com/aesopwolf/ember-cli-mask/screenshots/demo.gif?raw=true "Gif of ember-cli-mask being demoed")

## Installation

* `ember install ember-cli-mask`

## Usage

You can use `{{input-mask}}` anywhere in an `.hbs` file

```
{{input-mask mask="99/99/9999" placeholder="01/01/1900" type="text"}}
{{input-mask mask="(999) 999-9999" placeholder="Phone number"}}
{{input-mask mask="9A**999" placeholder="CA license plate"}}
{{input-mask mask="A-A-A" placeholder="Initials"}}
```

**Masking definitions**

- 9 - numeric
- A - alphabetical
- \* - alphanumeric

**Supported types**

The following are valid `type` attributes:

- text
- search
- url
- tel
- password

The component will automatically set `type="text"` if you don't specify one yourself.

## License

ember-cli-mask may be freely distributed under the [ISC License](https://www.isc.org/downloads/software-support-policy/isc-license/).

Original work Copyright (c) 2015 Serge Borbit <serge.borbit@gmail.com>

Modified work Copyright (c) 2016, Aesop Wolf <aesopwolf@gmail.com>
