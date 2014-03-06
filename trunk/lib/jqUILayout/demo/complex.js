/*
 * complex.html
 *
 * This is a demonstration page for the jQuery layout widget
 *
 *  NOTE: For best code readability, view this with a fixed-space font and tabs equal to 4-chars
 */

var outerLayout, innerLayout;

/*
*#######################
*     ON PAGE LOAD
*#######################
*/
$(document).ready( function() {
    // create the OUTER LAYOUT
    outerLayout = $("body").layout( layoutSettings_Outer );

    /*******************************
     ***  CUSTOM LAYOUT BUTTONS  ***
     *******************************
     *
     * Add SPANs to the east/west panes for customer "close" and "pin" buttons
     *
     * COULD have hard-coded span, div, button, image, or any element to use as a 'button'...
     * ... but instead am adding SPANs via script - THEN attaching the layout-events to them
     *
     * CSS will size and position the spans, as well as set the background-images
     */

    // BIND events to hard-coded buttons in the NORTH toolbar
    outerLayout.addToggleBtn( "#tbarToggleNorth", "north" );
    outerLayout.addOpenBtn( "#tbarOpenSouth", "south" );
    outerLayout.addCloseBtn( "#tbarCloseSouth", "south" );
    outerLayout.addPinBtn( "#tbarPinWest", "west" );
    outerLayout.addPinBtn( "#tbarPinEast", "east" );

    // save selector strings to vars so we don't have to repeat it
    // must prefix paneClass with "body > " to target ONLY the outerLayout panes
    var westSelector = "body > .ui-layout-west"; // outer-west pane
    var eastSelector = "body > .ui-layout-east"; // outer-east pane

     // CREATE SPANs for pin-buttons - using a generic class as identifiers
    $("<span></span>").addClass("pin-button").prependTo( westSelector );
    $("<span></span>").addClass("pin-button").prependTo( eastSelector );
    // BIND events to pin-buttons to make them functional
    outerLayout.addPinBtn( westSelector +" .pin-button", "west");
    outerLayout.addPinBtn( eastSelector +" .pin-button", "east" );

     // CREATE SPANs for close-buttons - using unique IDs as identifiers
    $("<span></span>").attr("id", "west-closer" ).prependTo( westSelector );
    $("<span></span>").attr("id", "east-closer").prependTo( eastSelector );
    // BIND layout events to close-buttons to make them functional
    outerLayout.addCloseBtn("#west-closer", "west");
    outerLayout.addCloseBtn("#east-closer", "east");


    /* Create the INNER LAYOUT - nested inside the 'center pane' of the outer layout
     * Inner Layout is create by createInnerLayout() function - on demand
     *
        innerLayout = $("div.pane-center").layout( layoutSettings_Inner );
     *
     */


    // DEMO HELPER: prevent hyperlinks from reloading page when a 'base.href' is set
    $("a").each(function () {
        var path = document.location.href;
        if (path.substr(path.length-1)=="#") path = path.substr(0,path.length-1);
        if (this.href.substr(this.href.length-1) == "#") this.href = path +"#";
    });

});


/*
*#######################
* INNER LAYOUT SETTINGS
*#######################
*
* These settings are set in 'list format' - no nested data-structures
* Default settings are specified with just their name, like: fxName:"slide"
* Pane-specific settings are prefixed with the pane name + 2-underscores: north__fxName:"none"
*/
layoutSettings_Inner = {
    applyDefaultStyles:             true // basic styling for testing & demo purposes
,   minSize:                        20 // TESTING ONLY
,   spacing_closed:                 14
,   north__spacing_closed:          8
,   south__spacing_closed:          8
,   north__togglerLength_closed:    -1 // = 100% - so cannot 'slide open'
,   south__togglerLength_closed:    -1
,   fxName:                         "slide" // do not confuse with "slidable" option!
,   fxSpeed_open:                   1000
,   fxSpeed_close:                  2500
,   fxSettings_open:                { easing: "easeInQuint" }
,   fxSettings_close:               { easing: "easeOutQuint" }
,   north__fxName:                  "none"
,   south__fxName:                  "drop"
,   south__fxSpeed_open:            500
,   south__fxSpeed_close:           1000
//, initClosed:                     true
,   center__minWidth:               200
,   center__minHeight:              200
};


