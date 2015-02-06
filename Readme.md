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




License
-------

[MIT][] © [Tomek Wiszniewski][].

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
