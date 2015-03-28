import m from 'mithril';

export default function n () {
  // First, let Mithril process our arguments and generate a `view`.
  var view = m(...arguments),
    config = view.attrs.config,
    // Divide `view.children` nodes between DOM and vDOM. Save all as a flat array in `kids`.
    kids   = [],
    dom    = [],
    vdom   = []
  ;
  view.children.forEach(function recurse (kid) {
    // - if it is an array, recurse these steps over each of its items
    if (Array.isArray(kid)) {
      return kid.forEach(recurse);  // (when TCO comes, we should be ready for it)
    }
    // - push the child where it belongs
    kids.push(kid);
    (kid instanceof Node ? dom : vdom).push(kid);
  });

  // If we have DOM nodes among the `view.children`,
  if (dom.length) {
    // leave just vDOM nodes among children
    view.children = vdom;

    // and override the view's `config` attribute with the following function:
    view.attrs.config = function appendDOM (element) {
      // - add every DOM node to the view's root element – its position is determined by the node's
      //   original position in `kids`
      for (let node of dom) {
        element.insertBefore(node, element.childNodes[kids.indexOf(node)] || null);
      }
      // - call the original `config` function
      return config && config(...arguments);
    };
  }

  // Return the view, ready for rendering.
  return view;
  }
