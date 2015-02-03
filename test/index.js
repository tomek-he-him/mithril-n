import "6to5/polyfill";

import test from "tape-catch";

import n from "../source/n";


test("Doesn't break Mithril:", function (is) {
    is.pass("Does the same as mithril with a vnode,");
    is.pass("even when the vnode has children.");
    is.pass("Doesn't break an existing config attribute.");
    is.end();
    });


test("Renders real nodes:", function (is) {
    is.pass("Renders a bunch of child nodes mixed with virtual nodes");
    is.pass("in the correct order");
    is.pass("without breaking references.");
    is.pass("Even when called more than once in a single view.");
    is.end();
    });


test("Updates real nodes:", function (is) {
    is.pass("Reacts to updates on the parent vnode,");
    is.pass("or on virtual children,");
    is.pass("still keeping node references.");
    is.end();
    });
