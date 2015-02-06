import "6to5/polyfill";

import test from "tape-catch";

import m from "mithril";
import n from "../source/n";


// Prepare a DOM container for tests
var testContainer = document.createElement("div");
document.body.appendChild(testContainer);

function flush (target) {
  var childNode;
  while ((childNode = target.lastChild)) {
    target.removeChild(childNode);
    }
  }


test("Does the same as Mithril", (is) => {
  var noop = () => {};

  is.deepEqual
    ( m("div", {an: "attribute", onclick: noop})
    , n("div", {an: "attribute", onclick: noop})
    , "with a single vnode"
    );

  is.deepEqual
    ( m("div", {an: "attribute", onclick: noop}, m("a"), [m(".b"), m("#c")])
    , n("div", {an: "attribute", onclick: noop}, m("a"), [m(".b"), m("#c")])
    , "even when the vnode has children"
    );

  m.render(testContainer, n
    ( ".something"
    , {config: () => {
      is.pass("keeping an existing config attribute when tha vnode has no children");
      }}
    ));

  m.render(testContainer, n
    ( ".somethingElse"
    , {config: () => {
      is.pass("as well as when it does have vchildren and child nodes");
      }}
    , document.createElement("div")
    , m(".another-child")
    ));

  flush(testContainer);
  is.end();
  });


test("Renders a real child node", (is) => {
  var grandpa, daughter, pa, son;

  (pa = document.createElement("div"))
    .setAttribute("some-attr", "some value")
    ;
  pa.appendChild(
    (son = document.createElement("span"))
    );
  pa.appendChild(
    (daughter = document.createTextNode("me is the daughter"))
    );

  m.render
    ( testContainer
    , n("article"
      , {config: (element) => {
        grandpa = element;
        }}
      , pa
      )
    );

  is.equal
    ( pa && pa.parentNode
    , grandpa
    , "in the parent vnode"
    );

  is.equal
    ( pa.getAttribute("some-attr")
    , "some value"
    , "keeping attributes and their values"
    );

  is.ok
    (  pa.firstChild == son
    && son.nextSibling == daughter
    ,  "and the node's subtree"
    );

  flush(testContainer);
  is.end();
});


test("Renders a bunch of real nodes", (is) => {
  var aunt, grandpa;
  var [ma, pa, uncle] = Array(3).fill(null).map(
    () => document.createElement("div")
    );

  m.render(testContainer
    , n(".grandpa"
      , {config: (element) => {grandpa = element;}}
      , ma
      , m(".aunt", {config: (element) => {aunt = element;}})
      , uncle
      , pa
      )
    );

  is.equal
    ( grandpa && grandpa.parentNode
    , testContainer
    , "just where told to render"
    );

  is.ok
    ( [ma, pa, uncle].every((element) =>
      element && element.parentNode == grandpa
      )
    , "in the parent node"
    );

  is.equal
    ( aunt && aunt.parentNode
    , grandpa
    , "alongside virtual nodes"
    );

  is.true
    ( [ma, aunt, uncle, pa].every((element, index, elements) =>
      (  index === 0
      || element.previousSibling == elements[index - 1]
      ))
    , "in the correct order"
    );

  is.skip("without breaking references");
  is.skip("persistently across redraws");
  is.skip("even when changing the order");
  is.skip("and keeping references to keyed vnodes");
  is.skip("even when called more than once in a single view");

  flush(testContainer);
  is.end();
  });


test("Updates real nodes", (is) => {
  is.skip("Reacts to updates on the parent vnode,");
  is.skip("or on virtual children,");
  is.skip("still keeping node references.");
  is.end();
  });
