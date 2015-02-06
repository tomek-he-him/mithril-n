import "6to5/polyfill";

import test from "tape-catch";

import m from "mithril";
import n from "../source/n";


var flush = function flush (target) {
  var childNode;
  while ((childNode = target.lastChild)) {
    target.removeChild(childNode);
    }
  };


test("Doesn't break Mithril", function (is) {
  var noop = function () {};

  is.deepEqual
    ( m("div", {an: "attribute", onclick: noop})
    , n("div", {an: "attribute", onclick: noop})
    , "Does the same as Mithril with a vnode,"
    );

  is.deepEqual
    ( m("div", {an: "attribute", onclick: noop}, m("a"), [m(".b"), m("#c")])
    , n("div", {an: "attribute", onclick: noop}, m("a"), [m(".b"), m("#c")])
    , "even when the vnode has children."
    );

  var changed = false;
  m.render(document.body, n
    ( ".something"
    , {config: function () { changed = true; }}
    ));
  is.true
    ( changed
    , "Doesn't break an existing config attribute,"
    );

  var changedAgain = false;
  m.render(document.body, n
    ( ".somethingElse"
    , {config: function () { changedAgain = true; }}
    , document.createElement("div")
    ));
  is.true
    ( changedAgain
    , "even when rendering a node."
    );

  flush(document.body);
  is.end();
  });


test("Renders a real child node", function (is) {
  var grandpa, son, daughter;
  var pa = document.createElement("div");
  pa.setAttribute("some-attr", "and its value");
  pa.appendChild(son = document.createElement("span"));
  pa.appendChild(daughter = document.createTextNode("I'm the daughter"));

  m.render
    ( document.body
    , n
      ( "article"
      , {config: function (element) {
        grandpa = element;
        }}
      , pa
      )
    );

  is.equal
    ( pa.parentNode, grandpa
    , "Renders a child node"
    );

  is.equal
    ( pa.getAttribute("some-attr"), "and its value"
    , "keeping attributes"
    );

  is.true
    (  pa.firstChild == son
    && son.nextSibling == daughter
    , "and the node's subtree."
    );

  flush(document.body);
  is.end();
});


test.skip("Renders a bunch of real nodes", function (is) {
  is.pass("Renders a bunch of child nodes mixed with virtual nodes");
  is.pass("in the correct order");
  is.pass("without breaking references");
  is.pass("and persists them across redraws.");
  is.pass("Even when called more than once in a single view.");
  is.end();
  });


test.skip("Updates real nodes", function (is) {
  is.pass("Reacts to updates on the parent vnode,");
  is.pass("or on virtual children,");
  is.pass("still keeping node references.");
  is.end();
  });
