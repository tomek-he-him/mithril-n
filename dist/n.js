import m from 'mithril';

function isDom( x ){
    return x.nodeType > 0;
}

function notDom( x ){
    return !isDom( x );
}

export default function n( ...input ){
    // Wrap any DOM arguments in an array:
    // Avoids Mithril parsing DOM as vdom attrs and makes our logic simpler.
    var view = m( ...( input.map( x => isDom( x ) ? [ x ] : x ) ) );

    var cfg  = view.attrs.config;
    var kids = view.children;

    var dom  = [];
    var vdom = [];

    // Divide children between dom & vdom
    if( Array.isArray( kids ) ){
        for ( let x of kids ){
            ( isDom( x ) ? dom : vdom ).push( x );
        }
    }

    if( dom.length > 0 ){
        view.attrs.config = ( el, init, context ) => {
            if( !init ){
                dom.map( dom, ( node, index ) => {
                    let next  = kids.slice( kids.indexOf( node ) ).find( notDom );
                    let nodes;

                    if( node instanceof Array ){
                        node = node;
                    }
                    if( node.nodeType === node.DOCUMENT_FRAGMENT_NODE ){
                        node = Array.from( node.childNodes );
                    }
                    else {
                        node = [ node ];
                    }

                    dom[ index ] = node;

                    for( let subNode of nodes ){
                        el.insertBefore( subNode, el.childNodes[ vdom.indexOf( next ) ] || null );
                    }
                } );
            }

            if( cfg ){
                return cfg( el, init, context );
            }
        };

        // Make sure only the virtual elements are parsed by m.render.
        view.children = vdom;
    }

    return view;
}
