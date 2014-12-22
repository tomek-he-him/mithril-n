import m from 'mithril';

var isDom = function isDom (element) {
    return element.nodeType > 0;
    };

var notDom = function notDom (x) {
    return !isDom(x);
    };

export default function n (...args) {
    // Wrap any DOM arguments in an array:
    // Avoids Mithril parsing DOM as vdom attrs and makes our logic simpler.
    var view = m(...args.map(arg => isDom(arg) ? [arg] : arg));

    var config = view.attrs.config;
    var kids = view.children;

    var dom = [];
    var vdom = [];

    // Divide children between dom & vdom
    if (Array.isArray(kids)) for (let kid of kids) {
        (isDom(kid) ? dom : vdom).push(kid);
        }

    if (dom.length) {
        view.attrs.config = function injectNodes (element, initialized, context) {
            if (!initialized) dom.map(dom, (node, index) => {
                var next = kids.slice(kids.indexOf(node)).find(notDom);
                var location = element.childNodes[vdom.indexOf(next)] || null;

                (function injectNode (node) {
                    if (node instanceof Array) {
                        node = node;
                        }
                    else if (node.nodeType === node.DOCUMENT_FRAGMENT_NODE) {
                        node = Array.from(node.childNodes);
                        }
                    else {
                        return element.insertBefore(node, location);
                        }

                    dom[index] = node;

                    for (let subNode of node){
                        injectNode(subNode);
                        }
                    })(node);
                });

            if (config instanceof Function) return config(element, initialized, context);
            };

        // Make sure only the virtual elements are parsed by m.render.
        view.children = vdom;
        }

    return view;
    };