/*
*#######################
* OUTER LAYOUT SETTINGS
*#######################
*
* This configuration illustrates how extensively the layout can be customized
* ALL SETTINGS ARE OPTIONAL - and there are more available than shown below
*
* These settings are set in 'sub-key format' - ALL data must be in a nested data-structures
* All default settings (applied to all panes) go inside the defaults:{} key
* Pane-specific settings go inside their keys: north:{}, south:{}, center:{}, etc
*/
var layoutSettings_Outer = {
    name: "outerLayout" // NO FUNCTIONAL USE, but could be used by custom code to 'identify' a layout
    // options.defaults apply to ALL PANES - but overridden by pane-specific settings
,   defaults: {
        size:                   "auto"
    ,   minSize:                50
    ,   paneClass:              "ui-layout-pane"      // default = 'ui-layout-pane'
    ,   resizerClass:           "ui-layout-resizer"   // default = 'ui-layout-resizer'
    ,   togglerClass:           "ui-layout-toggler"   // default = 'ui-layout-toggler'
    ,   buttonClass:            "button"    // default = 'ui-layout-button'
    ,   contentSelector:        ".content"  // inner div to auto-size so only it scrolls, not the entire pane!
    ,   contentIgnoreSelector:  "span"      // 'paneSelector' for content to 'ignore' when measuring room for content
    ,   togglerLength_open:     35          // WIDTH of toggler on north/south edges - HEIGHT on east/west edges
    ,   togglerLength_closed:   35          // "100%" OR -1 = full height
    ,   hideTogglerOnSlide:     true        // hide the toggler when pane is 'slid open'
    ,   togglerTip_open:        "Close This Pane"
    ,   togglerTip_closed:      "Open This Pane"
    ,   resizerTip:             "Resize This Pane"
    //  effect defaults - overridden on some panes
    ,   fxName:                 "slide"     // none, slide, drop, scale
    ,   fxSpeed_open:           750
    ,   fxSpeed_close:          1500
    ,   fxSettings_open:        { easing: "easeInQuint" }
    ,   fxSettings_close:       { easing: "easeOutQuint" }
}
,   north: {
        resizable:              true
    ,   slidable:               false
    //  override default effect
    ,   fxName:                 "none"
    }
,   south: {
        slidable:               false       // REFERENCE - cannot slide if spacing_closed = 0
    ,   initClosed:             true
    }
,   west: {
        spacing_closed:         21          // wider space when closed
    ,   togglerLength_open:     21           // NONE - using custom togglers INSIDE west-pane
    ,   togglerLength_closed:   21          // make toggler 'square' - 21x21
    ,   togglerAlign_closed:    "top"       // align to top of resizer
    ,   togglerTip_open:        "Close West Pane"
    ,   togglerTip_closed:      "Open West Pane"
    ,   resizerTip_open:        "Resize West Pane"
    ,   slideTrigger_open:      "click"     // default
    ,   initClosed:             true
    //  add 'bounce' option to default 'slide' effect
    ,   fxSettings_open:        { easing: "easeOutBounce" }
    }
,   east: {
        size:                   250
    ,   spacing_closed:         21          // wider space when closed
    ,   togglerLength_closed:   21          // make toggler 'square' - 21x21
    ,   togglerAlign_closed:    "top"       // align to top of resizer
    ,   togglerLength_open:     0           // NONE - using custom togglers INSIDE east-pane
    ,   togglerTip_open:        "Close East Pane"
    ,   togglerTip_closed:      "Open East Pane"
    ,   resizerTip_open:        "Resize East Pane"
    ,   slideTrigger_open:      "mouseover"
    ,   initClosed:             true
    //  override default effect, speed, and settings
    ,   fxName:                 "drop"
    ,   fxSpeed:                "normal"
    ,   fxSettings:             { easing: "" } // nullify default easing
    }
,   center: {
        paneSelector:           "#mainContent"          // sample: use an ID to select pane instead of a class
    ,   minWidth:               200
    ,   minHeight:              200
    }
};

/**
 *  debugData
 *
 *  Pass me a data structure {} and I'll output all the key/value pairs - recursively
 *
 *  @example var HTML = debugData( oElem.style, "Element.style", { keys: "top,left,width,height", recurse: true, sort: true, display: true, returnHTML: true });    
 *
 *  @param Object   o_Data   A JSON-style data structure
 *  @param String   s_Title  Title for dialog (optional)
 *  @param Hash     options  Pass additional options in a hash
 */
