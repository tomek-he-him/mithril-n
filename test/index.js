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
    , "even when the vnode has vchildren"
    );

  m.render(testContainer, n
    ( ".something"
    , {config: () => {
      is.pass("keeping an existing config attribute when the vnode has no children,");
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


test("Renders a child node", (is) => {
  var grandpa;
  var [pa, daughter, son] = Array(3).fill(null).map(
    () => document.createElement("div")
    );
  var baby = document.createTextNode("balbablaba ballablabla ba blbbla");
  pa.setAttribute("some-attr", "some value");
  pa.appendChild(son);
  pa.appendChild(daughter);
  pa.appendChild(baby);

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
  is.ok
    (  daughter.nextSibling == baby
    && pa.lastChild == baby
    ,  "including text nodes"
    );

  flush(testContainer);
  is.end();
});


test("Renders a bunch of child nodes", (is) => {
  var aunt, grandpa;
  var [ma, pa, uncle] = Array(3).fill(null).map(
    () => document.createElement("div")
    );

  m.render(testContainer
    , n(".grandpa"
      , {config: (element) => {grandpa = element;}}
      , ma
      , m(".aunt", { config: (element) => {aunt = element;}
                   , key: "aunt"
                   })
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
  is.ok
    ( [ma, aunt, uncle, pa].every((element, index, elements) =>
      (  index === 0
      || element.previousSibling == elements[index - 1]
      ))
    , "in the correct order"
    );


  var [oldUncle, oldAunt, oldPa] = [uncle, aunt, pa];
  m.render(testContainer
    , n(".other-grandpa"
      , {key: "other-grandpa"}
      , uncle
      , m(".aunt", { config: (element) => {aunt = element;}
                   , key: "aunt"
                   })
      )
    );
  is.notEqual
    ( uncle.parentNode
    , grandpa
    , "moving nodes when needed instead of cloning them"
    );
  is.equal
    ( uncle
    , oldUncle
    , "without breaking references across redraws"
    );
  is.equal
    ( aunt
    , oldAunt
    , "and keeping references to keyed vnodes"
    );


  m.render(testContainer
    , n(".other-grandpa"
      , {key: "other-grandpa"}
      , m(".aunt", { config: (element) => {aunt = element;}
                   , key: "aunt"
                   })
      , uncle
      , n("", pa)
      )
    );
  is.equal
    ( uncle
    , oldUncle
    , "even when changing the order"
    );
  is.equal
    ( pa
    , oldPa
    , "even when called more than once in a single view"
    );

  flush(testContainer);
  is.end();
  });
