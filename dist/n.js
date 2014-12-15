/* global m */

import noop from './tools/noop';
import toArray from './tools/to-array';


/**
 * @param {String} selector
 * @param {Attributes} [attributes]
 * @param {Node} [childNode]
 */
export default function n (selector) {
    var originalConfig;
    var restArguments = toArray(arguments).slice(1);
    var secondArgument = restArguments[1];

    // Read and clean arguments.
    var attributes = ( (  typeof secondArgument == 'object'
                       && !('tag' in secondArgument)
                       && !('subtree' in secondArgument)
                       )
                     ? restArguments.shift()
                     : {}
                     );
    var childNode = restArguments.shift();

    // Add config
    originalConfig = attributes.config || noop;
    attributes.config = function (element, isInitialized, context) {
        if (  !isInitialized
           && childNode instanceof Node
           ) {
            element.appendChild(childNode);
            }

        return originalConfig(element, isInitialized, context);
        };

    // Trigger mithril
    return m(selector, attributes);
    };
