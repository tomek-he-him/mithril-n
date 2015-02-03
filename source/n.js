import m from 'mithril';

export default function n (...args) {
  var view = m(...args);
  var cfg = view.attrs.config;
  var kids = [];

  (function recurse (x) {
    return (x instanceof Array
      ? x.map(recurse)
      : kids.push(x)
      );
    })(view.children);

  var dom = [];
  var vdom = [];

  for (let x of kids) {
    (x.nodeType ? dom : vdom).push(x);
    }

  if (dom.length) {
    view.attrs.config = function appendDom (el, ...rest) {
      for (let node of dom) {
        el.insertBefore(node, el.childNodes[kids.indexOf(node)] || null);
        }

      return cfg && cfg(el, ...rest);
      };

    view.children = vdom;
    }

  return view;
  }
