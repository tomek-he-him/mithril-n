import m from 'mithril';

export default function n( ...args ){
	var real  = args[ 0 ].nodeType && args[ 0 ];
	var attrs = args[ 1 ]; 
	var cfgs  = [];

	// If a native DOM node is the parent
	if( real ){
		if( attrs instanceof Object && !attrs.attrs ){
			throw Error( `Can't apply virtual attributes ${attrs} to pre-existing DOM node ${real}.` );
		}
	
		// Pass a placeholder virtual node to Mithril
		args.splice( 0, 1, '' );

		cfgs.push( temp => {
			// Switch it back in after build
			temp.parentNode.replaceChild( temp, el );
		} );
	}

	var view  = m( ...args );
	var kids  = [];

	// Flatten view.children to get rid of confusing nested arrays
	( function recurse( x ){
		return x instanceof Array ? x.map( recurse ) : kids.push( x );
	}( view.children ) );

	var dom   = [];
	var vdom  = [];
	
	// Split children into real and virtual nodes
	for ( let x of kids ) ( x.nodeType ? dom : vdom ).push( x );
	
	// If there are any real DOM children
	if( dom.length ){
		cfgs.push( ( el, init ) => {
			// Because n() effectively describes a view and can accept real DOM children,
			// we must assume the author intends to describe the full view via n().
			// Therefore, clear out any existing children when it's initialised.
			if( !init && el.childNodes.length !== vdom.length ){
				while( el.firstChild ) el.removeChild( el.firstChild );
			}
			
			// Insert each real DOM node in its intended place if Mithril build has removed them
			for ( let node of dom ){
				if( !node.isEqualNode( pos ) ){
					( real || el ).insertBefore( node, el.childNodes[ kids.indexOf( node ) ] || null );
				}
			}
		} );
	
		view.children = vdom;
	}
	
	// We need to ensure any passed in config is executed after the others so it has the
	// expected elements in place when it resolves
	var cfg   = view.attrs.config;
	// If Mithril wants to destroy the node, and the node was supplied by us, we need to 
	// make sure the real one is destroyed
	var kill  = () => real && real.parentNode.removeChild( real );
	
	cfgs.push( real ? ( el, init, ctxt ) => {
		// The user-supplied config can prevent natural destruction. We need to catch that.
		cfg && cfg( real, init, ctxt );
		
		let unload = ctxt.onunload;
		
		ctx.onunload = unload ? e => {
			let stop = e.preventDefault;
			let safe = false;
			
			e.preventDefault = () => safe = true && stop();
			
			cfg( e );
			
			safe || kill();
		} : kill
	} : cfg )

	// Execute the config functions in the right order.
	view.attrs.config = ( ...args ) => {
		cfgs.map( cfg => cfg( ...args ) );
	};

	return view;
}
