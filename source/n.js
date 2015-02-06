import m from 'mithril';

export default function n (...args) {
  var view = m(...args);
  var config = view.attrs.config;

  // Divide `view.children` between DOM and vDOM. Save all in kids.
  var kids = [];
  var dom = [];
  var vdom = [];
  view.children.forEach(function recurse (kid) {
    // - get rid of invalid values
    if (!(kid instanceof Object || typeof kid == "string")) return;

    // - push the child where it belongs, if it's not an array
    if (!(kid instanceof Array)) {
      kids.push(kid);
      (kid instanceof Node ? dom : vdom).push(kid);
      return;
      }

    // - and if it is an array, recurse these steps over each of its items
    kid.forEach(recurse);  // When TCO comes, we should be ready for it.
    });

  if (dom.length) {
    view.attrs.config = function appendDOM (element, ...rest) {
      for (let node of dom) {
        element.insertBefore(node,
          element.childNodes[kids.indexOf(node)] || null
          );
        }

      return config && config(element, ...rest);
      };

    view.children = vdom;
    }

  return view;
  }
