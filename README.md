<br/>
<div align="center">
  <img src="https://www.dropbox.com/s/uvbo6d4yrzdzmv6/typewriter2.png?raw=1" width="200">
</div>
<br/>

<div align="center"><a href="https://travis-ci.org/iliocatallo/typista">
  <img alt="Build status" src="https://travis-ci.org/iliocatallo/typista.svg?branch=master">
</a>
  <a href="https://coveralls.io/github/iliocatallo/typista">
  <img alt="Coverage" src="https://coveralls.io/repos/github/iliocatallo/typista/badge.svg?branch=master">
</a>
  <a href="https://bundlephobia.com/package/typista">
    <img alt="Dependencies" src="https://badgen.net/bundlephobia/dependency-count/typista"/>
  </a>
</div>

# Table of contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Tutorial](#tutorial)

## Introduction

Typista is a JavaScript library that provides a compact syntax for defining an abstract class along with a set of associated concrete classes. Using Typista, one may write

```javascript
const Maybe = data('Maybe');
Maybe.$ = $.Nothing
        | $.Just('x');
```

rather than

```javascript
class Maybe {}

class Nothing extends Maybe {}

class Just extends Maybe {
    constructor(x) {
        super();
        this.x = x;
    }
}
```

That is, Typista simplifies the definition of _structured types_<sup> 1</sup> – also known as _algebraic data types_<sup> 2</sup>, _variant types_<sup> 3</sup> or _custom types_<sup> 4</sup>.


## Installation

Typista can be installed via npm with the following command:

```
npm install typista
```

## Tutorial

In the following, we show how to define a `Maybe` data type useful to represent optional values. We define this new type by means of the `data` function.

```javascript
const {data, $} = require('typista');

const Maybe = data('Maybe');
```

A value of type `Maybe` may either be empty or contain a value `x`. We represent this fact by means of two constructors, named `Nothing` and `Just`. They are introduced via a combination of `$` and `|`, as to denote alternatives.


```javascript
const {data, $} = require('typista');

const Maybe = data('Maybe');
Maybe.$ = $.Nothing
        | $.Just('x');
```


Despite the different syntax, `Maybe.Just` and `Maybe.Nothing` are just plain JavaScript constructor functions. As such, it is possible to define methods by attaching functions to the corresponding prototype object. For instance, we may define a method that `map`s optional values according to a transformation function.

 ```javascript
Maybe.Just.prototype.map = function (fn) {
    return new Maybe.Just(fn(this.x));
};

Maybe.Nothing.prototype.map = function (fn) {
    return this;
};
```

Expectedly, we instantiate values by invoking the related constructor. The only notable difference is the possibility of omitting the `new` keyword, if so desired.

```javascript
const m1 = new Maybe.Just(5);   // => Just { x: 5 }
const m2 = m1.map(x => x + 2);  // => Just { x: 7 }

const m3 = new Maybe.Nothing(); // => Nothing {}
const m4 = m3.map(x => x + 2);  // => Nothing {}
```

---

[1]: [Simon Peyton Jones – The Implementation of Functional Programming Languages](https://www.microsoft.com/en-us/research/publication/the-implementation-of-functional-programming-languages/)<br>
[2]: [Wikipedia – Algebraic Data Type](http://wiki.haskell.org/Algebraic_data_type)<br/>
[3]: [ReasonML – Variants](https://reasonml.github.io/docs/en/variant) <br/>
[4]: [Elm – Custom Types](https://guide.elm-lang.org/types/custom_types.html)

Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
