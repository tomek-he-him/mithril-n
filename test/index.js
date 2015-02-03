import "6to5/polyfill";

import test from "tape-catch";

import m from "mithril";
import n from "../source/n";


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

  is.end();
  });


test.skip("Renders real nodes", function (is) {
  is.pass("Renders a bunch of child nodes mixed with virtual nodes");
  is.pass("in the correct order");
  is.pass("without breaking references.");
  is.pass("Even when called more than once in a single view.");
  is.end();
  });


test.skip("Updates real nodes", function (is) {
  is.pass("Reacts to updates on the parent vnode,");
  is.pass("or on virtual children,");
  is.pass("still keeping node references.");
  is.end();
  });