function debugData (o_Data, s_Title, options) {
    options = options || {};
    var
        str=s_Title || 'DATA'
    //  maintain backward compatibility with OLD 'recurseData' param
    ,   recurse=(typeof options=='boolean' ? options : options.recurse !==false)
    ,   keys=(options.keys?','+options.keys+',':false)
    ,   display=options.display !==false
    ,   html=options.returnHTML !==false
    ,   sort=options.sort !==false
    ,   D=[], i=0 // Array to hold data, i=counter
    ,   hasSubKeys = false
    ,   k, t, skip, x   // loop vars
    ;
    if (o_Data.jquery) {
        str=(s_Title ? s_Title+'\n':'')+'jQuery Collection ('+ o_Data.length +')\n    context="'+ o_Data.context +'"';
    }
    else if (o_Data.tagName && typeof o_Data.style == 'object') {
        str=(s_Title ? s_Title+'\n':'')+o_Data.tagName;
        var id = o_Data.id, cls=o_Data.className, src=o_Data.src, hrf=o_Data.href;
        if (id)  str+='\n    id="'+     id+'"';
        if (cls) str+='\n    class="'+  cls+'"';
        if (src) str+='\n    src="'+    src+'"';
        if (hrf) str+='\n    href="'+   hrf+'"';
    }
    else {
        parse(o_Data,''); // recursive parsing
        if (sort && !hasSubKeys) D.sort(); // sort by keyName - but NOT if has subKeys!
        str+='\n***'+'****************************'.substr(0,str.length);
        str+='\n'+ D.join('\n'); // add line-breaks
    }

    if (display) alert(str); // display data
    if (html) str=str.replace(/\n/g, ' <br>').replace(/  /g, ' &nbsp;'); // format as HTML
    return str;

    function parse ( data, prefix ) {
        if (typeof prefix=='undefined') prefix='';
        try {
            $.each( data, function (key, val) {
                k = prefix+key+':  ';
                skip = (keys && keys.indexOf(','+key+',') == -1);
                if (typeof val=='function') { // FUNCTION
                    if (!skip) D[i++] = k +'function()';
                }
                else if (typeof val=='string') { // STRING
                    if (!skip) D[i++] = k +'"'+ val +'"';
                }
                else if (typeof val !='object') { // NUMBER or BOOLEAN
                    if (!skip) D[i++] = k + val;
                }
                else if (isArray(val)) { // ARRAY
                    if (!skip) D[i++] = k +'[ '+ val.toString() +' ]'; // output delimited array
                }
                else if (val.jquery) {
                    if (!skip) D[i++] = k +'jQuery ('+ val.length +') context="'+ val.context +'"';
                }
                else if (val.tagName && typeof val.style == 'object') {
                    var id = val.id, cls=val.className, src=val.src, hrf=val.href;
                    if (skip) D[i++] = k +' '+
                        id  ? 'id="'+   id+'"' :
                        src ? 'src="'+  src+'"' :
                        hrf ? 'href="'+ hrf+'"' :
                        cls ? 'class="'+cls+'"' :
                        '';
                }
                else { // Object or JSON
                    if (!recurse || !hasKeys(val)) { // show an empty hash
                        if (!skip) D[i++] = k +'{ }';
                    }
                    else { // recurse into JSON hash - indent output
                        D[i++] = k +'{';
                        parse( val, prefix+'    '); // RECURSE
                        D[i++] = prefix +'}';
                    }
                }
            });
        } catch (e) {}
        function isArray(o) {
            return (o && typeof o==='object' && !o.propertyIsEnumerable('length') && typeof o.length==='number');
        }
        function hasKeys(o) {
            var c=0;
            for (x in o) c++;
            if (!hasSubKeys) hasSubKeys = !!c;
            return !!c;
        }
    }
};


/**
* showOptions
*
* Pass a layout-options object, and the pane/key you want to display
*/
function showOptions (o_Settings, key) {
    var data = o_Settings.options;
    $.each(key.split("."), function() {
        data = data[this]; // resurse through multiple levels
    });
    debugData( data, 'options.'+key );
}

/**
* showState
*
* Pass a layout-options object, and the pane/key you want to display
*/
function showState (o_Settings, key) {
    debugData( o_Settings.state[key], 'state.'+key );
}


/**
* createInnerLayout
*/
function createInnerLayout () {
    // innerLayout is INSIDE the center-pane of the outerLayout
    //debugData( layoutSettings_Inner );
    innerLayout = $( outerLayout.options.center.paneSelector ).layout( layoutSettings_Inner );
    // hide 'Create Inner Layout' commands and show the list of testing commands
    $('#createInner').hide();
    $('#createInner2').hide();
    $('#innerCommands').show();
}

