 [![Build status](https://img.shields.io/badge/local%20build-passing-brightgreen.svg?style=flat-square)](#testing)
 [![Code climate](https://img.shields.io/codeclimate/github/tomekwi/mithril-n.svg?style=flat-square)](https://codeclimate.com/github/tomekwi/mithril-n)
 [![David](https://img.shields.io/david/tomekwi/mithril-n.svg?style=flat-square)](https://david-dm.org/tomekwi/mithril-n)




n()
===

**Pure DOM nodes in [Mithril][] templates.**

[Mithril]: http://lhorie.github.io/mithril/




Installation
------------

Using bower:

```sh
$ bower install mithril-n
```

Using npm:

```sh
$ npm install mithril-n
```




Usage
-----

It's really just Mithril's `m()`, which accepts DOM nodes as `children` as well as original arguments.

So this JavaScript*:

```js
import m from "mithril";
import n from "mithril-n";

var pa = document.createElement("div");
pa.className = "pa";

var view = n
  ( ".home"
  , {config: (element) => {console.log(element.outerHTML);}}
  , pa
  , n(".ma", m(".son"))
  , "A happy family"
  );

m.render(document.body, view);
```

…will log the following:

```html
<div class="home">
  <div class="pa"></div>
  <div class="ma">
    <div class="son"></div>
    </div>
  A happy family
  </div>
```

(*) I'm using ES6 syntax here – brought to us today by great projects like [6to5]. When you download a release of _mithril-n_, you get two versions bundled: one for ES6, one for ES5 (available as CommonJS, RequireJS and as a global variable).

[6to5]: http://6to5.org




Testing
-------

Until [juliangruber/tape-run#5][tape-run-issue] is fixed we can't test on Travis. To run the tests locally make sure you have PhantomJS installed and run.

```sh
$ npm install && npm test
```

They pass. You have our word :)

```
Does the same as Mithril

  ✓ with a single vnode
  ✓ even when the vnode has children of different types
  ✓ keeping an existing config attribute when the vnode has no children,
  ✓ as well as when it does have vchildren and child nodes

Renders a child node

  ✓ in the parent vnode
  ✓ keeping attributes and their values
  ✓ and the node's subtree
  ✓ including text nodes

Renders a bunch of child nodes

  ✓ just where told to render
  ✓ in the parent node
  ✓ alongside virtual nodes
  ✓ in the correct order
  ✓ moving nodes when needed instead of cloning them
  ✓ without breaking references across redraws
  ✓ and keeping references to keyed vnodes
  ✓ even when changing the order
  ✓ even when called more than once in a single view

Accepts different types of syntax

  ✓ array syntax (has all nodes)
  ✓ array syntax (has them in the right order)
  ✓ non-array syntax (has all nodes)
  ✓ non-array syntax (has them in the right order)
  ✓ mixed syntax (has all nodes)
  ✓ mixed syntax (has them in the right order)



total:     23
passing:   23
duration:  2.9s

All tests pass!
```

[tape-run-issue]: https://github.com/juliangruber/tape-run/issues/5 "tape-run does not work on travis ci #5"




License
-------

[MIT][] © [Tomek Wiszniewski][].

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
