/**
 *  定义了ebaui所有控件的基类control类
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $ ){

    var ArrayProto     = Array.prototype;
    var slice          = ArrayProto.slice;
    var nativeForEach  = ArrayProto.forEach;
    
    var ObjectProto    = Object.prototype;
    var toString       = ObjectProto.toString;
    

    /**
     *  驼峰命名
     *  Button      -> button
     *  ButtonEdit  -> buttonEdit
     */
    ebaui.control = function( name, base, prototype ){

        var fullName, constructor, basePrototype, proxiedPrototype = {},namespace = name.split( "." )[ 0 ]; ;

        name = name.split( "." )[ 1 ];
        fullName = namespace + "-" + name;

        if ( !prototype ) {
            prototype = base;
            base = ebaui.Control;
        }

        ebaui[ namespace ] = ebaui[ namespace ] || {};

        basePrototype = new base();
        // we need to make the options hash a property directly on the new instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        basePrototype.options = ebaui.control.extend( {}, basePrototype.options );

        $.each( prototype, function( prop, value ) {
            if ( !$.isFunction( value ) ) {
                proxiedPrototype[ prop ] = value;
                return;
            }
            proxiedPrototype[ prop ] = (function() {
                var _super = function() {
                        return base.prototype[ prop ].apply( this, arguments );
                    },
                    _superApply = function( args ) {
                        return base.prototype[ prop ].apply( this, args );
                    };
                return function() {
                    var __super = this._super,
                        __superApply = this._superApply,
                        returnValue;

                    this._super = _super;
                    this._superApply = _superApply;
                    
                    returnValue = value.apply( this, arguments );

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            })();
        });

        constructor = ebaui[ namespace ][ name ] = function( options, element ) {

            // allow instantiation without "new" keyword
            if ( !this._createControl ) {
                return new constructor( options, element );
            }

            // allow instantiation without initializing for simple inheritance
            // must use "new" keyword (the code above always passes args)
            if ( arguments.length ) {
                this._createControl( options, element );
            }

        };

        constructor.prototype = ebaui.control.extend( basePrototype, proxiedPrototype, {
            constructor    : constructor,

            _namespace      : namespace,
            _controlName    : name,
            _controlFullName: fullName

        } );

        ebaui.control.bridge( name, constructor );

        return constructor;

    };

    ebaui.control.bridge = function( name, constructor ){
        
        //  var fullName = constructor.prototype.controlFullName || name;
        //  实际上，$.fn['ctrl']这个实际上应该是一个方法，所以name应该首先toLowerCase()
        name = name.toLocaleLowerCase();

        $.fn[ name ] = function( options ) {

            return this.each(function( idx,el ) {

                var $el = $( el );
                if( !$el.attr( 'data-parsed' ) || $el.attr( 'data-parsed' ) != 'true' ){
                    //  $el.data( 'model', new constructor( options, el ) );
                    new constructor( options, el );
                }

            });

        };

    };

    ebaui.control.extend = function( target ) {
        var input = slice.call( arguments, 1 ),
            inputIndex = 0,
            inputLength = input.length,
            key,
            value;
        for ( ; inputIndex < inputLength; inputIndex++ ) {
            for ( key in input[ inputIndex ] ) {
                value = input[ inputIndex ][ key ];
                if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
                    // Clone objects
                    if ( $.isPlainObject( value ) ) {
                        target[ key ] = $.isPlainObject( target[ key ] ) ?
                            ebaui.control.extend( {}, target[ key ], value ) :
                            // Don't extend strings, arrays, etc. with objects
                            ebaui.control.extend( {}, value );
                    // Copy everything else by reference
                    } else {
                        target[ key ] = value;
                    }
                }
            }
        }
        return target;
    };

    /** 
     *  ebaui控件基类
     *  @class      Control 
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    function Control( /* options,element */ ){  };

    Control.prototype = {

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   Control
         *  @member     {Object}    options
         */
        options : {
            id      : '',
            enabled : true,
            visible : true,
            focused : false,
            
            width   : 0,
            height  : 0,
            top     : 0,
            left    : 0,
            
            position: ''
        },

        /**
         *  控件ID
         *  @private
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    _controlID
         */
        _controlID : undefined,

        /**
         *  
         *  @private
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    _namespace
         */
        _namespace : '',

        /**
         *  
         *  @private
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    _controlName
         */
        _controlName : '',

        /**
         *  
         *  @private
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    _controlFullName
         */
        _controlFullName : '',

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   Control
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '',

        /**
         *  CSS长度单位的正则表达式匹配
         *  @private
         *  @instance
         *  @memberof   Control
         *  @member     {RegExp}    _cssUnitRE
         */
        _cssUnitRE:/^\d+(%|in|cm|mm|em|ex|pt|pc|px)?$/,

        /**
         *  更新UI的宽度
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _updateStyleWidth
         */
        _updateStyleWidth : function(){

            var me    = this;
            var $root = me._$root;
            if( !$root ){ return; }

            var width = me.width();
            var isNum = me.isNumber( width );

            if( isNum && width <= 0 ){
                return;
            }

            if( isNum && width > 0 ){
                 $root.width( width );
                 return;
            }

            var result = me._cssUnitRE.exec( width );
            if( result[1] ){
                //  if one css unit has been assigned
                $root.css( 'width',width );
            }else{
                //  default css unit is px
                $root.css( 'width',width + 'px' );
            }

        },

        /**
         *  更新UI的高度
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _updateStyleHeight
         */
        _updateStyleHeight : function(){

            var me     = this;
            var $root = me._$root;
            if( !$root ){ return; }

            var height = me.height();
            var isNum  = me.isNumber( height );

            if( isNum && height <= 0 ){
                return;
            }

            if( isNum && height > 0 ){
                $root.height( height );
                return;
            }

            var result = me._cssUnitRE.exec( height );
            if( result[1] ){
                //  if one css unit has been assigned
                $root.css( 'height',height );
            }else{
                //  default css unit is px
                $root.css( 'height',height + 'px' );
            }

        },

        /**
         *  更新UI的位置top
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _updateStyleTop
         */
        _updateStyleTop : function(){ 
            var me = this;
            var $root = me._$root;
            if( !$root ){ return; }

            var top = me.top();
            if( !isNaN( top ) && top != 0 ){
                $root.css( 'top',top + 'px' ); 
            }
        },

        /**
         *  更新UI的位置left
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _updateStyleLeft
         */
        _updateStyleLeft : function(){
            var me = this;
            var $root = me._$root;
            if( !$root ){ return; }

            var left = me.left();
            if( !isNaN( left ) && left != 0 ){
                $root.css( 'left',left + 'px' ); 
            }
        },

        /**
         *  更新UI的position属性
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _updateStylePosition
         */
        _updateStylePosition:function(){

            var me = this;
            var $root = me._$root;
            if( !$root ){ return; }

            var position = me.position();
            if(position){
                /* position !== '' */
                $root.css( 'position',position ); 
            }else{
                $root.css( 'position',null ); 
            }

        },

        /**
         *  更新UI的title属性
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _updateStyleTitle
         */
        _updateStyleTitle:function(){
            var me = this;
            var $root = me._$root;
            if( !$root ){ return; }

            var title = me.title();
            if(title){ $root.attr( 'title',title ); }
        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _setupEvents
         */
        _setupEvents : $.noop,

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _initControl
         */
        _initControl : $.noop,

        /**
         *  获取焦点
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _focus
         */
        _focus : $.noop,

        /**
         *  失去焦点
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _blur
         */
        _blur : $.noop,

        /**
         *  更新控件enabled的UI样式
         *  @private
         *  @instance
         *  @memberof   Control
         *  @method     _updateStyleEnabled
         */
        _updateStyleEnabled:$.noop,

        /**
         *  设置或者移除据聚焦样式或者失焦样式
         *  @private
         *  @instance
         *  @memberof   Control
         *  @method     _updateStyleFocused
         */
        _updateStyleFocused:$.noop,

        /**
         *  更新控件visible的UI样式
         *  @private
         *  @instance
         *  @memberof    ebaui.web.Control
         *  @method     _updateStyleVisible
         */
        _updateStyleVisible:function() {
            var me = this;
            if( !me._$root ){ return; }
            var op = me.visible() ? 'show' : 'hide';
            me._$root[op]();
        },

        /**
         *  把HTML占位符转换成为控件自身的HTML结构
         *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _parseUi
         *  @param      {Object}    element HTML占位符
         */
        _parseUi : function( element ){

            /*
                创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
                _parseDataOptions
                _parseAttrOptions
                _parseUi
                _initControl
                _setupEvents
                _render

                self._$root.data( 'model',self );
            */
            var me = this;
            // replace html with control template
            if( !me._rootHtmlTmpl ){ return null; }

            var template = $( me._rootHtmlTmpl ).html(),
                $el = $( element ),
                $html = $( template );
            $el.replaceWith( $html );
            //  如果是Form表单控件，一般会有name属性
            //  反之没有
            $html.attr( { 'data-name'  : me.name ? me.name() : '','data-parsed': 'true' } );

            if( me.id() !== '' ){
                $html.attr( 'id',me.id() );
            }

            return $html;

        },

        /**
         *  获取w3c中，html标签本身就支持的属性配置<br />
         *  ebaui框架中，html标签本身就支持的属性直接编写在html标签内，而不会放在data-option里面进行配置
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _parseAttrOptions
         *  @param      {Object}    element HTML占位符
         */
        _parseAttrOptions : function( element ){

            /*
                创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
                _parseDataOptions
                _parseAttrOptions
                _parseUi
                _initControl
                _setupEvents
                _render

                self._$root.data( 'model',self );
            */

            var $el   = $(element);
            var id    = $el.attr( 'id' );
            var name  = $el.attr( 'name' );
            var title = $el.attr( 'title' );

            var options      = {
                'id'   : id ? id : '',
                'name' : name ? name : '',
                'title': title ? title : '',
            };

            return options;
        },

        /**
         *  更新UI显示
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   Control
         *  @method     _render
         */
        _render : function(){

            /*
                创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
                _parseDataOptions
                _parseAttrOptions
                _parseUi
                _initControl
                _setupEvents
                _render

                self._$root.data( 'model',self );
            */

            var me = this;
            me._updateStyleWidth();
            me._updateStyleHeight();
            me._updateStylePosition();
            me._updateStyleTop();
            me._updateStyleLeft();
            me._updateStyleEnabled();
            me._updateStyleVisible();
            me._updateStyleTitle();
        },

        /**
         *  创建控件——获取初始化参数，初始化，绑定事件，输出控件样式
         *  @private
         *  @instance
         *  @memberof   Control
         *  @method     _createControl
         */
        _createControl:function( options, element ){

            var self        = this;
            var finalOpts   = $.extend( {}, self.options, self._parseDataOptions( element ), self._parseAttrOptions( element ) );

            if( options ){
                finalOpts = $.extend( finalOpts,options );
            }

            self.options    = finalOpts;

            self._controlID = ebaui.guid();
            self._$root     = self._parseUi( element );

            self._initControl();
            self._setupEvents();
            self._render();
            
            self._$root.data( 'model',self );
            
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   Control
         *  @method     _setOptions
         */
        _setOptions: function( options ) {
            var key;

            for ( key in options ) {
                this._setOption( key, options[ key ] );
            }
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   Control
         *  @method     _getOption
         *  @param      {String}    key     - option key
         */
        _getOption: function( key ){
            return this.options[key];
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   Control
         *  @method     _setOption
         *  @param      {String}    key     - option key
         *  @param      {Object}    value   - option key
         */
        _setOption: function( key, value ) {
            this.options[ key ] = value;
        },

        /**
         *  把html标签定义的data-options字符串转换成javascript对象
         *  @private
         *  @instance
         *  @memberof   Control
         *  @method     _parseDataOptions
         *  @param      {Object}    element
         */
        _parseDataOptions:function( element ){

            /*
                创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
                _parseDataOptions
                _parseAttrOptions
                _parseUi
                _initControl
                _setupEvents
                _render

                self._$root.data( 'model',self );
            */

            var $el     = $( element );
            var options = {};
            
            if( $el.size() == 0 ){ return options; }

            var s = $.trim( $el.attr('data-options') );
            if ( s ){

                var first = s.substring(0,1);
                var last  = s.substring(s.length-1);

                if (first != '{') {  s = '{' + s; }
                if (last != '}') { s = s + '}'; }

                options = ( new Function( 'return ' + s ) )();

            }

            return options;

        },

        /**
         *  获取控件类所属命名空间
         *  @public
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    namespace
         *  @example    <caption>get</caption>
         *      console.log( ctrl.namespace() );
         */
        namespace:function() {
            return this._namespace;
        },

        /**
         *  获取控件名称
         *  @public
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    controlName
         *  @example    <caption>get</caption>
         *      console.log( ctrl.controlName() );
         */
        controlName:function() {
            return this._controlName;
        },

        /**
         *  获取包含命名空间在内的控件全名
         *  @public
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    controlFullName
         *  @example    <caption>get</caption>
         *      console.log( ctrl.controlFullName() );
         */
        controlFullName:function() {
            return this._controlFullName;
        },

        /**
         *  获取控件html标签的ID
         *  @public
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    id
         *  @example    <caption>get</caption>
         *      console.log( ctrl.id() );
         */
        id : function(){
            return this.options['id'];
        },

        /**
         *  获取或者设置控件是否可用
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {Boolean}   enabled
         *  @default    true
         *  @example    <caption>get</caption>
         *      //  true
         *      console.log( ctrl.enabled() );
         *  @example    <caption>set</caption>
         *      //  disable control
         *      ctrl.enabled( false )
         */
        enabled : function( val ){

            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['enabled'];
            }
            me._setOption( 'enabled',val );
            me._updateStyleEnabled();

        },

        /**
         *  获取或者设置控件是否可见
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {String}   title
         *  @default    ''
         *  @example    <caption>get</caption>
         *      console.log( ctrl.title() );
         *  @example    <caption>set</caption>
         *      ctrl.title( 'pls type user name' )
         */
        title : function( val ){
            var me = this;
            if( !me.isString( val ) ){ 
                return me.options['title']; 
            }
            me.options['title'] = val;
        },

        /**
         *  获取或者设置控件是否可见
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {Boolean}   visible
         *  @default    true
         *  @example    <caption>get</caption>
         *      //  true
         *      console.log( ctrl.visible() );
         *  @example    <caption>set</caption>
         *      //  hide
         *      ctrl.visible( false )
         */
        visible : function( val ){
            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['visible'];
            }
            me._setOption( 'visible',val );
            me._updateStyleVisible();
        },

        /**
         *  控件是否可以获取焦点
         *  @public
         *  @instance
         *  @virtual
         *  @readonly
         *  @memberof   Control
         *  @member     {Boolean}   focusable
         *  @default    false
         *  @example    <caption>get</caption>
         *      //  false
         *      console.log( ctrl.focusable() );
         */
        focusable:function() { return false },

        /**
         *  获取或者设置控件是否已经得到焦点
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {Boolean}   focused
         *  @default    false
         *  @example    <caption>get</caption>
         *      //  true
         *      console.log( ctrl.focused() );
         *  @example    <caption>set</caption>
         *      //  true
         *      ctrl.focused( false );
         */
        focused : function( val ){

            var me = this;
            if( me.isBoolean( val ) ){

                me._setOption( 'focused',val );

                if( val ){
                    me._focus();
                }else{
                    me._blur();
                }

                me._updateStyleFocused();
                
            }

            return me.options['focused'];
        },

        /**
         *  获取或者设置控件宽度
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {Number}    width
         *  @default    null
         *  @example    <caption>get</caption>
         *      //  100
         *      console.log( ctrl.width() );
         *  @example    <caption>set</caption>
         *      ctrl.width( 100 );
         */
        width : function( val ){

            var me = this;
            if( me.isNumber( val ) ){
                me.options['width'] = val;
                me._updateStyleWidth();
            }else{
                return me.options['width'];
            }

        },

        /**
         *  获取或者设置控件高度
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {Number}    height
         *  @default    null
         *  @example    <caption>get</caption>
         *      //  100
         *      console.log( ctrl.height() );
         *  @example    <caption>set</caption>
         *      ctrl.height( 100 );
         */
        height : function( val ){

            var me = this;
            if( me.isNumber( val ) ){
                me.options['height'] = val;
                me._updateStyleHeight();
            }else{
                return me.options['height'];
            }

        },

        /**
         *  获取或者设置控件的位置top
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {Number}    top
         *  @default    null
         *  @example    <caption>get</caption>
         *      //  100
         *      console.log( ctrl.top() );
         *  @example    <caption>set</caption>
         *      ctrl.top( 100 );
         */
        top : function( val ) {
            var me = this;
            if( me.isNumber( val ) ){
                me.options['top'] = val;
                me._updateStyleTop();
            }else{
                return me.options['top'];
            }
        },

        /**
         *  获取或者设置控件的位置left
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {Number}    left
         *  @default    null
         *  @example    <caption>get</caption>
         *      //  100
         *      console.log( ctrl.left() );
         *  @example    <caption>set</caption>
         *      ctrl.left( 100 );
         */
        left : function( val ) {
            var me = this;
            if( me.isNumber( val ) ){
                me.options['left'] = val;
                me._updateStyleLeft();
            }else{
                return me.options['left'];
            }
        },

        /**
         *  position设置
         *  @public
         *  @instance
         *  @memberof   Control
         *  @member     {String}    position
         *  @default    'static'
         *  @example    <caption>get</caption>
         *      //  'static'
         *      console.log( ctrl.position() );
         *  @example    <caption>set</caption>
         *      ctrl.position( 'relative' );
         */
        position : function( val ){
            var me = this;
            if( !val ){ return me.options['position']; }

            if( /absolute|fixed|relative|static|inherit|\s*/.test( val ) ){
                me.options['position'] = $.trim(val);
                me._updateStylePosition();
            }

        },

        /**
         *  获取控件ID
         *  @public
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {String}    controlID
         *  @example    <caption>get</caption>
         *      console.log( ctrl.controlID() );
         */
        controlID : function(){
            return this._controlID;
        },

        /**
         *  获取控件关联的HTML DOM对象的jQuery包装
         *  @public
         *  @readonly
         *  @instance
         *  @memberof   Control
         *  @member     {Object}    uiElement
         *  @example    <caption>get</caption>
         *      console.log( ctrl.uiElement() );
         */
        uiElement : function(){
            return this._$root;
        },

        keys:function( obj ){

            var me = this;
            if ( !me.isObject(obj) ){
                throw new TypeError('Invalid object');
            }

            var keys = [];
            for (var key in obj) {
                if( obj.hasOwnProperty( key ) ){
                    keys.push(key);
                }
            }

            return keys;

        },

        /**
         *  编译HTML模板
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     compileTmpl
         *  @arg        tmpl
         *  @arg        data
         *  @example
         *      console.log( ctrl.compileTmpl( '' ) );
         */
        compileTmpl:function( text, data ){

            var render;
            var noMatch = /(.)^/;
            var settings = {
                evaluate    : /<%([\s\S]+?)%>/g,
                interpolate : /<%=([\s\S]+?)%>/g,
                escape      : /<%-([\s\S]+?)%>/g
            };
            var escapes = {
                "'":      "'",
                '\\':     '\\',
                '\r':     'r',
                '\n':     'n',
                '\t':     't',
                '\u2028': 'u2028',
                '\u2029': 'u2029'
            };
            var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

            // Combine delimiters into one regular expression via alternation.
            var matcher = new RegExp([
              (settings.escape || noMatch).source,
              (settings.interpolate || noMatch).source,
              (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

            // Compile the template source, escaping string literals appropriately.
            var index = 0;
            var source = "__p+='";
            text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
              source += text.slice(index, offset)
                .replace(escaper, function(match) { return '\\' + escapes[match]; });

              if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':ebaui.escape(__t))+\n'";
              }
              if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
              }
              if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
              }
              index = offset + match.length;
              return match;
            });
            source += "';\n";

            // If a variable is not specified, place data values in local scope.
            if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

            source = "var __t,__p='',__j=Array.prototype.join," +
              "print=function(){__p+=__j.call(arguments,'');};\n" +
              source + "return __p;\n";

            try {
              render = new Function(settings.variable || 'obj', source);
            } catch (e) {
              e.source = source;
              throw e;
            }

            if (data){
                return render(data);
            }
            
            var template = function(data) {
              return render.call(this, data);
            };

            // Provide the compiled function source as a convenience for precompilation.
            template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

            return template;

        },

        /**
         *  forEach
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isNull
         *  @arg        obj
         *  @arg        iterator
         *  @arg        context
         *  @example
         *      console.log( ctrl.isNull( null ) );
         */
        each:function( obj, iterator, context ){

            var me = this;
            if (obj == null) return;
            if (nativeForEach && obj.forEach === nativeForEach) {
              obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
              for (var i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
              }
            } else {
              var keys = me.keys(obj);
              for (var i = 0, length = keys.length; i < length; i++) {
                if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
              }
            }

        },

        /**
         *  检查一个变量是否是空的。
         *  遇到以下情形，我们认为这个变量是空的：
         *  "" (an empty string)
         *  ，0 (0 as an integer)
         *  ，0.0 (0 as a float)
         *  ，null
         *  ，undefined
         *  ，false
         *  ，[](an empty array)
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isEmpty
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isEmpty( '' ) );
         */
        isEmpty : function( val ){

            if( val === null || val === undefined ){
                return true;
            }
            var me = this;
            //  false
            if( me.isBoolean( val ) ){ return val; }
            //  empty string && array
            if( me.isString( val ) || me.isArray( val ) ){ return val.length == 0; }
            //  0 (0 as an integer) || 0.0 (0 as a float)
            if( me.isNumber( val ) && !val ){ return true; }

            return true;

        },

        /**
         *  判断一个变量是否是null值
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isNull
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isNull( null ) );
         */
        isNull : function(obj){ return (obj === null || obj === undefined); },

        /**
         *  判断一个变量是否是RegExp类型
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isRegExp
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isRegExp() );
         */
        isRegExp:function(obj){ return toString.call(obj) == '[object RegExp]'; },

        /**
         *  判断一个变量是否是Date类型
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isDate
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isDate() );
         */
        isDate:function(obj){ return toString.call(obj) == '[object Date]'; },

        /**
         *  判断一个变量是否是Object类型
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isObject
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isObject() );
         */
        isObject:function( obj ) { return obj === Object(obj); },

        /**
         *  判断一个变量是否是Function类型
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isFunc
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isFunc() );
         */
        isFunc:function( obj ){ return toString.call(obj) == '[object Function]'; },

        /**
         *  判断一个变量是否是String类型
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isString
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isString() );
         */
        isString:function(obj){ return toString.call(obj) == '[object String]'; },

        /**
         *  判断一个变量是否是数值类型
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isNumber
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isNumber() );
         */
        isNumber:function(obj){ return toString.call(obj) == '[object Number]'; },

        /**
         *  判断一个变量是否是Array类型
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isArray
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isArray() );
         */
        isArray:function(obj){ return toString.call(obj) == '[object Array]'; },

        /**
         *  判断一个变量是否是Boolean类型
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isBoolean
         *  @arg        obj
         *  @return     {Boolean}
         *  @example
         *      console.log( ctrl.isBoolean() );
         */
        isBoolean:function( obj ){ return obj === true || obj === false || toString.call(obj) == '[object Boolean]'; },

        /**
         *  判断是否使用远程数据源
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     isUsingRemoteData
         *  @param      {Object|Array}          dataSource              - 如果dataSource是一个数组对象，则认为采用本地数据作为数据源；反之，如果dataSource包含了url属性，data属性（可选），怎认为是使用远程数据源
         *  @property   {String}                dataSource.url          - 服务端URL
         *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
         */
        isUsingRemoteData:function( dataSource ){
            if( !dataSource ){
                throw 'dataSource can not be null!';
            }

            var me = this;
            if( me.isArray( dataSource ) ){
                return false;
            }else if( me.isObject( dataSource ) && 'url' in dataSource ){
                return true;
            }

            return false;
        },

        /**
         *  移除所有事件监听，注销控件
         *  @public
         *  @instance
         *  @memberof   Control
         *  @method     destroy
         *  @example    
         *      ctrl.destroy();
         *  @todo       暂时还没有任何相关实现
         */
        destroy:function(){}
        
    };

    // exported
    ebaui.Control = Control;

})( jQuery );
/**
 *  ebaui.web.Dialog
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ){

    ebaui.web.registerControl( 'Dialog' );

    /** 
     *  控件全名 e.g. ebaui.web.Dialog
     *  控件描述
     *  @class      Dialog 
     *  @memberof   ebaui.web
     *  @extends    Control
     *  @tutorial   dialog_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      &lt;input data-role="dialog" data-options="{ width:800,height:600,beforeclose:onbefore,afterclose:onafter }"/&gt;
     */
    ebaui.control( 'web.Dialog',{

        _vexDialogId : null,

        /**
         *  内部变量，用来保存vex dialog的配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Dialog
         *  @member     {Object}    _vexOptions
         */
        _vexOptions:{
            className           : 'vex-theme-default',
            showCloseButton     : true,
            overlayClosesOnClick: false
        },

        /**
         *  把HTML占位符转换成为控件自身的HTML结构
         *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Dialog
         *  @method     _parseUi
         *  @param      {Object}    element HTML占位符
         */
        _parseUi : function( element ){
            //  update options
            var $html = $( element );
            this._vexOptions['content'] = $html.html();
            return $html;
        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Dialog
         *  @method     _initControl
         */
        _initControl : function(){

            var me = this;
            var $root = me._$root;
            var opts = me._vexOptions;

            opts = $.extend(vex.defaultOptions,me._vexOptions,opts);

            opts['afterOpen'] = function( options ){
                ebaui.web.parseUi( options.$vexContent );
            };

            me._vexOptions = opts;
            opts['width']  = me.options['width'];
            opts['height'] = me.options['height'];

            if( me.options['title'] ){
                opts['title'] = me.options['title'];
            }

            opts.content = '<div style="width:100%;height:100%;">' + opts.content + '</div>';

            if( me.options['beforeclose'] ){
                var beforefn = me.options['beforeclose'];
                opts['beforeClose'] = function(){
                    beforefn( me,{} );
                }
            }

            if( me.options['afterclose'] ){
                var afterfn = me.options['afterclose'];
                opts['afterClose'] = function(){
                    afterfn( me,{} );
                }
            }

        },

        /**
         *  打开窗口
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Dialog
         *  @method     open
         */
        open:function(){

            var me   = this;
            var opts = me._vexOptions;

            var $vexContent = vex.open(opts);
            var $vex = $vexContent.parent();
            me._vexDialogId = $vex.data().vex.id;

            $vexContent.css({
                'padding'         : '5px',
                'border'          : '1px #eee solid',
                'background-color': '#ddd',
                'width'           : opts['width'],
                'height'          : opts['height']
            });

            $vex.css({
                'padding-top'   : '50px',
                'padding-bottom': '0'
            });


        },

        /**
         *  关闭窗口
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Dialog
         *  @method     close
         */
        close:function(){
            vex.close(this._vexDialogId);
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Dialog
         *  @member     {Object}    options
         */
        options : {

            width      : 800,
            height     : 600,

            /**
             *  控件的值发生改变的时候触发
             *  @event      ebaui.web.Dialog#beforeClose
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
            beforeclose: null,

            /**
             *  控件的值发生改变的时候触发
             *  @event      ebaui.web.Dialog#afterclose
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
            afterclose : null

        }

    } );

})( jQuery,ebaui );

/**
 *  web.FormElement，所有表单控件的基类
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    /** 
     *  ebaui.web.FormElement
     *  表单控件的基类
     *  @class      FormElement
     *  @extends    Control
     *  @memberof   ebaui.web
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.FormElement',{

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @virtual
         *  @memberof   ebaui.web.FormElement
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '',

        /**
         *  控件当前验证状态
         *  @private
         *  @instance
         *  @default    ebaui.web.validationStates.none
         *  @memberof   ebaui.web.FormElement
         *  @member     {Number}    _currVaidationState
         */
        _currVaidationState:0,

        /**
         *  控件验证状态
         *  @private
         *  @instance
         *  @virtual
         *  @memberof   ebaui.web.FormElement
         *  @member     {Object}    _validationStates
         */
        _validationStates : {
            none   : 0,
            /** 验证成功 */
            success: 1,
            /** 提醒 */
            info   : 2,
            /** 错误 */
            error  : 3,
            /** 警告 */
            warning: 4,
            /** 忙碌 */
            busy   : 5
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _updateStyleReadonly
         */
        _updateStyleReadonly : $.noop,

        /**
         *  控件在所处的各个不同得validationState下对应的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @member     {Object}    _stateClass
         */
        _stateClass : ['','eba-success','eba-light','eba-error','eba-warning','eba-loading'],

        /**
         *  控件在所处的各个不同得validationState下对应的UI的icon类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @member     {Object}    _stateIconCls
         */
        _stateIconCls : {
            'eba-success': 'icon-ok',
            'eba-light'  : 'icon-lightbulb',
            'eba-error'  : 'icon-remove-circle',
            'eba-warning': 'icon-warning-sign',
            'eba-loading': 'icon-spinner icon-spin'
        },

        /**
         *  控件验证错误信息
         *  @private
         *  @instance
         *  @readonly
         *  @default    {}
         *  @memberof   ebaui.web.FormElement
         *  @member     {Object}    _errorCollection
         *  @example
         *      //  { required : 'this field is required...' }
         *      console.log( ctrl._errorCollection );
         */
        _errorCollection    : {},

        /**
         *  表单控件是否通过验证
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @member     {Boolean}   _isValid
         */
        _isValid  : true,

        /**
         *  初始化设置控件的validators
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _initValidators
         */
        _initValidators:function(){

            var me = this;
            var opts = me.options['validators'];
            if( opts ){
                me._validators = me._parseValidators( opts );
            }

        },

        /**
         *  将控件配置的验证规则，转化为相应的Javascript Validator对象
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _parseValidator
         */
        _parseValidator : function( rule ){

            if( !rule ){ return; }

            var result = /([a-z_]+)(.*)/i.exec( rule );
            var name = result[1];
            var param = eval(result[2]);

            var constructor = ebaui['web']['validationRules'][name];
            if( !constructor ){ return null; }
            var validator = new constructor( param );
            return validator;

        },

        /**
         *  将控件配置的验证规则，转化为相应的Javascript Validator对象
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _parseValidators
         */
        _parseValidators : function( rules ){

            var me = this;
            if( !rules || !me.isArray( rules ) ){ return []; }

            var returnValue = [];
            for( var i = 0,l = rules.length; i<l; i++ ){
                var validator = me._parseValidator( rules[i] );
                if( validator ){ returnValue.push( validator ); }
            }

            return returnValue;

        },

        /**
         *  显示控件的各个验证状态样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _doRenderStyleTip
         */
        _doRenderStyleTip:function( rootCls,tips ){

            var me      = this;
            if( me.isEmpty( tips ) ){
                tips = '';
            }

            var $root   = me._$root;
            var iconCls = me._stateIconCls[rootCls];
            var $border = $( '[class*="border"]',$root );
            var $icon   = $border.next('i[class^="icon"]');

            //  remove old validation class
            var states   = me._validationStates;
            var stateCls = me._stateClass;
            for( var item in states ){ $root.removeClass( stateCls[states[item]] ); }
            if( !$root.hasClass( rootCls ) ){ $root.addClass( rootCls ); }

            if( $icon.size() == 0 ){
                var html = '<i class="{0}" title="{1}"></i>'.replace('{0}',iconCls).replace('{1}',tips);
                $border.after( html );
            }else{

                $icon.attr( {
                    'class' : iconCls,
                    'title' : tips
                } );

            }

        },

        /**
         *  清除控件验证状态信息
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _renderStyleNoneTip
         *  @param      {String}  tips          - tooltips消息
         */
        _clearValidationTips:function ( tips ) {

            var me    = this;
            var $root = me._$root;
            var cls   = me._stateClass;
            for (var i = 0,l = cls.length; i < l; i++) {

                var rootCls = cls[i];
                if( rootCls ){
                    var iconCls = rootCls + 'icon';
                    $root.removeClass(rootCls);
                    $( 'span.' + iconCls,$root ).remove();
                }

            }

        },

        /**
         *  显示控件验证状态以及相应得消息
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _renderStyleTips
         *  @param      {Number}  state         - 控件验证状态
         *  @param      {String}  tips          - tooltips消息
         */
        _renderStyleTips:function( state,tips ) {

            var me       = this;
            var rootCls  = '';
            var stateCls = me._stateClass;
            var states   = me._validationStates;

            switch( state ){
                case states.success : 
                    rootCls = stateCls[states.success];
                    break;
                case states.info : 
                    rootCls = stateCls[states.info];
                    break;
                case states.error : 
                    rootCls = stateCls[states.error];
                    break;
                case states.warning : 
                    rootCls = stateCls[states.warning];
                    break;
                case states.busy : 
                    rootCls = stateCls[states.busy];
                    break;
                default:
                    break;
            }

            if( !rootCls ){
                me._clearValidationTips( tips ); return;
            }

            me._doRenderStyleTip( rootCls,tips );
        },

        /**
         *  更新验证后的样式信息
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _updateStyleValidationResult
         */
        _updateStyleValidationResult:function(){

            var me = this;
            if( me.isValid() ){
                me.success( '' );
            }else{
                me.error( me.errorTips() );
            }

        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _render
         */
        _render : function(){
            var me = this;
            me._super();
            me._updateStyleReadonly();
        },

        /**
         *  重置控件，清空验证状态，控件值，恢复到控件原始状态
         *  @public
         *  @virtual
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     reset
         */
        reset     : $.noop,

        /**
         *  获取或者设置控件验证状态信息
         *  @public
         *  @instance
         *  @default    ebaui.web.validationStates.none
         *  @memberof   ebaui.web.FormElement
         *  @method     tips
         *  @param      {Number}    state         - 控件验证状态
         *  @param      {String}    tips          - tooltips消息
         *  @example    <caption>get</caption>
         *      //  0,1,2,3,4
         *      //  详细的枚举值请查看ebaui.web.validationStates
         *      console.log( ctrl.tips() );
         *  @example    <caption>set</caption>
         *      //  设置info样式
         *      var states = ebaui.web.validationStates;
         *      ctrl.tips( states.info,'info' )
         *      //  清除tips以及其样式
         *      var states = ebaui.web.validationStates;
         *      ctrl.tips( states.none )
         */
        tips:function ( state,tips ) {

            var me = this;
            if( !me.isNumber( state ) ){ return me._currVaidationState; }

            if( !me.isString( tips ) ){
                tips = '';
            }

            if( -1 < state && state < 6 ){
                me._currVaidationState = state;
                me._renderStyleTips( state,tips );
            }

        },

        /**
         *  清除所有状态以及状态信息
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     clearTips
         *  @example
         *      ctrl.clearTips()
         */
        clearTips:function () { 
            var me = this;
            me.tips( me._validationStates.none ); 
        },

        /**
         *  设置控件验证成功状态以及信息
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     success
         *  @param      {String}    tips          - tooltips消息
         *  @example
         *      ctrl.success( 'info' )
         */
        success:function( tips ) {
            var me = this;
            me.tips( me._validationStates.success,tips );
        },

        /**
         *  设置控件提醒状态以及提醒信息
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     info
         *  @param      {String}    tips          - tooltips消息
         *  @example
         *      ctrl.info('info' )
         */
        info:function( tips ) {
            var me = this;
            me.tips( me._validationStates.info,tips );
        },

        /**
         *  设置控件警告状态以及警告信息
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     warning
         *  @param      {String}    tips          - tooltips消息
         *  @example
         *      ctrl.warning( 'info' )
         */
        warning : function ( tips ) {
            var me = this;
            me.tips( me._validationStates.warning,tips );
        },

        /**
         *  设置控件验证错误状态以及错误信息
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     error
         *  @param      {String}    tips          - tooltips消息
         *  @example
         *      ctrl.error( 'info' )
         */
        error:function ( tips ) {
            var me = this;
            me.tips( me._validationStates.error,tips );
        },

        /**
         *  设置当前控件的状态为忙碌，在控件后面添加一个菊花转
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     busy
         *  @param      {String}    tips          - tooltips消息
         *  @example
         *      ctrl.busy( 'i am busy now' )
         */
        busy:function( tips ){
            var me = this;
            me.tips( me._validationStates.busy,tips );
        },

        /**
         *  获取控件验证完成之后产生的错误信息字符串
         *  @private
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.FormElement
         *  @default    ''
         *  @member     {String}    errorTips
         *  @example    <caption>get</caption>
         *      //  tips == '用户名不能为空'
         *      var tips = ctrl.errorTips();
         */
        errorTips:function(){

            // gen error tips
            var me = this;
            var tips = '';
            var keys = me.keys( me._errorCollection );

            for( var i = 0,l = keys.length; i<l; i++ ){
                tips += me._errorCollection[keys[i]];
                if( i < l -1 ){
                    tips += '\n';
                }
            }

            return tips;

        },

        /**
         *  是否在控件的值发生改变的时候就触发验证
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @member     {Boolean}     validateOnChange
         *  @default    false
         *  @example    <caption>get</caption>
         *      //  { text : '' ,value : '' };
         *      console.log( ctrl.validateOnChange() );
         *  @example    <caption>set</caption>
         *      ctrl.validateOnChange( true );
         *  @todo   在现有控件里实现
         */
        validateOnChange:function( val ) {
            
            var me = this;
            if( me.isBoolean( val ) ){
                me._setOptions({ validateOnChange: val });
            }else{
                return me.options['validateOnChange'];
            }

        },

        _validators : [],

        /**
         *  表单控件验证规则
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.FormElement
         *  @member     {Array}     validators
         *  @example
         *      //  [
         *      //      { name : 'required',parameters : {},message : '',validate : function( value,parameters ){} }
         *      //  ]
         *      console.log( ctrl.validators );
         */
        validators: function(){
            return this._validators;
        },

        /**
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     _indexOfValidator
         *  @param      {String}        rule
         */
        _indexOfValidator:function( rule ){

            if( !rule ){ return -1; }
            var me         = this;
            var index      = -1;
            var validators = me._validators;
            for (var i = 0,l = validators.length; i < l; i++) {
                if(validators[i]['name'] === rule){
                    index = i;break;
                }
            }

            return index;

        },

        /**
         *  判断指定的验证规则是否已经存在
         *  ，合法的rule参数应该是cn,digit,email等
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     hasValidator
         *  @param      {String}        rule
         */
        hasValidator : function( rule ){
            return ( this._indexOfValidator( rule ) > -1 );
        },

        /**
         *  添加新的验证规则
         *  ，合法的rule参数应该是cn,digit,email等
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     addValidator
         *  @param      {String}        rule
         */
        addValidator : function( rule ){

            if( !rule ){ return; }
            var me = this;
            var validator = me._parseValidator( rule );
            /* we do not have me kind of validator OR validator already exist, then return */
            if( !validator || me.hasValidator( validator['name'] ) ){ 
                return; 
            }
            me._validators.push(validator);

        },

        /**
         *  移除一条表单验证规则
         *  ，合法的rule参数应该是cn,digit,email等
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     removeValidator
         *  @param      {String}        rule
         */
        removeValidator : function( rule ){
            var me = this;
            var index = me._indexOfValidator( rule );
            if( index == -1 ){ return; }
            me._validators.splice( index,1 );
        },

        /**
         *  获取或者设置控件数据
         *  @public
         *  @instance
         *  @virtual
         *  @memberof   ebaui.web.FormElement
         *  @member     {Object}        data
         */
        data: $.noop,

        /**
         *  获取表单控件对应的name的值。name是用来提交到服务器时使用的表单域名称。同时name也是通过form.data( object )初始化表单各个控件值时候，object的属性名。通过name，关联控件和object的属性值
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.FormElement
         *  @member     {String}    name
         *  @default    ''
         *  @example    <caption>get</caption>
         *      var name = ctrl.name();
         *  @example    <caption>set</caption>
         *      ctrl.name( 'inputname' );
         */
        name : function(){
            return this.options['name'];
        },
        
        /**
         *  获取或者设置表单控件是否只读
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @member     {Boolean}   readonly
         *  @default    false
         *  @example    <caption>get</caption>
         *      var readonly = ctrl.readonly();
         *  @example    <caption>set</caption>
         *      ctrl.readonly( true );
         *      ctrl.readonly( false );
         */
        readonly  : function( val ){
            var me = this;
            if( me.isBoolean( val ) ){
                me._setOptions({ readonly: val });
                me._updateStyleReadonly();
            }else{
                return me.options['readonly'];
            }
        },

        /**
         *  获取或者设置表单控件是否允许按下enter键的时候，聚焦到下一个控件
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @member     {Boolean}   enterAsTab
         *  @default    false
         *  @example    <caption>get</caption>
         *      var enterAsTab = ctrl.enterAsTab();
         *  @example    <caption>set</caption>
         *      ctrl.enterAsTab( true );
         */
        enterAsTab:function( val ) {
            var me = this;
            if( me.isBoolean( val ) ){
                me._setOptions({ enterAsTab: val });
            }else{
                return me.options['enterAsTab'];
            }

        },

        /**
         *  获取控件值是否已经通过验证
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.FormElement
         *  @default    true
         *  @member     {Boolean}   isValid
         *  @example    <caption>get</caption>
         *      //  isValid == true
         *      var isValid = ctrl.isValid();
         */
        isValid : function(){
            return this._isValid;
        },

        /**
         *  验证控件，返回控件值的验证结果
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @method     validate
         *  @returns    {Boolean}
         */
        validate : function(){

            var me = this;
            var validators = me.validators();

            if( validators.length == 0  ){ return true; }

            /* display busy status */
            me.busy();

            /* starting validation */
            var errorMsg  = me._errorCollection;
            var value   = me.value();
            var first   = validators[0];
            var isValid = first.validate( value,first.parameters );
            
            if( !isValid ){
                errorMsg[first.name] = first.message;
            }

            for( var i = 1,l = validators.length;i<l;i++ ){
                var validator = validators[i];
                isValid = isValid && validator.validate( value,validator.parameters );
                if( !isValid ){
                    errorMsg[validator.name] = validator.message;
                }
            }

            /* 控件所有验证规则的验证结果 */
            me._isValid = isValid;
            /* 更新控件的错误提示样式 */
            if( isValid ){ 
                me.success( '' );
            }else{ 
                me.error( me.errorTips() ); 
            }

            return isValid;
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FormElement
         *  @member     {Object}    options
         */
        options : {

            name            : '',
            value           : '',
            readonly        : false,
            
            //  validation config
            validateOnChange: false,
            validation      : '',
            messages        : '',
            enterAsTab      : false

        }

    });


})( jQuery,ebaui );
/**
 *  定义了ebaui.web.TextBox控件
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    var supportHolder = ebaui.web.support['placeholder'];

    ebaui.web.registerFormControl( 'TextBox',true );

    /** 
     *  ebaui.web.TextBox
     *  文本域
     *  @class      ebaui.web.TextBox 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   textbox_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.TextBox', ebaui.web.FormElement, {

        /**
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {Object}    _domSelector
         */
        _domSelector:{
            'formInput'  : '.eba-textbox-input',
            'placeholder': '.eba-placeholder-lable',
            'icon'       : '>i'
        },

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-textbox',

        /**
         *  控件要用到的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {Object}    _cssClass
         */
        _cssClass : {
            disabled: 'eba-disabled',
            focused : 'eba-textbox-focus',
            readonly: 'eba-readonly'
        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self                   = this;
            var $root                  = self._$root;
            var $input                 = self._$formInput;
            
            var formInputDomSelector   = self._domSelector.formInput;
            var placeholderDomSelector = self._domSelector.placeholder;

            $root.bind('keydown', formInputDomSelector, function(event) {

                switch( event.which ){
                    case ebaui.keycodes.enter:
                        self.options['onenter']( self,event );
                        break;
                    default:
                        self.options['onkeydown']( self,event );
                        break;
                }

            });

            $root.bind('keyup', formInputDomSelector, function(event) {
                /* Act on the event */
                return self.options['onkeyup']( self,event );
            });

            $root.on( 'change',formInputDomSelector,function( event ){
                //  更新控件的值
                self.options['value'] = $input.val();
                self.options['onchange']( self,{} );

                //  值发生改变的时候，触发控件验证
                if( self.validateOnChange() ){
                    self.validate();
                }
            } );

            $root.on( 'focus',formInputDomSelector,function(evt){

                self._setOption( 'focused',true );
                self._updateStyleFocused();

                return self.options['onfocus']( self,evt );

            } );

            $root.on( 'blur',formInputDomSelector,function(evt){

                self._setOption( 'focused',false );
                self._updateStyleFocused();

                return self.options['onblur']( self,evt );

            } );

            /*  
                when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
                when you click on this label
                remove this label then focus in the input
            */
            $root.on( 'click',placeholderDomSelector,function( event ){
                $( this ).hide();
                self._$formInput.focus();
            } );

            self._super();

        },

        /**
         *  聚焦
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     focus
         */
        _focus : function(){

            var me = this;
            if( me.enabled() && !me.readonly() ){
                me._updateStyleFocused();
            }
            me._$formInput.focus();

        },

        /**
         *  失焦
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _blur
         */
        _blur : function(){

            var me = this;
            if( me.enabled() ){
                me._updateStyleFocused();
            }
            me._$formInput.blur();

        },

        /**
         *  设置或者移除据聚焦样式或者失焦样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _updateStyleFocused
         */
        _updateStyleFocused:function() {

            var me      = this;
            var focused = me.focused();
            var ro      = me.readonly();
            var enabled = me.enabled();

            if( focused ){
                me._$root.addClass( me._cssClass['focused'] );
                if( enabled && !ro ){ me._hidePlaceHolder(); }
            }else{
                me._$root.removeClass( me._cssClass['focused'] );
                if( enabled ){ me._showPlaceHolder(); }
            }

        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _showPlaceHolder
         */
        _showPlaceHolder:function(){

            var me = this;
            if( !supportHolder ){
                var val = $.trim( me._$formInput.val() );
                if( !val ){
                    $( me._domSelector.placeholder,me._$root ).show();
                }
            }

        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _hidePlaceHolder
         */
        _hidePlaceHolder:function(){

            var me = this;
            if(!supportHolder){ 
                $( me._domSelector.placeholder,me._$root ).hide(); 
            }
            
        },

        /**
         *  更新placeholder的文本
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _updateStylePlaceHolder
         */
        _updateStylePlaceHolder : function () {

            var me = this;
            var placeholder = me.placeHolder();
            if( supportHolder ){ 
                me._$formInput.attr( 'placeholder',placeholder );
                return; 
            }

            var $label = $( me._domSelector.placeholder,me._$root );
            if( $label.size() > 0 ){
                /* udpate placebolder text */
                $label.text( placeholder );
            }else{
                /* create placeholder */
                $label = $( '<label for="" class="eba-placeholder-lable"></label>' ).text(placeholder);
                me._$formInput.after( $label );
            }

        },

        /**
         *  更新控件enable的UI样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _updateStyleEnabled
         */
        _updateStyleEnabled:function(){
            
            var me = this;
            if( me.enabled() ){
                me._$root.removeClass( me._cssClass['disabled'] );
                me._$formInput.attr( 'disabled',null );
            }else{
                me._$formInput.attr('disabled','disabled');
                me._$root.removeClass( me._cssClass['focused'] );
                me._$root.addClass( me._cssClass['disabled'] );
            }

        },

        /**
         *  更新控件readonly的UI样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _updateStyleReadonly
         */
        _updateStyleReadonly:function(){

            var me = this;
            var ro = me.readonly();
            if( !me.enabled() ){ return; }

            if( ro ){
                me._$root.addClass( me._cssClass['readonly'] );
                me._$formInput.attr( 'readonly','readonly' );
            }else{
                me._$root.removeClass( me._cssClass['readonly'] );
                me._$formInput.attr( 'readonly',null );
            }

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _initControl
         */
        _initControl : function(){

            var me = this;
            //  dom shortcuts
            me._$formInput = $( me._domSelector.formInput,me._$root );

            //  validators
            me._initValidators();
            
            var name = me.name();
            if( name ){ me._$formInput.attr( 'name',name ); }

            me._updateStylePlaceHolder();
        },

        _updateAttrMaxLen:function(){
            var me = this;
            var maxLength = me.maxLength();
            me._$formInput.attr( 'maxlength', ( maxLength > 0 ) ? maxLength : null );
        },

        _updateAttrValue:function(){
            var me = this;
            var value = me.value();
            if( !me.isEmpty( value ) ){
                me._$formInput.val( value );
                me._hidePlaceHolder();
            }
        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _render
         */
        _render : function(){
            var me = this;
            me._updateAttrMaxLen();
            me._updateAttrValue();
            me._updateStyleIcon();
            me._super();
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     _updateStyleIcon
         */
        _updateStyleIcon : function(){

            var me = this;
            var icon = me.iconCls();
            if( !icon ){
                /* if icon is null or empty, then remove icon dom */
                $( '[class$="border"]',me._$root ).removeClass('eba-textbox-icon');
                $( 'eba-textbox-icon i',me._$root ).remove();
            }else{
                $( '[class$="border"]',me._$root ).addClass('eba-textbox-icon');
                var $iconLabel = $( 'eba-textbox-icon i',me._$root );
                if( !$iconLabel.size() ){
                    /* create icon label dom */
                    var html = '<i class="{0}"></i>'.replace('{0}',icon);
                    $( html ).insertBefore( me._$formInput );
                }else{
                    /* update icon class */
                    $iconLabel.attr('class',icon);
                }
            }

        },

        /**
         *  获取或者设置button的icon图标CSS样式类
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {String}    TextBox
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  iconCls == 'icon-add'
         *      var iconCls = ctrl.iconCls();
         *  @example    <caption>set</caption>
         *      ctrl.iconCls( 'icon-add' );
         */
        iconCls : function( val ){

            var me = this;
            if( me.isString( val ) && $.trim( val ) != '' ){
                me.options['iconCls'] = val;
                me._updateStyleIcon();
            }else{
                return me.options['iconCls'];
            }

        },

        /**
         *  获取或者设置文本域输入文本的最大长度，默认值是-1，不做任何限制
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {Number}    maxLength
         *  @default    -1
         *  @example    <caption>get</caption>
         *      //  max == -1
         *      var max = ctrl.maxLength();
         *  @example    <caption>set</caption>
         *      ctrl.maxLength( 100 );
         */
        maxLength : function( val ){

            var me = this;
            if( !me.isNumber( val ) ){
                return me.options['maxLength'];
            }
            
            var old = me._maxlength;
            /* max值小于等于0，表示input可输入的文本长度不做限制；否则，根据适当情况，考虑截断字符串 */
            if( 0 < val && val < old ){
                var text = me.value();
                me.value( text.substr( 0,val ) );
            }

            me.options['maxLength'] = val;
            me._$formInput.attr( 'maxlength',( val > 0 ) ? val : null );

        },

        /**
         *  控件是否可以获取焦点
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.TextBox
         *  @member     {Boolean}   focusable
         *  @example    <caption>get</caption>
         *      //  false
         *      console.log( ctrl.focusable() );
         */
        focusable:function() { return true; },

        /**
         *  获取或者设置文本占位符
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {String}    placeHolder
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  holder == ''
         *      var holder = ctrl.placeHolder();
         *  @example    <caption>set</caption>
         *      ctrl.placeHolder( 'your text value' );
         */
        placeHolder : function( val ){

            var me = this;
            var prop = 'placeHolder';
            if( !me.isString( val ) ){
                return me.options[prop];
            }
            me.options[prop] = val;
            me._updateStylePlaceHolder();

        },

        /**
         *  获取或者设置表单控件值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {Object}    _valueAccessor
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( 'your text value' );
         */
        _valueAccessor:function( val ){

            var me = this;
            /* get */
            if( !me.isString( val ) ){ return me.options['value']; }
            /* set */
            /* max值小于等于0，表示input可输入的文本长度不做限制；否则，根据适当情况，考虑截断字符串 */
            var max = me.maxLength();
            if( max > 0 && ( val.length > max ) ){
                val = val.substr( 0,max );
            }
            me.options['value'] = val;
            me._$formInput.val( val );
            if( !val ){ 
                me._showPlaceHolder(); 
            }else{ 
                me._hidePlaceHolder(); 
            }
            /* 控件的值发生改变的时候触发onchange事件 */
            me.options['onchange']( me,{} );
        },

        /**
         *  获取或者设置表单控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {Object}    value
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( 'your text value' );
         */
        value : function( val ){ return this._valueAccessor(val); },

        /**
         *  获取或者设置控件数据
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {Object}        data
         *  @example    <caption>get</caption>
         *      //  { text : '' ,value : '' };
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      var pair = { text : '' ,value : '' };
         *      ctrl.data( pair );
         */
        data: function( val ){ return this._valueAccessor(val); },

        /**
         *  重置控件，清空验证状态，控件值，恢复到控件原始状态
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @method     reset
         *  @example
         *      ctrl.reset();
         */
        reset : function(){
            var me = this;
            me.value('');
            me.errors   = {};
            me._isValid = true;
            me.clearTips();
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  css 属性top
            top     : 0,
            //  css 属性left
            left    : 0,
            //  default width
            width : 150,
            //  default height
            height : 30,
            //  定义按钮的icon样式
            iconCls : '',
            //  文本占位符
            placeHolder: '请输入...',
            //  获取或者设置文本域输入文本的最大长度，默认值是-1，不做任何限制
            maxLength  : -1,
            /**
             *  键盘按下时发生
             *  @event  ebaui.web.TextBox#onkeydown
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onkeydown    : $.noop,

            /**
             *  键盘释放时发生
             *  @event  ebaui.web.TextBox#onkeyup
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onkeyup      : $.noop,

            /**
             *  回车时发生
             *  @event  ebaui.web.TextBox#onenter
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onenter      : $.noop,

            /**
             *  控件获取焦点的时候触发
             *  @event  ebaui.web.TextBox#onfocus
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onfocus      : $.noop,

            /**
             *  控件失去焦点的时候触发
             *  @event  ebaui.web.TextBox#onblur
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onblur      : $.noop,

            /**
             *  控件的值发生改变的时候触发
             *  @event      ebaui.web.TextBox#onchange
             *  @tutorial   textbox_onchange
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop,
            enterAsTab : true

        }

    });

})( jQuery,ebaui );


/**
 *  定义了ebaui.web.ButtonEdit控件
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'ButtonEdit',true );
    
    /** 
     *  ebaui.web.ButtonEdit
     *  按钮输入框
     *  @class      ButtonEdit
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   buttonedit_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      //  readonly
     *      //  data-options={ onbtnclick : function( sender,eventArgs ){},onclsclick : function( sender,eventArgs ){} } 
     *      &lt;input data-role="buttonedit" id="" name="" data-options="{}"/&gt;&lt;/input/&gt;
     */
    ebaui.control( 'web.ButtonEdit',ebaui.web.TextBox, {

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBox
         *  @member     {Object}    _domSelector
         */
        _domSelector:{
            'formInput'  : '.eba-buttonedit-input',
            'placeholder': '.eba-placeholder-lable',
            'icon'       : '.eba-label-icon',
            'btnClose'   : '.eba-buttonedit-close',
            'btnToggle'  : '.eba-buttonedit-button'
        },

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-buttonedit',

        /**
         *  控件要用到的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {Object}    _cssClass
         */
        _cssClass : {
            disabled: 'eba-buttonedit-disabled',
            focused : 'eba-buttonedit-focus',
            readonly: 'eba-readonly'
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     _updateStyleReadonly
         */
        _updateStyleReadonly:function() {

            var me = this;
            var ro = me.readonly();
            var showClose = me.showClose();

            me._super();

            if( !ro ){ 
                me._$btnToggle.show(); 
            }else{ 
                me._$btnToggle.hide(); 
            }

            if( !ro && showClose ){
                me._$btnClose.show();
                me._$btnClose.css('display','inline-block');
            }

        },
        
        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self   = this,
                $root  = self._$root,
                $input = self._$formInput;

            var _domSelector = this._domSelector;

            $root.on( 'click',_domSelector.placeholder,function( event ){
                self.focused( true );
            } );

            /*  
                when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
                when you click on this label
                remove this label then focus in the input
            */
            $root.on( 'click',_domSelector.placeholder,function( event ){
                $( this ).hide();self._$formInput.focus();
            } );

            $root.on( 'click','.eba-buttonedit-button',function(evt){

                if( self.enabled() ){
                    self.options['onbtnclick']( self,evt );
                }

            } );

            $root.on( 'click',_domSelector.btnClose,function(evt){

                if( self.showClose() && self.enabled() ){
                    self.options['onclsclick']( self,evt );
                }

            } );

            //  如果不允许手工输入文本，返回false，阻止文字输入
            $root.bind('keydown', _domSelector.formInput, function(event) {

                if( self.allowInput() ){
                    self.options['onkeydown']( self,event );
                }else{
                    return false;
                }
                
            } );

            $root.bind('keyup', _domSelector.formInput, function(event) {

                //  更新控件的值
                self.text( $input.val() );

                switch( event.which ){
                    case ebaui.keycodes.enter:
                        self.options['onenter']( self,event );
                        break;
                    default:
                        self.options['onkeyup']( self,event );
                        break;
                }
                
            });

            $root.on( 'focus',_domSelector.formInput,function(evt){
                //self.focused( true );
                self._setOption( 'focused',true );
                self._updateStyleFocused();
            } );

            $root.on( 'blur',_domSelector.formInput,function(evt){
                //self.focused( false );
                self._setOption( 'focused',false );
                self._updateStyleFocused();
            } );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     _initControl
         */
        _initControl : function(){
            var me = this;
            var $root = me._$root;
            var selectors = me._domSelector;
            me._$btnToggle = $(selectors.btnToggle,$root);
            me._$btnClose  = $(selectors.btnClose,$root);
            me._super();
        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     _render
         */
        _render : function(){
            var me = this;
            var text = me.text();
            if( !me.isEmpty( text ) ){
                me._$formInput.val( text );
                me._hidePlaceHolder();
            }

            me._updateStyleWidth();
            me._updateStyleHeight();
            me._updateStyleTop();
            me._updateStyleLeft();

            me._updateStyleEnabled();
            me._updateStyleVisible();

            me._updateStyleReadonly();
        },

        /**
         *  获取或者设置是否显示关闭按钮
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {Boolean}   showClose
         *  @default    false
         *  @example    <caption>get</caption>
         *      //  showCloseBtn == true
         *      var showCloseBtn = buttonedit.showClose();
         *  @example    <caption>set</caption>
         *      buttonedit.showClose( true );
         *      buttonedit.showClose( false );
         */
        showClose : function( val ){

            var me = this;
            if( !me.isBoolean( val ) ){
                return me._getOption( 'showClose' );
            }
            me._setOption( 'showClose',val );

        },

        /**
         *  获取或者设置buttonedit文本值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {String}    text
         *  @default    ''
         *  @example    <caption>get</caption>
         *      var text = buttonedit.text();
         *  @example    <caption>set</caption>
         *      buttonedit.text( 'your text value' );
         */
        text : function( val ){

            var me = this;
            if( !me.isString( val ) ){ 
                return me._getOption( 'text' ); 
            }

            me._setOption( 'text',val );
            me._$formInput.val( val );

            if( !val ){ 
                me._showPlaceHolder(); 
            }else{ 
                me._hidePlaceHolder(); 
            }

        },
        
        /**
         *  获取或者设置表单控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {Object}    value
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( true );
         *      ctrl.value( false );
         */
        value     : function( val ){
            var me = this;
            if( me.isNull( val ) ){ 
                return me.options['value']; 
            }
            me.options['value'] = val;
            /* 控件的值发生改变的时候触发onchange事件 */
            me.options['onchange']( me,{} );
        },

        /**
         *  获取或者设置控件数据
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {Object}        data
         *  @example    <caption>get</caption>
         *      //  { text : '' ,value : '' };
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      var pair = { text : '' ,value : '' };
         *      ctrl.data( pair );
         */
        data : function( val ){

            var me = this;
            var textField = me.textField();
            var valueField = me.valueField();
            
            if( val && ( textField in val ) && ( valueField in val ) ){
                me.text( val[textField] );
                me.value( val[valueField] );
            }else{
                var _data         = {};
                _data[textField]  = me.text();
                _data[valueField] = me.value();
                return _data;
            }

        },

        /**
         *  控件数据源对象字段中，用于作为控件值的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {String}      valueField
         *  @default    'value'
         *  @example    <caption>get</caption>
         *      var valueField = ctrl.valueField();
         *  @example    <caption>set</caption>
         *      ctrl.valueField( '' );
         */
        valueField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['valueField'];
            }
            me.options['valueField'] = val;
        },

        /**
         *  控件数据源对象字段中，用于作为控件文本的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {String}      textField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var textField = ctrl.textField();
         *  @example    <caption>set</caption>
         *      ctrl.textField( '' );
         */
        textField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['textField'];
            }
            me.options['textField'] = val;
        },

        /**
         *  获取或者设置是否允许手工输入文本
         *  @public
         *  @instance
         *  @tutorial   buttonedit_allowInput
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {Boolean}    allowInput
         *  @default    true
         *  @example    <caption>get</caption>
         *      var allowed = ctrl.allowInput();
         *  @example    <caption>set</caption>
         *      ctrl.allowInput( false );
         */
        allowInput:function( val ){
            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['allowInput'];
            }
            me.options['allowInput'] = val;
        },

        /**
         *  重置控件，清空验证状态，控件值，恢复到控件原始状态
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     reset
         *  @example
         *      buttonedit.reset();
         */
        reset :function(){
            var me = this;
            me.errors           = {};
            me._isValid         = true;
            me.options['text']  = '';
            me.options['value'] = '';
            me._render();
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @member     {Object}    options
         */
        options : {
             // css position property
             position   : 'absolute',
             //  default width
             width      : 150,
             //  default height
             height     : 21,
             //  是否允许手工输入文本
             allowInput : true,
             //  
             text       : '',
             //  
             value      : '',
             //  值字段
             valueField : 'value',
             //  文本字段
             textField  : 'text',
             //  文本占位符
             placeHolder: '请输入...',
             //  是否显示‘X’按钮
             showClose  : false,
             
             /**
             *  回车时发生
             *  @event  ebaui.web.ButtonEdit#onenter
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
             onenter      : $.noop,
             
             /**
             *  键盘按下时发生
             *  @event  ebaui.web.ButtonEdit#onkeydown
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
             onkeydown    : $.noop,
             
             /**
             *  键盘释放时发生
             *  @event  ebaui.web.ButtonEdit#onkeyup
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
             onkeyup      : $.noop,
             
             /**
             *  按钮点击时发生
             *  @event      ebaui.web.ButtonEdit#onbtnclick
             *  @tutorial   buttonedit_onbtnclick
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
             onbtnclick: $.noop,
             
             /**
             *  关闭按钮点击时发生
             *  @event      ebaui.web.ButtonEdit#onclsclick
             *  @tutorial   buttonedit_onclsclick
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
             onclsclick : $.noop,
             
             /**
             *  控件的值发生改变的时候触发
             *  @event      ebaui.web.ButtonEdit#onchange
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
             onchange : $.noop

        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Password控件
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'Password',true );
    
    /** 
     *  ebaui.web.Password
     *  密码域
     *  @class      Password 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.TextBox
     *  @tutorial   password_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      //  other attributes : readonly="readonly"
     *      &lt;input id="" name="" data-role="password" data-options="{ }" /&gt;
     */
    ebaui.control( 'web.Password', ebaui.web.TextBox, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextArea
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-password',

        /**
         *  获取或者设置文本域输入文本的最大长度，默认值是-1，不做任何限制
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Password
         *  @member     {Number}    maxLength
         *  @default    -1
         *  @example    <caption>get</caption>
         *      //  max == -1
         *      var max = ctrl.maxLength();
         *  @example    <caption>set</caption>
         *      ctrl.maxLength( 100 );
         */
        maxLength : $.noop,

        /**
         *  获取或者设置控件数据
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Password
         *  @member     {Object}        data
         *  @example    <caption>get</caption>
         *      //  { text : '' ,value : '' };
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      var pair = { text : '' ,value : '' };
         *      ctrl.data( pair );
         */
        data: function( val ){

            var me = this;
            if( !me.isString( val ) ){
                return me.options['value'];
            }

            me.options['value'] = val;
            me._$formInput.val( val );
            if( !val ){ 
                me._showPlaceHolder(); 
            }else{ 
                me._hidePlaceHolder(); 
            }

            /* 控件的值发生改变的时候触发onchange事件 */
            me.options['onchange']( me,{} );

        },

        /**
         *  获取或者设置表单控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Password
         *  @member     {Object}    value
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( 'your text value' );
         */
        value : function( val ){

            var me = this;
            if( !me.isString( val ) ){
                return me.options['value'];
            }

            console.log( 'value' )
            console.log( val )
            
            me.options['value'] = val;
            me._$formInput.val( val );
            if( !val ){ 
                me._showPlaceHolder(); 
            }else{ 
                me._hidePlaceHolder(); 
            }

            /* 控件的值发生改变的时候触发onchange事件 */
            me.options['onchange']( me,{} );

        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Label控件
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'Label',true );

    /**
     *  ebaui.web.Label
     *  标注控件
     *  @class      Label 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   label_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      //  readonly
     *      //  data-options={ hasBorder : false, textAlign : '',text : '' } 
     *      &lt;input data-role="label" data-options="{ textAlign : 'left',text : '' }" /&gt;
     */
    ebaui.control( 'web.Label',ebaui.web.FormElement,{

        /**
         *  允许的button的state
         *  @private
         *  @instance
         *  @virtual
         *  @memberof   ebaui.web.Button
         *  @member     {String}    _availableState
         */
        _availableState:/white|primary|info|success|warning|danger|\s+/i,

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-label',

        /**
         *  更新lable标签的边框
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @method     _updateStyleBorder
         */
        _updateStyleBorder:function(){

            var $root     = this._$root;
            if( this.hasBorder() ){
                $root.removeClass('eba-nobor').addClass('eba-bor');
            }else{
                $root.removeClass('eba-bor').addClass('eba-nobor');
            }

        },

        /**
         *  更新lable标签的文字对其方式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @method     _updateStyleAlign
         */
        _updateStyleAlign:function(){

            var $root     = this._$root;
            var align = this.textAlign();
            var alignment = {
                'left'  : function(){
                    if( !$root.hasClass('eba-txtl') ){
                        $root.removeClass('eba-txtr').removeClass('eba-txtc').addClass('eba-txtl');
                    }
                },
                'center': function(){
                    if( !$root.hasClass('eba-txtc') ){
                        $root.removeClass('eba-txtl').removeClass('eba-txtr').addClass('eba-txtc');
                    }
                },
                'right' : function(){
                    if( !$root.hasClass('eba-txtr') ){
                        $root.removeClass('eba-txtl').removeClass('eba-txtc').addClass('eba-txtr');
                    }
                }
            };

            alignment[align]();

        },

        _updateStyleStates:function(){
            var me = this;
            var $root = me._$root;
            var state = $.trim(me.options['state']).toLowerCase();
            if( state.length > 0 ){
                var cls = 'eba-label ' + 'label-' + state;
                $root.attr( 'class',cls );
            }
        },

        /**
         *  获取或者设置button的状态
         *  可选的值：
         *  
         *  white
         *  primary
         *  info
         *  success
         *  warning
         *  danger
         *  
         *  如果要取消着色，只要传入一个空字符串即可，即ctrl.state( '' )
         *  
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @member     {String}    state
         *  @default    ''
         *  @example    <caption>get</caption>
         *      var state = ctrl.state();
         *  @example    <caption>set</caption>
         *      ctrl.state( '' );
         */
        state:function( val ){
            var me = this;
            var opts = me.options;
            if( !me._availableState.test( val ) ){ return opts['state']; }

             opts['state'] = val;
             me._updateStyleStates();
        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @method     _render
         */
        _render : function(){
            var me = this;
            me._updateStyleBorder();
            me._updateStyleAlign();
            me._updateStyleStates();
            me._$root.text( me.text() );
            me._super();
        },
       
        /**
         *  获取或者设置是否显示label边框
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @member     {Boolean}   hasBorder
         *  @default    false
         *  @example    <caption>get</caption>
         *      //  hasBorder == true
         *      var hasBorder = ctrl.hasBorder();
         *  @example    <caption>set</caption>
         *      ctrl.hasBorder( true );
         *      ctrl.hasBorder( false );
         */
        hasBorder : function( val ){

            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['hasBorder'];
            }

            me.options['hasBorder'] = val;
            me._render();

        },

        /**
         *  获取或者设置label文本值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @member     {String}    text
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  text == 'text'
         *      var text = ctrl.text();
         *  @example    <caption>set</caption>
         *      ctrl.text( 'label' );
         */
        text : function( val ){

            var me = this;
            if( !me.isString( val ) ){
                return me.options['text'];
            }
            me.options['text'] = val;
            me._render();

        },

        /**
         *  同text
         *  @see ebaui.web.Label.text
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @member     {Object}        data
         *  @example    <caption>get</caption>
         *      //  { text : '' ,value : '' };
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      var pair = { text : '' ,value : '' };
         *      ctrl.data( pair );
         */
        data: function( val ){

            if( val && ( 'text' in val ) && ( 'value' in val ) ){

                this.text( val['text'] );

            }else{

                var txt = this.text();
                return {
                    'text' : txt,
                    'value': txt
                };

            }

        },

        /**
         *  获取或者设置label文本对其方式，目前只支持'left','center','right'三种对齐方式
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @member     {String}    textAlign
         *  @default    'right'
         *  @example    <caption>get</caption>
         *      //  textAlign == 'right'
         *      var textAlign = ctrl.textAlign();
         *  @example    <caption>set</caption>
         *      ctrl.textAlign( 'left' );
         *      ctrl.textAlign( 'center' );
         *      ctrl.textAlign( 'right' );
         */
        textAlign : function( val ){

            var me = this;
            var re = /left|center|right/i;
            if( !re.test( val ) ){
                return me.options['textAlign'];
            }
            me.options['textAlign'] = val;
            me._render();

        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Label
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  指定是否显示label边框
            hasBorder: false,
            //  文本对齐
            textAlign: 'right',
            //  label文本
            text     : ''
        }

    } );

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Button控件
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {
    
    ebaui.web.registerControl( 'Button',false );

    /** 
     *  控件全名 e.g. ebaui.web.Button
     *  控件描述
     *  @class      Button 
     *  @memberof   ebaui.web
     *  @extends    Control
     *  @tutorial   button_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      //  data-options={ iconCls : '',iconPosition : '',isFlat: false, href : '', target:'', text:'', onclick:function( sender,eventArgs ){} } 
     *      &lt;input data-role="button" data-options="{ }"/&gt;
     */
    ebaui.control( 'web.Button', {

        /**
         *  允许的button的state
         *  @private
         *  @instance
         *  @virtual
         *  @memberof   ebaui.web.Button
         *  @member     {String}    _availableState
         */
        _availableState:/primary|info|success|warning|danger|inverse|link|\s+/i,

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @virtual
         *  @memberof   ebaui.web.Button
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-button',

        /**
         *  控件要用到的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {Object}    _cssClass
         */
        _cssClass : {
            disabled: 'eba-button-disabled'
        },

        /**
         *  更新控件enabled的UI样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _updateStyleEnabled
         */
        _updateStyleEnabled:function(){
            var me = this;
            var cls = me._cssClass['disabled'];
            var op = me.enabled() ? 'removeClass' : 'addClass';
            me._$root[op](cls);
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _updateUIText
         */
        _updateUIText:function(){
            var me = this;
            var txt  = me.text();
            if( txt ){ me._$btnText.text( txt ); }
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _updateUIHref
         */
        _updateUIHref:function(){
            var me   = this;
            var href = me.href();
            var attrVal = ( me.enabled() && href ) ? href : 'javascript:void(0);';
            me._$root.attr( 'href',attrVal );
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _updateUITarget
         */
        _updateUITarget:function(){
            var me = this;
            var target = me.target();
            me._$root.attr( 'target',target ? target : null );
        },

        _updateStyleStates:function(){
            var me = this;
            var $root = me._$root;
            var state = $.trim(me.options['state']).toLowerCase();
            var cls = 'eba-button-Default ' + 'eba-button-' + state;
            $root.attr( 'class',cls );
        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _updateStyleIcon
         */
        _updateStyleIcon:function () {

            var me = this;
            var $root    = me._$root;
            var iconCls  = me.iconCls();
            var iconPosition = me.iconPosition();
            var iconHtml = '<i class="{0}"></i>'.replace( '{0}',iconCls );
            
            $( 'i',$root ).remove();
            if( iconPosition !== 'left' ){
                $root.append( iconHtml );
            }else{
                $root.prepend( iconHtml );
            }

        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _render
         */
        _render : function(){

            var me = this;

            me._updateUIText();
            me._updateStyleIcon();
            me._updateUIHref();
            me._updateUITarget();
            me._updateStyleStates();
            
            me._super();

        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self = this;
            var $root = self._$root;

            $root.on( 'click',function( event ){

                if( self.enabled() && self.isFunc( self.options['onclick'] ) ){
                    event.preventDefault();
                    self.options['onclick']( self,event );
                }

            } );

            //  onenter
            $root.on( 'keydown',function( event ){

                var onenter = function ( self,event ) {
                    
                    if( self.enabled() && self.isFunc( self.options['onclick'] ) ){

                        event.preventDefault();
                        self.options['onclick']( self,event );

                    }

                };

                switch( event.which ){
                    case ebaui.keycodes.enter:
                        onenter( self,event );
                        break;
                    default:
                        break;
                }

            } );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _initControl
         */
        _initControl : function(){
            var me = this;
            me._$btnText = $( '.eba-button-text ', me._$root );

            var opts = me.options;
            if( !me._availableState.test( opts['state'] ) ){
                opts['state'] = '';
            }

        },

        /**
         *  聚焦
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _focus
         */
        _focus : function(){ 
            this._$root.focus(); 
        },

        /**
         *  失焦
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @method     _blur
         */
        _blur : function(){
            this._$root.blur(); 
        },

        /**
         *  获取或者设置button的状态
         *  可选的值：
         *  
         *  primary
         *  info
         *  success
         *  warning
         *  danger
         *  inverse
         *  link
         *  
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {String}    state
         *  @default    ''
         *  @example    <caption>get</caption>
         *      var state = ctrl.state();
         *  @example    <caption>set</caption>
         *      ctrl.state( '' );
         */
        state:function( val ){
            var me = this;
            var opts = me.options;
            if( !me._availableState.test( val ) ){ return opts['state']; }

             opts['state'] = val;
             me._updateStyleStates();
        },

        /**
         *  获取或者设置button文本值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {String}    text
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  text == 'text'
         *      var text = ctrl.text();
         *  @example    <caption>set</caption>
         *      ctrl.text( 'label' );
         */
        text : function( val ){
            var me = this;
            if( !me.isString( val ) ){ return me.options['text']; }
            me.options['text'] = val;
            me._$btnText.text( val );
        },

        /**
         *  获取或者设置button超链接地址
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {String}    href
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  href == 'href'
         *      var href = ctrl.href();
         *  @example    <caption>set</caption>
         *      ctrl.href( 'http://xxx.com/xxx' );
         */
        href : function( val ){

            var me = this;
            if( me.isString( val ) && $.trim( val ) != '' ){
                me.options['href'] = val;
                me._updateUIHref();
            }else{
                return me.options['href'];
            }

        },

        /**
         *  获取或者设置在何处打开目标 URL
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {String}    target
         *  @default    '_blank'
         *  @example    <caption>get</caption>
         *      var target = ctrl.target();
         *  @example    <caption>set</caption>
         *      //  _blank _parent _self _top 
         *      ctrl.target( '_blank' );
         */
        target : function( val ){
            var me = this;
            var re = /_parent|_blank|_self|_top/i;
            if( !re.test(val) ){
                return me.options['target'];
            }
            me.options['target'] = val;
            me._updateUITarget();
        },

        /**
         *  控件是否可以获取焦点
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.Button
         *  @member     {Boolean}   focusable
         *  @default    false
         *  @example    <caption>get</caption>
         *      //  false
         *      console.log( ctrl.focusable() );
         */
        focusable:function() { return true; },

        /**
         *  获取或者设置表单控件是否允许按下enter键的时候，聚焦到下一个控件
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {Boolean}   enterAsTab
         *  @default    false
         *  @example    <caption>get</caption>
         *      var enterAsTab = ctrl.enterAsTab();
         *  @example    <caption>set</caption>
         *      ctrl.enterAsTab( true );
         */
        enterAsTab:function( val ) {

            var me = this;
            if( me.isBoolean( val ) ){
                me._setOptions({ enterAsTab: val });
            }else{
                return me.options['enterAsTab'];
            }

        },

        /**
         *  获取或者设置button的icon图标CSS样式类
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {String}    iconCls
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  iconCls == 'icon-add'
         *      var iconCls = ctrl.iconCls();
         *  @example    <caption>set</caption>
         *      ctrl.iconCls( 'icon-add' );
         */
        iconCls : function( val ){
            var me = this;
            if( !me.isString( val ) ){
                return me.options['iconCls'];
            }
            me.options['iconCls'] = val;
            me._updateStyleIcon();
        },

        /**
         *  获取或者设置button的icon图标位置，可选的值有：left right
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {String}    iconPosition
         *  @default    'left'
         *  @example    <caption>get</caption>
         *      //  position == 'left'
         *      var position = ctrl.iconPosition();
         *  @example    <caption>set</caption>
         *      ctrl.iconPosition( 'left' );
         *      ctrl.iconPosition( 'right' );
         */
        iconPosition : function( val ){

            var me = this;
            var re = /left|right/i;
            if( !re.test( val ) ){
                return me.options['iconPosition'];
            }
            me.options['iconPosition'] = val;
            me._updateStyleIcon();
            
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {Object}    options
         */
        options : {
            //  控件默认的状态
            state : '',
            //  default width
            width : 0,
            //  default height
            height : 0,
            //  按钮文本
            text        : '',
            //  超链接地址
            href        : '',
            //  超链接弹出方式
            target      : 'blank',
            //  定义按钮的icon样式
            iconCls     : '',
            //  left top right
            iconPosition: 'left',
            //  获取或者设置表单控件是否允许按下enter键的时候，聚焦到下一个控件
            enterAsTab : false,
            /**
             *  鼠标点击按钮时发生
             *  @event  ebaui.web.Button#onclick
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onclick    : $.noop,
            /**
             *  按下回车键时触发
             *  @event  ebaui.web.Button#onenter
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onenter    : $.noop
        }
    });

})( jQuery,ebaui );
/**
 *  ebaui.textarea.js
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'TextArea',true );

    /** 
     *  多行的文本输入控件
     *  @class      TextArea 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.TextBox
     *  @tutorial   textarea_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      //  other attributes : maxlength="100" readonly="readonly"
     *      &lt;textarea id="" name="" data-role="textarea"  placeholder="请输入备注" data-options="{  }"&gt;&lt;/textarea&gt;
     */
    ebaui.control( 'web.TextArea',ebaui.web.TextBox, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextArea
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-textarea',

        /**
         *  更新UI的宽度
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextArea
         *  @method     _updateStyleWidth
         *  @todo       等伟榕把样式整理好之后，就开始实现这个方法
         */
        _updateStyleWidth : function(){

            var me     = this;
            var $root  = me._$root;
            var $input = me._$formInput;
            var width  = me.width();

            $root.width( width );
            $input.width( width );

        },

        /**
         *  更新UI的高度
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextArea
         *  @method     _updateStyleHeight
         *  @todo       等伟榕把样式整理好之后，就开始实现这个方法
         */
        _updateStyleHeight : function(){

            var me     = this;
            var $root  = me._$root;
            var $input = me._$formInput;
            var height = me.height();

            $root.height( height );
            //  $input.parent.borderHeight + $input.paddingHeight = 4
            $input.height( height - 4 );

        },

        /**
         *  获取或者设置表单控件是否允许按下enter键的时候，聚焦到下一个控件
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.TextArea
         *  @member     {Boolean}   enterAsTab
         *  @default    false
         *  @example    <caption>get</caption>
         *      var enterAsTab = ctrl.enterAsTab();
         */
        enterAsTab:function() { return false; },

        options : {
            //  default width
            width : 150,
            //  default height
            height : 30,
            enterAsTab : false
        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Combo
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    /** 
     *  定义combobox combolist dateTimePicker的基类
     *  ebaui.web.Combo
     *  @class      Combo 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.ButtonEdit
     *  @tutorial   datetimepicker_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example    
     *      &lt;input value="2013-10-08 16:07" data-role="datetimepicker" data-options="{}"/&gt;
     */
    ebaui.control( 'web.Combo',ebaui.web.ButtonEdit, {

        /**
         *  下拉菜单的弹出框
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Combo
         *  @member     _panel
         */
        _panel : null,

        /**
         *  调整下拉菜单的位置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Combo
         *  @method     _reposition
         */
        _reposition:function(){

            var me     = this;
            var panel  = me._panel;
            var $popup = panel.uiElement();

            if( !panel.visible() ){ return; }

            var $root       = me._$root;
            var rootPos     = $root.position();
            var popupHeight = $popup.outerHeight();
            var scrollTop   = $(document).scrollTop();

            var top  = rootPos.top + $root.outerHeight();
            if( top + popupHeight > $(window).height() + scrollTop ){
                top = rootPos.top - popupHeight;
            }

            panel.move({
                'top' : top,
                'left': rootPos.left
            });

        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Combo
         *  @method     _setupEvents
         */
        _setupEvents:function(){

            var me         = this;
            var panel      = me._panel;
            var $root      = me._$root;
            var $panelRoot = panel.uiElement();

            $panelRoot.on( 'click',function( event ){
                event.stopPropagation();
            } );

            /*
             *  downArrow button click
             */
            $root.on( 'click', '.eba-buttonedit-button', function( event ){
                event.stopPropagation();
                if( me.enabled() && !me.readonly() ){
                    panel.toggle();
                    me._reposition();
                }
            });

            /*
             *  在document上注册一个click事件，当触发这个事件的时候，会自动收起下拉菜单
             */
            $( document ).on('click',function( event ){
                panel.close();
            });

            /*
             *  windows的窗口位置改变的时候，下拉菜单的位置应该跟着移动
             */
            $( window ).resize(function(event) {
                me._reposition();
            });

        }

    } );

})( jQuery,ebaui );
/**
 *  
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'ListBox',true );

    /**
     *  列表控件
     *  ，单选DEMO请查看 {@tutorial listbox_index}
     *  ，多选DEMO请看{@tutorial listbox_multiselect}
     *  ，使用远程数据源的DEMO请看 {@tutorial listbox_remoteDataSource}
     *  @class      ListBox 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.ListBox',ebaui.web.FormElement, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-listbox',

        /**
         *  listbox列表项目的模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {String}    _rootHtmlTmpl
         */
        _itemHtmlTmpl : '#ebaui-template-listbox-item',

        /**
         *  是否使用remote数据源
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {Boolean}       _usingRemoteData
         *  @default    false
         */
        _usingRemoteData : false,

        /**
         *  已经编译好的ListBox项HTML模板，后续会重复使用
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     __compiledListItemTmpl
         */
        _compiledListItemTmpl : $.noop,

        /**
         *  显示listbox正在加载的样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     _loadMask
         *  @param      {Boolean}    loading
         */
        _loadMask:function(){

            var me = this;
            var html = me._compiledListItemTmpl( {
                'loading'      : true,
                'idField'      : '',
                'textField'    : '',
                'valueField'   : '',
                'selectedItems': [],
                'dataItems'    : []
            } );
            
            $( 'table.eba-listbox-items',me._$root ).html( html );
        },

        /**
         *  更新listbox列表项
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     _renderData
         *  @param      {Boolean}    loading
         */
        _renderData:function () {

            var me = this;
            var html = me._compiledListItemTmpl( {
                'loading'      : false,
                'idField'      : me.textField(),
                'textField'    : me.textField(),
                'valueField'   : me.valueField(),
                'selectedItems': me.selectedItems(),
                'dataItems'    : me.items()
            } );
            
            $( 'table.eba-listbox-items',me._$root ).html( html );

        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     _render
         */
        _render : function(){
            var me = this;
            me._loadData( function( sender ){
                //  show loading style
                sender._loadMask();
            },function( sender ){
                //  show list items
                sender._renderData();
            } );
            me._super();
        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self         = this;
            var $root        = self._$root;

            $root.on( 'click','tr.eba-listbox-item',function ( event ) {

                event.stopPropagation();

                var $target  = $(this);
                var itemIdx  = parseInt( $target.attr( 'data-index' ) );

                /* ctrl + click then remove item */
                if( event.ctrlKey){
                    self.deselect( itemIdx );
                }else{
                    self.select( itemIdx );
                }

                self.options['onitemclick']( self,{} );

            } );

            $root.on( 'dblclick','tr.eba-listbox-item',function ( event ) {
                
                event.stopPropagation();
                self.options['onitemdbclick']( self,{} );

            } );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     _initControl
         */
        _initControl : function(){
            var me = this;
            me._usingRemoteData = me.isUsingRemoteData( me.options['dataSource'] );
            var itemTmpl = $.trim( $( me._itemHtmlTmpl ).html() );
            me._compiledListItemTmpl  = me.compileTmpl( itemTmpl );
        },

        /**
         *  控件是否可以获取焦点
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.ListBox
         *  @member     {Boolean}   focusable
         *  @example    <caption>get</caption>
         *      //  false
         *      console.log( ctrl.focusable() );
         */
        focusable:function() { return true; },

        /**
         *  获取文本值
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.ListBox
         *  @member     {Array}    text
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  text == ''
         *      var text = buttonedit.text();
         */
        text : function(){
            var me = this;
            var toRet = [];
            var field = me.textField();
            var data = me.data();

            for (var i = 0,l = data.length; i < l; i++) {
                var item = data[i];
                toRet.push( item[field] )
            };

            return toRet;
        },
        
        /**
         *  获取或者设置表单控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {Object|Array}    value
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( [] );
         */
        value     : function( val ){

            if( !val ){

                var toRet = [];
                var field = this.valueField();
                var data = this.data();

                for (var i = 0,l = data.length; i < l; i++) {
                    var item = data[i];
                    toRet.push( item[field] )
                };

                return toRet;

            }

            var me = this;
            if( !me.isArray( val ) ){
                val = [ val ];
            }

            var toSelect = null;
            var field = me.valueField();
            var items = me.items();
            var multiSelect = me.multiSelect();
            //  todo update the data property
            if( !multiSelect ){
                //  如果是单选，那么只能选中第一个选项
                var i = 0,
                    l = items.length;

                for (; i < l; i++) {
                    var item = items[i];
                    if( item[field] == val[0] ){
                        break;
                    }
                };

                toSelect = items[i];

            }else{
                //  如果是多选
                toSelect = [];
                var forEach = me.each;

                forEach( items,function ( item ) {

                    forEach( val,function ( value ) {
                        
                        if( value == item[field] ){
                            toSelect.push( item );
                        }

                    } );

                } );

            }

            me.select( toSelect );

        },

        /**
         *  获取或者设置选中的项
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {Array}        data
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( [] );
         */
        data: function( val ){

            var me = this;
            if( !val ){ return me.selectedItems(); }
            if( !me.isArray( val ) ){ val = [ val ]; }

            if( val.length == 0 ){
                me.deselectAll();
                return;
            }

            var toSelect = null;
            var field = me.valueField();
            var items = me.items();

            if( !me.multiSelect() ){
                //  如果是单选，那么只能选中第一个选项
                var i = 0,
                    l = items.length,
                    first = val[0];

                for (; i < l; i++) {
                    var item = items[i];
                    if( item[field] == first[field] ){
                        break;
                    }
                };

                toSelect = items[i];

            }else{
                //  如果是多选
                toSelect = [];
                var forEach = me.each;

                forEach( items,function ( item ) {

                    forEach( val,function ( value ) {
                        
                        if( value[field] == item[field] ){
                            toSelect.push( item );
                        }

                    } );

                } );

            }

            me.select( toSelect );

        },

        /**
         *  listBox项的集合
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {Array}  _items
         */
        _items : [],

        /**
         *  加载listbox的列表数据
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     _loadData
         *  @param      {Function}  beforeLoad
         *  @param      {Function}  afterLoad
         */
        _loadData:function( beforeFn,afterFn ) {

            var me       = this;
            var dataSource = me.dataSource();

            beforeFn = ( me.isFunc( beforeFn ) ) ? beforeFn : $.noop;
            afterFn = ( me.isFunc( afterFn ) ) ? afterFn : $.noop;

            if( me._usingRemoteData ){

                //  清空列表
                me._items = [];
                me._selectedItems = [];
                me._loadMask();

                var paramsToServer = {};

                if( me.isFunc( dataSource.data ) ){
                    paramsToServer = dataSource.data();
                }else{
                    $.extend(paramsToServer, dataSource.data);
                }

                beforeFn( me );

                $.ajax({

                    url       : dataSource.url,
                    data      : paramsToServer,
                    dataType  : 'json',
                    
                    error     : me.options['onloadfail'],
                    beforeSend: me.options['onpreload'],
                    success   : function ( serverData ) {
                        me._items = serverData;
                        afterFn( me );
                        me.options['onloadsucc']( me,serverData );
                    },
                    complete  : me.options['onloadcomplete']

                });

            }else{
                beforeFn( me );
                me._items = dataSource;
                afterFn( me );
            }

        },

        /**
         *  listBox项的集合
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.ListBox
         *  @member     {Array}  items
         */
        items : function () {
            return this._items;
        },

        /**
         *  选中的项
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {Array}  _selectedItems
         */
        _selectedItems: [],

        /**
         *  获取选中的项
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.ListBox
         *  @member     {Array}  selectedItems
         *  @example    <caption>get</caption>
         *      //  [{ text : '' ,value : '' }];
         *      var items = ctrl.selectedItems();
         *  @example    <caption>set</caption>
         *      ctrl.selectedItems( [] );
         */
        selectedItems:function() {
            return this._selectedItems;
        },

        /**
         *  添加列表项
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     add
         *  @param      {Object|Array}     items
         *  @example    
         *      ctrl.add( [] );
         *  @tutorial listbox_addItems
         */
        add : function ( items ) {

            if( !items ){ return; }

            var me = this;
            if( !me.isArray( items ) ){
                items = [ items ];
            }

            if( items.length > 0 ){
                me._items = me._items.concat( items );
                me._renderData();
            }

        },

        /**
         *  删除列表项
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     remove
         *  @param      {Object|Array}     items
         *  @example    
         *      ctrl.remove( [] );
         *  @tutorial listbox_removeItems
         */
        remove:function ( items ) {

            if( !items ){ return; }

            var me = this;
            if( !me.isArray( items ) ){
                items = [ items ];
            }

            if( items.length > 0 ){

                var idField = me.idField();
                for (var i = 0; i < items.length; i++) {

                    var item = items[i];
                    for (var j = 0; j < me._items.length; j++) {
                        var dataItem = me._items[j];

                        if( dataItem[idField] == item[idField] ){
                            me._items.splice( j,1 );
                            break;
                        }
                        
                    };

                };

                me._renderData();

            }

        },

        /**
         *  更新列表中的项目
         *  @public 
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     update
         *  @param      {Object|Array}     items
         *  @example    
         *      ctrl.update( [] );
         *  @tutorial listbox_updateItems
         */
        update:function ( items ) {

            if( !items ){ return; }

            var me = this;
            if( !me.isArray( items ) ){
                items = [ items ];
            }

            if( items.length > 0 ){

                var idField = me.idField();
                for (var i = 0; i < items.length; i++) {

                    var item = items[i];
                    for (var j = 0; j < me._items.length; j++) {
                        var dataItem = me._items[j];

                        if( dataItem[idField] == item[idField] ){
                            me._items[j] = item;
                            break;
                        }
                        
                    };

                };

                me._renderData();

            }

        },

        /**
         *  移动列表项
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     move
         *  @param      {Number}     source
         *  @param      {Number}     dist
         *  @example    
         *      ctrl.move( [] );
         *  @tutorial listbox_moveItems
         */
        move:function ( source,dist ) {

            var me = this;
            if( !me.isNumber( source ) || !me.isNumber( dist ) ){
                return;
            }

            var items = me._items;
            var temp = items[source]

            items[source] = items[dist];
            items[dist] = temp;

            me._renderData();

        },

        /**
         *  当前选中项目的index
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     _currItemIdx
         */
        _currItemIdx:-1,

        /**
         *  选中前一个项目
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     select
         *  @example    
         *      ctrl.selectPrev();
         */
        selectPrev:function(){

            var me = this;
            var currIdx = me._currItemIdx;
            var dataItems = me.items();

            if( !dataItems || dataItems.length == 0 ){ return; }
            if( currIdx - 1 < 0){ return; }

            --currIdx;
            me._currItemIdx = currIdx;
            me.select( currIdx );

            me.highlight( currIdx );

        },

        /**
         *  选中前一个项目
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     select
         *  @example    
         *      ctrl.selectNext();
         */
        selectNext:function(){

            var me = this;
            var currIdx = me._currItemIdx;
            var dataItems = me.items();

            if( !dataItems || dataItems.length == 0 ){ return; }
            if( currIdx + 1 >= dataItems.length){ return; }

            ++currIdx;
            me._currItemIdx = currIdx;
            me.select( currIdx );

            me.highlight( currIdx );

        },

        /**
         *  选中项目
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     select
         *  @param      {Object|Array|Number}     items    -   数据对象，数据对象数组，或者索引index
         *  @example    
         *      ctrl.select( [] );
         *  @tutorial listbox_selectItems
         */
        select:function ( items ) {

            var me = this;
            if( me.isNull( items ) ){ return; }

            var isNum = me.isNumber( items );
            var dataItems = me.items();
            if( isNum && !( items >= 0 && items < dataItems.length ) ){ return; }
            if( isNum ){
                /* 
                 *  如果参数是一个index选项，
                 *  并且这个index在合理的范围内 
                 */
                items = [ dataItems[items]  ];
            }

            if( !me.isArray( items ) ){ items = [ items ]; }
            if( !items.length ){ return; }

            var selectedItems = me._selectedItems;
            var idField = me.idField();

            if( me.multiSelect() ){

                for (var i = 0; i < items.length; i++) {

                    var data = items[i];
                    var alreadySelected = false;
                    for (var j = 0; j < selectedItems.length; j++) {

                        var selectedItem = selectedItems[j];
                        if( selectedItem[idField] == data[idField] ){
                            alreadySelected = true;
                            break;
                        }

                    };

                    if( !alreadySelected ){
                        selectedItems.push( data );
                    }

                };
                
            }else{
                selectedItems = [ items[0] ];
            }

            me._selectedItems = selectedItems;
            me._renderData();
            me.options['onchange']( me,{} );

        },

        /**
         *  取消选中项目
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     deselect
         *  @param      {Object|Array}     items    -   数据对象，数据对象数组
         *  @example    
         *      ctrl.deselect( [] );
         *  @tutorial listbox_selectItems
         */
        deselect : function( items ) {

            var me = this;
            if( me.isNull( items ) ){ return; }

            var isNum = me.isNumber( items );
            var dataItems = me.items();
            if( isNum && !(items >= 0 && items < dataItems.length) ){
                return;
            }

            if( isNum ){
                items = [ dataItems[items] ];
            }

            if( !me.isArray( items ) ){ items = [ items ]; }

            if( items.length == 0 ){ return; }

            var selectedItems = me._selectedItems;
            if( items.length <=0 || selectedItems.length <= 0 ){
                return;
            }

            var idField = me.idField();
            for (var i = 0; i < items.length; i++) {
                
                var toRm = items[i];
                for (var j = 0; j < selectedItems.length; j++) {

                    var selected = selectedItems[j];
                    if( selected[idField] == toRm[idField] ){
                        selectedItems.splice( j,1 );
                        break;
                    }

                };

            };
            
            me._currItemIdx = -1;
            me._renderData();
            me.options['onchange']( self,{} );

        },

        /**
         *  取消所有选中项目
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     deselectAll
         */
        deselectAll:function(){
            var me = this;
            me._currItemIdx = -1;
            me._selectedItems = [];
            me._renderData();
            me.options['onchange']( me,{} );
        },

        /**
         *  高亮listbox的某条数据，但是不选中
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @method     highlight
         *  @param      {Number|Object}     target    -   索引值或者数据对象
         *  @example    
         *      ctrl.select( [] );
         *  @tutorial listbox_selectItems
         */
        highlight : function( target ){

            var me = this;
            if( me.isNull( target ) ){ return; }

            var itemIndex = -1;
            if( me.isNumber( target ) ){

                if( target >= me._items.length ){
                    return;
                }

                itemIndex = target;

            }else{

                var field = me.idField();
                for (var i = 0; i < me._items.length; i++) {

                    var item = me._items[i];
                    if( target[field] && ( item[field] == target[field] ) ){
                        itemIndex = i;
                        break;
                    }

                };

            }

            var $root = me._$root;
            var hoverCls = 'eba-listbox-item-hover';
            $( '.eba-listbox-item-hover',$root ).removeClass(hoverCls);
            if( itemIndex > -1 ){
                $( '.eba-listbox-item:eq(' + itemIndex + ')',$root ).addClass(hoverCls);
            }

        },

        /**
         *  控件数据源对象的ID字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {String}      idField
         *  @default    'id'
         *  @example    <caption>get</caption>
         *      var idField = ctrl.idField();
         *  @example    <caption>set</caption>
         *      ctrl.idField( '' );
         */
        idField : function( val ) {

            var me = this;
            if( !me.isString( val ) ){
                return me.options['idField'];
            }

            me.options['idField'] = val;

        },

        /**
         *  控件数据源对象字段中，用于作为控件值的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {String}      valueField
         *  @default    'value'
         *  @example    <caption>get</caption>
         *      var valueField = ctrl.valueField();
         *  @example    <caption>set</caption>
         *      ctrl.valueField( '' );
         */
        valueField : function( val ) {

            var me = this;
            if( !me.isString( val ) ){
                return me.options['valueField'];
            }

            me.options['valueField'] = val;
            me._renderData();

        },

        /**
         *  控件数据源对象字段中，用于作为控件文本的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {String}      textField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var textField = ctrl.textField();
         *  @example    <caption>set</caption>
         *      ctrl.textField( '' );
         */
        textField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){ return me.options['textField']; }
            me.options['textField'] = val;
            me._renderData();
        },

        /**
         *  数据源，可以是URL地址或者是一个javascript数组对象作为数据源
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {String|Array}      dataSource
         *  @default    []
         *  @example    <caption>get</caption>
         *      var src = ctrl.dataSource();
         *  @example    <caption>set</caption>
         *      //  本地数据
         *      ctrl.dataSource( [] );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : {}
         *      } );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : function(){ 
         *              // your logic
         *              return {};
         *          }
         *      } );
         */
        dataSource : function( val ){

            var me = this;
            if( !val ){
                return me.options['dataSource'];
            }

            me.options['dataSource'] = val;
            me._usingRemoteData      = me.isUsingRemoteData( val );
            me._loadData(function( sender ){
                sender._loadMask();
            },function( sender ) {
                /* 重置控件的状态 */
                sender._currItemIdx   = -1;
                sender._selectedItems = [];
                /* 渲染数据 */
                sender._renderData();
            });

        },

        /**
         *  获取或者设置控件是否支持多选
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {Boolean}    multiSelect
         */
        multiSelect : function( val ) {

            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['multiSelect'];
            }
            me.options['multiSelect'] = val;

        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ListBox
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  default width
            width : 150,
            //  default height
            height : 0,
            //  控件当前已经选中列表的文本值
            text : [],
            //  控件当前已经选中列表的值
            value: [],
            //  是否支持多选
            multiSelect : false,
            //  控件数据源对象的ID字段名
            idField  : 'id',
            //  值字段
            valueField : 'value',
            //  文本字段
            textField  : 'text',
            //  数据源，可以是URL地址或者是一个javascript数组对象作为数据源
            //  dataSource : []
            //  dataSource : { url ,data:{} || function(){ return {}; } }
            dataSource : {},
            /**
             *  控件的值发生改变的时候触发
             *  @event  ebaui.web.ListBox#onchange
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop,
            /**
             *  数据项点击时发生
             *  @event  ebaui.web.ListBox#onitemclick
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onitemclick : $.noop,
            /**
             *  数据项双击时发生
             *  @event  ebaui.web.ListBox#onitemdbclick
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onitemdbclick : $.noop,
            /**
             *  加载失败的时候触发
             *  @event  ebaui.web.ListBox#onloadfail
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onloadfail : $.noop,
            /**
             *  加载成功的时候触发
             *  @event  ebaui.web.ListBox#onloadsucc
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onloadsucc : $.noop,
            /**
             *  数据开始加载的时候触发
             *  @event  ebaui.web.ListBox#onpreload
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onpreload : $.noop,
            /**
             *  数据加载结束的时候触发，无论数据加载成功还是失败
             *  @event  ebaui.web.ListBox#onloadcomplete
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onloadcomplete : $.noop
        }

    });

})( jQuery,ebaui );
/**
 *  定义了TextBoxList控件以及其实现
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {
    
    ebaui.web.registerFormControl( 'TextBoxList',true );

    /** 
     *  ebaui.web.TextBoxList
     *  多选输入框
     *  @class      TextBoxList 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   textboxlist_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      
     *      valueField 默认值:value
     *      textField  默认值:text
     *      filterField默认值:text
     *
     *      data-options={ 
     *          value      : [0,1],
     *          valueField : 'value',
     *          textField  : 'text',
     *          filterField: 'text',
     *          filter     : function( item,value,filterField ){},
     *          dataSource : '' 
     *      } 
     *      
     *      &lt;input id="" name="" data-role="textboxlist" data-options="{ }"/&gt;
     */
    ebaui.control( 'web.TextBoxList',ebaui.web.FormElement, {

        /**
         *  下拉菜单包含的控件对象，Combobox中就是一个ListBox
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     _listbox
         */
        _listbox : null,

        /**
         *  下拉菜单的弹出框
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     _panel
         */
        _panel : null,

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Object}    _domSelector
         */
        _domSelector:{
            'formInput'   : '.eba-textboxlist-input',
            'selectedItem': 'li.eba-textboxlist-item',
            'btnRemoveItem'  : 'span.eba-textboxlist-close'
        },

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-textboxlist',

        /**
         *  控件要用到的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Object}    _cssClass
         */
         _cssClass : {
            disabled: 'eba-disabled',
            focused : 'eba-textboxlist-focus',
            readonly: 'eba-readonly'
        },

        /**
         *  已经编译好的文本列表项HTML模板，后续会重复使用
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _compiledTextItemTmpl
         */
        _compiledTextItemTmpl : $.noop,

        /**
         *  是否使用remote数据源
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Boolean}       _usingRemoteData
         */
        _usingRemoteData : false,

        /**
         *  查询得到的数据集，用于下拉菜单的选项
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Array}     _dataItems
         */
        _dataItems : [],

        /**
         *  调整下拉菜单的位置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Combo
         *  @method     _reposition
         */
        _reposition:function(){

            var me        = this;
            var $popup    = me._panel._$root;

            if( !me._panel.visible() ){ return; }

            var $root     = me._$root;
            var rootPos = $root.position();
            var popupHeight = $popup.outerHeight();
            var scrollTop = $(document).scrollTop();

            var top  = rootPos.top + $root.outerHeight();
            if( top + popupHeight > $(window).height() + scrollTop ){
                top = rootPos.top - popupHeight;
            }

            me._panel.move({
                'top' : top,
                'left': rootPos.left
            });

        },

        /**
         *  创建下拉菜单
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _initPanel
         */
        _initPanel : function(){

            var me = this;
            var ctrlId = me.id();
            var $root = me._$root;
            var $popup = $( '<div data-options="{ visible:false }" style="display:none;"><input /></div>' ).appendTo( document.body );
            $popup.css({ 
                'position'  : 'absolute',
                'display'   : 'none'
            });

            $popup.panel({
                id      : 'panel-' + ctrlId,
                position: 'absolute'
            });

            $( 'input',$popup ).listbox({

                width     : me.width(),
                height    : 220,
                idField   : me.valueField(),
                textField : me.textField(),
                valueField: me.valueField(),
                dataSource: [],
                onitemclick:function( sender,event ){

                    /* 更新控件的数据 */
                    var selected = sender.selectedItems();
                    var clone = me.data();
                    if( !clone || clone.length == 0 ){
                        me.data( selected );
                    }else if( me._indexOf( selected )  == -1 ){
                        me.data( [].concat( clone,selected ) );
                    }

                    /* then clear text in the textbox */
                    me._$formInput.val('');
                    me._panel.close();

                }

            });

            me._listbox = ebaui.get( $( '[data-role="listbox"]',$popup ) );
            me._panel = ebaui.get( $popup );
        },

        /**
         *  更新已经选中的文本列表
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _updateStyleText
         */
        _updateStyleText:function(){

            var me = this;
            var html = me._compiledTextItemTmpl( { 
                'loading'      : false,
                'textField'    : me.textField(),
                'valueField'   : me.valueField(),
                'selectedItems': [],
                'dataItems'    : me.data()
            } );

            $( 'ul li.eba-textboxlist-item',me._$root ).remove();
            $( 'ul',me._$root ).prepend( html );

        },

        /**
         *  根据input文本域的值，更新当前下拉菜单的数据集
         *  输入正常字符，进行过滤
         *  如果使用远程数据，则发送AJAX请求去获取数据，然后把得到的数据赋值给this._dataItems变量；
         *  如果使用的是本地数据，则对dataSource进行filter操作，然后把结果值赋值给this._dataItems变量；
         *  清零this._currDataItemIndex
         *  UI加载并且显示this._dataItems
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _loadData
         */
        _loadData:function( inputValue,afterUpdate ){

            var self       = this;
            var dataSource = self.dataSource();

            if( !afterUpdate ){ afterUpdate = $.noop; }

            if( self._usingRemoteData ){

                var toServer = {};
                var url      = dataSource.url;
                if( self.isFunc( dataSource.data ) ){
                    toServer = dataSource.data();
                }else if( dataSource.data && self.isObject( dataSource.data ) ){
                    toServer = dataSource.data;
                }
                //  服务端要进行过滤的字段，以及对应的字段的值
                toServer[self.filterField()] = inputValue;
                $.getJSON( url,toServer ).done(function( serverData ){

                    //  显示加载中的样式
                    self._dataItems = serverData;
                    afterUpdate( self );

                });

            }else{

                /* if we have value to filtering */
                if(inputValue){
                    var dataItems = [];
                    var filter = self.options['filter'];
                    var filterField = self.filterField();
                    for (var i = 0,l = dataSource.length; i < l; i++) {
                        var item = dataSource[i];

                        if( filter( item,inputValue,filterField ) ){
                            dataItems.push( item );
                        }

                    };

                    self._dataItems = dataItems;
                }else{
                    self._dataItems = dataSource;
                }

                afterUpdate( self );

            }

        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self        = this;
            var $root       = self._$root;
            var $input      = self._$formInput;
            var domSelector = self._domSelector;
            var panel       = self._panel;
            var listbox     = self._listbox;

            $root.on( 'click',domSelector.selectedItem,function( event ){
                var $this = $( this );
                $this.siblings( '.eba-textboxlist-item-selected' ).removeClass('eba-textboxlist-item-selected');
                $this.addClass('eba-textboxlist-item-selected');
            } );

            $root.on( 'click','ul',function( event ){
                $input.focus();
            } );

            /* 删除已经选中的对象 */
            $root.on( 'click',domSelector.btnRemoveItem,function( event ){
                var toRm = self._query( $( this ).attr( 'data-value' ) );
                self._remove( toRm );
            } );

            $root.on( 'keydown',domSelector.formInput,function( event ){
                //  用户定义的事件处理程序
                self.options['onkeydown']( self,event );
            });

            $root.on( 'keyup',domSelector.formInput,function( event ){

                var onDownArrow = function( self,event ) {
                    /* 键盘向下按键 */
                    listbox.selectNext();
                };

                var onUpArrow = function( self,event ) {
                    /* 键盘向上按键 */
                    listbox.selectPrev();
                };

                var onEnter = function( self,event ) {

                    if( !panel.visible() ){
                        /* 当前下拉菜单处于关闭状态，那么这个时候，如果有其他得onenter事件，触发onenter事件 */
                        self.options['onenter']( self,event );
                    }else{
                        /* 
                         *  下拉菜单处于展开的状态
                         *  listbox.data()返回一个数组对象
                         */
                        self._add( listbox.data()[0] );
                        /* 清空文本 */
                        $input.val('');
                        /* 重置_currPopupItemIndex索引 */
                        panel.close();
                    }
                    
                };

                var onBackspace = function( self,event ) {
                    var inputVal = $input.val();
                    /* 退格键 */
                    if( !inputVal ){

                        /* 
                         *  第一次按下退格键，首先高亮最后一个选项
                         *  再次按下退格键，删除最后一个选项
                         */
                        var $highlighted = $( '.eba-textboxlist-item-selected',$root );
                        if( $highlighted.size() == 0 ){
                            $( domSelector.selectedItem,$root ).last().addClass('eba-textboxlist-item-selected');
                        }else{
                            self._pop();
                        }

                    }else{
                        //  输入正常字符，进行过滤
                        //  如果使用远程数据，则发送AJAX请求去获取数据，然后把得到的数据赋值给this._dataItems变量；
                        //  如果使用的是本地数据，则对dataSource进行filter操作，然后把结果值赋值给this._dataItems变量；
                        //  清零this._currDataItemIndex
                        //  UI加载并且显示this._dataItems
                        self._loadData( inputVal,function( sender ){

                            listbox.dataSource( self.items() );
                            panel.open();
                            self._reposition();

                        } );

                    }
                };

                var defaultHandle = function( self,event ) {

                    //  输入正常字符，进行过滤
                    //  如果使用远程数据，则发送AJAX请求去获取数据，然后把得到的数据赋值给this._dataItems变量；
                    //  如果使用的是本地数据，则对dataSource进行filter操作，然后把结果值赋值给this._dataItems变量；
                    //  清零this._currDataItemIndex
                    //  UI加载并且显示this._dataItems
                    self._loadData( $input.val(),function(){

                        listbox.dataSource( self.items() );
                        panel.open();
                        self._reposition();

                    } );

                };

                switch( event.which ){
                    case ebaui.keycodes.down_arrow:
                        onDownArrow( self,event );
                        break;
                    case ebaui.keycodes.up_arrow:
                        onUpArrow( self,event );
                        break;
                    case ebaui.keycodes.enter:
                        onEnter( self,event );
                        break;
                    case ebaui.keycodes.backspace:
                        onBackspace( self,event );
                        break;
                    default:
                        defaultHandle( self,event );
                        break;
                };

                self.options['onkeyup']( self,event );
            });

            $root.on( 'focus',domSelector.formInput,function(evt){
                self._setOption( 'focused',true );
                if( self.enabled() && !self.readonly() ){
                    self.options['onfocus']( self,event );
                }
                self._updateStyleFocused();
            });

            $root.on( 'blur',domSelector.formInput,function(evt){
                self._setOption( 'focused',false );
                if( self.enabled() ){
                    self.options['onblur']( self,event );
                }
                self._updateStyleFocused();
            });

        },

        /**
         *  根据对象的值，在dataSource查找并且返回对象
         *  如果没有找到对象，则返回null值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _indexOf
         *  @arg        {Object}    targetVal   指定的对象的值
         *  @returns    {Object}
         */
        _query:function( targetVal ){

            var me = this;
            if( me.isNull( targetVal ) ){
                return null;
            }

            var dataItems = me.data();
            var field     = me.valueField();

            for (var i = dataItems.length - 1; i >= 0; i--) {

                var item = dataItems[i];
                if( item[field] == targetVal ){
                    return item;
                }

            }

            return null;
        },

        /**
         *  返回指定对象在当前已经选中的对象列表中的索引
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _indexOf
         *  @returns    {Number}
         */
        _indexOf : function( arg ){

            var me = this;
            if( me.isNull( arg ) ){ return -1; }

            var index     = -1;
            var dataItems = me.data();
            var field     = me.valueField();

            for (var i = dataItems.length - 1; i >= 0; i--) {

                var item = dataItems[i];
                if( item[field] == arg[field] ){
                    index = i;
                    break;
                }

            };

            return index;

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _initControl
         */
        _initControl : function(){

            var me = this;
            var opts = me.options;
            me._$formInput = $( '.eba-textboxlist-input',me._$root );
            me._compiledTextItemTmpl  = me.compileTmpl( $( '#ebaui-template-textboxlist-item' ).html() );

            //  过滤字段,使用remote 数据源的时候，发起请求时input值对应的url参数得KEY
            //  该参数默认等同于textField参数
            if( opts['filterField'] ){ opts['filterField'] = opts['textField']; }

            //  which kind of dataSource are we using now ?
            //  Are we access data from remove server or just from a javascript array as dataSource ? 
            me._usingRemoteData = me.isUsingRemoteData( opts['dataSource'] );
            //  创建下拉菜单
            me._initPanel();
            //  加载数据
            me._loadData( undefined, function( sender ){

                me._listbox.dataSource( me.items() );
                var initVal = opts['value'];
                //  如果有设置combobox初始化的值，那么在popup窗口创建完成之后，就应该初始化已经选中的项目
                if( initVal ){
                    //  在下拉菜单的所有数据都加载完成之后，更新一次value属性。因为value属性的真正的值是从下拉菜单的数据集得到的。
                    me.value( initVal );
                    me._listbox.data( me.data() );
                }

            } );

        },

        /**
         *  下拉菜单数据
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.Combo
         *  @member     {Array}  items
         */
        items:function(){ return this._dataItems; },

        /**
         *  textboxlist 文本列表
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Array}     text
         *  @example    <caption>get</caption>
         *      //  [ '', '' ]
         *      var pair = ctrl.text();
         */
        text : function(){ return this.options['text']; },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _add
         *  @arg        {Object|Number}     要添加的对象或者对象的index
         */
        _add:function( arg ){

            var me = this;
            if( me.isNull( arg ) ){ return; }

            var isNum = me.isNumber( arg );
            var dataItems = me.items();
            if( dataItems.length == 0 ){ return; }

            if( isNum && !(arg >= 0 && arg < dataItems.length ) ){
                return;
            }

            if( isNum ){
                arg = dataItems[arg];
            }

            if( me._indexOf( arg ) == -1 ){
                var opts = me.options;
                var field = me.valueField();
                /* 没有这条数据，添加这条数据 */
                opts['data'].push(arg);
                opts['value'].push(arg[field]);
                /* update displayed text */
                me._updateStyleText();
                /* trigger change event */
                me.options['onchange']( me,{} );
            }

        },

        /**
         *  删除并且返回最后一个选中对象
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _pop
         */
        _pop:function(){
            var me = this;
            var opts = me.options;
            var data = opts['data'];

            /* 如果当前已选中项目列表是空的，直接返回 */
            if( me.isEmpty( data ) ){ return null; }

            var idx  = data.length - 1;
            var lastItem = data[idx];
            /* 删除数据 */
            opts['data'].splice(idx,1);
            opts['value'].splice(idx,1);
            /* update displayed text */
            me._updateStyleText();
            /* trigger change event */
            me.options['onchange']( me,{} );

            return lastItem;
        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @method     _remove
         *  @arg        {Object|Number}     要移除的对象或者对象的index
         */
        _remove:function( arg ){

            var me = this;
            if( me.isNull( arg ) ){ return; }

            var isNum = me.isNumber( arg );
            var dataItems = me.items();
            if( dataItems.length == 0 ){ return; }

            if( isNum && !(arg >= 0 && arg < dataItems.length ) ){
                return;
            }

            if( isNum ){
                arg = dataItems[arg];
            }

            var idx = me._indexOf( arg );
            if( idx != -1 ){
                /* 当前控件有选中的这个对象 */
                var opts = me.options;
                /* 删除数据 */
                opts['data'].splice(idx,1);
                opts['value'].splice(idx,1);
                /* update displayed text */
                me._updateStyleText();
                /* trigger change event */
                me.options['onchange']( me,{} );
            }

        },

        _updateValue : function( val,isEqual ){

            var me = this;
            if( !me.isArray( val ) ){ val = [ val ]; }
            
            var neoData    = [];
            var neoValue   = [];
            var neoText    = [];
            var textField  = me.textField();
            var valueField = me.valueField();
            var dataItems  = me.items();

            /* first we should filter out existed value */
            me.each(val,function(valueItem){

                for (var i = 0, l = dataItems.length; i < l; i++) {
                    var dataItem = dataItems[i];

                    if( isEqual(dataItem,valueItem,valueField) ){

                        var text = dataItem[textField];
                        var value = dataItem[valueField];

                        var toInsert = {};
                        toInsert[textField] = text;
                        toInsert[valueField] = value;

                        neoData.push(dataItem);
                        neoText.push(text);
                        neoValue.push(value);

                        break;
                    }
                };

            } );
            /* update controls value */
            me.options['data'] = neoData;
            me.options['text'] = neoText;
            me.options['value'] = neoValue;
            /* update displayed text */
            me._updateStyleText();
            /* trigger change event */
            me.options['onchange']( me,{} );

        },

        /**
         *  textboxlist value
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Array}     value
         *  @example    <caption>get</caption>
         *      //  [ '', '' ]
         *      var value = ctrl.value();
         */
        value : function( val ){

            var me = this;
            if( !val ){
                return me.options['value'];
            }

            me._updateValue( val,function( dataItem,valueItem,valueField ){
                return (dataItem[valueField] == valueItem);
            } );
        },

        /**
         *  控件数据，当前控件选中的数据，包含文本还有对应的值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Array}     data
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( pair );
         */
        data: function( val ){

            var me = this;
            if( !val ){
                return me.options['data'];
            }

            me._updateValue( val,function( dataItem,valueItem,valueField ){
                return (dataItem[valueField] == valueItem[valueField]);
            } );

        },

        /**
         *  控件数据源对象字段中，用于筛选的对象字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {String}      filterField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var filterField = ctrl.filterField();
         *  @example    <caption>set</caption>
         *      ctrl.filterField( '' );
         */
        filterField : function( val ) {

            var me = this;
            if( !me.isString( val ) ){
                return me.options['filterField'];
            }
            me.options['filterField'] = val;

        },

        /**
         *  控件数据源对象字段中，用于作为控件值的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {String}      valueField
         *  @default    'value'
         *  @example    <caption>get</caption>
         *      var valueField = ctrl.valueField();
         *  @example    <caption>set</caption>
         *      ctrl.valueField( '' );
         */
        valueField : function( val ) {

            var me = this;
            if( !me.isString( val ) ){
                return me.options['valueField'];
            }
            me.options['valueField'] = val;

        },

        /**
         *  控件数据源对象字段中，用于作为控件文本的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {String}      textField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var textField = ctrl.textField();
         *  @example    <caption>set</caption>
         *      ctrl.textField( '' );
         */
        textField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['textField'];
            }
            me.options['textField'] = val;
        },

        /**
         *  下拉菜单选项的数据源，可以是远程数据源URL配置对象或者是一个javascript数组对象作为数据源
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Object|Array}          dataSource
         *  @property   {String}                dataSource.url          - 服务端URL
         *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
         *  @tutorial   texboxlist_local
         *  @tutorial   texboxlist_remote
         *  @example    <caption>get</caption>
         *      var src = ctrl.dataSource();
         *  @example    <caption>set</caption>
         *      //  本地数据
         *      ctrl.dataSource( [] );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : {}
         *      } );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : function(){ 
         *              // your logic
         *              return {};
         *          }
         *      } );
         */
        dataSource : function( val ){

            var me = this;
            if( !val ){
                return me.options['dataSource'];
            }

            me.options['dataSource'] = val;
            me._usingRemoteData = me.isUsingRemoteData( val );

        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  default width
            width : 250,
            //  default height
            height : 24,
            //  控件当前已经选中列表的文本值
            text : [],
            //  控件当前已经选中列表的值
            value: [],
            //  值字段
            valueField : 'value',
            //  文本字段
            textField  : 'text',
            //  过滤字段,使用remote 数据源的时候，发起请求时input值对应的url参数得KEY
            //  该参数默认等同于textField参数
            filterField : '',
            //  使用本地array数据，作为数据过滤的函数
            filter : function( item,value,filterField ){
                return item[filterField].indexOf( value ) > -1;
            },
            //  下拉菜单选项的数据源，可以是URL地址或者是一个javascript数组对象作为数据源
            //  dataSource : []
            //  dataSource : { url ,data:{} || function(){ return {}; } }
            dataSource : '',

            /**
             *  键盘按下时发生
             *  @event  ebaui.web.TextBoxList#onkeydown
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onkeydown    : $.noop,

            /**
             *  键盘释放时发生
             *  @event  ebaui.web.TextBoxList#onkeyup
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onkeyup      : $.noop,

            /**
             *  回车时发生
             *  @event  ebaui.web.TextBoxList#onenter
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onenter      : $.noop,

            /**
             *  控件获取焦点的时候触发
             *  @event  ebaui.web.TextBoxList#onfocus
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onfocus      : $.noop,

            /**
             *  控件失去焦点的时候触发
             *  @event  ebaui.web.TextBoxList#onblur
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onblur      : $.noop,

            /**
             *  控件的值发生改变的时候触发
             *  @event  ebaui.web.TextBoxList#onchange
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop

        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.MiniGrid
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {
    
     /** 
     *  ebaui.web.MiniGrid
     *  控件描述
     *  @class      MiniGrid 
     *  @memberof   ebaui.web
     *  @extends    Control
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example    ''
     */
    ebaui.control( 'web.MiniGrid', {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-minigrid',

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @member     {String}    _rootHtmlTmpl
         */
        _headerHtmlTmpl : '#ebaui-template-minigrid-header',

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @member     {String}    _rootHtmlTmpl
         */
        _itemHtmlTmpl : '#ebaui-template-minigrid-item',

        /**
         *  已经编译好的ListBox项HTML模板，后续会重复使用
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     _compiledHeaderTmpl
         */
        _compiledHeaderTmpl : $.noop,

        /**
         *  已经编译好的ListBox项HTML模板，后续会重复使用
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     _compiledItemTmpl
         */
        _compiledItemTmpl : $.noop,

        _updateStyleHeight : function(){

            var me      = this;
            var height  = me.height();
            var isNum   = me.isNumber( height );
            
            var $root   = me._$root;
            var $border = $('.eba-listbox-border',$root);
            var $view   = $('.eba-listbox-view',$root);

            if( isNum ){
                if( height > 0 ){ 
                    $view.height( height );
                }
            }else if( height ){
                var result = me._cssUnitRE.exec( height );
                if( result[1] ){
                    //  if one css unit has been assigned
                    $view.css( 'height',height );
                }else{
                    //  default css unit is px
                    $view.css( 'height',height + 'px' );
                }
            }

        },

        _updateStyleWidth:function(){

            var me      = this;
            var width   = me.width();
            var isNum   = me.isNumber( width );
            
            var $root   = me._$root;
            var $border = $('.eba-listbox-border',$root);
            var $view   = $('.eba-listbox-view',$root);

            if( isNum ){
                if( width > 0 ){ $view.width( width ); }
            }else if( width ){
                var result = me._cssUnitRE.exec( width );
                if( result[1] ){
                    //  if one css unit has been assigned
                    $view.css( 'width',width );
                }else{
                    //  default css unit is px
                    $view.css( 'width',width + 'px' );
                }
            }

        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self  = this;
            var $root = self._$root;

            /* because of event delegation,so I stop event bubbling here */
            $root.on( 'click',function( event ){ 
                event.stopPropagation();
            } );

            $root.on( 'change',':checkbox',function( event ){

                event.stopPropagation();

                var $this       = $(this);
                var value       = $this.val();
                var selectedCls = 'eba-listbox-item-selected';
                if( value === 'selectall' && $this.is(':checked') ){
                    //  in case of select all
                    $( ':checkbox[value!="selectall"]',$root ).each(function( index,el ){
                        el.checked = true;
                    });

                    $( '.eba-listbox-view tr[data-index!=""]',$root ).addClass(selectedCls);

                    if( self.isFunc( self.options['onSelectAll'] ) ){
                        self.options['onSelectAll']( self,{} );
                    }

                }else if( value === 'selectall' && !$this.is(':checked') ){
                    //  in case of deselect all
                    self.resetSelection();
                    $( '.eba-listbox-view .' + selectedCls,$root ).removeClass(selectedCls);
                    self.options['onSelectAll']( self,{} );
                }else if( value !== 'selectall' && $this.is(':checked') ){

                    $this.parent().parent().addClass(selectedCls);
                    if( self.isFunc( self.options['onSelectRow'] ) ){
                        self.options['onSelectRow']( self,{} );
                    }

                }else if( value !== 'selectall' && !$this.is(':checked') ){
                    $this.parent().parent().removeClass(selectedCls);
                    self.options['onSelectRow']( self,{} );
                }

            } );

        },

        /**
         *  判断是否使用本地数据源还是使用remote数据源
         *  ，因为我直接整合jqgrid的配置，并没有做过多的修改
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     _isRemoteDataSource
         */
        _isRemoteDataSource:function(){
            var me = this;
            var dataSource = me.options['data'];
            var url = $.trim( me.options['url'] );

            /*
             *  优先加载远程数据，然后才是本地数据
             */
            if( url ){ return true; }

            if( dataSource && me.isArray( dataSource ) ){
                return false;
            }
            
            //  at last, it comes to an empty array as a local dataSource
            me.options['data'] = [];
            return false;
        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     _initControl
         */
        _initControl : function(){

            var me = this;
            var headerTmpl = $.trim( $( me._headerHtmlTmpl ).html() );
            me._compiledHeaderTmpl = me.compileTmpl( headerTmpl );

            var itemHtmlTmpl = $.trim( $( me._itemHtmlTmpl ).html() );
            me._compiledItemTmpl = me.compileTmpl( itemHtmlTmpl );

            me._usingRemoteData = me._isRemoteDataSource();

        },

        _usingRemoteData  : false,

        _loadRemoteData : function( callback ){

            var me = this;
            var opts = me.options;
            var dataSource = opts['url'];
            var postData = opts['postData'];
            var parameters = {};
            if( postData ){
                for( var i = 0,l = postData.length;i<l;i++ ){
                    $.extend( parameters,postData[i] );
                }
            }

            $.getJSON(dataSource, parameters, function(serverData) {
                callback( serverData );
            });

        },

        _loadData:function( callback ){

            var self = this;
            if( self._usingRemoteData ){
                self._loadRemoteData( function( serverData ){
                    self._items = serverData;
                    callback();
                    self.options['loadComplete']( self,{} );
                } );
            }else{
                self._items = self.options.data;
                callback();
                self.options['loadComplete']( self,{} );
            }

        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     _render
         */
        _render : function(){

            var self = this;
            var $root = this._$root;

            self._loadData( function(){

                var headerHtml = self._compiledHeaderTmpl({
                    'headers' : self.options['colModel']
                });

                var itemsHtml = self._compiledItemTmpl({
                    'headers'  : self.options['colModel'],
                    'rows'     : self.items(),
                    'autowidth': self.options['autowidth']
                });

                if( self.options['autowidth'] ){
                    $( '.eba-listbox-headerInner',$root ).html( headerHtml );
                    $( '.eba-listbox-items',$root ).html( itemsHtml );
                }else{
                    $( '.eba-listbox-items',$root ).html( headerHtml + itemsHtml );
                }

                self._updateStyleWidth();
                self._updateStyleHeight();

            } );

        },

        //  本地数据源
        _items : [],

        /**
         *  当前MiniGrid的数据源
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @member     items
         */
        items : function(){ return this._items; },

        /**
         *  当前MiniGrid的已经选中的项目
         *  @private
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @member     selectedItems
         */
        selectedItems : function(){

            var me = this;
            if( me._items.length <=0 ){
                return [];
            }

            var idx   = [];
            var $root = me._$root;
            $( ':checked',$root ).each( function( index,el ){
                var $this = $( el );
                var value = $this.val();
                if( el.checked && value !== "selectall" ){
                    idx.push( parseInt( value ) );
                }
            } );

            var selected = [];
            for( var i = 0,l = idx.length; i < l; i++ ){
                var index = idx[i];
                selected.push( me._items[index] );
            }
            return selected;

        },

        /**
         *  清空选中的项。如果有指定的数据行，则清空指定数据行的选中状态；
         *  否则，清空所有选中的数据行。
         *  @public
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     resetSelection
         *  @param      {String}        rowId
         */
        resetSelection : function( rowId ){

            var $root            = this._$root;
            var $checkboxes      = $( ':checkbox',$root );
            var $checked         = $( ':checked',$root );
            var checkedItemCount = $checked.size();
            var allChecked       = checkedItemCount == this._items.length;
            var resetAll         = !this.isNumber( rowId );

            if( checkedItemCount == 0 ){
                return ;
            }

            if( !resetAll && allChecked ){
                //  in case of checked all
                $checkboxes.get( 0 ).checked = false;
                $checkboxes.get( rowId + 1 ).checked = false;
            }else if( !resetAll && !allChecked ){
                //  in case of reset one row
                $checkboxes.get( rowId + 1 ).checked = false;
            }else{
                //  in case of reset all
                $( '.eba-listbox-item-selected',$root ).removeClass('eba-listbox-item-selected');
                $checked.each( function( index,el ){
                    el.checked = false;
                } );
            }

        },

        /**
         *  选中指定的数据行
         *  @public
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     setSelection
         *  @param      {String}        rowId
         */
        setSelection : function( rowId ){

            var me = this;
            var selector = ':checkbox[value="{0}"]'.replace( '{0}',rowId );
            var $tr = $( 'tr[data-index="{0}"]'.replace( '{0}',rowId ),me._$root );

            if(  $tr.size() > 0 ){
                $tr.find(':checkbox').get(0).checked = true;
                $tr.addClass('eba-listbox-item-selected');
                if( me.isFunc( me.options['onSelectRow'] ) ){
                    me.options['onSelectRow']( me,{} );
                }
            }

        },

        //  { data : [] }
        /**
         *  更新grid的配置
         *  @public
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     setGridParam
         *  @param      {Object}        options
         */
        setGridParam : function( parameters ){
            if( !parameters ){ return; }
            this.options = $.extend( this.options,parameters );
        },

        /**
         *  使用grid配置重新加载grid
         *  @public
         *  @instance
         *  @memberof   ebaui.web.MiniGrid
         *  @method     reloadGrid
         */
        reloadGrid : function(){
            var me = this;
            //  
            me._usingRemoteData = me._isRemoteDataSource();
            //  re-render
            me._render();
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Button
         *  @member     {Object}    options
         */
        options : {
            //  
            autowidth : true,
            //  default width
            width : 400,
            //  default height
            height : 120,
            //  remote data source 
            url         : '',
            //  local data array
            data        : [],
            //  xml 
            //  xmlstring 
            //  json 
            //  jsonstring 
            //  local 
            //  javascript 
            //  function 
            //  clientSide
            datatype    : "local",
            //  使用远程数据的时候，随着url一起提交到服务器的数据
            postData    : [{}],
            //  控件数据源对象的ID字段名
            colModel    : [ 
                {name       :'id', label : 'ID', width : 150},
                {name       :'text', label : 'Text', width : 150} 
            ],
            //  是否允许多选
            multiselect : true,
            //  
            onSelectRow : $.noop,
            //  
            onSelectAll : $.noop,
            //
            loadComplete: $.noop
        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.ComboBox
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    /* 命名空间别名 */
    ebaui.web.registerFormControl( 'ComboBox',true );

    /** 
     *  ebaui.web.ComboBox
     *  ，DEMO请查看 {@tutorial combobox_index}
     *  ，使用远程数据源的DEMO请看 {@tutorial combobox_remoteDataSource}
     *  @class      ComboBox 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.Combo
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      
     *      valueField默认值:value
     *      valueField默认值:text
     *      filterField默认值:text
     *
     *      data-options={ 
     *          text       : '',
     *          value      : null,
     *          idField    : 'id',
     *          textField  : 'text',
     *          valueField : 'value',
     *          dataSource : '' ,
     *          onchange   : $.noop
     *      }
     *
     *      &lt;input id="" name="" value="aa" placeholder="" readonly="" data-role="combobox" data-options="{ }" /&gt;
     */
    ebaui.control( 'web.ComboBox',ebaui.web.Combo, {

        /**
         *  下拉菜单包含的控件对象，Combobox中就是一个ListBox
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @member     _listbox
         */
        _listbox : null,

        /**
         *  创建并且初始化下拉菜单
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @method     _initPanel
         */
        _initPanel : function(){

            var me = this;
            var ctrlId = me.id();
            var $root = me._$root;
            var $popup = $( '<div data-options="{ visible:false }" style="display:none;"><input /></div>' ).appendTo( document.body );
            //  18是表单控件外围status的icon宽度
            $popup.panel({
                id      : 'panel-' + ctrlId,
                position: 'absolute',
                width   : me.width() - 22,
                height  : me.height()
            });

            $( 'input',$popup ).listbox({

                position  : null,
                width     : 0,
                height    : 0,
                idField   : me.idField(),
                textField : me.textField(),
                valueField: me.valueField(),
                dataSource: [],
                onitemclick:function( sender,event ){
                    //  更新控件的数据 
                    me.data( sender.selectedItems() );
                    //  如果是单选的情况，那么在选中其中的一个项目之后，就把下拉菜单收起来
                    me._panel.close();
                }

            });

            me._panel = ebaui.get( $popup );
            me._listbox = ebaui.get( $( '[data-role="listbox"]',$popup ) );
        },

        /**
         *  更新已经选中的文本列表
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @method     _updateText
         */
        _updateStyleText:function(){

            var str = '';
            var text = this.text();
            for (var i = 0,l=text.length; i < l; i++) {
                var item = text[i];
                str += item;
                if( i < l -1 ){
                    str += ',';
                }
            }

            this._$formInput.val( str );

        },

        /**
         *  加载listbox的列表数据
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @method     _loadRemoteData
         *  @param      {Object}    inputValue
         *  @param      {Function}  afterLoad
         */
        _loadRemoteData:function( inputValue,beforeLoad,afterLoad ){

            var self       = this;
            var dataSource = self.dataSource();

            if( !self.isFunc(beforeLoad) ){ beforeLoad = $.noop; }
            if( !self.isFunc(afterLoad) ){ afterLoad = $.noop; }

            //  清空下拉菜单旧的数据
            self._popupDataItems = [];
            var paramsToServer = {};

            if( self.isFunc( dataSource.data ) ){
                paramsToServer = dataSource.data();
            }

            if( inputValue && inputValue.length > 0 ){
                /*
                 *  如果是单选，那么允许你过滤下拉菜单数据
                 *  多选的情况下不允许过滤下拉菜单数据，因为这个时候限制了用户的输入
                 */
                paramsToServer[self.filterField()] = inputValue;
            }

            beforeLoad( self );

            $.ajax({
                url       : dataSource.url,
                data      : paramsToServer,
                dataType  : 'json',
                success   : function ( serverData ) {
                    self._popupDataItems = serverData;
                    afterLoad( self );
                }
            });

        },

        /**
         *  加载listbox的列表数据
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @method     _loadLocalData
         *  @param      {Object}    inputValue
         *  @param      {Function}  afterLoad
         */
        _loadLocalData:function( inputValue,beforeLoad,afterLoad ){

            var self       = this;
            var field      = self.filterField();
            var filter     = self.options['filter'];
            var dataSource = self.dataSource();

            if( !self.isFunc(beforeLoad) ){ beforeLoad = $.noop; }
            if( !self.isFunc(afterLoad) ){ afterLoad = $.noop; }

            beforeLoad( self );

            if( inputValue && inputValue.length > 0 ){
                //  如果是单选，那么允许你过滤下拉菜单数据
                var dataItems = [];
                for (var i = 0; i < dataSource.length; i++) {
                    var item = dataSource[i]
                    if( filter( item,inputValue,field ) ){
                        dataItems.push( item );
                    }
                };

                self._popupDataItems = dataItems;

            }else{
                //  多选的情况下不允许过滤下拉菜单数据，因为这个时候限制了用户的输入
                self._popupDataItems = dataSource;
            }

            afterLoad( self );

        },

        /**
         *  加载listbox的列表数据
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @method     _loadPopupData
         *  @param      {Function}  beforeLoad
         *  @param      {Function}  afterLoad
         */
        _loadPopupData:function( inputValue,beforeLoad,afterLoad ) {

            var me = this;
            if( me._usingRemoteData ){
                me._loadRemoteData( inputValue,beforeLoad,afterLoad );
            }else{
                me._loadLocalData( inputValue,beforeLoad,afterLoad );
            }

        },

        /**
         *  查找数据项是在下拉菜单数据源的索引值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @method     _indexOf
         *  @param      {Object}    toCompare
         */
        _indexOf:function( toCompare,field,isEqual ){

            var me = this;
            if( me.isString( field ) ){
                field = this.idField();
            }

            if( !me.isFunc( isEqual ) ){
                isEqual = function( source,dist ){
                    return source[field]  == dist[field];
                };
            }

            var index = -1;
            for (var i = 0; i < me._popupDataItems.length; i++) {

                if( isEqual( toCompare,me._popupDataItems[i] ) ){
                    index = i;
                    break;
                }

            };

            return index;

        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            //  初始化加载下拉菜单数据
            //  下拉菜单的数据应该是由combobox过滤以及筛选，然后赋值给下拉菜单控件
            //  我觉得，下载菜单的数据应该是在点击下来菜单的时候去加载数据
            var me   = this;
            var $root  = me._$root;

            $root.on( 'focus','.eba-buttonedit-input',function( event ){
                me._setOption( 'focused',true );
                me._updateStyleFocused();
            } );

            $root.on( 'blur','.eba-buttonedit-input',function( event ){
                me._setOption( 'focused',false );
                me._updateStyleFocused();
            } );

            //  when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
            //  when you click on this label
            //  remove this label then focus in the input
            $root.on( 'click','.eba-placeholder-lable',function( event ){
                $(this).hide();
                me._$formInput.focus();
            } );

            //  如果不允许手工输入文本，返回false，阻止文字输入
            $root.on( 'keydown','.eba-buttonedit-input',function( event ){
                
                var allowed = false;
                switch( event.which ){
                    case ebaui.keycodes.down_arrow:
                        allowed = true;
                        break;
                    case ebaui.keycodes.up_arrow:
                        allowed = true;
                        break;
                    case ebaui.keycodes.enter:
                        allowed = true;
                        break;
                };

                if( !allowed && !me.allowInput() ){
                    event.preventDefault();
                }

            } );

            $root.on( 'keyup','.eba-buttonedit-input',function( event ){

                if( !me.enabled() || me.readonly() ){
                    event.preventDefault();
                }

                var onDownArrow = function( self,event ) {
                    /* 键盘向下按键 */
                    self._listbox.selectNext();
                };

                var onUpArrow = function( self,event ) {
                    /* 键盘向上按键 */
                    self._listbox.selectPrev();
                };

                var onEnter = function( self,event ) {

                    if( !self._panel.visible() ){

                        /* 
                         *  当前下拉菜单处于关闭状态，
                         *  那么这个时候，
                         *  如果有其他得onenter事件，触发onenter事件 
                         */
                        self.options['onenter']( self,event );
                    }else{
                        /*
                         *  按下回车键选中下拉菜单的某一个项的时候，
                         *  下拉菜单的listbox控件也要选中这个项 
                         */
                         var listbox = self._listbox;
                         self.data( listbox.data() );
                         self._panel.close();
                    }

                };

                var defaultHandle = function( self,event ) {

                    var inputVal = self._$formInput.val();
                    self.text( inputVal );
                    /*
                     *  输入正常字符，进行过滤
                     *  如果使用远程数据，则发送AJAX请求去获取数据，然后把得到的数据赋值给this._dataItems变量； 
                     *  如果使用的是本地数据，则对dataSource进行filter操作，然后把结果值赋值给this._dataItems变量；
                     *  清零this._currDataItemIndex
                     *  UI加载并且显示this._dataItems
                     */
                    self._loadPopupData( inputVal,$.noop,function( sender ){

                        self._listbox.dataSource( self.items() );
                        self._panel.open();
                        self._reposition();

                    } );

                };

                switch( event.which ){
                    case ebaui.keycodes.down_arrow:
                        onDownArrow( me,event );
                        break;
                    case ebaui.keycodes.up_arrow:
                        onUpArrow( me,event );
                        break;
                    case ebaui.keycodes.enter:
                        onEnter( me,event );
                        break;
                    default:
                        defaultHandle( me,event );
                        break;
                };

            });

            me._super();

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @method     _initControl
         */
        _initControl : function(){

            //  调用父类的_initControl方法
            var me = this;
            me._super();
            me._$formInput = $( '.eba-buttonedit-input',me._$root );
            me._$root.addClass( 'eba-combobox eba-popupedit' );

            /*
             *  过滤字段,使用remote 数据源的时候，发起请求时input值对应的url参数得KEY
             *  该参数默认等同于textField参数
             */
            var opts = me.options;
            if( opts['filterField'] == '' ){
                opts['filterField'] = opts['textField'];
            }

            //  创建下拉菜单，并且进行初始化，设置数据源等
            me._initPanel();
            me._usingRemoteData = me.isUsingRemoteData( me.options['dataSource'] );
            //  加载数据
            me._loadPopupData( undefined, undefined, function( sender ){

                sender._listbox.dataSource( sender.items() );
                var initVal = sender.options['value'];
                //  如果有设置combobox初始化的值，那么在popup窗口创建完成之后，就应该初始化已经选中的项目
                if( initVal ){
                    //  在下拉菜单的所有数据都加载完成之后，更新一次value属性。因为value属性的真正的值是从下拉菜单的数据集得到的。
                    sender.value( initVal );
                    sender._listbox.data( sender.data() );
                }

            } );

        },

        /**
         *  下拉菜单数据
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.Combo
         *  @member     {Array}  items
         */
        items:function(){ return this._popupDataItems; },   

        /**
         *  获取文本值
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.ComboBox
         *  @member     {Array}    text
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  text == ''
         *      var text = buttonedit.text();
         */
        text : function( val ){

            var me = this;
            if( !me.isString( val ) ){
                return me.options['text'];
            }

            var opts = me.options;
            opts['text'] = val;
            me._$formInput.val( val );

            if( me.isEmpty( opts['text'] ) ){ 
                me._showPlaceHolder();
            }else{ 
                me._hidePlaceHolder(); 
            }

        },

        /**
         *  获取或者设置表单控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @member     {Object}    value
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( {} );
         */
        value     : function( val ){

            var me = this;
            if( me.isNull( val ) ){
                return me.options['value'];
            }

            if( !me.isArray( val ) ){
                val = [ val ];
            }

            if( val.length == 0 ){
                me.data([]);
                return;
            }

            var data  = [];
            var field = me.valueField();
            var items = me._popupDataItems;

            //  单选的情况
            for (var i = 0; i < items.length; i++) {
                var dataItem = items[i];
                if( dataItem[field] == val[0] ){
                    data = [ dataItem ];
                    break;
                }
            };

            me.data( data );
        },

        _data: null,

        /**
         *  获取或者设置选中的项
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @member     {Object}        data
         *  @default    null
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( {} );
         */
        data: function( val ){

            var me = this;
            if( me.isNull( val ) ){
                return me._data;
            }

            if( !me.isArray( val ) ){ val = [ val ]; }

            var opts = me.options;
            if( val.length == 0 ){
                //  清空数据
                me._data = null;
            }else{
                //  单选
                me._data = val[0];

                var textField = me.textField();
                var valueField = me.valueField();

                opts['text'] = me._data[textField];
                opts['value'] = me._data[valueField];

                me._$formInput.val( opts['text'] );
                if( opts['text'] ){ me._hidePlaceHolder(); }else{ me._showPlaceHolder(); }
            }

            //  me._updateStyleText();
            opts['onchange']( self,{} );

        },

        /**
         *  控件数据源对象的ID字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @member     {String}      idField
         *  @default    'id'
         *  @example    <caption>get</caption>
         *      var idField = ctrl.idField();
         *  @example    <caption>set</caption>
         *      ctrl.idField( '' );
         */
        idField : function( val ) {

            var me = this;
            if( me.isNull( val ) ){
                return me.options['idField'];
            }

            me.options['idField'] = val.toString();
            //  同步更新popup的设置
            me._listbox.idField( val );
        },

        /**
         *  控件数据源对象字段中，用于作为控件文本的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @member     {String}      textField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var textField = ctrl.textField();
         *  @example    <caption>set</caption>
         *      ctrl.textField( '' );
         */
        textField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['textField'];
            }
            me.options['textField'] = val;
            //  同步更新popup的设置
            me._listbox.textField( val );
        },

        /**
         *  控件数据源对象字段中，用于作为控件值的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @member     {String}      valueField
         *  @default    'value'
         *  @example    <caption>get</caption>
         *      var valueField = ctrl.valueField();
         *  @example    <caption>set</caption>
         *      ctrl.valueField( '' );
         */
        valueField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['valueField'];
            }
            me.options['valueField'] = val;
            //  同步更新popup的设置
            me._listbox.valueField( val );
        },

        /**
         *  控件数据源对象字段中，用于筛选的对象字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @member     {String}      filterField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var filterField = ctrl.filterField();
         *  @example    <caption>set</caption>
         *      ctrl.filterField( '' );
         */
        filterField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['filterField'];
            }
            me.options['filterField'] = val;
        },

        /**
         *  获取或者设置是否允许手工输入文本
         *  ，原先的文字，如果不在列表内，清除。
         *  @public
         *  @instance
         *  @tutorial   combobox_allowInput
         *  @memberof   ebaui.web.ComboBox
         *  @member     {Boolean}    allowInput
         *  @default    true
         *  @example    <caption>get</caption>
         *      var allowed = ctrl.allowInput();
         *  @example    <caption>set</caption>
         *      ctrl.allowInput( false );
         */
        allowInput:function( val ){

            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['allowInput'];
            }

            me.options['allowInput'] = val;

            //  如果设置allowInput=false，原先的文字，如果不在列表内，就要清除。
            if( !val ){

                me._loadPopupData( '',$.noop,function(){

                    var text = me.text();
                    var exist = false;
                    var field = me.textField();
                    var dataItems = me._popupDataItems;
                    for (var i = 0; i < dataItems.length; i++) {
                        exist = dataItems[i][field] == text;
                        if( exist ){ break; }
                    }

                    if( !exist ){ me.text(''); }

                } );

            }

        },

        /**
         *  下拉菜单选项的数据源，可以是URL地址或者是一个javascript数组对象作为数据源
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Combo
         *  @member     {Object|Array}          dataSource
         *  @property   {String}                dataSource.url          - 服务端URL
         *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
         *  @example    <caption>get</caption>
         *      var src = ctrl.dataSource();
         *  @example    <caption>set</caption>
         *      //  本地数据
         *      ctrl.dataSource( [] );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : {}
         *      } );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : function(){ 
         *              // your logic
         *              return {};
         *          }
         *      } );
         */
        dataSource : function( val ){

            var me = this;
            if( !val ){
                return me.options['dataSource'];
            }

            me._usingRemoteData = me.isUsingRemoteData( me.options['dataSource'] );
            me.options['dataSource'] = val;
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboBox
         *  @member     {Object}    options
         */
        options:{
            // css position property
            position   : 'absolute',
            //  
            text       : '',
            //  
            value      : null,
            //  是否允许手工输入文本
            allowInput : true,
            //  文本占位符
            placeholder: '请选择...',
            //  控件数据源对象的ID字段名
            idField    : 'id',
            //  值字段
            valueField : 'value',
            //  文本字段
            textField  : 'text',
            //  过滤字段,使用remote 数据源的时候，发起请求时input值对应的url参数得KEY
            //  该参数默认等同于textField参数
            filterField: '',
            //  使用本地array数据，作为数据过滤的函数
            filter : function( item,value,filterField ){
                return item[filterField].indexOf( value ) > -1;
            }

        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.ComboList
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'ComboList',true );

    /** 
     *  ebaui.web.ComboList
     *  ，DEMO请查看 {@tutorial combolist_index}
     *  ，使用远程数据源的DEMO请看 {@tutorial combolist_remoteDataSource}
     *  ，手工更改数据源设置的DEMO请看{@tutorial combolist_setDataSource}
     *  @class      ComboList 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.Combo
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      
     *      valueField默认值:value
     *      valueField默认值:text
     *      filterField默认值:text
     *
     *      data-options={ 
     *
     *      }
     *
     *      &lt;input id="" name="" value="aa" placeholder="" readonly="" data-role="combolist" data-options="{ }" /&gt;
     */
    ebaui.control( 'web.ComboList',ebaui.web.Combo, {

        /**
         *  下拉菜单包含的控件对象，Combobox中就是一个ListBox
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @member     _listbox
         */
        _listbox : null,

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     _updateStyleEnabled
         */
        _updateStyleEnabled:function() {

            var me     = this;
            var $root  = me._$root;
            var $input = me._$formInput;

            if( me.enabled() ){
                $root.removeClass( me._cssClass['disabled'] );
            }else{
                $root.removeClass( me._cssClass['focused'] );
                $root.addClass( me._cssClass['disabled'] );
            }

            //  input 始终禁用
            $input.attr('disabled','disabled');

        },

        /**
         *  更新已经选中的文本列表
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @method     _updateText
         */
        _updateText:function( textArray ){

            var str = '';
            var me = this;
            if( me.isEmpty(textArray) ){
                me._$formInput.val( '' );
                me._showPlaceHolder();
                return;
            }

            for (var i = 0,l=textArray.length; i < l; i++) {
                var item = textArray[i];
                str += item;
                if( i < l -1 ){
                    str += ';';
                }
            }

            me._$formInput.val( str );
            if( me.isEmpty(str) ){
                me._showPlaceHolder();
            }else{
                me._hidePlaceHolder();
            }

        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            //  初始化加载下拉菜单数据
            //  下拉菜单的数据应该是由combobox过滤以及筛选，然后赋值给下拉菜单控件
            //  我觉得，下载菜单的数据应该是在点击下来菜单的时候去加载数据
            var me   = this;
            var $root  = me._$root;

            $root.on( 'focus','.eba-buttonedit-input',function( event ){
                me._setOption( 'focused',true );
                me._updateStyleFocused();
            } );

            $root.on( 'blur','.eba-buttonedit-input',function( event ){
                me._setOption( 'focused',false );
                me._updateStyleFocused();
            } );

            //  when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
            //  when you click on this label
            //  remove this label then focus in the input
            $root.on( 'click','.eba-placeholder-lable',function( event ){
                $(this).hide();
                me._$formInput.focus();
            } );

            me._super();

        },

        /**
         *  初始化内部控件MiniGrid的配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @method     _initMiniGrid
         */
        _initMiniGrid:function(){

            var me = this;
            //  format for iniVal is 'aa,bb,cc'
            var initVal    = me.options['value'];
            var textField  = me.textField();
            var valueField = me.valueField();

            var onSelectRowHandle = function( sender ){
                var selectedItems = sender.selectedItems();
                me.data( selectedItems,true );
            };

            var onSelectAllHandle = function( sender ){
                var selectedItems = sender.selectedItems();
                me.data( selectedItems,true );
            };

            var loadCompleteHandle = function( sender ){

                if( initVal ){

                    var gridData = sender.items();
                    var selectedVal = initVal.toString().split( ',' );

                    $.each( selectedVal,function( i,val ){

                        $.each( gridData,function( idx,item ){

                            if( item[valueField] == val ){
                                sender.setSelection( idx );
                            }

                        } );

                    } );

                }

            };

            var gridOpts = me.options['grid'];

            //  init grid options
            gridOpts['onSelectRow']  = onSelectRowHandle;
            gridOpts['onSelectAll']  = onSelectAllHandle;
            gridOpts['loadComplete'] = loadCompleteHandle;

            $.each(gridOpts['colModel'], function(index, model) {
                 if( !model['width'] ){
                    model['width'] = 150;
                 }
            });

            if( me.isEmpty( gridOpts['width'] ) ){
                gridOpts['width'] = 400;
            }

            if( me.isEmpty( gridOpts['height'] ) ){
                gridOpts['height'] = 120;
            }

        },

        /**
         *  创建下拉菜单
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @method     _initPanel
         */
        _initPanel : function(){
            var me     = this;
            var ctrlId = me.id();
            var $root  = me._$root;

            var $popup = $( '<div data-options="{ visible:false }" style="display:none;"><input /></div>' ).appendTo( document.body );
            //  18是表单控件外围status的icon宽度
            $popup.panel({
                id      : 'panel-' + ctrlId,
                position: 'absolute',
                width   : me.width() - 22,
                height  : me.height()
            });

            $( 'input',$popup ).minigrid( me.options['grid'] );

            me._panel   = ebaui.get( $popup );
            me._listbox = ebaui.get( $( '[data-role="minigrid"]',$popup ) );
        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @method     _initControl
         */
        _initControl : function(){
            var me = this;
            //  调用父类的_initControl方法
            me._super();
            me._$root.addClass( 'eba-combobox eba-popupedit' ).attr( 'data-role','combolist' );
            //  init minigrid config
            me._initMiniGrid();
            //  创建下拉菜单，并且进行初始化，设置数据源等
            me._initPanel();
        },

        /**
         *  下拉菜单选项的数据源，可以是远程数据源URL配置对象或者是一个javascript数组对象作为数据源
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TextBoxList
         *  @member     {Object|Array}          dataSource
         *  @property   {String}                dataSource.url          - 服务端URL
         *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
         *  @tutorial   texboxlist_local
         *  @tutorial   texboxlist_remote
         *  @example    <caption>get</caption>
         *      var src = ctrl.dataSource();
         *  @example    <caption>set</caption>
         *      //  本地数据
         *      ctrl.dataSource( [] );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : {}
         *      } );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : function(){ 
         *              // your logic
         *              return {};
         *          }
         *      } );
         */
        dataSource : function( val ){

            var me = this;
            if( !val ){ return me.options['grid']; }

            //  infact me.options['grid'] equals me._listbox.options
            var gridConf = me._listbox.options;
            if( me.isArray( val ) ){
                gridConf['data'] = val;
                gridConf['url'] = '';
            }else{
                gridConf['data'] = undefined;
                gridConf['url'] = val['url'];
                if( val['postData'] ){
                    gridConf['postData'] = val['postData'];
                }
            }

            //  reload grid data
            me._listbox.reloadGrid();

        },

        /**
         *  获取文本值
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.ComboList
         *  @member     {Array}    text
         *  @default    ''
         *  @example    <caption>get</caption>
         *      //  text == ['','']
         *      var text = ctrl.text();
         */
        text : function( val ){
            return this.options['text'];
        },
        
        /**
         *  获取或者设置表单控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @member     {Object}    value
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( [] );
         */
        value     : function( val ){

            var me = this;
            if( !val ){
                return me.options['value'];
            }

            if( !me.isArray( val ) ){
                val = [ val ];
            }

            if( val.length == 0 ){
                //  reset all data
                me._data = [];
                me.options['text'] = [];
                me.options['value'] = [];
                //  reset mini grid election
                me._listbox.resetSelection();
                //  reset text display
                me._updateText( [] );
                return;
            }

            var gridRowIds = [];
            var valueArray = [];
            var textArray  = [];
            var textField  = me.textField();
            var valueField = me.valueField();
            var gridData   = me._listbox.items();

            $.each(val, function(j, valueItem) {

                $.each(gridData, function(rowId, dataItem) {

                    /* iterate through array or object */
                    if( dataItem[valueField] == valueItem ){
                        /* by this way ,I can get values that real exist */
                        valueArray.push( dataItem[valueField] );
                        textArray.push( dataItem[textField] );

                        gridRowIds.push( rowId );
                    }

                });

            });

            //  update text property
            me.options['text'] = textArray;
            //  update control value 
            me.options['value'] = valueArray;
            //  update minigrid selection
            me._listbox.resetSelection();
            for (var i = 0; i < gridRowIds.length; i++) {
                me._listbox.setSelection( gridRowIds[i] );
            };
            //  update text display
            me._updateText( textArray );
            //  trigger onchange event
            me.options['onchange']( self,{} );
        },

        _data: null,

        /**
         *  获取或者设置选中的项
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @member     {Object}        data
         *  @default    null
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( [{ name : value },{ name : value }] );
         */
        data: function( val,doNotUpdateGrid ){

            var me = this;
            if( !val ){
                return me._data;
            }

            if( !me.isArray( val ) ){
                val = [ val ];
            }

            if( val.length == 0 ){
                //  清空数据
                me._data = [];
                me.options['text'] = [];
                me.options['value'] = [];
                //  reset mini grid election
                me._listbox.resetSelection();
                //  
                me._updateText( [] );
                return ;
            }

            //  单选
            self._data = [];
            var gridRowIds = [];
            var textArray  = [];
            var valueArray = [];
            var textField  = me.textField();
            var valueField = me.valueField();
            var gridData = me._listbox.items();

            $.each(gridData, function(rowId, dataItem) {
                 
                $.each(val, function(j, valueItem) {

                    if( dataItem[valueField] == valueItem[valueField] ){

                        textArray.push( dataItem[textField] );
                        valueArray.push( dataItem[valueField] );

                        var item = {};
                        item[textField] = dataItem[textField];
                        item[valueField] = valueItem[valueField];
                        self._data.push( item );

                        gridRowIds.push( rowId );

                    }

                });

            });
            var opts = me.options;
            //  update control's text and value
            opts['text'] = textArray;
            opts['value'] = valueArray;
            //  update minigrid selection
            if( !doNotUpdateGrid ){
                me._listbox.resetSelection();
                for (var i = 0; i < gridRowIds.length; i++) {
                    me._listbox.setSelection( gridRowIds[i] );
                };
            }
            //  update control's display
            me._updateText( textArray );
            //  trigger onchange event
            opts['onchange']( self,{} );

        },

        /**
         *  控件数据源对象的ID字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @member     {String}      idField
         *  @default    'id'
         *  @example    <caption>get</caption>
         *      var idField = ctrl.idField();
         *  @example    <caption>set</caption>
         *      ctrl.idField( '' );
         */
        idField : function( val ) {
            var me = this;
            if( me.isEmpty(val) ){
                return me.options['idField'];
            }

            me.options['idField'] = val.toString();
            //  同步更新popup的设置
            me._listbox.idField( val );
        },

        /**
         *  控件数据源对象字段中，用于作为控件文本的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @member     {String}      textField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var textField = ctrl.textField();
         *  @example    <caption>set</caption>
         *      ctrl.textField( '' );
         */
        textField : function( val ) {

            var me = this;
            if( !me.isString( val ) ){
                return me.options['textField'];
            }
            me.options['textField'] = val;
            //  同步更新popup的设置
            me._listbox.textField( val );

        },

        /**
         *  控件数据源对象字段中，用于作为控件值的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @member     {String}      valueField
         *  @default    'value'
         *  @example    <caption>get</caption>
         *      var valueField = ctrl.valueField();
         *  @example    <caption>set</caption>
         *      ctrl.valueField( '' );
         */
        valueField : function( val ) {

            var me = this;
            if( !me.isString( val ) ){
                return me.options['valueField'];
            }
            me.options['valueField'] = val;
            //  同步更新popup的设置
            me._listbox.valueField( val );

        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ComboList
         *  @member     {Object}    options
         */
        options:{
            // css position property
            position   : 'absolute',
            //  
            text : [],
            //  
            value : [],
            //  文本占位符
            placeholder: '请选择...',
            //  数据源的ID属性字段
            idField    : 'id',
            //  值字段
            textField  : 'text',
            //  值字段
            valueField : 'value',
            //  内嵌的grid的配置
            grid : {
                //  
                autowidth : true,
                //  default width
                width : 400,
                //  default height
                height : 120,
                //  
                url         : '',
                //  local data array
                data        : [],
                //  xml 
                //  xmlstring 
                //  json 
                //  jsonstring 
                //  local 
                //  javascript 
                //  function 
                //  clientSide
                datatype    : "local",
                //  使用远程数据的时候，随着url一起提交到服务器的数据
                postData    : [{}],
                //  控件数据源对象的ID字段名
                colModel    : [ 
                    {name       :'id', label : 'ID', width : 150},
                    {name       :'text', label : 'Text', width : 150} 
                ],
                //  是否允许多选
                multiselect : true,
                //  
                onSelectRow : $.noop,
                //  
                onSelectAll : $.noop,
                //
                loadComplete: $.noop
            },

            /**
             *  控件的值发生改变的时候触发
             *  @event      ebaui.web.ComboList#onchange
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop

        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Calendar，依赖moment.js库
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'Calendar',false );

    /**
     *  控件全名 e.g. ebaui.web.Calendar
     *  控件描述
     *  @class      Calendar 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   calendar_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      &lt;input data-role="calendar" data-options="{}"/&gt;
     */
    ebaui.control( 'web.Calendar',ebaui.web.FormElement, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-calendar',

        /**
         *  已经编译好的日历Week文本HTML模板
         *  ，'日', '一', '二', '三', '四', '五', '六'
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _compiledHeaderTextTmpl
         */
        _compiledHeaderTextTmpl : $.noop,

        /**
         *  已经编译好的日历Week的HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _compiledCalendarWeekTmpl
         */
        _compiledCalendarWeekTmpl : $.noop,

        /**
         *  已经编译好的日历菜单的HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _compiledCalendarMenuTmpl
         */
        _compiledCalendarMenuTmpl : $.noop,

        /**
         *  控件要用到的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {Object}    _cssClass
         */
        _cssClass : {
            disabled: 'eba-calendar-disabled',
            selected: 'eba-calendar-selected'
        },

        /**
         *  当前显示的年份
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {String}    _currYear
         */
        _currYear : new Date().getFullYear(),

        /**
         *  当前显示的月份
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {Number}    _currMonth
         */
        _currMonth : new Date().getMonth(),

        /**
         *  当前标题的格式，比如是xxxx年xx月或者是Sep 2013之类的
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {String}    _titleDisplayFormat
         */
        _titleDisplayFormat : 'MMM YYYY',

        /**
         *  通过代码设置calendar.value属性的时候，如果传入错误的日期，抛出的异常提示信息
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {String}    _formatInvalidException
         */
        _formatInvalidException : 'The date is invalid, please input a valid date!',

        /**
         *  日期文本
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {Array}    _weeks
         */
        _weeks:['S','M','T','W','T','F','S'],

        /**
         *  月份文本
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {Array}    _months
         */
        _months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        /**
         *  更新控件enabled的UI样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _updateStyleEnabled
         */
        _updateStyleEnabled:function(){

            var me = this;
            var $root = me._$root;
            var cls = me._cssClass;
            if( me.enabled() ){
                $root.removeClass( cls['disabled'] );
            }else{
                $root.addClass( cls['disabled'] );
            }

        },

        /**
         *  显示或者隐藏  年份月份选择  界面
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _toggleMenu
         */
        _toggleMenu:function(){

            var $root        = this._$root;
            var toggleKey    = '__toggled__';
            var viewSelector = '.eba-calendar-view';
            var menuSelector = '[data-role="menu"]';
            
            if( !$root.data( toggleKey ) ){
                $( viewSelector,$root ).hide();
                $( menuSelector,$root ).show();
                $root.data( toggleKey,true );
            }else{
                $( viewSelector,$root ).show();
                $( menuSelector,$root ).hide();
                $root.data( toggleKey,false );
            }

        },

        /**
         *  初始化  主视图  标题  相关事件，比如'>' '>>'等符号的点击事件
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _setupTitleEvents
         */
        _setupTitleEvents:function(){

            var self   = this;
            var $root  = self._$root;

            $root.on( 'click','.eba-calendar-title',function( event ){

                 if( self.enabled() ){
                    /*
                     *  2013年08月
                     *  当前选中的  年月  点击事件触发
                     *  切换到选择年份，月份的视图界面
                     */
                    self._toggleMenu();
                 }

            } );

            $root.on( 'click','.eba-calendar-monthNext',function( event ){

                if( self.enabled() ){
                    /*  主视图 下月份  按钮点击事件触发 */
                    ++self._currMonth;
                    self._renderTitle( self._currYear,self._currMonth );
                    self._renderWeeks( self.value(),self._currYear,self._currMonth );
                }

            } );

            $root.on( 'click','.eba-calendar-monthPrev',function( event ){

                if( self.enabled() ){
                    /* 主视图 上月份  按钮点击事件触发 */
                    --self._currMonth;
                    self._renderTitle( self._currYear,self._currMonth );
                    self._renderWeeks( self.value(),self._currYear,self._currMonth );
                }

            } );

            $root.on( 'click','.eba-calendar-yearNext',function( event ){

                if( self.enabled() ){
                    /* 
                     *  主视图 下一年  按钮点击事件触发
                     *  主视图 下月份  按钮点击事件触发 
                     */
                    ++self._currYear;
                    self._renderTitle( self._currYear,self._currMonth );
                    self._renderWeeks( self.value(),self._currYear,self._currMonth );
                }

            } );

            $root.on( 'click','.eba-calendar-yearPrev',function( event ){

                if( self.enabled() ){
                    /* 
                     *  主视图 上一年  按钮点击事件触发
                     *  主视图 下月份  按钮点击事件触发
                     */
                    --self._currYear;
                    self._renderTitle( self._currYear,self._currMonth );
                    self._renderWeeks( self.value(),self._currYear,self._currMonth );
                }

            } );

        },

        /**
         *  初始化  主视图  日期  相关事件，比如 日期的点击事件
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _setupTitleEvents
         */
        _setupWeeksEvents:function(){

            var me    = this;
            var $root = me._$root;
            $root.on( 'click','.eba-calendar-date',function( event ){

                //  日历控件上的日期点击事件触发
                if( me.enabled() ){

                    var $this = $( this ),
                        m = new moment( $this.attr( 'data-value' ),'YYYY-M-D' ),
                        inCurrentMonth = !$this.hasClass('eba-calendar-othermonth');

                    if( inCurrentMonth ){

                        var selected = m.toDate();
                        var date = me.value();
                        date.setFullYear( selected.getFullYear() );
                        date.setMonth( selected.getMonth() );
                        date.setDate( selected.getDate() );

                        var domSelector = '.' + me._cssClass['selected'];
                        $( domSelector,$root ).removeClass( me._cssClass['selected'] );
                        $this.addClass( me._cssClass['selected'] );

                        //  触发value的onchange事件
                        me.options['onchange']( me,event );
                        //  触发onclick事件
                        me.options['onclick']( me,event );
                    }

                }

            } );

        },

        /**
         *  初始化  年份月份选择  界面  相关事件
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _setupTitleEvents
         */
        _setupMenuEvents:function(){

            var me   = this;
            var $root  = this._$root;

            $root.on( 'click','.eba-calendar-menu-prevYear',function( event ){

                if( me.enabled() ){
                    var $year = $( '.eba-calendar-menu-year',$root ).first();
                    var initYear = parseInt( $year.attr( 'data-value' ) ) - 10;
                    var menuYears = me._getMenuYears( initYear );
                    
                    me._renderMenu( menuYears,me._currYear,me._currMonth );
                }

            } );

            $root.on( 'click','.eba-calendar-menu-nextYear',function( event ){

                if( me.enabled() ){

                    var $year = $( '.eba-calendar-menu-year',$root ).last();
                    var initYear = parseInt( $year.attr( 'data-value' ) ) + 1;
                    var menuYears = me._getMenuYears( initYear );

                    me._renderMenu( menuYears,me._currYear,me._currMonth );
                }

            } );

            $root.on( 'click','.eba-calendar-menu-month',function( event ){

                if( me.enabled() ){
                    //  menu界面的月份点击的时候触发
                    $( '.eba-calendar-menu-month',$root ).filter( '.eba-calendar-menu-selected' ).removeClass('eba-calendar-menu-selected');
                    $( this ).addClass('eba-calendar-menu-selected');
                }

            } );

            $root.on( 'click','.eba-calendar-menu-year',function( event ){

                if( me.enabled() ){
                    //  menu界面的月份点击的时候触发
                    $( '.eba-calendar-menu-year',$root ).filter( '.eba-calendar-menu-selected' ).removeClass('eba-calendar-menu-selected');
                    $( this ).addClass('eba-calendar-menu-selected');
                }

            } );

            $root.on( 'click','.eba-calendar-okButton',function( event ){

                if( me.enabled() ){
                    //  menu界面的月份点击的时候触发
                    var $selectedMonth = $( '.eba-calendar-menu-month',$root ).filter( '.eba-calendar-menu-selected' );
                    me._currMonth = parseInt( $selectedMonth.attr( 'data-value' ) );

                    var $selectedYear = $( '.eba-calendar-menu-year',$root ).filter( '.eba-calendar-menu-selected' );
                    me._currYear = parseInt( $selectedYear.attr( 'data-value' ) );

                    var date = me.value();
                    date.setFullYear( me._currYear );
                    date.setMonth( me._currMonth );

                    me._renderTitle( me._currYear,me._currMonth );
                    me._renderWeeks( date,me._currYear,me._currMonth );
                    me._toggleMenu();

                }

            } );

            $root.on( 'click','.eba-calendar-cancelButton',function( event ){
                
                if( me.enabled() ){
                    me._toggleMenu();
                    var menuYears = me._getMenuYears( me._currYear );
                    me._renderMenu( menuYears,me._currYear,me._currMonth );
                }

            } );

        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _setupEvents
         */
        _setupEvents : function(){
            var me = this;
            me._setupTitleEvents();
            me._setupWeeksEvents();
            me._setupMenuEvents();
        },

        /**
         *  初始化控件，声明内部变量
         *  ，在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _initControl
         */
        _initControl : function(){

            var me = this;
            //  调用父类的方法
            me._super();

            //  预编译以后要用到的HTML模板
            var weekTmpl = $.trim( $( '#ebaui-template-calendar-week' ).html() );
            me._compiledCalendarWeekTmpl = me.compileTmpl( weekTmpl );

            var headerTextTmpl = $.trim( $( '#ebaui-template-calendar-weeksheader' ).html() );
            me._compiledHeaderTextTmpl = me.compileTmpl( headerTextTmpl );

            var menuTmpl = $.trim( $( '#ebaui-template-calendar-menu' ).html() );
            me._compiledCalendarMenuTmpl = me.compileTmpl( menuTmpl );

            //  设置初始化的值
            var initVal = me.options['value'];
            var m = new moment( initVal );
            if( !m.isValid() ){
                initVal = new Date;
            }else{
                initVal = m.toDate();
            }

            me._currYear = initVal.getFullYear();
            me._currMonth = initVal.getMonth();

            me.value( initVal );

        },

        /**
         *  获取当前年份，以及之后十年的年份
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Calendar
         *  @method         _getMenuYears
         *  @param          {Number}    year
         *  @returns        {Array}     [year]
         */
        _getMenuYears:function( year ){
            year = parseInt( year );
            var max = year + 10;
            var range = [];
            for (var i = year; i < max; i++) {
                range.push( i );
            };
            return range;
        },

        /**
         *  get weeks data
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Calendar
         *  @method         _getWeeks
         *  @param          {Number}    year
         *  @param          {Number}    month   0 ~ 11
         *  @returns        {Array}     [year,month,date]
         */
        _getWeeks:function( year, month ){

            var dates = [];
            var lastDay = new Date(year, month + 1, 0).getDate();
            for(var i=1; i<=lastDay; i++) {
                dates.push([year,month,i]);
            }

            //  分组group date by week
            var weeks = [], week = [];
            while(dates.length > 0){
                var date = dates.shift();
                week.push(date);
                //  getDay() 方法可返回表示星期的某一天的数字。，返回值是 0（周日） 到 6（周六） 之间的一个整数。
                //  判断是否是星期天
                if (new Date(date[0],date[1],date[2]).getDay() == 6){
                    weeks.push(week);
                    week = [];
                }
            }

            if (week.length){
                weeks.push(week);
            }
            
            var firstWeek = weeks[0];
            if (firstWeek.length < 7){

                while(firstWeek.length < 7){
                    var firstDate = firstWeek[0];
                    var date = new Date(firstDate[0],firstDate[1],firstDate[2]-1)
                    firstWeek.unshift([date.getFullYear(), date.getMonth(), date.getDate()]);
                }

            } else {

                var firstDate = firstWeek[0];
                var week = [];
                for(var i=1; i<=7; i++){
                    var date = new Date(firstDate[0], firstDate[1], firstDate[2]-i);
                    week.unshift([date.getFullYear(), date.getMonth(), date.getDate()]);
                }
                weeks.unshift(week);

            }
            
            var lastWeek = weeks[weeks.length-1];
            while(lastWeek.length < 7){
                var lastDate = lastWeek[lastWeek.length-1];
                var date = new Date(lastDate[0], lastDate[1], lastDate[2]+1);
                lastWeek.push([date.getFullYear(), date.getMonth(), date.getDate()]);
            }

            if (weeks.length < 6){
                var lastDate = lastWeek[lastWeek.length-1];
                var week = [];
                for(var i=1; i<=7; i++){
                    var date = new Date(lastDate[0], lastDate[1], lastDate[2]+i);
                    week.push([date.getFullYear(), date.getMonth(), date.getDate()]);
                }

                weeks.push(week);
            }
            
            return weeks;

        },

        /**
         *  输出calendar标题部分，比如2013年09月
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Calendar
         *  @method         _renderTitle
         *  @param          {Number}    year
         *  @param          {Number}    month   0 ~ 11
         */
        _renderTitle : function( year,month ){

            var me = this;
            var date = new Date( year,month,1 );
            var m = new moment( date );
            var title = m.format( me._titleDisplayFormat );
            $( '.eba-calendar-title',me._$root ).text( title );

        },

        /**
         *  输出calendar日期的表头
         *  ，['日', '一', '二', '三', '四', '五', '六']
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Calendar
         *  @method         _renderWeeksHeader
         */
        _renderWeeksHeader : function(){

            var me = this;
            var html = me._compiledHeaderTextTmpl( {
                text : me._weeks
            } );

            $( '[data-role="weeksHeader"]',me._$root ).html( html );

        },

        /**
         *  输出calendar的日期
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Calendar
         *  @method         _renderWeeks
         *  @param          {Date}      date，当前选中日期
         *  @param          {Number}    year，当前年份
         *  @param          {Number}    month，当前月份
         */
        _renderWeeks : function( date,year,month ){

            var me = this;
            var $root = me._$root;
            var weeks = me._getWeeks( year,month );
            var output = me._compiledCalendarWeekTmpl({

                year : year,
                month: month,
                value: [ date.getFullYear(),date.getMonth(),date.getDate() ],
                weeks: weeks

            });

            $( '.eba-calendar-days',$root ).remove();
            $( '[data-role="footer"]',$root ).before( output );

        },

        /**
         *  输出calendar的菜单
         *  ，包含月份，年份可以选择
         *  ，['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Calendar
         *  @method         _renderMenu
         *  @param          {Array}     menuYears，当前选中年份往后推算10年的年份范围
         *  @param          {Number}    year，当前年份
         *  @param          {Number}    month，当前月份
         */
        _renderMenu : function( menuYears,year,month ){

            //  输出HTML
            var $root = this._$root;
            var today = [ year,month,1 ];

            if( !menuYears ){
                menuYears = this._getMenuYears( year );
            }

            var output = this._compiledCalendarMenuTmpl({
                value : today,
                years : menuYears,
                months: this._months
            });

            $( '[data-role="menu"]',$root ).html( output );

        },

        /**
         *  输出UI
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _render
         */
        _render : function(){

            var me = this;
            //  调用父类的方法
            me._super();
            me._renderWeeksHeader();

             //  输出HTML
            var selected  = me.value(),
                menuYears = me._getMenuYears( me._currYear );

            //  内容可变
            me._renderTitle( me._currYear,me._currMonth );
            me._renderWeeks( selected,me._currYear,me._currMonth );
            me._renderMenu( menuYears,me._currYear,me._currMonth );

        },

        /**
         *  访问和设置calendar的值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     _accessValue
         *  @example    <caption>get</caption>
         *      var pair = ctrl._accessValue();
         *  @example    <caption>set</caption>
         *      ctrl._accessValue( new Date );
         */
        _accessValue : function( val ){

            var me = this;
            if( !val ){
                return me.options['value'];
            }

            var m = new moment( val );
            if( m.isValid() ){

                var selected  = m.toDate();
                me.options['value'] = selected;

                //  update some internal variables
                me._currYear = selected.getFullYear();
                me._currMonth = selected.getMonth();

                //  update ui
                var menuYears = me._getMenuYears( me._currYear );
                me._renderTitle( me._currYear,me._currMonth );
                me._renderWeeks( selected,me._currYear,me._currMonth );
                me._renderMenu( menuYears,me._currYear,me._currMonth );

                //  trigger 'onchange' event
                me.options['onchange']( me,event );
            }else{
                throw me._formatInvalidException;
            }

        },

        /**
         *  访问和设置calendar的值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {Date}        data
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( new Date );
         */
        data: function( val ){ return this._accessValue( val ); },

        /**
         *  访问和设置calendar的值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {Date}     value
         *  @example    <caption>get</caption>
         *      var pair = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( new Date );
         */
        value : function( val ){ return this._accessValue( val ); },

        /**
         *  重置控件，清空验证状态，控件值，恢复到控件原始状态
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @method     reset
         */
        reset     : function(){
            var me              = this;
            me.errors           = {};
            me.options['value'] = new Date;
            me._isValid         = true;
            me._render();
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  default width
            width : 220,
            //  default height
            height : 169,
            //  日历控件的值
            value : new Date,
            /**
             *  点击日历控件上的日期时触发
             *  @event  ebaui.web.Calendar#onclick
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onclick : $.noop,
            /**
             *  控件的值发生改变的时候触发
             *  @event      ebaui.web.Calendar#onchange
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop
        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Calendar，依赖[Moment.js](http://momentjs.com/)库
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'TimeSpinner',true );

    /**
     *  控件全名 e.g. ebaui.web.TimeSpinner
     *  控件描述
     *  @class      TimeSpinner 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   timespinner_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example    
     *      &lt;input data-role="timespinner" id="" name="" value="" data-options="{}"/&gt;
     */
    ebaui.control( 'web.TimeSpinner',ebaui.web.FormElement, {

        /**
         *  当期获得焦点的INPUT控件index
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Number}    _currInput
         */
        _currInput : 0,

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-timespinner',

        /**
         *  控件要用到的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Object}    _cssClass
         */
        _cssClass : {
            disabled: 'eba-disabled',
            focused : 'eba-buttonedit-focus',
            readonly: 'eba-readonly'
        },

        /**
         *  各个不同时间单位的最大值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Object}    _max
         */
        _max : {
            'hour'  : 23,
            'minute': 59,
            'second': 59
        },

        /**
         *  各个不同时间单位的最小值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Object}    _min
         */
        _min : {
            'hour'  : 0,
            'minute': 0,
            'second': 0
        },

        /**
         *  获取焦点
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _focus
         */
        _focus : function(){
            var me = this;
            $( 'input',me._$root ).eq( me._currInput ).focus();
        },

        /**
         *  失去焦点
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _blur
         */
        _blur : function(){
            var me = this;
            $( 'input',me._$root ).eq( me._currInput ).blur();
        },

        /**
         *  更新UI的宽度
         *  @private
         *  @instance
         *  @tutorial   timespinner_width
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _updateStyleWidth
         */
        _updateStyleWidth : function(){
            var me = this;
            me._$root.width( me.width() );
            me._updateUiInput();
        },

        /**
         *  设置或者移除据聚焦样式或者失焦样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _updateStyleFocused
         */
        _updateStyleFocused:function() {

            var me    = this;
            var $root = me._$root;
            var cls   = me._cssClass;
            if( me.focused() ){
                $root.addClass( cls['focused'] );
            }else{
                $root.removeClass( cls['focused'] );
            }

        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _updateStyleEnabled
         */
        _updateStyleEnabled:function() {

            var me    = this;
            var $root = me._$root;
            var cls   = me._cssClass;
            if( me.enabled() ){
                $( 'input',$root ).attr('disabled',null);
                $root.removeClass( cls['disabled'] );
            }else{
                $( 'input',$root ).attr('disabled','disabled');
                $root.removeClass( cls['focused'] )
                     .addClass( cls['disabled'] );
            }

        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _updateStyleEnabled
         */
        _updateStyleReadonly:function() {

            var me    = this;
            var $root = me._$root;
            var cls   = me._cssClass;
            if( me.readonly() ){
                $root.addClass( cls['readonly'] );
                $( '.eba-buttonedit-buttons',$root ).hide();
                $( 'input',$root ).attr('readonly','readonly');
            }else{
                $root.removeClass( cls['readonly'] );
                $( 'input',$root ).attr('readonly',null);
                $( '.eba-buttonedit-buttons',$root ).show();
            }

        },

        /**
         *  更新在不同的timeFormat格式下，UI界面显示要有所不同
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _updateStyleEnabled
         */
        _updateUiInput:function(){

            var me         = this;
            var $root      = me._$root;
            var format     = me.timeFormat();
            var vv         = format.split( ':' );
            var totalWidth = $root.width() - $( '.eba-buttonedit-button',$root ).width();
            var width      = totalWidth;

            var hourSelector = '[data-pos="hour"]';
            var minuSelector = '[data-pos="minute"]';
            var secoSelector = '[data-pos="second"]';
            //  calculate width
            switch( vv.length ){
                case 1 : 
                    $( hourSelector,$root ).width( width );
                    $( minuSelector,$root ).parent().hide();
                    $( secoSelector,$root ).parent().hide();
                    break;
                case 2 : 
                    width = totalWidth * 0.4;
                    $( hourSelector,$root ).width( width );
                    $( minuSelector,$root ).width( width );
                    $( secoSelector,$root ).parent().hide();
                    break;
                case 3 : 
                    width = totalWidth * 0.3;
                    $( hourSelector,$root ).width( width );
                    $( minuSelector,$root ).width( width );
                    $( secoSelector,$root ).width( width );
                    break;
            }

        },

        /**
         *  更新UI显示
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _render
         */
        _render : function(){

            var me    = this;
            var value = me.value();
            if( value ){
                var vv = value.split( ':' );
                var $inputs = $( 'input',me._$root );
                for (var i = 0,l = $inputs.size(); i < l; i++) {
                    $inputs.eq( i ).val( vv[i] );
                };
            }

            me._super();
        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self    = this,
                $root   = self._$root,
                $input  = self._$formInput;

            var max = self._max;
            var min = self._min;

            var updateTime = function( increase,event ){

                var $focusedInput = $( 'input',$root ).eq( self._currInput ),
                    pos = $focusedInput.attr( 'data-pos' ),
                    step = self[pos + 'Step'](),
                    value = parseInt( $focusedInput.val() );

                var circular = self.circular();

                if( increase && !circular ){
                    value = ( value + step <  max[pos] ) ? ( value  + step ) : max[pos];
                }else if( !increase && !circular ){
                    value = ( value - step >  min[pos] ) ? ( value - step ) : min[pos];
                }

                //  递增或者递减支持循环
                if( increase && circular ){
                    value = ( value + step <  max[pos] ) ? ( value  + step ) : ( value + step - max[pos] );
                }else if( !increase && circular ){
                    value = ( value - step >  min[pos] ) ? ( value - step ) : ( max[pos] - Math.abs( value - step - min[pos] ) );
                }

                $focusedInput.val( value );
                self.options['onchange']( self,event );

            };

            $root.on( 'keydown','input',function( event ){

                var keycodeValid = event.which == ebaui.keycodes.down_arrow
                                || event.which == ebaui.keycodes.up_arrow
                                || event.which == ebaui.keycodes.enter
                                || event.which == ebaui.keycodes.backspace
                                || event.which == ebaui.keycodes.tab
                                || ebaui.keycodes.isNumber( event.which );

                return keycodeValid;

            } );

            $root.on( 'keyup','input',function( event ){

                var $target = $( this );
                var $inputs = $( 'input',this._$root );
                var isEnter = event.which == ebaui.keycodes.enter;
                var index   = $inputs.index( $target );
                var len     = self.timeFormat().split(':').length;
                var canGoToNext = len > 1 && ( index < len -1 );

                if( isEnter && canGoToNext ){

                    $inputs.eq( index + 1 ).focus();

                }else if( !isEnter && canGoToNext ){

                    //  如果这个input已经填满两位数，那么直接跳转到下一个input
                    var inputVal = $target.val().toString();
                    if( inputVal.length  == 2 ){
                        $inputs.eq( index + 1 ).focus();
                    }else if( inputVal.length > 2 ){
                        inputVal = inputVal.substr( 0,2 );
                        $target.val( inputVal );
                        $inputs.eq( index + 1 ).focus();
                    }

                }else{

                    //  当前已经是最后一个input的时候，如果输入超过两位数，那么直接截断
                    var inputVal = $target.val().toString();
                    if( inputVal.length > 2 ){
                        inputVal = inputVal.substr( 0,2 );
                        $target.val( inputVal );
                    }

                }

            } );

            $root.on( 'focus','input',function( event ){

                var idx = parseInt( $( this ).data( 'idx' ) );
                self._currInput = idx;
                self._setOption( 'focused',true );
                self._updateStyleFocused();
            } );

            $root.on( 'blur','input',function( event ){
                self._setOption( 'focused',false );
                self._updateStyleFocused();
            } );

            $root.on( 'click','.eba-buttonedit-up',function( event ){
                updateTime( true,event );
                self.options['onspinup']( self,event );
            } );

            $root.on( 'click','.eba-buttonedit-down',function( event ){
                updateTime( false,event );
                self.options['onspindown']( self,event );
            } );

        },

        /**
         *  使用moment.js库，对时间进行格式化
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _padding
         *  @param      {String}    time
         *  @param      {String}    time
         */
        _padding : function ( time,format ) {

            var now = new Date;
            format  =  format ? format : 'HH:mm:ss';

            if( time ){

                time        = time.toString();
                var vv      = time.split( ':' );
                var hours   = parseInt( vv[0] ? vv[0] : 0 );
                var minutes = parseInt( vv[1] ? vv[1] : 0 );
                var seconds = parseInt( vv[2] ? vv[2] : 0 );

                now.setHours( vv[0] );
                now.setMinutes( vv[1] );
                now.setSeconds( vv[2] );

            }else{
                time = now;
            }

            var formatter = new moment( time,format );
            if( formatter.isValid() ){
                return formatter.format( format );
            }
            
            formatter = new moment();
            return formatter.format( format );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _initControl
         */
        _initControl : function(){
            var me = this;
            me._$border    = $('.eba-buttonedit-border',me._$root);
            /* validators */
            me._initValidators();
            /* init value */
            var formatedVal = me._padding( me.value(),me.timeFormat() );
            me.options['value'] = formatedVal;
        },

        /**
         *  控件是否可以获取焦点
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Boolean}   focusable
         *  @example    <caption>get</caption>
         *      //  false
         *      console.log( ctrl.focusable() );
         */
        focusable:function() { return true; },

        /**
         *  时间格式化字符串,HH:mm或者HH:mm:ss
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @default    'HH:mm'
         *  @member     {String}        timeFormat
         *  @example    <caption>get</caption>
         *      var format = ctrl.timeFormat();
         *  @example    <caption>set</caption>
         *      ctrl.timeFormat( 'HH:mm:ss' );
         */
        timeFormat : function( val ){
            var me = this;
            if( !val ){
                return me.options['timeFormat'];
            }
            me.options['timeFormat'] = val.toString();
            me._updateUiInput();
        },

        /**
         *  获取或者设置timeSpinner值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {String}        _accessValue
         *  @example    <caption>get</caption>
         *      var value = ctrl._accessValue();
         *  @example    <caption>set</caption>
         *      ctrl._accessValue( '19:20' );
         */
        _accessValue : function( val ){

            var me = this;
            if( !val ){
                return me.options['value'];
            }

            var formatedVal = me._padding( val,me.timeFormat() );
            //  update value
            me.options['value'] = formatedVal;
            //  update ui
            var value  = me.value();
            if( value ){
                var vv = value.split( ':' );
                var $inputs = $( 'input',me._$root );
                for (var i = 0,l = $inputs.size(); i < l; i++) {
                    $inputs.eq( i ).val( vv[i] );
                };
            }
            //  trigger 'onchange' event
            me.options['onchange']( me,{} );
        },

        /**
         *  获取或者设置timeSpinner值,同value属性一致
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {String}        data
         *  @example    <caption>get</caption>
         *      var data = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( '19:20' );
         */
        data: function( val ){ return this._accessValue( val ); },

        /**
         *  获取或者设置timeSpinner值,同value属性一致
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {String}    text
         *  @default    ''
         *  @example    <caption>get</caption>
         *      var text = ctrl.text();
         *  @example    <caption>set</caption>
         *      ctrl.text( '19:20' );
         */
        text : function( val ){ return this._accessValue( val ); },

        /**
         *  获取或者设置timeSpinner值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {String}     value
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( '19:20' );
         */
        value : function( val ){ return this._accessValue( val ); },

        /**
         *  获取或者设置是否允许循环调整时间
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Boolean}     circular
         *  @default    false   
         *  @tutorial   timespinner_circular
         *  @example    <caption>get</caption>
         *      var value = ctrl.circular();
         *  @example    <caption>set</caption>
         *      ctrl.circular( true );
         */
        circular : function( val ){
            var me = this;
            if( !me.isBoolean( val ) ){ return me.options['circular']; }
            me.options['circular'] = val;
        },

        /**
         *  获取或者设置微调步进
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @method     _accessStep
         *
         *  @example    <caption>get</caption>
         *      var value = ctrl._accessStep();
         *  @example    <caption>set</caption>
         *      ctrl._accessStep( true );
         */
        _accessStep : function( val,which ){
            var me = this;
            if( !me.isNumber( val ) ){
                return me.options[which];
            }
            me.options[which] = val;
        },

        /**
         *  获取或者设置小时微调步进
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Number}     hourStep
         *  @default    1
         *  @tutorial   timespinner_steps
         *  @example    <caption>get</caption>
         *      var value = ctrl.hourStep();
         *  @example    <caption>set</caption>
         *      ctrl.hourStep( 2 );
         */
        hourStep : function( val ){ 
            return this._accessStep( val,'hourStep' ); 
        },

        /**
         *  获取或者设置分钟微调步进
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Number}     minuteStep
         *  @default    10
         *  @tutorial   timespinner_steps
         *  @example    <caption>get</caption>
         *      var value = ctrl.minuteStep();
         *  @example    <caption>set</caption>
         *      ctrl.minuteStep( 20 );
         */
        minuteStep : function( val ){ 
            return this._accessStep( val,'minuteStep' ); 
        },

        /**
         *  获取或者设置秒微调步进
         *  @public
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Number}     secondStep
         *  @default    10
         *  @tutorial   timespinner_steps
         *  @example    <caption>get</caption>
         *      var value = ctrl.secondStep();
         *  @example    <caption>set</caption>
         *      ctrl.secondStep( 20 );
         */
        secondStep : function( val ){ 
            return this._accessStep( val,'secondStep' ); 
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.TimeSpinner
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  default width
            width : 150,
            //  default height
            height : 21,
            //  default timeSpinner value is now
            value : '',
            //  是否允许循环调整时间
            circular : false,
            //  小时微调步进
            hourStep : 1,
            //  分钟微调步进
            minuteStep  : 10,
            //  秒微调步进
            secondStep : 10,
            //  时间格式化字符串HH:mm或者HH:mm:ss
            timeFormat : 'HH:mm',
            /**
             *  增加数值的时候触发
             *  @tutorial   timespinner_events
             *  @event  ebaui.web.TimeSpinner#onspinup
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onspinup : $.noop,
            /**
             *  减少数值的时候触发
             *  @tutorial   timespinner_events
             *  @event  ebaui.web.TimeSpinner#onspindown
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onspindown : $.noop,
            /**
             *  控件的值发生改变的时候触发
             *  @tutorial   timespinner_events
             *  @event      ebaui.web.TimeSpinner#onchange
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop
        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.DateTimePicker，依赖[Moment.js](http://momentjs.com/)库
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'DateTimePicker',true );

    /** 
     *  ebaui.web.DateTimePicker
     *  @class      DateTimePicker 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.Combo
     *  @tutorial   datetimepicker_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example    
     *      &lt;input value="2013-10-08 16:07" data-role="datetimepicker" data-options="{}"/&gt;
     */
    ebaui.control( 'web.DateTimePicker',ebaui.web.Combo, {

        /**
         *  DateTimePicker复合控件内的Calendar控件
         *  @private
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {ebaui.web.Calendar}    _calendar
         */
        _calendar : undefined,

        /**
         *  DateTimePicker复合控件内的TimeSpinner控件
         *  @private
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {ebaui.web.TimeSpinner}    _timeSpinner
         */
        _timeSpinner : undefined,

        /**
         *  calendar主视图要显示的按钮，对象格式
         *  {
         *      'text'   : '',
         *      'visible': false,
         *      'onclick': function( sender,event ){  }
         *  }
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Calendar
         *  @member     {Object}    _buttons
         */
        _buttons:{

            'today' : {
                'text'   : 'today',
                'visible': true,
                'onclick': function( sender,event ){

                        event.stopPropagation();

                        var date = new Date;
                        var showSpinner = sender.showTimeSpinner();
                        if( showSpinner ){
                            /*
                             *  sender is an instance of DateTimePicker
                             *  time is a string in the format : 'xx:xx';
                             *  如果当期控件有显示timeSpinner，当前时间应该更新成timeSpinner的值
                             *  var time = sender._timeSpinner.value().split( ':' );
                             */
                            var time = showSpinner ? sender._timeSpinner.value() : '00:00:00';
                            time.split( ':' );
                            if( time.length > 0 ){
                                date.setHours(time[0]);
                                date.setMinutes(time[1]);
                            }
                            
                            if( time.length == 3 ){
                                date.setSeconds(time[2]);
                            }

                        }

                        /*
                         *  更新DateTimePicker的控件值，以及其显示
                         */
                        sender.value( date );
                        sender._panel.close();
                    }
            },

            'ok':{
                'text'   : 'ok',
                'visible': true,
                'onclick': function( sender,event ){

                    event.stopPropagation();

                    /*
                     *  sender is an instance of DateTimePicker
                     */
                    var pickedDate = sender._calendar.value(),
                        date = new moment( pickedDate );

                    var time = sender.showTimeSpinner() ? sender._timeSpinner.value() : '00:00:00';
                    var dateTimeString = date.format( 'YYYY-MM-DD' ) + ' ' + time;

                    /*
                     *  更新DateTimePicker的控件值，以及其显示
                     */
                    sender.value( dateTimeString );
                    sender._panel.close();
                }
            },

            'clear':{
                'text'   : 'clear',
                'visible': false,
                'onclick': function( sender,event ){

                    event.stopPropagation();

                    var opts = sender.options;
                    /*
                     *  sender is an instance of DateTimePicker
                     *  is setting opts['value'] = null right ?
                     */
                    opts['value'] = null;
                    /*
                     *  once the control's value changed, then trigger the 'onchange' event
                     */
                    opts['onchange']( sender,event );
                    /*
                     *  clean ui display
                     */
                    sender._$formInput.val('');
                    sender._panel.close();
                }
            }

        },

        /**
         *  创建下拉菜单
         *  @private
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @method     _initPanel
         */
        _initPanel : function(){
            var me     = this;
            var ctrlId = me.id();
            var $root  = me._$root;

            var $popup = $( '<div data-options="{ visible:false }" style="display:none;"><input /></div>' ).appendTo( document.body );

            $popup.panel({
                id      : 'panel-' + ctrlId,
                position: 'absolute'
            });

            $( 'input',$popup ).calendar({
                'width'   : 260,
                'height'  : 0,
                'position': ''
            });

            /*
             *  判断是否显示加载并且显示底部的timeSpinner
             */
            var showSpinner = me.showTimeSpinner();
            if( showSpinner ){
                $( '[data-role="calendar-timespinner"]',$popup ).timespinner({
                    'width'   : 120,
                    'height'  : 0,
                    'position': ''
                });
                me._timeSpinner =  ebaui.get( $( '[data-role="timespinner"]',$popup ) );
            }

            /*
             *  判断是否显示加载并且显示底部的buttons
             */
            var visibleBtns = 0;
            var keys        = [ 'today','ok','clear' ];
            var buttons     = me._buttons;
            for (var i = 0,l = keys.length; i < l; i++) {
                var btn = buttons[keys[i]];
                if( btn['visible'] ){
                    ++visibleBtns;
                }
            }

            if( showSpinner || visibleBtns > 0 ){
                $( 'tr[data-role="footer"]',$popup ).show();
            }

            me._panel    = ebaui.get( $popup );
            me._calendar = ebaui.get( $( '[data-role="calendar"]',$popup ) );
        },

        /**
         *  输出calendar底部的buttons
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Calendar
         *  @method         _renderButtons
         *  @param          {Boolean}    needSplitter
         */
        _renderButtons : function( needSplitter ){

            var self    = this;
            var buttons = self._buttons;
            var $root   = self._panel.uiElement();

            var html = ['<input class="today" style="display:none;"/>',
                        '<span class="eba-calendar-footerSpace"></span>',
                        '<input class="ok" style="display:none;"/>',
                        '<span class="eba-calendar-footerSpace"></span>',
                        '<input class="clear" style="display:none;"/>'].join('');

            $( '[data-role="buttonGroup"]',$root ).html( html );

            var keys = [ 'today','ok','clear' ];
            for (var i = 0,l = keys.length; i < l; i++) {

                var key = keys[i];
                var btn = buttons[key];
                var selector = '[data-role="buttonGroup"] .' + key;

                var handle = ( function( button ){

                    return function( sender,eventArgs ){
                        button['onclick']( self,eventArgs );
                    };

                } )( btn );

                $( selector,$root ).button({
                    width  : 30,
                    text   : btn["text"],
                    visible: btn['visible'],
                    onclick: handle
                });

            };

        },

        /**
         *  更新控件enabled的UI样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     _updateStyleEnabled
         */
        _updateStyleEnabled:function(){

            var me = this;
            var en = me.enabled();
            me._calendar.enabled( en );
            if( me.showTimeSpinner() ){
                me._timeSpinner.enabled( en );
            }
            if( !en ){
                me._panel.close();
            }

            me._super();

        },

        /**
         *  更新UI的DateTime显示，显示的是格式化后的日期字符串
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     _updateUIDateTime
         */
        _updateUIDateTime:function( datetime ){

            //  render the formatted datetime string
            var me = this;
            var m = new moment( datetime );
            if( datetime && m.isValid() ){
                var str = m.format( me.dateTimeFormat() );
                me._$formInput.val( str );
            }

        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.ButtonEdit
         *  @method     _render
         */
        _render : function(){
            var me = this;
            //  call base._render()
            me._super();
            //  render the buttons
            me._renderButtons( !me.showTimeSpinner() );
            //  render the formatted datetime string
            me._updateUIDateTime( me.value() );
        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @method     _initControl
         */
        _initControl : function(){

            //  调用父类的方法
            var me = this;
            me._super();

            //  父类声明以下属性
            //  me._$root
            //  me._$formInput
            me._$root.addClass( 'eba-datepicker eba-popupedit' );

            //  create popup and subcontrols
            me._initPanel();

            //  init datetimepicker's value
            var initVal = me.value();
            var m = new moment( initVal );
            if( initVal && m.isValid() ){

                var date = m.toDate();
                me.options['value'] = date;
                //  init subcontrols' value
                me._calendar.value( date );
                if( showTimeSpinner ){
                    me._timeSpinner.value( m.format( 'HH:mm' ) );
                }

            }

            //   init buttons' visiblity
            var btns = me._buttons;
            btns['today'].visible = me.showTodayButton();
            btns['ok'].visible    = me.showOkeyButton();
            btns['clear'].visible = me.showClearButton();
            
        },

        /**
         *  通过代码设置calendar.value属性的时候，如果传入错误的日期，抛出的异常提示信息
         *  @private
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {String}    _formatInvalidException
         */
        _formatInvalidException : 'The date is invalid, please input a valid date!',

        /**
         *  访问和设置DateTimePicker的值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @method     _accessValue
         *  @example    <caption>get</caption>
         *      var pair = ctrl._accessValue();
         *  @example    <caption>set</caption>
         *      ctrl._accessValue( new Date );
         */
        _accessValue : function( val ){

            var me = this;
            if( me.isNull( val ) ){ return me.options['value']; }

            var m = new moment( val );
            if( m.isValid() ){
                var opts     =  me.options;
                var datetime = m.toDate();
                //  update ui display
                me._updateUIDateTime( datetime );
                //  update control's value
                opts['value'] =  datetime;
                //  trigger the 'onchange' event
                opts['onchange']( me,event );
            }else{
                throw me._formatInvalidException;
            }

        },

        /**
         *  访问和设置DateTimePicker的值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {Date}        data
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( new Date );
         */
        data: function( val ){ return this._accessValue( val ); },

        /**
         *  访问和设置DateTimePicker的值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {Date}     value
         *  @example    <caption>get</caption>
         *      var pair = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( new Date );
         */
        value : function( val ){ return this._accessValue( val ); },

        /**
         *  重置控件，清空验证状态，控件值，恢复到控件原始状态
         *  @public
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @method     reset
         */
        reset     : function(){
            
            var me = this;
            me.errors   = {};
            me._isValid = true;
            
            var now      = new Date;
            var spinner  = me._timeSpinner;
            var calendar = me._calendar;
            var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

            me.options['value'] = now;

            calendar.reset();
            spinner.reset();

            calendar.value( now );
            spinner.value( time );

        },

        /**
         *  显示“Today”按钮
         *  @public
         *  @instance
         *  @default    true
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {Boolean}     showTodayButton
         *  @example    <caption>get</caption>
         *      var value = ctrl.showTodayButton();
         *  @example    <caption>set</caption>
         *      ctrl.showTodayButton( false );
         */
        showTodayButton : function( val ){

            var me   = this;
            var opts =  me.options;
            if( !me.isBoolean( val ) ){
                return opts['showTodayButton'];
            }

            opts['showTodayButton'] = val;

        },

        /**
         *  显示清空按钮
         *  @public
         *  @instance
         *  @default    false
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {Boolean}     showClearButton
         *  @example    <caption>get</caption>
         *      var value = ctrl.showClearButton();
         *  @example    <caption>set</caption>
         *      ctrl.showClearButton( true );
         */
        showClearButton : function( val ){

            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['showClearButton'];
            }

            me.options['showClearButton'] = val;

        },

        /**
         *  显示OKey按钮
         *  @public
         *  @instance
         *  @default    true
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {Boolean}     showOkeyButton
         *  @example    <caption>get</caption>
         *      var value = ctrl.showOkeyButton();
         *  @example    <caption>set</caption>
         *      ctrl.showOkeyButton( false );
         */
        showOkeyButton : function( val ){

            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['showOkeyButton'];
            }

            me.options['showOkeyButton'] = val;

        },

        /**
         *  显示TimeSpinner控件
         *  @public
         *  @instance
         *  @default    false
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {Boolean}     showTimeSpinner
         *  @example    <caption>get</caption>
         *      var pair = ctrl.value();
         */
        showTimeSpinner:function( val ){
            
            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['showTimeSpinner'];
            }

            me.options['showTimeSpinner'] = val;

        },

        /**
         *  日期时间格式化字符串
         *  @public
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @default    'YYYY-MM-DD HH:mm'
         *  @member     {String}        dateTimeFormat
         *  @example    <caption>get</caption>
         *      var format = ctrl.dateTimeFormat();
         *  @example    <caption>set</caption>
         *      ctrl.dateTimeFormat( 'HH:mm' );
         */
        dateTimeFormat : function( val ){

            var me = this;
            if( !val ){
                return me.options['dateTimeFormat'];
            }

            me.options['dateTimeFormat'] = val.toString();

        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.DateTimePicker
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //
            value : undefined,
            //  日期时间格式化字符串
            dateTimeFormat : 'YYYY-MM-DD HH:mm',
            //  显示TimeSpinner控件
            showTimeSpinner:false,
            //  显示清空按钮
            showClearButton:false,
            //  显示“Today”按钮
            showTodayButton:true,
            //  显示OKey按钮
            showOkeyButton:true
        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Calendar，依赖[Moment.js](http://momentjs.com/)库
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'Spinner',true );

    /**
     *  控件全名 e.g. ebaui.web.Spinner
     *  控件描述
     *  @class      Spinner 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   spinner_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example    
     *      &lt;input data-role="spinner" id="" name="" value="" data-options="{}"/&gt;
     */
    ebaui.control( 'web.Spinner',ebaui.web.FormElement, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-spinner',

        /**
         *  控件要用到的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {Object}    _cssClass
         */
        _cssClass : {
            disabled: 'eba-disabled',
            focused : 'eba-buttonedit-focus',
            readonly: 'eba-readonly'
        },

        /**
         *  获取焦点
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _focus
         */
        _focus : function(){
            var me = this;
            $( 'input',me._$root ).eq( me._currInput ).focus();
        },

        /**
         *  失去焦点
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _blur
         */
        _blur : function(){
            var me = this;
            $( 'input',me._$root ).eq( me._currInput ).blur();
        },

        /**
         *  设置或者移除据聚焦样式或者失焦样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _updateStyleFocused
         */
        _updateStyleFocused:function() {
            var me = this;
            if( me.focused() ){
                me._$root.addClass( me._cssClass['focused'] );
            }else{
                me._$root.removeClass( me._cssClass['focused'] );
            }

        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _updateStyleEnabled
         */
        _updateStyleEnabled:function() {
            var me = this;
            var $root     = me._$root;
            if( me.enabled() ){
                $( 'input',$root ).attr('disabled',null);
                $root.removeClass( me._cssClass['disabled'] );
            }else{
                $( 'input',$root ).attr('disabled','disabled');
                $root.removeClass( me._cssClass['focused'] )
                     .addClass( me._cssClass['disabled'] );
            }

        },

        /**
         *  
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _updateStyleEnabled
         */
        _updateStyleReadonly:function() {
            var me = this;
            var $root = me._$root;
            if( me.readonly() ){
                $root.addClass( me._cssClass['readonly'] );
                $( '.eba-buttonedit-buttons',$root ).hide();
                $( 'input',$root ).attr('readonly','readonly');
            }else{
                $root.removeClass( me._cssClass['readonly'] );
                $( 'input',$root ).attr('readonly',null);
                $( '.eba-buttonedit-buttons',$root ).show();
            }

        },

        /**
         *  
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _fixNumber
         */
        _fixNumber:function( ctrlVal ){
            var me = this;
            if( me.isNull( ctrlVal ) ){ ctrlVal = me.value(); }
            var decimalPlaces = me.decimalPlaces();
            var fixedNumberStr = decimalPlaces < 0 ? ctrlVal.toString() :  ctrlVal.toFixed( decimalPlaces );
            return fixedNumberStr;
        },

        /**
         *  更新UI显示
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _render
         */
        _render : function(){
            var me = this;
            me._$formInput.val( me._fixNumber() );
            me._super();
        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self    = this,
                $root   = self._$root,
                $input  = self._$formInput;

            $root.on( 'keyup','input',function( event ){

                if( event.which == ebaui.keycodes.up_arrow ){
                    //  increase
                    self.stepUp();
                }else if( event.which == ebaui.keycodes.down_arrow ){
                    //  decrease
                    self.stepDown();
                }

            } );

            $root.on( 'change','input',function( event ){
                var val = $input.val();
                self.value( val );
            } );

            $root.on( 'focus','input',function( event ){
                self._setOption( 'focused',true );
                self._updateStyleFocused();
            } );

            $root.on( 'blur','input',function( event ){
                self._setOption( 'focused',false );
                self._updateStyleFocused();
            } );

            $root.on( 'click','.eba-buttonedit-up',function( event ){
                self.stepUp();
                self.options['onspinup']( self,event );
            } );

            $root.on( 'click','.eba-buttonedit-down',function( event ){
                self.stepDown();
                self.options['onspindown']( self,event );
            } );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     _initControl
         */
        _initControl : function(){

            var me = this;
            me._$formInput = $( 'input',me._$root );
            me._$border    = $('.eba-buttonedit-border',me._$root);
            
            //  validators
            me._initValidators();

            //  check init value
            //  if init value is invalid then set it to 0
            var initVal = me.options['value'];
            if( !me.isNumber( initVal ) ){
                initVal = 0;
            }

            var fixed = me._fixNumber( initVal );
            me.options['value'] = parseFloat( fixed );
        },

        /**
         *  控件是否可以获取焦点
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.Spinner
         *  @member     {Boolean}   focusable
         *  @example    <caption>get</caption>
         *      //  false
         *      console.log( ctrl.focusable() );
         */
        focusable:function() { return true; },

        /**
         *  获取或者设置spinner值
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {String}        _accessValue
         *  @example    <caption>get</caption>
         *      var value = ctrl._accessValue();
         *  @example    <caption>set</caption>
         *      ctrl._accessValue( '19:20' );
         */
        _accessValue : function( val ){

            var me = this;
            if( me.isNull( val ) ){
                return me.options['value'];
            }

            val = parseFloat( val );
            if( isNaN( val ) ){ val = 0; }

            var me = this;
            var max = me.max();
            var min = me.min();

            if( val < min ){ val = min; }
            if( val > max ){ val = max; }

            var fixedNumberStr = me._fixNumber( val );
            //  格式化数据
            val = parseFloat( fixedNumberStr );
            //  update value 
            me.options['value'] = val;
            //  display value
            me._$formInput.val( fixedNumberStr );
            //  trigger 'onchange' event
            me.options['onchange']( me,{} );
        },

        /**
         *  获取或者设置spinner值,同value属性一致
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {String}        data
         *  @example    <caption>get</caption>
         *      var data = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( '19:20' );
         */
        data: function( val ){ return this._accessValue( val ); },

        /**
         *  获取或者设置spinner值,同value属性一致
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {String}    text
         *  @default    ''
         *  @example    <caption>get</caption>
         *      var text = ctrl.text();
         *  @example    <caption>set</caption>
         *      ctrl.text( '19:20' );
         */
        text : function( val ){ return this._accessValue( val ); },

        /**
         *  获取或者设置spinner值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {String}     value
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( '19:20' );
         */
        value : function( val ){ return this._accessValue( val ); },

        /**
         *  获取或者设置秒微调步进
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {Number}     step
         *  @default    1
         *  @tutorial   timespinner_steps
         *  @example    <caption>get</caption>
         *      var value = ctrl.step();
         *  @example    <caption>set</caption>
         *      ctrl.step( 20 );
         */
        step:function( val ){ 

            var me = this;
            if( !me.isNumber( val ) ){
                return me.options['step'];
            }

            me.options['step'] = val;

        },

        /**
         *  
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     stepUp
         *  @example    
         *      ctrl.stepUp();
         */
        stepUp:function(){

            var step      = this.step();
            var max       = this.max();
            var currValue = this.value();
            currValue = ( ( currValue + step ) > max ) ? max : ( currValue + step );
            this.value( currValue );

        },

        /**
         *  
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @method     stepDown
         *  @example    
         *      ctrl.stepDown();
         */
        stepDown:function(){

            var me        = this;
            var step      = me.step();
            var min       = me.min();
            var currValue = me.value();
            currValue = ( ( currValue - step ) < min ) ? min : ( currValue - step );
            me.value( currValue );

        },

        /**
         *  获取或者设置秒微调步进
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {Number}     min
         *  @default    0
         *  @tutorial   timespinner_steps
         *  @example    <caption>get</caption>
         *      var value = ctrl.min();
         *  @example    <caption>set</caption>
         *      ctrl.min( 20 );
         */
        min:function( val ){ 

            var me = this;
            if( !me.isNumber( val ) ){
                return me.options['min'];
            }

            me.options['min'] = val;

        },

        /**
         *  获取或者设置秒微调步进
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {Number}     max
         *  @default    100
         *  @tutorial   timespinner_steps
         *  @example    <caption>get</caption>
         *      var value = ctrl.max();
         *  @example    <caption>set</caption>
         *      ctrl.max( 20 );
         */
        max:function( val ){ 

            var me = this;
            if( !me.isNumber( val ) ){
                return me.options['max'];
            }

            me.options['max'] = val;

        },

        /**
         *  保留的小数点位数。默认值是-1，表示不作任何限制
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {Number}     decimalPlaces
         *  @default    0
         *  @example    <caption>get</caption>
         *      var decimalPlaces = ctrl.decimalPlaces();
         *  @example    <caption>set</caption>
         *      ctrl.decimalPlaces( 20 );
         */
        decimalPlaces : function( val ){
            var me = this;
            if( !me.isNumber( val ) ){ 
                return me.options['decimalPlaces']; 
            }
            me.options['decimalPlaces'] = val;
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Spinner
         *  @member     {Object}    options
         */
        options : {

            //  保留的小数点位数。默认值是-1，表示不作任何限制
            decimalPlaces:-1,
            //  default width
            width : 150,
            //  default height
            height : 21,
            //  default timeSpinner value is now
            value : 0,
            //  微调步进
            step : 1,
            //  min value 
            min : 0,
            //  max value 
            max : 100,
            /**
             *  增加数值的时候触发
             *  @tutorial   timespinner_events
             *  @event  ebaui.web.Spinner#onspinup
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onspinup : $.noop,
            /**
             *  减少数值的时候触发
             *  @tutorial   timespinner_events
             *  @event  ebaui.web.Spinner#onspindown
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onspindown : $.noop,
            /**
             *  控件的值发生改变的时候触发
             *  @tutorial   timespinner_events
             *  @event      ebaui.web.Spinner#onchange
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop
        }

    });

})( jQuery,ebaui );
/**
 *  依赖于SWFUpload
 *  @see http://demo.swfupload.org/Documentation/
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerControl( 'FileUploader',true );

    /** 
     *  控件全名 e.g. ebaui.web.FileUploader
     *  控件描述
     *  @class      FileUploader 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   fileuploader_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      &lt;input data-role="fileuploader" data-options="{ }"/&gt;
     */
    ebaui.control( 'web.FileUploader',ebaui.web.FormElement, {

        /**
         *  内部上传控件实例
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @member     {SWFUpload}    _uploader
         */
        _uploader:null,

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-fileuploader',

        /**
         *  uploadUrl是必须有值的属性，如果该属性为空，抛出此异常
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @member     {String}    _uploadUrlEmptyException
         */
        _uploadUrlEmptyException:'the uploadUrl property can not be null or empty!',

        /**
         *  更新UI的按钮文本
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @method     _updateUIButtonText
         */
        _updateUIButtonText:function(){
            $( '.eba-buttonedit-button',this._$root ).text( this.buttonText() );
        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @method     _render
         */
        _render : function(){
            var me = this;
            me._super();
            me._updateUIButtonText();
        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @method     _initControl
         */
        _initControl : function(){

            var self      = this;
            var uploadUrl = self.uploadUrl();

            if( !uploadUrl ){
                throw self._uploadUrlEmptyException;
            }

            self._$formInput = $( 'input',self._$root );

            var btnID     = self.controlID()+'$span';
            var $root     = self._$root;
            var offset    = $root.offset();
            var $flashEl  = $( '<div><span id="' + btnID + '""></span></div>' )
                                               .css({ 'position' : 'absolute','top' : offset.top,'left' : offset.left,'width' : $root.width(),'height' : $root.height() })
                                               .appendTo( document.body );

            var flashUrl = ebaui.web.urlRoot + 'lib/SWFUpload/Flash/swfupload.swf';

            var customer = {

                post_params          : self.extraParams(),
                file_post_name       : self.filePostName(),

                file_types           : self.fileType(),
                file_size_limit      : self.fileSizeLimit(),
                file_queue_limit     : 0,
                file_upload_limit    : 0,

                button_width         : '100%',
                button_height        : '100%',
                button_placeholder_id: btnID,
                
                upload_url           : self.uploadUrl()

            };

/**
//  fileinfo 对象属性列表

var fileinfo = {

    averageSpeed: 0,
    creationdate: Thu Aug 22 2013 09:35:25 GMT+0800 (China Standard Time),
    currentSpeed: 0,
    filestatus: -1,
    id: "SWFUpload_0_0",
    index: 0,
    modificationdate: Thu Aug 22 2013 08:38:53 GMT+0800 (China Standard Time),
    movingAverageSpeed: 0,
    name: "bg-scrollbar-thumb-y.png",
    percentUploaded: 0,
    post: Object,
    size: 2567,
    sizeUploaded: 0,
    timeElapsed: 0,
    timeRemaining: 0,
    type: ".png"

}

*/

            var evtHandles={

                upload_start_handler : function( fileinfo ){

                    //   disable the swfupload
                    self._uploader.setButtonDisabled( true );

                    self.options['onuploadstart']( self,{
                        'file' : fileinfo
                    } );

                },

                upload_progress_handler : function( fileinfo,complete,total ){

                    self.options['onuploadprogress']( self,{
                        'file'         : fileinfo,
                        'bytesComplete': complete,
                        'totalBytes'   : total
                    } );

                },

                upload_error_handler : function( fileinfo,errorCode,message ){

                    //   enable the swfupload
                    self._uploader.setButtonDisabled( false );

                    self.options['onuploaderror']( self,{
                        'file'    : fileinfo,
                        'errorMsg': message
                    } );

                },

                upload_success_handler : function( fileinfo,data,response){
                    
                    //   enable the swfupload
                    self._uploader.setButtonDisabled( false );
                    self.options['onuploadsucc']( self,{
                        'file'          : fileinfo,
                        'serverData'    : data,
                        'serverResponse': response
                    } );

                },

                upload_complete_handler : function(fileinfo){

                    self.options['onuploadcomplete']( self,{
                        'file' : fileinfo
                    } );

                },

                file_dialog_start_handler:function () {
                    //  clear queue
                    self._uploader.cancelQueue();
                },

                file_queued_handler : function( fileinfo ){
                    //  display file path
                    self._$formInput.val( fileinfo.name );
                },

                file_queue_error_handler : function( fileinfo,errorCode,message ){

                    switch( errorCode ){

                        case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                            //  File is too big
                            break;

                        case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                            //  Cannot upload Zero Byte files
                            break;

                        case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                            //  Invalid File Type
                            break;

                        case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                            //  You have selected too many file
                            break;

                    }

                },

                file_dialog_complete_handler : function( fileSelectedCount,fileQueuedCount,fileQueueLength ){
                    //  todo
                    var stats = self._uploader.getStats();
                    if( self.uploadOnSelect() ){
                        //  upload files
                        self._uploader.startUpload();
                    }

                }

            };

            //  event handlers
            var defaults = {

                flash_url               : flashUrl,

                use_query_string        : false,
                requeue_on_error        : true,
                http_success            : [201, 202],
                assume_success_timeout  : 0,
                file_types_description  : "",
                
                debug                   : false,
                debug_handler           : $.noop,
                
                prevent_swf_caching     : false,
                preserve_relative_urls  : false,
                
                //  button text && style setting
                button_text             : '',
                button_image_url        : '',
                button_text             : '',
                button_text_style       : '',
                button_text_left_padding: 3,
                button_text_top_padding : 2,
                button_action           : SWFUpload.BUTTON_ACTION.SELECT_FILES,
                button_disabled         : false,
                button_cursor           : SWFUpload.CURSOR.HAND,
                button_window_mode      : SWFUpload.WINDOW_MODE.TRANSPARENT

                /*

                //  events

                swfupload_loaded_handler    : swfupload_loaded_function,
                file_dialog_start_handler   : file_dialog_start_function,
                file_queued_handler         : file_queued_function,
                file_queue_error_handler    : file_queue_error_function,
                file_dialog_complete_handler: file_dialog_complete_function


                */

            };

            var settings = $.extend( defaults,customer,evtHandles );
            self._uploader = new SWFUpload( settings );

        },

        /**
         *  开始上传文件
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @method     startUpload
         *  @param      {Object}    file
         */
        startUpload:function ( file ){
            var uploader = this._uploader;
            if( uploader ){
                uploader.startUpload( file );
            }
        },

        /**
         *  添加POST提交的参数
         *  @public
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @method     addPostParam
         *  @param      {String}    name
         *  @param      {String}    value
         */
        addPostParam:function (name, value) {

            var uploader = this._uploader;
            if( uploader && name && value ){
                uploader.addPostParam( name,value );
            }

        },

        /**
         *  服务端上传文件处理地址
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @member     {String}    uploadUrl
         */
        uploadUrl : function ( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['uploadUrl'];
            }
            me.options['uploadUrl'] = val;
        },

        /**
         *  按钮的文本
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @member     {String}    buttonText
         */
        buttonText : function ( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['buttonText'];
            }

            var uploader = me._uploader;
            me.options['buttonText'] = val;
            me._updateUIButtonText();
            if( uploader ){
                uploader.setButtonText( val );
            }
        },

        /**
         *  文件选择后即上传
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @member     {Boolean}    uploadOnSelect
         */
        uploadOnSelect : function( val ){
            var me = this;
            if( !me.isBoolean( val ) ){
                return me.options['uploadOnSelect'];
            }
            me.options['uploadOnSelect']  = val;
        },

        /**
         *  允许上传的文件类型,使用";"分割，默认只允许上传图片
         *  @private
         *  @instance
         *  @default    '*.jpg;*.gif;*.png'
         *  @memberof   ebaui.web.FileUploader
         *  @member     {String}    fileType
         */
        fileType : function ( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['fileType'];
            }

            var uploader = me._uploader;
            me.options['fileType'] = val;
            if( uploader ){
                uploader.setFileTypes( val );
            }
        },

        /**
         *  上传文件大小限制，默认文件大小上限是10MB
         *  @private
         *  @instance
         *  @default    '10MB'
         *  @memberof   ebaui.web.FileUploader
         *  @member     {String}    fileSizeLimit
         */
        fileSizeLimit : function( val ) {

            var me = this;
            if( !me.isString( val ) ){
                return me.options['fileSizeLimit'];
            }

            //  This applies to all future files that are queued. 
            //  The file_size_limit parameter will accept a unit. 
            //  Valid units are B, KB, MB, and GB. The default unit is KB.
            var uploader = me._uploader;
            me.options['fileSizeLimit'] = val;
            if( uploader ){
                uploader.setFileSizeLimit( val );
            }

        },

        /**
         *  文件提交到服务端的时候，post的key值，比如在asp.net你可以使用Request.Files[filePostName]进行访问
         *  @private
         *  @instance
         *  @default    'ebauiUploadedFiles'
         *  @memberof   ebaui.web.FileUploader
         *  @member     {String}    fileSizeLimit
         */
        filePostName : function( val ) {

            var me = this;
            if( !me.isString( val ) ){
                return me.options['filePostName'];
            }

            var uploader = me._uploader;
            me.options['filePostName'] = val;
            if( uploader ){
                uploader.setFilePostName( val );
            }

        },

        /**
         *  通过POST额外上传到服务器的参数
         *  @private
         *  @instance
         *  @default    {}
         *  @memberof   ebaui.web.FileUploader
         *  @member     {Object}    extraParams
         */
        extraParams : function( val ) {

            var me = this;
            if( !me.isObject( val ) ){
                return me.options['extraParams'];
            }

            //  This applies to all future files that are queued. 
            //  The file_size_limit parameter will accept a unit. 
            //  Valid units are B, KB, MB, and GB. The default unit is KB.
            var uploader = me._uploader;
            var old = me.options['extraParams'];

            if( uploader && old ){
                for( var name in old ){
                    uploader.removePostParam( name );
                }
            }

            if( uploader && val ){
                for( var name in val ){
                    uploader.addPostParam( name,val[name] );
                }
            }

            me.options['extraParams'] = val;

        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.FileUploader
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  default width
            width : 150,
            //  default height
            height : 21,
            //  按钮的文本
            buttonText : '浏览...',
            //  允许上传的文件类型
            fileType : '*.jpg;*.gif;*.png',
            //  上传文件大小限制
            fileSizeLimit:'10MB',
            //  文件提交到服务端的时候，post的key值，比如在asp.net你可以使用Request.Files[filePostName]进行访问
            filePostName : 'ebauiUploadedFiles',
            //  服务端上传文件处理地址
            uploadUrl:'',
            //  文件选择后即上传
            uploadOnSelect : false,
            //  通过POST额外上传到服务器的参数
            extraParams:{},
            /**
             *  开始上传文件的时候触发
             *  。此事件处理程序中，如果返回true，文件真正开始上传
             *  ；如果返回false，则文件上传失败，同时触发onuploaderror事件
             *  @event  ebaui.web.FileUploader#onuploadstart
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             *  @prop   {Object}    eventArgs.file
             */
            onuploadstart : $.noop,
            /**
             *  文件正在上传的过程中不断触发
             *  @event  ebaui.web.FileUploader#onuploadprogress
             *  @param  {Object}    file       - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             *  @prop   {Object}    eventArgs.file
             *  @prop   {Object}    eventArgs.bytesComplete
             *  @prop   {Object}    eventArgs.totalBytes
             */
            onuploadprogress : $.noop,
            /**
             *  文件上传失败触发
             *  @event  ebaui.web.FileUploader#onuploaderror
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             *  @prop   {Object}    eventArgs.file
             *  @prop   {Object}    eventArgs.errorMsg
             */
            onuploaderror : $.noop,
            /**
             *  文件上传成功触发
             *  @event  ebaui.web.FileUploader#onuploadsucc
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             *  @prop   {Object}    eventArgs.file
             *  @prop   {Object}    eventArgs.serverData
             *  @prop   {Object}    eventArgs.serverResponse
             */
            onuploadsucc: $.noop,
            /**
             *  不论文件上传成功还是失败，这个事件都会触发
             *  @event  ebaui.web.FileUploader#onuploadcomplete
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             *  @prop   {Object}    eventArgs.file
             */
            onuploadcomplete: $.noop

        }

    });

})( jQuery,ebaui );
/**
 *  ebaui控件的代码模板，定义了控件需要实现的虚方法，防止控件重定义虚方法虚属性，提高控件开发速度
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerControl( 'Checkbox',true );

    /** 
     *  ebaui.web.Checkbox
     *  @class      Checkbox 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   checkbox_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.Checkbox',ebaui.web.FormElement, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-checkbox',

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @method     _render
         */
        _render : function(){
            var me = this;
            me._updateStyleChecked();
            me._updateUILabel();
            me._super();
        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @method     _setupEvents
         */
        _setupEvents : function(){
            var me   = this;
            var $root = me._$root;
            $root.on( 'change','input',function( event ){
                me.options['checked'] = this.checked;
                me.options['onchange']( me,event );
            } );
        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @method     _initControl
         */
        _initControl : function(){
            var me = this;
            me._$formInput = $( 'input',me._$root );
            //  设置input的name属性
            var name = me.name();
            if( name ){me._$formInput.attr( 'name',name );}

            //  控件的可用性
            me._$formInput.attr( 'id',me.controlID() );
            $( 'label',me._$root ).attr( 'for',me.controlID() );
        },

        /**
         *  更新UI界面的label文本
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @method     _updateUILabel
         */
        _updateUILabel:function(){ $( 'label',this._$root ).text( this.text() ); },

        /**
         *  更新checkbox的选中样式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @method     _updateStyleChecked
         */
        _updateStyleChecked : function(){
            var me = this;
            me._$formInput.get(0).checked = me.checked(); 
        },

        /**
         *  重置控件，清空验证状态，控件值，恢复到控件原始状态
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @method     reset
         *  @example
         *      ctrl.reset();
         */
        reset : function(){
            var me = this;
            me.checked( false );
            me.errors   = {};
            me._isValid = true;
            me.clearTips();
        },


        /**
         *  获取或者设置checkbox控件的文本
         *  @public
         *  @instance
         *  @default    ''
         *  @memberof   ebaui.web.Checkbox
         *  @member     {String}        text
         *  @example    <caption>get</caption>
         *      var pair = ctrl.text();
         *  @example    <caption>set</caption>
         *      ctrl.text( 'label' );
         */
        text:function( val ){
            var me = this;
            if( !me.isString( val ) ){
                return me.options['text'];
            }
            me.options['text'] = val;
            me._updateUILabel();
        },

        /**
         *  获取或者设置控件的所有值
         *  { 'text' : '','value' : null,'checked' : false }
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @member     {Object}        data
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data(  { 'text' : '','value' : null,'checked' : false } );
         */
        data: function( val ){
            var me = this;
            if( me.isNull(val) ){
                return me.options['checked'];
            }

            var text = val[me.textField()];
            if( text ){ me.text( text ); }

            var value = val[me.valueField()];
            if( !me.isNull(val) ){
                me.value( value );
            }

            if( me.isBoolean( val['checked'] ) ){
                me.checked( val['checked'] );
            }
        },

        /**
         *  获取或者设置checkbox是否选中，同checked
         *  @public
         *  @instance
         *  @default    ''
         *  @memberof   ebaui.web.Checkbox
         *  @member     {Object}     value
         *  @example    <caption>get</caption>
         *      var pair = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( 'value' );
         */
        value : function( val ){
            var me = this;
            if( me.isNull(val) ){ return me.options['value']; }
            me.options['value'] = val;
        },

        /**
         *  获取或者设置checkbox是否选中
         *  @public
         *  @instance
         *  @readonly
         *  @default    false
         *  @memberof   ebaui.web.Checkbox
         *  @member     {Boolean}     checked
         *  @example    <caption>get</caption>
         *      var pair = ctrl.checked();
         *  @example    <caption>set</caption>
         *      ctrl.checked( true );
         */
        checked : function( val ){
            var me = this;
            if( !me.isBoolean( val ) ){ return me.options['checked']; }
            me.options['checked'] = val;
            me._updateStyleChecked();
        },

        /**
         *  控件数据源对象字段中，用于作为控件值的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @member     {String}      valueField
         *  @default    'value'
         *  @example    <caption>get</caption>
         *      var valueField = ctrl.valueField();
         *  @example    <caption>set</caption>
         *      ctrl.valueField( '' );
         */
        valueField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){ return me.options['valueField']; }
            me.options['valueField'] = val;
        },

        /**
         *  控件数据源对象字段中，用于作为控件文本的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @member     {String}      textField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var textField = ctrl.textField();
         *  @example    <caption>set</caption>
         *      ctrl.textField( '' );
         */
        textField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){ return me.options['textField']; }
            me.options['textField'] = val;
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Checkbox
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  checkbox控件的文本
            text   : '',
            //  checkbox控件的值
            value  : true,
            //  值字段
            valueField : 'value',
            //  文本字段
            textField  : 'text',
            //  checkbox是否选中
            checked: false,

            /**
             *  控件的值发生改变的时候触发
             *  @event      ebaui.web.Checkbox#onchange
             *  @param      {Object}    sender      - 事件发送对象
             *  @param      {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop
        }

    });

})( jQuery,ebaui );
/**
 *  ebaui控件的代码模板，定义了控件需要实现的虚方法，防止控件重定义虚方法虚属性，提高控件开发速度
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    //  import packages
    ebaui.web.registerControl( 'CheckboxList',true );

    /** 
     *  ebaui.web.CheckboxList
     *  ，本地数据源DEMO请参考{@tutorial checkboxlist_index}
     *  ，远程数据源DEMO请参考{@tutorial checkboxlist_remoteDataSource}
     *  @class      CheckboxList 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.CheckboxList',ebaui.web.FormElement, {

        /**
         *  是否使用remote数据源
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {Boolean}       _usingRemoteData
         */
        _usingRemoteData : false,

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-checkboxlist',

        /**
         *  已经编译好的checkbox模板，使用underscore模板引擎，后续会重复使用
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @method     _compiledListItemTmpl
         */
        _compiledListItemTmpl : $.noop,

        /**
         *  显示checkbox列表
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @method     _renderListItem
         */
        _renderListItem:function () {

            var me = this;
            var dataItems = me._dataItems;
            if( me.isEmpty( dataItems ) ){ return; }

            var html = me._compiledListItemTmpl({
                'controlID' : me.controlID(),
                'textField' : me.textField(),
                'valueField': me.valueField(),
                'dataItems' : dataItems
            });

            $( 'tr',me._$root ).html( html );

        },

        /**
         *  checkboxlist数据源
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {Array}     _dataItems
         */
        _dataItems : [],

        /**
         *  加载数据源，加载成功后填充本地数据源_dataItems
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @method     _loadData
         */
        _loadData:function( afterLoad ){

            var self       = this;
            var dataSource = self.dataSource();

            if( !afterLoad ){ afterLoad = $.noop; }

            if( self._usingRemoteData ){
                //  use remote data source 
                var toServer = {};
                var url      = dataSource.url;

                if( self.isFunc( dataSource.data ) ){
                    toServer = dataSource.data();
                }else if( dataSource.data && self.isObject( dataSource.data ) ){
                    toServer = dataSource.data;
                }

                $.getJSON( url,toServer ).done(function( serverData ){
                    //  显示加载中的样式
                    self._dataItems = serverData;
                    afterLoad();
                });

            }else{
                //  use local data source 
                self._dataItems = dataSource;
                afterLoad();
            }

        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @method     _render
         */
        _render : function(){

            var self = this;
            self._super();
            /* load data then render checkboxlist */
            self._loadData( function(){

                /*
                 *  首次输出UI界面的时候，应该检查初始值，看看是否有设置已经选中的项目
                 *  如果有，那么应该在初始化的时候，自动勾选
                 */
                var checkedVal = self.options['value'];
                var dataItems  = self._dataItems;
                var valueField = self.valueField();

                if( checkedVal && checkedVal.length > 0 ){
                    for (var j = 0,max = checkedVal.length; j < max; j++) {
                        for (var i = 0,l = dataItems.length; i < l; i++) {
                            var dataItem = dataItems[i];
                            dataItem['checked'] = ( dataItem[valueField] == checkedVal[i] ) ? 'true' : false;
                        };
                    };
                    
                }

                self._renderListItem();

            } );

        },

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self   = this;
            var $root  = self._$root;
            $root.on( 'change','input',function( event ){
                self.options['onchange']( self,event );
            } );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @method     _initControl
         */
        _initControl : function(){
            var me = this;
            var checkboxItemTmpl = $.trim( $( '#ebaui-template-checkboxlist-item' ).html() );
            me._compiledListItemTmpl = me.compileTmpl( checkboxItemTmpl );
            me._usingRemoteData = me.isUsingRemoteData( me.options['dataSource'] );
        },

        /**
         *  获取或者设置checkboxlist的选中项
         *  ，参数格式示例：[{ text : '',value : '' }]
         *  @public
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {Array}        data
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( [] );
         */
        data: function( val ){

            var me = this;
            if( !me.isArray( val ) ){
                var toRet      = [];
                var ctrlVal    = me.value();
                var dataItems  = me._dataItems;
                var valueField = me.valueField();
                var textField  = me.textField();

                for (var i = 0,l = ctrlVal.length; i < l; i++) {

                    for (var j = 0,max=dataItems.length; j < max; j++) {
                        var dataItem = dataItems[j];
                        if( dataItem[valueField] == ctrlVal[i] ){

                            toRet.push( {
                                'text' : dataItem[textField],
                                'value': ctrlVal[i]
                            } );

                        }
                    }

                }

                return toRet;
            }

            /* update checkboxes's value */
            me.value( val );

        },

        /**
         *  获取或者设置checkboxlist的选中项
         *  @public
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {Array}     value
         *  @example    <caption>get</caption>
         *      var pair = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( [1,2,3] );
         */
        value : function( val ){

            var me = this;
            //  get value
            if( !me.isArray( val ) ){
                var checkedItems = [];
                $( 'input:checked',me._$root ).each(function( idx,el ){
                    checkedItems.push( $( el ).val() );
                });
                return checkedItems;
            }

            //  update checkboxes checked property
            for (var i = 0,l = val.length; i < l; i++) {
                var selector = 'input[value="]' + val[i] + '"]';
                var $checkbox = $( selector,this._$root );
                if( $checkbox.size() > 0 ){
                    $checkbox.get(0).checked=true;
                }
            };

            //  trigger onchange event
            me.options['onchange']( me,{} );

        },

        /**
         *  控件数据源对象字段中，用于作为控件值的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {String}      valueField
         *  @default    'value'
         *  @example    <caption>get</caption>
         *      var valueField = ctrl.valueField();
         *  @example    <caption>set</caption>
         *      ctrl.valueField( '' );
         */
        valueField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['valueField'];
            }
            me.options['valueField'] = val;
        },

        /**
         *  控件数据源对象字段中，用于作为控件文本的字段名
         *  @public
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {String}      textField
         *  @default    'text'
         *  @example    <caption>get</caption>
         *      var textField = ctrl.textField();
         *  @example    <caption>set</caption>
         *      ctrl.textField( '' );
         */
        textField : function( val ) {
            var me = this;
            if( !me.isString( val ) ){
                return me.options['textField'];
            }
            me.options['textField'] = val;

        },

        /**
         *  checkboxlist选项的数据源，可以是远程数据源URL配置对象或者是一个javascript数组对象作为数据源
         *  @public
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {Object|Array}          dataSource
         *  @property   {String}                dataSource.url          - 服务端URL
         *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
         *  @tutorial   texboxlist_local
         *  @tutorial   texboxlist_remote
         *  @example    <caption>get</caption>
         *      var src = ctrl.dataSource();
         *  @example    <caption>set</caption>
         *      //  本地数据
         *      ctrl.dataSource( [] );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : {}
         *      } );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : function(){ 
         *              // your logic
         *              return {};
         *          }
         *      } );
         */
        dataSource : function( val ){

            var me = this;
            if( !val ){
                return me.options['dataSource'];
            }

            me._usingRemoteData = me.isUsingRemoteData( val );
            me.options['dataSource'] = val;

            me._loadData(function(){
                me._renderListItem();
            });

        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.CheckboxList
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  控件当前已经选中列表的文本值
            text : [],
            //  控件当前已经选中列表的值
            value: [],
            //  值字段
            valueField : 'value',
            //  文本字段
            textField  : 'text',
            //  下拉菜单选项的数据源，可以是URL地址或者是一个javascript数组对象作为数据源
            //  dataSource : []
            //  dataSource : { url ,data:{} || function(){ return {}; } }
            dataSource : '',

            /**
             *  控件的值发生改变的时候触发
             *  @event  ebaui.web.CheckboxList#onchange
             *  @param  {Object}    sender      - 事件发送对象
             *  @param  {Object}    eventArgs   - 事件参数
             */
            onchange : $.noop
        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Captcha控件
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'Captcha',true );

    /** 
     *  ebaui.web.Captcha
     *  ，验证码控件
     *  ，远程服务器返回一个JSON对象，格式为
     *  ：{ image : '', code : '' }
     *  @class      Captcha 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.TextBox
     *  @tutorial   captcha_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.Captcha', ebaui.web.TextBox, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-captcha',

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @method     _setupEvents
         */
        _setupEvents : function(){

            var self   = this;
            var $root  = self._$root;
            var $input = self._$formInput;
            
            $root.on( 'click','[data-role="btn-reload"]',function( event ){
                self.refresh();
            } );

            $root.on( 'focus','.eba-textbox-input',function(evt){
                self._setOption( 'focused',true );
                self._updateStyleFocused();
            } );

            $root.on( 'blur','.eba-textbox-input',function(evt){
                self._setOption( 'focused',false );
                self._updateStyleFocused();
            } );

            $root.on( 'change','.eba-textbox-input',function(evt){
                if( self.validateOnChange() ){
                    self.validate();
                }
            } );

            /*
             *  when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
             *  when you click on this label
             *  remove this label then focus in the input
             */
            $root.on( 'click','.eba-placeholder-lable',function( event ){
                $(this).hide();
                self._$formInput.focus();
            } );

            self._super();

        },

        /**
         *  数据源格式错误
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @member     {String}    _dataSourceInvalidException
         */
        _serverDataInvalidException:'captcha code server response is invalid!!',

        /**
         *  数据源格式错误
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @member     {String}    _dataSourceInvalidException
         */
        _dataSourceInvalidException:'the dataSource format is invalid, only remote dataSource supported!',
        
        /**
         *  加载验证码图片以及图片的字符串
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @method     _loadCaptcha
         */
        _loadCaptcha:function(){

            var self       = this;
            var dataSource = self.options['dataSource'];
            var isRemote   = self.isUsingRemoteData( dataSource );

            if( !isRemote ){
                throw self._dataSourceInvalidException;
            }

            var remoteUrl      = dataSource.url;
            var postData = {};
            if( self.isFunc( dataSource.data ) ){
                postData = dataSource.data();
            }else{
                $.extend(postData, dataSource.data);
            }
            postData['t'] = ( new Date ).getTime().toString() + parseInt( Math.random() * 1000 ).toString();
            remoteUrl += '?' + $.param( postData );
            self._$captchaImg.attr( 'src',remoteUrl );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @method     _initControl
         */
        _initControl : function(){

            var me = this;
            me._super();

            me._$captchaImg = $( '.eba-code-img',me._$root );
            me._$btnReload  = me._$captchaImg.parent();

            var opts = me.options;
            /* init validation url, by defualts, it is the same with dataSource */
            if( !opts['validationUrl'] ){
                opts['validationUrl'] = opts['dataSource']['url'];
            }

            /* 
             *  if validateOnServer and you did not config remote validation rule 
             *  then add remote validation rule automatically
             */
            me._addRemoteValidator( opts['validateOnServer'] );

            /* load captcha code image from remote server */
            me._loadCaptcha();

        },

        /**
         *  刷新验证码
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @method     refresh
         *  @example
         *      ctrl.refresh();
         */
        refresh:function(){ this._loadCaptcha(); },

        /**
         *  获取表单控件值
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.Captcha
         *  @member     {String}    data
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.data();
         */
        data : function(){ return this._$formInput.val(); },

        /**
         *  获取表单控件值
         *  @public
         *  @instance
         *  @readonly
         *  @memberof   ebaui.web.Captcha
         *  @member     {String}    value
         *  @default    null
         *  @example    <caption>get</caption>
         *      var value = ctrl.value();
         */
        value : function(){ return this._$formInput.val(); },

        /**
         *  远程数据源
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @member     {Object}                dataSource
         *  @property   {String}                dataSource.url          - 服务端URL
         *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
         *  @example    <caption>get</caption>
         *      var src = ctrl.dataSource();
         *  @example    <caption>set</caption>
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : {}
         *      } );
         *
         *      //  服务端数据
         *      ctrl.dataSource( {
         *          url : 'http://xx.xx/xx?xx=xx',
         *          data : function(){ 
         *              // your logic
         *              return {};
         *          }
         *      } );
         */
        dataSource : function( val ){
            if( !val ){
                return this.options['dataSource'];
            }

            this.options['dataSource'] = val;
        },

        _addRemoteValidator:function( validateOnServer ){

            var me = this;
            /* init remote validator */
            if( validateOnServer && !me.hasValidator('remote') ){

                window['captchaPass'] = function( value, serverData ){
                    if( !serverData ){ return false; }
                    if( serverData['result'] == null || serverData['result'] == undefined ){ return false; }
                    return parseInt( serverData['result'] ) == 1;
                };

                var rule = 'remote[\'url${0}\',\'token${1}\',\'pass$captchaPass\']'.replace('{0}',me.validationUrl()).replace('{1}',me.queryKey());
                me.addValidator( rule );

            }else if ( !validateOnServer ){
                me.removeValidator( 'remote' );
            }

        },

        /**
         *  开启服务端验证
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @member     {Boolean}                validateOnServer
         *  @default    false
         *  @example    <caption>get</caption>
         *      var src = ctrl.validateOnServer();
         *  @example    <caption>set</caption>
         *      ctrl.validateOnServer( true );
         */
        validateOnServer:function( val ){
            var me = this;
            if( !me.isBoolean( val ) ){ 
                return me.options['validateOnServer']; 
            }
            me.options['validateOnServer'] = val;
            me._addRemoteValidator( val );
        },

        /**
         *  验证码的服务端验证地址，默认和dataSource里面配置的url一样
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @member     {String}                validationUrl
         *  @example    <caption>get</caption>
         *      var src = ctrl.validationUrl();
         *  @example    <caption>set</caption>
         *      ctrl.validationUrl( 'http://' );
         */
        validationUrl : function ( val ) {
            var me = this;
            var re = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
            if( !re.test( val ) ){
                return me.options['validationUrl'];
            }
            me.options['validationUrl'] = val;
        },

        /**
         *  控件进行验证的时候，要提交到验证服务器的url query parameter key
         *  @public
         *  @instance
         *  @default    'verify'
         *  @memberof   ebaui.web.Captcha
         *  @member     {String}                queryKey
         *  @example    <caption>get</caption>
         *      var src = ctrl.queryKey();
         *  @example    <caption>set</caption>
         *      ctrl.queryKey( '' );
         */
        queryKey : function( val ){
            var me = this;
            if( me.isEmpty( val ) ){
                return me.options['queryKey'];
            }
            me.options['queryKey'] = val;
        },

        /**
         *  重置控件，清空验证状态，控件值，恢复到控件原始状态
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @method     reset
         *  @example
         *      ctrl.reset();
         */
        reset : function(){
            var me = this;
            me.errors   = {};
            me._isValid = true;
            me._$formInput.val('');
            me.clearTips();
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Captcha
         *  @member     {Object}    options
         */
        options : {
            // css position property
            position   : 'absolute',
            //  top
            top     : 0,
            //  left
            left    : 0,
            //  default width
            width : 250,
            //  default height
            height : 21,
            //  开启服务端验证
            validateOnServer:false,
            //  是否在控件的值发生改变的时候就触发验证
            validateOnChange:false,
            //  文本占位符
            placeholder: '请输入...',
            //  验证码的服务端验证地址
            //  ，默认和dataSource里面配置的url一样
            validationUrl : '',
            //  控件进行验证的时候，要提交到验证服务器的url query parameter key
            queryKey : 'verify',
            //  下拉菜单选项的数据源，可以是URL地址或者是一个javascript数组对象作为数据源
            //  dataSource : []
            //  dataSource : { url ,data:{} || function(){ return {}; } }
            dataSource : ''
        }

    });

})( jQuery,ebaui );

/**
 *  ebaui控件的代码模板，定义了控件需要实现的虚方法，防止控件重定义虚方法虚属性，提高控件开发速度
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    //  import packages
    ebaui.web.registerControl( 'RadioButtonList',true );

    /** 
     *  ebaui.web.RadioButtonList
     *  ，本地数据源DEMO请参考{@tutorial radiobuttonlist_index}
     *  ，远程数据源DEMO请参考{@tutorial radiobuttonlist_remoteDataSource}
     *  @class      RadioButtonList 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.CheckboxList
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.RadioButtonList',ebaui.web.CheckboxList, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof    ebaui.web.RadioButtonList
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-radiobuttonlist',

        /**
         *  显示checkbox列表
         *  @private
         *  @instance
         *  @memberof    ebaui.web.RadioButtonList
         *  @method     _renderListItem
         */
        _renderListItem:function () {

            var me = this;
            var dataItems = me._dataItems;
            if( !dataItems || dataItems.length == 0 ){ return ; }

            var html = me._compiledListItemTmpl({
                
                'name'      : me.name(),
                'controlID' : me.controlID(),
                'textField' : me.textField(),
                'valueField': me.valueField(),
                'dataItems' : dataItems

            });

            $( 'tr',me._$root ).html( html );

        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof    ebaui.web.RadioButtonList
         *  @method     _render
         */
        _render : function(){

            var self = this;
            //  
            self._super();
            //  load data then render checkboxlist
            self._loadData( function(){

                //  首次输出UI界面的时候，应该检查初始值，看看是否有设置已经选中的项目
                //  如果有，那么应该在初始化的时候，自动勾选
                self._renderListItem();
                var checkedVal = self.options['value'];
                if( checkedVal ){

                    var $radio = $( 'input[value="' + checkedVal +'"]',this._$root );
                    if( $radio.size() > 0 ){
                        $radio.get(0).checked = true;
                    }
                    
                }

            } );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof    ebaui.web.RadioButtonList
         *  @method     _initControl
         */
        _initControl : function(){

            var me = this;
            //  ensure control name != ''
            if( !me.name() ){
                me.options['name'] = me.controlName() + me.controlID();
            }

            var checkboxItemTmpl = $.trim( $( '#ebaui-template-radiobuttonlist-item' ).html() );
            me._compiledListItemTmpl = me.compileTmpl( checkboxItemTmpl );
            me._usingRemoteData = me.isUsingRemoteData( me.options['dataSource'] );

        },

        /**
         *  获取或者设置RadioButtonList的选中项
         *  ，参数格式示例：[{ text : '',value : '' }]
         *  @public
         *  @instance
         *  @memberof    ebaui.web.RadioButtonList
         *  @member     {Number}        data
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( 2 );
         */
        data: function( val ){

            var me = this;
            if( !me.isArray( val ) ){

                var toRet      = null;
                var ctrlVal    = me.value();
                var dataItems  = me._dataItems;
                var valueField = me.valueField();
                var textField  = me.textField();

                for (var j = 0,max=dataItems.length; j < max; j++) {
                    var dataItem = dataItems[j];
                    if( dataItem[valueField] == ctrlVal ){
                        toRet = dataItem;
                    }
                }

                return toRet;
                
            }

            //  update checkboxes's value
            me.value( val );
        },

        /**
         *  获取或者设置RadioButtonList的选中项
         *  @public
         *  @instance
         *  @memberof    ebaui.web.RadioButtonList
         *  @member     {Number}     value
         *  @example    <caption>get</caption>
         *      var pair = ctrl.value();
         *  @example    <caption>set</caption>
         *      ctrl.value( 2 );
         */
        value : function( val ){

            var me = this;
            //  get value
            if( !me.isNumber( val ) ){
                var checkedItem = null;

                $( 'input:checked',me._$root ).each(function( idx,el ){
                    checkedItem = $( el ).val();
                });

                return checkedItem;
            }

            //  update checkboxes checked property
            var selector = 'input[value="]' + val + '"]';
            var $radio = $( selector,me._$root );
            if( $radio.size() > 0 ){
                $radio.get(0).checked=true;
            }

            //  trigger onchange event
            me.options['onchange']( me,{} );

        }

    });

})( jQuery,ebaui );
/**
 *  ebaui控件的代码模板，定义了控件需要实现的虚方法，防止控件重定义虚方法虚属性，提高控件开发速度
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerFormControl( 'Hidden',true );

    /** 
     *  ebaui.web.Hidden
     *  控件描述
     *  @class      Hidden 
     *  @memberof   ebaui.web
     *  @extends    ebaui.web.FormElement
     *  @tutorial   hidden_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *      &lt;input id="hidden1" name="hidden1" data-role="hidden" value="" /&gt;
     */
    ebaui.control( 'web.Hidden',ebaui.web.FormElement, {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof   Control
         *  @member     {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-hidden',

        /**
         *  获取或者设置控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Hidden
         *  @member     {Object}     value
         *  @example    <caption>get</caption>
         *      var pair = ctrl.value();
         */
        _accessValue:function( val ){
            if( !val ){ 
                return this.options['value']; 
            }
            this.options['value'] = val;
        },

        /**
         *  获取或者设置控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Hidden
         *  @member     {Object}        data
         *  @example    <caption>get</caption>
         *      var pair = ctrl.data();
         *  @example    <caption>set</caption>
         *      ctrl.data( {} );
         */
        data: function( val ){ return this._accessValue( val ); },

        /**
         *  获取或者设置控件值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Hidden
         *  @member     {Object}     value
         *  @example    <caption>get</caption>
         *      var pair = ctrl.value();
         */
        value : function( val ){ return this._accessValue( val ); },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Hidden
         *  @member     {Object}    options
         */
        options : {
            width : 0,
            height: 0,

            value : null
        }

    });

})( jQuery,ebaui );
/**
 *  定义了ebaui.web.Form
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerControl( 'Form',false );

    /** 
     *  ebaui.web.Form
     *  能批量对多个控件进行赋值、取值、重置、验证、获取错误信息等，节省大量针对单独控件的操作代码。<br />
     *  @class      Form 
     *  @memberof   ebaui.web
     *  @tutorial   form_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.Form', {

        /**
         *  所有form表单控件类。在form控件初始化的时候，会自动加载当前DOM上下文中的这个集合内的控件到作为表单的一个字段
         *  @private
         *  @readonly
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {Array}     _formelements
         */
        _formelements : function(){
            return ebaui.web.formControls;
        },

        /**
         *  表单是否通过验证
         *  @private
         *  @instance
         *  @memberof ebaui.web.Form
         *  @member {Boolean}   _isValid
         */
        _isValid  : true,

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof ebaui.web.Form
         *  @member {Object}    options
         */
        options : {

            fields       : [],

            action       : '',
            name         : '',
            method       : '',
            acceptCharset: '',
            enctype      : ''

        },

        /**
         *  遍历form控件内所有的表单控件
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @method     _forEach
         *  @param      {Function}  iterator - 迭代器
         */
        _forEach:function( iterator ){

            var fields = this.fields();
            for( var i = 0,l = fields.length;i<l;i++ ){
                iterator( fields[i] );
            }

        },

        /**
         *  更新UI显示
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @method     _render
         */
        _render : function(){

            if( this.visible() ){
                this._$root.show();
            }else{
                this._$root.hide();
            }

        },

        /**
         *  把HTML占位符转换成为控件自身的HTML结构
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @method     _parseUi
         *  @param      {Object}    element HTML占位符
         */
        _parseUi : function( element ){
            return $( element );
        },

        /**
         *  获取w3c中，html标签本身就支持的属性配置<br />
         *  ebaui框架中，html标签本身就支持的属性直接编写在html标签内，而不会放在data-option里面进行配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @method     _parseAttrOptions
         *  @param      {Object}    element HTML占位符
         */
        _parseAttrOptions : function( element ){

            var $el               = $( element );
            var options           = {};
            options.fields        = [];
            
            //  about submition
            options.action        = $el.attr('action') || '';
            options.name          = $el.attr('name') || 'ebaui-form';
            options.method        = $el.attr('method') || 'GET';
            options.acceptCharset = $el.attr('accept-charset') || '';
            options.enctype       = $el.attr('enctype') || 'application/x-www-form-urlencoded';

            return options;

        },

        _setupEvents : function(){

            var self    = this,
                $root   = this._$root;

            $root.on( 'keyup',function( event ){

                var $target = $( event.target ).parents( '[data-ns="ebaui.web"]',$root ).eq(0);
                var ctrl    = ebaui.get( $target );
                var isEnter = event.which == ebaui.keycodes.enter;

                if( ctrl && ctrl.focusable() && ctrl.enterAsTab() && isEnter ){
                    var next = ctrl.__nextTab__;
                    if( next ){ next.focused( true ); }
                }

            } );

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @method     _initControl
         */
        _initControl : function(){

            //  get fields
            var me       = this;
            var formId   = me.id();
            var controls = me._formelements();

            if( formId ){
                me._$root.attr( 'id',formId );
            }

            function onenter( sender,event ) {
                var next = sender.__nextTab__;
                if( next ){ next.focused( true ); }
            };

            var $doms = $( '[data-ns="ebaui.web"]',me._$root );
            var len   = $doms.size();

            $doms.each(function( index,el ){

                var m = ebaui.get( el );
                if( m && m.data ){
                    me.options['fields'].push( m );
                    //  设置当前控件的按下tab之后的下一个要聚焦的控件
                    for (var j = index + 1; j < len; j++) {

                        var next = ebaui.get( $doms.eq( j ) );
                        if( next && next.focusable() ){
                            m.__nextTab__ = next;
                            break;
                        }

                    };
                }

            });

        },

        /**
         *  获取或者设置表单名字
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {String}    name
         *  @example    <caption>get</caption>
         *      var name = form.name();
         *  @example    <caption>set</caption>
         *      form.name( yourformName );
         */
        name : function( val ){
            var me = this;
            if( me.isEmpty( val ) ){ return me.options['name']; }
            me.options['name'] = val;
        },

        /**
         *  获取form表单内的控件集合
         *  @public
         *  @readonly
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {Array}     fields
         *  @example    <caption>get</caption>
         *      // get controls of a form instance
         *      var controls = form.fields();
         */
        fields  : function(){
            return this.options['fields'];
        },

        /**
         *  获取form表单内的控件集合
         *  @public
         *  @readonly
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {Array}     elements
         *  @example    <caption>get</caption>
         *      // get controls of a form instance
         *      var controls = form.elements();
         */
        elements:function(){ return this.options['fields']; },

        /**
         *  获取或者设置form表单数据，支持使用JSON字符串
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {Object}    data
         *  @tutorial   form_data
         *  @example    <caption>get</caption>
         *      // 获取form表单数据
         *      var data = form.data();
         *  @example    <caption>set</caption>
         *      // 设置form表单数据
         *      form.data({ name : 'hou',password : '123' });
         */
        data    : function( data ){

            if( !data ){

                //  get data
                var formData = {};
                this._forEach( function( field ){

                    if( !field['data'] ){
                        return;
                    }

                    var name       = field.name();
                    var data        = field.data();
                    formData[name] = data;

                } );

                return formData;

            }else{

                //  set data
                var formData = data;
                if( me.isString( data ) ){
                    //  JSON string
                    formData = ebaui.fromJSON( data );
                }

                this._forEach( function( field ){
                    var name  = field.name();
                    var fieldData = formData[name];
                    if( fieldData ){
                        field.data( fieldData );
                    }
                } );

            }

        },

        /**
         *  获取或者设置表单的各个控件的值
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {Object}    value
         *  @tutorial   form_data
         *  @example    <caption>get</caption>
         *      // 获取form表单数据
         *      var value = form.value();
         *  @example    <caption>set</caption>
         *      // 设置form表单数据
         *      form.value({ name : 'hou',password : '123' });
         */
        value:function( formValue ){

            if( !formValue ){

                //  get data
                var formVal = {};
                this._forEach( function( field ){

                    if( !field['value'] ){
                        return;
                    }

                    var name = field.name();
                    if( !name ){ return; }

                    var val = field.value();
                    if( !field['checked'] ){
                        formVal[name] = val;
                        return;
                    }

                    if( field['checked'] && field['checked']() ){
                        formVal[name] = val;
                        return;
                    }

                } );

                return formVal;

            }else{

                if( me.isString( formValue ) ){
                    //  JSON string
                    formValue = ebaui.fromJSON( formValue );
                }

                this._forEach( function( field ){
                    var name = field.name();
                    var val  = formValue[name];
                    if( val ){
                        field.value( val );
                    }
                } );

            }

        },

        /**
         *  获取或者设置表单数据提交地址
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {String}    action
         *  @example    <caption>get</caption>
         *      var action = form.action();
         *  @example    <caption>set</caption>
         *      form.action( url );
         */
        action:function( val ){

            var me = this;
            if( me.isString( val ) && $.trim( val ) != '' ){
                me.options['action'] = val;
            }else{
                return me.options['action'];
            }

        },

        /**
         *  获取或者设置表单数据提交方法，可能的值为："GET"或者"POST"
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {String}    method
         *  @example    <caption>get</caption>
         *      var action = form.method();
         *  @example    <caption>set</caption>
         *      form.method( method );
         */
        method : function( val ){

            var me = this;
            if( me.isString( val ) && $.trim( val ) != '' ){
                me.options['method'] = val.toUpperCase();
            }else{
                return me.options['method'];
            }

        },

        /**
         *  <pre>
         *  服务器处理表单数据所接受的字符集。
         *  常用的字符集有：
         *      UTF-8 - Unicode 字符编码
         *      ISO-8859-1 - 拉丁字母表的字符编码
         *  </pre>
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {String}    acceptCharset
         *  @example    <caption>get</caption>
         *      var charset = form.acceptCharset();
         *  @example    <caption>set</caption>
         *      form.acceptCharset( charset );
         */
        acceptCharset : function( val ){

            var me = this;
            if( me.isString( val ) && $.trim( val ) != '' ){
                me.options['acceptCharset'] = val;
            }else{
                return me.options['acceptCharset'];
            }
            
        },

        /**
         *  <pre>
         *  规定表单数据在发送到服务器之前应该如何编码
         *  常用的值有：
         *  
         *  application/x-www-form-urlencoded
         *      在发送前编码所有字符（默认
         *  multipart/form-data 
         *      不对字符编码。
         *      在使用包含文件上传控件的表单时，必须使用该值。
         *  text/plain  
         *      空格转换为 "+" 加号，但不对特殊字符编码。
         *  </pre>
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @member     {String}    enctype
         *  @example    <caption>get</caption>
         *      var enctype = form.enctype();
         *  @example    <caption>set</caption>
         *      form.enctype( MIME_type );
         */
        enctype : function( val ){

            var me = this;
            if( me.isString( val ) && $.trim( val ) != '' ){
                me.options['enctype'] = val;
            }else{
                return me.options['enctype'];
            }

        },

        /**
         *  验证表单
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @method     validate
         *  @tutorial   form_data
         *  @return     {Boolean}
         */
        validate: function(){

            var fields = this.fields();
            if( fields.length == 0 ){ return true; }

            var l = fields.length,isValid = false;
            isValid = fields[0].validate();

            if( l > 1 ){

                for( var i = 1 ;i < l; i++ ){
                    //var field = fields[i];
                    //var isFieldValid = field.validate();
                    isValid = ( fields[i].validate() ) && isValid;
                }

            }

            this._isValid = isValid;
            return isValid;

        },

        /**
         *  重置表单
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @method     reset
         *  @tutorial   form_data
         *  @example
         *      form.reset();
         */
        reset   : function(){
            this._forEach( function( field ){
                if( field['reset'] ){
                    field.reset();
                }
            } );
        },

        /**
         *  提交表单
         *  @public
         *  @instance
         *  @memberof   ebaui.web.Form
         *  @method     submit
         *  @tutorial   form_submit
         *  @param      {Object}    [settings]              -   更详细的文档，请参考{@link http://api.jquery.com/jQuery.ajax/|jQuery.ajax()}
         *  @prop       {Object}    settings.data           -   要提交到服务器的额外的数据
         *  @prop       {String}    settings.dataType       -   服务端响应的数据格式，默认是自动判断(xml, json, script, or html)
         *  @prop       {Function}  settings.success        -   表单提交成功后的回调函数
         *  @prop       {Function}  settings.error          -   表单提交失败的回调函数
         *  @prop       {Function}  settings.beforeSend     -   表单提交之前触发的回调函数
         *  @prop       {Function}  settings.complete       -   无论表单是否提交成功，总是触发这个回调函数
         */
        submit:function( settings ){

            var me       = this;
            var action   = me.action();
            var isGET    = me.method() === 'GET';
            var toSubmit = me.value();

            //  data,dataType,success
            if( settings && settings.data ){
                toSubmit = $.extend( toSubmit,settings.data );
                delete settings.data;
            }

            var method = isGET ? 'GET' : 'POST';
            var ajaxConf = $.extend({
                type: method,
                url : action,
                data: toSubmit
            }, settings);

            $.ajax(ajaxConf);

        }

    } );

    /**
     *  获取ebaui.web.Form对象实例
     *  @public
     *  @static
     *  @memberof   ebaui.web
     *  @method     getForm
     *  @param      {String}    selector    -   表单的CSS选择器
     *  @param      {String}    [context]   -   上下文对象
     *  @return     form对象实例
     */
    ebaui.web.getForm = function( selector,context ){

        var $dom = $( selector,context );

        if( $dom.data('model') ){
            return $dom.data( 'model' );
        }

        $dom.form();
        return $dom.data( 'model' );

    };

})( jQuery,ebaui );
/**
 *  
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerControl( 'Panel' );

    /** 
     *  控件全名 e.g. ebaui.web.Panel
     *  控件描述
     *  @class      Panel 
     *  @memberof   ebaui.web
     *  @extends    Control
     *  @tutorial   DEMO页
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.Panel', {

        /**
         *  把HTML占位符转换成为控件自身的HTML结构
         *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
         *  @private
         *  @virtual
         *  @instance
         *  @memberof   ebaui.web.Panel
         *  @method     _parseUi
         *  @param      {Object}    element HTML占位符
         */
        _parseUi : function( element ){ return $( element ); },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Panel
         *  @method         _initControl
         */
        _initControl : function(){
            var me = this;
            var id = me.id();
            if( id ){ me._$root.attr( 'id', id ); }
        },

        /**
         *  显示或者关闭panel
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Panel
         *  @method         toggle
         */
        toggle:function(){
            var me = this;
            var isVisible = me.visible();
            me.visible( !isVisible );
        },

        /**
         *  显示panel
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Panel
         *  @method         open
         */
        open:function(){
            this.visible( true );
        },

        /**
         *  关闭panel
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Panel
         *  @method         close
         */
        close:function(){
            this.visible( false );
        },

        /**
         *  移动panel
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Panel
         *  @method         move
         *  @arg            {Object}    pos - new position { top left }
         */
        move:function( pos ){

            if( !pos ){ return; }

            var me = this;
            var opts = me.options;

            if( pos['top'] !== null ){
                opts['top'] = pos['top'];
            }

            if( pos['left'] !== null ){
                opts['left'] = pos['left'];
            }

            me._$root.css({
                'top' : opts['top'],
                'left': opts['left']
            });

        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Panel
         *  @member         {Object}    options
         */
        options : {
            // css position property
            position   : 'relative',
            //  panel's init width
            width   : 0,
            //  panel's init height
            height  : 0
        }

    });

})( jQuery,ebaui );
/**
 *  ebaui.uilayout组件
 *  @file _mapToDefaultSection
 *  @dependencies
 *      jquery-ui           http://jqueryui.com/
 *
 *          ui.core.js
 *          ui.draggable.js     – to enable resizing capability
 *          effects.core        – for open/close animation effects
 *          effects.slide.js    – for 'slide' effect
 *          effects.drop.js     – for 'drop' effect
 *          effects.scale.js    – for 'scale' effect
 *
 *      jquery UI Layout    http://layout.jquery-dev.net/index.cfm
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    ebaui.web.registerControl( 'UiLayout' );

    /** 
     *  ebaui.web.UiLayout
     *  ，相应的DEMO请查看/build/demo/layout_index.html这个文件
     *  ，自动化生成的DOC会有JS异常
     *  @class      UiLayout 
     *  @memberof   ebaui.web
     *  @extends    Control
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     *  @example
     *          <body data-role="uilayout">
     *              <div data-role="layout-east"></div>
     *              <div data-role="layout-west"></div>
     *              <div data-role="layout-north"></div>
     *              <div data-role="layout-south"></div>
     *              <div data-role="layout-center"></div>
     *          </body>
     */
    ebaui.control( 'web.UiLayout', {

        /**
         *  jQuery UI Layout插件实例
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @member     {Object}     _layoutPlugin
         */
        _layoutPlugin:null,

        /**
         *  配置名映射规则
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @member     {Object}     _mapRules
         */
        _mapRules:{

            fx:{
                name : 'fxName',
                open : 'fxSettings_open',
                close: 'fxSettings_close'
            },

            button:{
                cls : 'buttonClass'
            },

            content:{
                ignoreSelector: 'contentIgnoreSelector',
                selector      : 'contentSelector'
            },

            toggler:{
                hideOnSlide : 'hideTogglerOnSlide',
                open :{ 
                    tip   : 'togglerTip_open',
                    length: 'togglerLength_open',
                    align : 'togglerAlign_open' 
                },
                close:{ 
                    tip   : 'togglerTip_closed',
                    length: 'togglerLength_closed',
                    align : 'togglerAlign_closed' 
                }
            },

            spacing:{
                open : 'spacing_open',
                close: 'spacing_closed'
            }

        },

        /**
         *  rulenames 指定需要重命名的属性集
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _doRealMap
         *  @param      {String}    target      -   north/south/west/east/center
         *  @param      {Array}     rulenames  -    要进行映射的配置节
         *  @param      {Object}    origin      -   原始配置对象
         *  @return     {Object}
         */
        _doRealMap : function ( target,rulenames,origin ) {

            var me = this;
            var config = {};
            var dest = {};

            for (var i = 0,l = rulenames.length; i < l; i++) {
                var name = rulenames[i];
                var rules = me._mapRules[name];

                //  name应该是fx或者toggler等
                //  判断原配置对象是否有配置对应的值
                if( origin[name] ){

                    //  对配置对象的每个属性进行映射
                    for( var rule in rules ){

                        var hasValForRule = ( origin[name][rule] !== null || origin[name][rule] !== undefined );
                        if( !me.isString( rules[rule] ) && hasValForRule ){

                            /*  
                             *  主要这边是有三级的配置对象。
                             *  确实，配置对象的深度过大也是很头疼的问题。
                             *  然后把最深处的配置对象扁平化，成为只包含一级的配置对象
                             *  _mapRules:{
                             *      toggler:{
                             *          hideOnSlide : 'hideTogglerOnSlide',
                             *          open :{ 
                             *              tip: 'togglerTip_open',
                             *              length: 'togglerLength_open',
                             *              align:'togglerAlign_open' 
                             *          }
                             *      }
                             *  }
                             */
                            var subrules = rules[rule];
                            for( var key in subrules ){
                                dest[subrules[key]] = origin[name][rule][key];
                            }

                        }else if( hasValForRule ){
                            //  save property and value
                            dest[rules[rule]] = origin[name][rule];
                        }

                    }

                    delete origin[name];
                }

            }

            $.extend( dest,origin );

            config[target] = dest;

            return config;
        },

        /**
         *  映射ui layout的整体默认配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _mapToDefaultSection
         *  @return     {Object}
         */
        _mapToDefaultSection:function( settings ){

            /*
             *  about the applyDefaultStyles cconfig
             *  When applyDefaultStyles is enabled, the layout will apply basic styles directly to resizers & buttons. This is intended for quick mock-ups, so that you can 'see' your layout immediately.
             *  to read more, @see http://layout.jquery-dev.net/documentation.cfm#Option_applyDefaultStyles
             */
            var config = {
                name              : 'defaults',
                applyDefaultStyles: false,
                defaults: {
                    size   :  "auto",
                    minSize:  50
                }
            };

            //  指定需要重命名的属性集
            var rulenames = [
                'fx',
                'button',
                'content'
            ];

            for (var i = 0,l = rulenames.length; i < l; i++) {

                var name = rulenames[i];
                var rules = this._mapRules[name];

                for( var rule in rules ){

                    if( settings[name] ){
                        //  propertye name after mapping
                        var mapedProp = rules[rule];
                        //  property value
                        var propVal   = settings[name][rule];
                        //  save property and value
                        config['defaults'][mapedProp] = propVal;
                    }

                }

            };

            if( settings['panes'] && settings['panes']['cls'] ){
                config['defaults']['paneClass'] = settings['panes']['cls'];
            }

            return config;
        },

        /**
         *  映射ui layout的主题内容pane的配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _mapToDefaultSection
         *  @return     {Object}
         */
        _mapToCenterSection:function( settings ){

            if( !settings['panes'] || !settings['panes']['center'] ){
                return {};
            }
            
            var config = { center : {} };
            var before = settings['panes']['center'];
            for( var item in before ){
                if( item != 'toggler' ){
                    config['center'][item] = before[item];
                }
            }

            return config;
        },

        /**
         *  映射ui layout的east pane的配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _mapToEastSection
         *  @return     {Object}
         */
        _mapToEastSection:function( settings ){
            if( !settings['panes'] || !settings['panes']['east'] ){
                return {};
            }
            return this._doRealMap( 'east',['fx','toggler','spacing'],settings['panes']['east'] );
        },

        /**
         *  映射ui layout的west pane的配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _mapToWestSection
         *  @return     {Object}
         */
        _mapToWestSection:function( settings ){
            if( !settings['panes'] || !settings['panes']['west'] ){
                return {};
            }
            return this._doRealMap( 'west',['fx','toggler','spacing'],settings['panes']['west'] );
        },

        /**
         *  映射ui layout的north pane的配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _mapToNorthSection
         *  @return     {Object}
         */
        _mapToNorthSection:function( settings ){
            if( !settings['panes'] || !settings['panes']['north'] ){
                return {};
            }

            return this._doRealMap( 'north',['fx','toggler','spacing'],settings['panes']['north'] );
        },

        /**
         *  映射ui layout的south pane的配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _mapToSouthSection
         *  @return     {Object}
         */
        _mapToSouthSection:function( settings ){
            if( !settings['panes'] || !settings['panes']['south'] ){
                return {};
            }
            return this._doRealMap( 'south',['fx','toggler','spacing'],settings['panes']['south'] );
        },

        /**
         *  把ebaui.web.UiLayout自定义的JS配置类格式，转换成为jqUILayout插件所使用的JS配置格式
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _map
         *  @return     {Object}
         */
        _map:function( settings ){

            var me = this;
            var defaults = me._mapToDefaultSection( settings );
            var north    = me._mapToNorthSection( settings );
            var south    = me._mapToSouthSection( settings );
            var west     = me._mapToWestSection( settings );
            var east     = me._mapToEastSection( settings );
            var center   = me._mapToCenterSection( settings );

            var uiLayoutConfig = $.extend( {},defaults,north,south,west,east,center );

            return uiLayoutConfig;
        },

        _getPanesConf : function(){

            var self        = this;
            var $root       = self._$root;
            var defualts    = self.options['layout']['panes'];
            var $westPane   = $( '[data-role="layout-west"]',$root );
            var $eastPane   = $( '[data-role="layout-east"]',$root );
            var $northPane  = $( '[data-role="layout-north"]',$root );
            var $southPane  = $( '[data-role="layout-south"]',$root );
            var $centerPane = $( '[data-role="layout-center"]',$root );

            if( $westPane.size() > 0 ){
                var westPaneConf = self._parseDataOptions( $westPane );
                $.extend(defualts['west'],westPaneConf);
            }

            if( $eastPane.size() > 0 ){
                var eastPaneConf = self._parseDataOptions( $eastPane );
                $.extend(defualts['east'],eastPaneConf);
            }

            if( $northPane.size() > 0 ){
                var northPaneConf = self._parseDataOptions( $northPane );
                $.extend(defualts['north'],northPaneConf);
            }

            if( $southPane.size() > 0 ){
                var southPaneConf = self._parseDataOptions( $southPane );
                $.extend(defualts['south'],southPaneConf);
            }

            if( $centerPane.size() > 0 ){
                var centerPaneConf = self._parseDataOptions( $centerPane );
                $.extend(defualts['center'],centerPaneConf);
            }

            return defualts;
        },

        /**
         *  把HTML占位符转换成为控件自身的HTML结构
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _parseUi
         */
        _parseUi : function( element ){ return $( element ); },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     _initControl
         */
        _initControl : function(){

            //  get plugin config then init layout plugin
            var panesConfig   = this._getPanesConf();
            var config = $.extend(this.options['layout']['panes'], panesConfig);
            var layoutConfig = this._map( this.options['layout'] );

            this._layoutPlugin = this._$root.layout( layoutConfig ); 

        },

        /**
         *  A hash containing the dimensions of all the elements, including the layout container. Dimensions include borders and padding for: top, bottom, left, right, plus outerWidth, outerHeight, innerWidth, innerHeight.
         *  <br />获取当前uilayout的状态，包含uilayout容器的innerWidth，paddingLeft
         *  ，以及所有panes的top， bottom， left， right，outerWidth， outerHeight， innerWidth， innerHeight
         *  ，参数可选的值有container north east south west center
         *  ，默认返回uilayout所有的状态
         *  @public
         *  @instance
         *  @memberof       ebaui.web.UiLayout
         *  @member         {Object}    state
         */
        state : function( pane ){
            if( this._layoutPlugin ){

                if( /north|east|south|west|center|container/i.test( pane ) ){
                    return this._layoutPlugin.state[pane];
                }else{
                    return this._layoutPlugin.state;
                }

            }
        },

        /**
         *  pane objects( panes.north, panes.south, etc ).Each pane-element is in a jQuery wrapper.If a pane does not exist in the layout - for example no south-pane - then panes.south == false - instead of being a jQuery element.
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @member     {Object}     panes
         */
        panes : function(){

            if( this._layoutPlugin ){
                return this._layoutPlugin.panes;
            }

        },

        /**
         *  get pane object
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     getPane
         *  @param      {String}    pane  -  north/south/west/east/center
         */
        getPane : function( pane ){

            if( this._layoutPlugin ){
                if( /north|east|south|west|center/i.test( pane ) ){
                    return this._layoutPlugin.panes[pane];
                }
            }

        },

        /**
         *  显示或者隐藏指定区域
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     togglePane
         *  @param      {String}    pane  -  north/south/west/east/center
         */
        togglePane:function( pane ){

            var me = this;
            if( !me.isString( pane ) ){
                return ;
            }

            if( me._layoutPlugin ){
                return me._layoutPlugin.toggle( pane );
            }

        },

        /**
         *  展开指定区域
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     openPane
         *  @param      {String}    pane  -  north/south/west/east/center
         */
        openPane:function( pane ){

            var me = this;
            if( !me.isString( pane ) ){
                return ;
            }

            if( me._layoutPlugin ){
                return me._layoutPlugin.open( pane );
            }

        },

        /**
         *  缩起指定区域
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     closePane
         *  @param      {String}    pane  -  north/south/west/east/center
         */
        closePane:function( pane ){

            var me = this;
            if( !me.isString( pane ) ){
                return ;
            }

            if( me._layoutPlugin ){
                return me._layoutPlugin.close( pane );
            }
        },

        /**
         *  显示指定区域
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     showPane
         *  @param      {String}    pane  -  north/south/west/east/center
         */
        showPane:function( pane ){

            var me = this;
            if( !me.isString( pane ) ){
                return ;
            }

            if( me._layoutPlugin ){
                return me._layoutPlugin.show( pane );
            }
        },

        /**
         *  隐藏指定区域
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     hidePane
         *  @param      {String}    pane  -  north/south/west/east/center
         */
        hidePane:function( pane ){

            var me = this;
            if( !me.isString( pane ) ){
                return ;
            }

            if( me._layoutPlugin ){
                return me._layoutPlugin.hide( pane );
            }
        },

        /**
         *  对于north 和 south 这两个pane更新其outerHeight
         *  ，对于east 和 west 则更新outerWidth
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     sizePane
         *  @param      {String}    pane            -  north/south/west/east/center
         *  @param      {Number}    sizeInPixels    -  sizeInPixels
         */
        sizePane : function( pane, sizeInPixels ){

            var me = this;
            if( me._layoutPlugin ){

                if( /north|east|south|west|center/i.test( pane ) ){
                    return me._layoutPlugin.sizePane( pane,sizeInPixels );
                }

            }

        },

        /**
         *  重新调整所有的pane，以便所有的pane能够适应容器元素的大小
         *  @public
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @method     resizeAllPanes
         *  @param      {String}    pane  -  north/south/west/east/center
         */
        resizeAllPanes:function(){
            var me = this;
            if( me._layoutPlugin ){
                return me._layoutPlugin.resizeAll();
            }
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.UiLayout
         *  @member     {Object}    options
         */
        options : {

            //  默认配置
            layout:{

                    size                  : "auto"
                ,   minSize               : 0
                ,   maxSize               : 0

                /*
                 *  spacing的配置
                 *  参考文档：http://layout.jquery-dev.net/documentation.cfm#Option_paneSelector
                 *  
                 *  HTML结构：
                 *  pane
                 *      ->  spacing
                 *          ->  toggler
                 */

                /*
                 *  toggler的配置
                 *  关于toggler的更多信息，请参考文档：http://layout.jquery-dev.net/documentation.cfm#toggler
                 *
                 *  map to the following config 
                 *
                 *  togglerClass:           "toggler"   // default = 'ui-layout-toggler'
                 *  togglerLength_open:     35          // WIDTH of toggler on north/south edges - HEIGHT on east/west edges
                 *  togglerLength_closed:   35          // "100%" OR -1 = full height
                 *  togglerTip_open:        "Close This Pane"
                 *  togglerTip_closed:      "Open This Pane"
                 *  hideTogglerOnSlide:     true        // hide the toggler when pane is 'slid open'
                 *  togglerAlign_open:      "center"
                 *  togglerAlign_closed:    "center"
                 *      "left", "center", "right", "top", "middle", "bottom"
                 */

                /*
                 *  panes的配置
                 *  关于content的更多信息，请参考文档：
                 *      http://layout.jquery-dev.net/documentation.cfm#Option_paneSelector
                 *      http://layout.jquery-dev.net/documentation.cfm#Panes
                 *      http://layout.jquery-dev.net/documentation.cfm#Callback_Functions
                 *      http://layout.jquery-dev.net/documentation.cfm#Option_paneSelector
                 *
                 *  map to the following config 
                 *
                 *  paneClass:              "ui-layout-pane"      // default = 'ui-layout-pane'
                 *  paneSelector: ".ui-layout-PANE"
                 *  
                 *  $(document).ready(function() {
                 *     $("body").layout({
                 *        // using custom 'ID' paneSelectors
                 *        north__paneSelector:  "#north"
                 *     ,  west__paneSelector:   "#west"
                 *     ,  center__paneSelector: "#center"
                 *     });   
                 *  });
                 */
                ,   panes : {

                    cls      : 'ui-layout-pane',
                    west     : {

                        size        : 'auto',
                        initClosed  : false,
                        closable    : true,
                        slidable    : true,
                        resizable   : true,
                        paneSelector: '[data-role="layout-west"]',
                        spacing     :{ open : 5,close : 5 },
                        toggler       : { 
                            cls  : 'ui-layout-toggler',
                            hideOnSlide:     true,
                            open :{ align:'center',tip: 'Close This Pane',length: 35 }, 
                            close :{ align:'center',tip: 'Open This Pane',length: 35 } 
                        }

                    },
                    east     : {

                        size        : 'auto',
                        initClosed  : false,
                        closable    : true,
                        slidable    : true,
                        resizable   : true,
                        paneSelector: '[data-role="layout-east"]',
                        spacing     :{ open : 5,close : 5 },
                        toggler       : { 
                            cls  : 'ui-layout-toggler',
                            hideOnSlide:     true,
                            open :{ align:'center',tip: 'Close This Pane',length: 35 }, 
                            close :{ align:'center',tip: 'Open This Pane',length: 35 } 
                        }

                    },
                    north    : {

                        size        : 'auto',
                        initClosed    : false,
                        closable      : true,
                        slidable      : true,
                        resizable     : true,
                        paneSelector  : '[data-role="layout-north"]',
                        spacing:{ open : 5,close : 5 },
                        toggler       : { 
                            cls  : 'ui-layout-toggler',
                            hideOnSlide:     true,
                            open :{ align:'center',tip: 'Close This Pane',length: 35 }, 
                            close :{ align:'center',tip: 'Open This Pane',length: 35 } 
                        }

                    },
                    south    : {

                        size        : 'auto',
                        initClosed  : false,
                        closable    : true,
                        slidable    : true,
                        resizable   : true,
                        paneSelector: '[data-role="layout-south"]',
                        spacing     :{ open : 5,close : 5 },
                        toggler       : {  
                            cls  : 'ui-layout-toggler',
                            hideOnSlide:     true,
                            open :{ align:'center',tip: 'Close This Pane',length: 35 }, 
                            close :{ align:'center',tip: 'Open This Pane',length: 35 } 
                        }

                    },
                    center   : { 
                        initClosed  : false,
                        closable    : true,
                        slidable    : true,
                        resizable   : true,
                        paneSelector: '[data-role="layout-center"]'

                    }

                }

                /*
                 *  content的配置
                 *  关于content的更多信息，请参考文档：http://layout.jquery-dev.net/documentation.cfm#Option_contentSelector
                 *
                 *  map to the following config 
                 *
                 *  contentSelector:        ".content"  // inner div to auto-size so only it scrolls, not the entire pane!
                 *  contentIgnoreSelector:  "span"      // 'paneSelector' for content to 'ignore' when measuring room for content
                 *  
                 */
                ,   content : {
                    // 'paneSelector' for content to 'ignore' when measuring room for content
                    ignoreSelector: 'span',
                    // inner div to auto-size so only it scrolls, not the entire pane!
                    selector      : '[data-role="content"]'
                }

                /*
                 *  custom buttons的配置
                 *  关于toggler的更多信息，请参考文档：http://layout.jquery-dev.net/documentation.cfm#Option_buttonClass
                 *  示例：outerLayout.addToggleBtn( "#tbarToggleNorth", "north" );
                 *
                 *  map to the following config 
                 *
                 *  buttonClass:            "button"    // default = 'ui-layout-button'
                 *  
                 */
                ,   button:{
                    cls : 'ui-layout-button'
                }

                /*
                 *  特效的配置
                 *  
                 *  map to the following config 
                 *
                 *  fxName:                 "slide"     // none, slide, drop, scale
                 *  fxSpeed_open:           400     normal
                 *  fxSpeed_close:          400     normal
                 *  fxSettings_open:        { easing: "easeInQuint" }
                 *  fxSettings_close:       { easing: "easeOutQuint" }
                 *  
                 */
                ,   fx:{
                    name : 'slide',
                    open : { easing: "easeInQuint", duration : 400 },
                    close: { easing: "easeOutQuint", duration : 400 }
                }

                /*
                 *  resizer的配置
                 *  
                 *  map to the following config 
                 *
                 *  resizerClass:           "resizer"   // default = 'ui-layout-resizer'
                 *  resizerTip:             "Resize This Pane"
                 */
                ,   resizer : {
                    cls : 'ui-layout-resizer',
                    tip : 'Resize This Pane'
                }

                ,   paneEvents:{

                    onhide_start  :  $.noop,
                    onhide_end    :  $.noop,
                    
                    onshow_start  :  $.noop,
                    onshow_end    :  $.noop,
                    
                    onopen_start  :  $.noop,
                    onopen_end    :  $.noop,
                    
                    onclose_start :  $.noop,
                    onclose_end   :  $.noop,
                    
                    onresize_start:  $.noop,
                    onresize_end  :  $.noop

                }

            }

        }

    });

})( jQuery,ebaui );
/**
 *  
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ) {

    /** 
     *  Tab
     *  @class      Tab
     *  @param      {Object}    options     -   控件配置参数
     */
    function Tab(options){ this._init( options ); };

    Tab.prototype = {

        /**
         *  控件要用到的UI的CSS样式类
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @member         {Object}    _cssClass
         */
        _cssClass : { actived: 'eba-tab-active' },

        /**
         *  dom对象引用
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @member         {Object}    _$header
         */
        _$header : null,

        /**
         *  dom对象引用
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @member         {Object}    _$header
         */
        _$content : null,

        _headerHtmlTmpl : '#ebaui-template-tabs-header',

        _contentHtmlTmpl : '#ebaui-template-tabs-content',

        /**
         *  预编译的tab项静态模板
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @member         {Function}    _compiledHeaderTmpl
         */
        _compiledHeaderTmpl:$.noop,

        /**
         *  预编译的tab项静态模板
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @member         {Function}    _compiledContentTmpl
         */
        _compiledContentTmpl:$.noop,

        /**
         *  tab的header dom对象
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @member         {Object}    headerDom
         */
        headerDom:function(){
            return this._$header;
        },

        /**
         *  tab的content dom对象
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @member         {Object}    contentDom
         */
        contentDom:function(){
            return this._$content;
        },

        _updateStyleTitle:function(){
            var me = this;
            $( '.eba-tab-text',me._$header ).text( me.options['title'] );
        },

        /**
         *  tab的标题
         *  @public
         *  @instance
         *  @memberof       Tab
         *  @member         {String}    title
         */
        title  : function( val ){
            var me = this;
            if( !val ){ return me.options['title']; }
            me.options['title'] = val;
            me._updateStyleTitle();
        },

        /**
         *  tab内容的URL
         *  @public
         *  @instance
         *  @memberof       Tab
         *  @member         {String}    url
         */
        url    : function( val ){
            var me = this;
            if( !val ){ return me.options['url']; }
            me.options['url'] = val;
            me.refresh();
        },

        _updateStyleIcon:function(){
            var me = this;
            var iconCls = me.options['iconCls'];
            var cls = 'eba-tab-icon ';
            if( iconCls ){ cls += iconCls; }
            $( '.eba-tab-icon',me._$header ).attr('class',cls);
        },

        _updateStyleClosable: function () {
            var me        = this;
            var closable  = me.closable();
            var $root     = me.headerDom();
            var $btnClose = $('span',$root).last();

            if( !closable && $btnClose.size() > 0 ){
                $btnClose.remove();
                return;
            }

            if( closable && $btnClose.size() == 0 ){
                $root.append('<span class="eba-tab-close"></span>');
                return;
            }
        },

        /**
         *  获取或者设置tab是否可以关闭
         *  @public
         *  @instance
         *  @memberof       Tab
         *  @member         {String}    closable
         */
        closable :function( val ){
            var me = this;
            if( val == null ){ return me.options['closable']; }
            me.options['closable'] = val;
            me._updateStyleClosable();
        },

        /**
         *  tab的icon
         *  @public
         *  @instance
         *  @memberof       Tab
         *  @member         {String}    iconCls
         */
        iconCls: function( val ){
            var me = this;
            if( !val ){ return currIconCls; }
            me.options['iconCls'] = val;
            me._updateStyleIcon();
        },

        /**
         *  tab是否激活
         *  @public
         *  @instance
         *  @default        false
         *  @memberof       Tab
         *  @member         {Boolean}    isActived
         */
        isActived: function( val ){

            var me = this;
            if( me.isClosed() ){ return; }
            if( typeof val !== 'boolean' ){ return me.options['isActived']; }

            me.options['isActived'] = val;
            if( val ){
                me._$header.addClass('eba-tab-active');
                me._$content.show();
            }else{
                me._$header.removeClass('eba-tab-active');
                me._$content.hide();
            }

        },

        /**
         *  刷新tab页面的内容
         *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
         *  ，tab参数如果是一个string对象，那么默认按照tab的title属性进行查找
         *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         refreshTab
         *  @param          {Number|String|Function}        tab
         */
        refresh:function(){
            var me = this;
            if( me.isClosed() ){ return; }

            var timestamp = ( new Date ).getTime();
            var url = me.options['url'];
            url += ( url.indexOf( '?' ) == -1 ) ? ( '?t=' + timestamp ) : ( '&t=' + timestamp );
            $( 'iframe',me._$content ).attr( 'src',url );
        },

        _closed : false,

        isClosed:function(){ return this._closed; },
        /**
         *  关闭选项卡
         *  @public
         *  @instance
         *  @memberof       Tab
         *  @method         close
         */
        close:function(){
            var me = this;
            //  unbind event handlers
            $( 'iframe',me._$content ).off( 'load' );
            //  mark，表示这个tab已经关闭了
            me._closed = true;
            //  remove dom from dom tree
            me._$header.remove();
            me._$content.remove();
            //  release dom reference
            delete me._$header;
            delete me._$content;

        },

        /**
         *  初始化
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @member         {Object}    options
         */
        options : {
            isActived: false,
            iconCls  : '',
            title    : '',
            url      : '',
            closable : true
        },

        /**
         *  初始化
         *  @private
         *  @instance
         *  @memberof       Tab
         *  @method         _init
         */
        _init:function (options) {

            var me = this;
            var opts = $.extend({},me.options,options);

            me.options = opts;

            //  create dom
            var headerTmpl = $( me._headerHtmlTmpl ).html();
            var contentTmpl = $( me._contentHtmlTmpl ).html();

            me._$header = $( headerTmpl );
            me._$content = $( contentTmpl );

            //  init title and iframe src
            me._updateStyleTitle();
            me._updateStyleClosable();
            me._updateStyleIcon();

            me.refresh();
        }

    };

    ebaui.web.registerControl( 'Tabs' );

    /** 
     *  ebaui.web.Tabs
     *  @class      ebaui.web.Tabs 
     *  @memberof   ebaui.web
     *  @extends    基类
     *  @tutorial   tab_index
     *  @param      {Object}    options     -   控件配置参数
     *  @param      {Object}    element     -   dom对象
     */
    ebaui.control( 'web.Tabs', {

        /**
         *  控件HTML模板
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs 
         *  @member         {String}    _rootHtmlTmpl
         */
        _rootHtmlTmpl : '#ebaui-template-tabs',

        /**
         *  预编译的tab项静态模板
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs 
         *  @member         {Function}    _compiledTabTmpl
         */
        _compiledTabTmpl:$.noop,

        /**
         *  初始化DOM事件处理程序
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         _setupEvents
         */
        _setupEvents:function(){

            var self = this;
            var $root = this._$root;

            $root.on( 'click','.eba-tab',function( event ){

                var tabIndex = $( '.eba-tab',$root ).index( this );
                if( tabIndex == -1 ){ return; }
                self.activateTab( tabIndex );

            } );

            $root.on( 'click','.eba-tab-close',function( event ){
                //  close tab
                var tabIndex = $( '.eba-tab',$root ).index( $( this ).parent() );
                if( tabIndex == -1 ){ return; }
                self.closeTab( tabIndex );

            } );

        },

        /**
         *  在tab初始化并且被添加到_tabs集合中的时候，验证tab的初始化配置信息是否正确
         *  ，其中，url是必须指定的参数
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         _validateTabConfig
         *  @param          {Tab}                           opts
         */
        _validateTabConfig:function( opts ){
            if( !opts || !opts['url'] ){ return false; }
            return true;
        },

        /**
         *  初始化homeTab的配置，如果homeTab的配置正确，那么就把homeTab添加到选项卡里
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         _initControl
         */
        _initHomeTab:function(){

            /* 默认添加homeTab */
            var homeTab        = this.options['home'];
            var isHomeTabValid = this._validateTabConfig( homeTab );

            if( isHomeTabValid ){
                homeTab['title']  = ( homeTab['title'] ) ? homeTab['title'] : homeTab['url'];
                this.addTab( homeTab );
            }

        },

        /**
         *  初始化控件，声明内部变量
         *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         _initControl
         */
        _initControl : function(){
            /* contentRegion是必选参数 */
            this._$contentRegion = $( this.options['contentRegion'] );

            /* 如果指定的contentRegion里面没有ul，那么初始化的时候append一个新的ul */
            /* 我们的content的html格式是<li><iframe src=""></iframe></li> */
            var ulSize = $( 'ul',this._$contentRegion ).size();
            if( ulSize == 0 ){
                this._$contentRegion.append('<ul></ul>');
            }

            /* 默认添加homeTab */
            this._initHomeTab();
        },

        /**
         *  私有变量，用来保存所有tab对象
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs 
         *  @member         {Array}         _tabs
         */
        _tabs : [],

        /**
         *  homeTab配置，homeTab是默认首页
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs 
         *  @member         {Object}         _homeTab
         */
        _homeTab : null,

        /**
         *  当前激活的tab选项卡的对应引用
         *  @private
         *  @instance
         *  @memberof       ebaui.web.Tabs 
         *  @member         {Tab}        _currentTab
         */
        _currentTab : null,

        /**
         *  设置或者获取当前激活的tab选项卡对象
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs 
         *  @member         {Tab}                           currentTab
         *  @example        <caption>get</caption>
         *      var tab = console.log( ctrl.currentTab() );
         *  @example        <caption>set</caption>
         *      console.log( ctrl.currentTab( {Number|String|Function} ) );
         */
        currentTab : function ( tab ) {

            var me = this;
            if( tab == null ){ return me._currentTab; }

            var tabInstance = me.getTab( tab );
            if( me._currentTab && !me._currentTab.isClosed() ){
                me._currentTab.isActived( false );
            }else{
                /*
                 *  当前tab已经关闭了，那么就移除其引用
                 */
                me._currentTab = null;
            }

            if( tabInstance ){
                tabInstance.isActived( true );
                me._currentTab = tabInstance;
            }

        },

        /**
         *  添加一个新的选项卡
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         addTab
         *  @param          {Tab}                           tab
         */
        addTab : function( tab ){

            if( !tab ){ return; }

            var me = this;
            var tabIndex = me.indexOf( tab['url'] );
            if( tabIndex == -1 ){

                //  declare tab's index in tabs collection
                tabIndex = me._tabs.length;
                //  new a Tab instance
                var instance = new Tab( tab );
                //  add a new tab
                me._tabs.push( instance );
                //  gen a new html fragment
                var html = me._compiledTabTmpl( tab );

                //  append tab to dom
                $( 'ul',me._$root ).append( instance.headerDom() );
                //  append tab content to dom
                $( 'ul',me._$contentRegion ).append( instance.contentDom() );

            }
            //  final activate me tab
            me.activateTab( tabIndex );

        },

        /**
         *  关闭选项卡
         *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
         *  ，tab参数如果是一个string对象，那么默认按照tab的url属性进行查找
         *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         closeTab
         *  @param          {Number|String|Function}        tab
         */
        closeTab : function( tab ){

            var me = this;
            var tabIndex = me.indexOf( tab );
            if( tabIndex == -1 ){ return; }
            //  set currentTab
            var myTabs = me._tabs;
            var lastIndex = tabIndex === 0 ? 1 : ( tabIndex - 1 > 0 ? tabIndex - 1 : 0 );
            if( lastIndex > myTabs.length ){
                lastIndex = myTabs.length - 1;
            }

            var tabToClose = myTabs[tabIndex];
            var currTab = me.currentTab();
            if( currTab == tabToClose ){ me.activateTab( lastIndex ); }

            //  close tab and remove dom reference
            tabToClose.close();
            tabToClose = null;
            //  remove tab instance from tabs collection
            myTabs.splice( tabIndex,1 );
            me._tabs = myTabs;
        },

        /**
         *  关闭所有选项卡
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         closeAllTab
         */
        closeAllTab : function(){
            var me      = this;
            var keep    = [];
            var removal = []
            var myTabs  = me._tabs;
            //  iterate all tab instances
            for (var i = 0,l = myTabs.length; i < l; i++) {
                var item = myTabs[i];
                if( !item.closable() ){
                    keep.push( item );
                }else{
                    removal.push( item );
                }
            }

            for (var i = 0,l = removal.length; i < l; i++) {
                removal[i].close();
            };
            //  release old tab collection
            me._tabs = keep;
            if( keep.length > 0 ){ me.activateTab(0); }
        },

        /**
         *  关闭指定选项卡以外的所有选项卡
         *  ，but参数如果是一个int对象,那么直接but参数作为索引查找tab
         *  ，but参数如果是一个string对象，那么默认按照url属性进行查找
         *  ，but参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         closeAllTab
         *  @param          {Number|String|Function}        but
         *  @example
         *      ctrl.closeOtherTabs(0);
         *      ctrl.closeOtherTabs('tabname');
         */
        closeOtherTabs:function( but ){

            var me = this;
            var tabIndex = me.indexOf( but );
            if( tabIndex == -1 ){ return; }

            //  first activate the excluded tab
            me.activateTab( tabIndex );

            //  close other tabs
            for (var i = 0,l = me._tabs.length; i < l; i++) {
                if( tabIndex != i ){
                    me._tabs[i].close();
                }
            }

            //  maintains internal status
            var excludeTab = me.getTab( tabIndex );
            me._tabs = [ excludeTab ];

        },

        /**
         *  获取选项卡对象
         *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
         *  ，tab参数如果是一个string对象，那么默认按照tab的url属性进行查找
         *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
         *  ，如果没有找到tab的实例，返回null
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         getTab
         *  @param          {Number|String|Function}        tab
         *  @returns        {Tab}
         */
        getTab : function( tab ){
            var me = this;
            var tabIndex = me.indexOf( tab );
            if( tabIndex == -1 ){ return null; }
            return me._tabs[tabIndex];
        },

        /**
         *  获取选项卡对象的索引
         *  ，如果isEqual参数是一个合法的索引，那么直接返回
         *  ，isEqual参数如果是一个string对象，那么默认按照tab的url属性进行查找
         *  ，isEqual参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         indexOf
         *  @param          {Number|String|Function}               isEqual or tab name
         *  @returns        {Number}
         */
        indexOf : function( isEqual ){

            var me = this;
            if( me.isNull( isEqual ) || me._tabs.length == 0 ){ 
                return -1; 
            }

            var tabIndex = -1;
            if( me.isNumber( isEqual ) ){

                tabIndex = parseInt( isEqual );
                if( isNaN( tabIndex ) || tabIndex < 0 || tabIndex >= me._tabs.length ){
                    tabIndex = -1;
                }
                return tabIndex;

            }

            var fn = null;
            if( me.isString( isEqual ) ){
                /* well, tab parameter is a instance of Tab class */
                fn = function( tab ){
                    return tab['url']() === isEqual; 
                };

            }else if( me.isFunc( isEqual ) ){
                fn = isEqual;
            }else{
                return -1;
            }

            var tabs = me._tabs;
            for (var i = 0,l = tabs.length; i < l; i++) {
                if( fn( tabs[i] ) ){
                    tabIndex = i;
                    break;
                }
            }

            return tabIndex;

        },

        /**
         *  激活指定的选项卡
         *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
         *  ，tab参数如果是一个string对象，那么默认按照tab的url属性进行查找
         *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         activateTab
         *  @param          {Number|String|Function}        tab
         */
        activateTab : function( tab ){
            var me = this;
            var tabIndex = me.indexOf( tab );
            if( tabIndex === -1 ){ return; }
            me.currentTab( tabIndex );

        },

        /**
         *  刷新tab页面的内容
         *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
         *  ，tab参数如果是一个string对象，那么默认按照tab的url属性进行查找
         *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs
         *  @method         refreshTab
         *  @param          {Number|String|Function}        tab
         */
        refreshTab : function( tab ){
            var me = this;
            /* if tab parameter was not been assigned, the current active tab will be refreshed */
            if( me.isNull( tab ) ){
                var currTab = me.currentTab();
                if( currTab ){
                    currTab.refresh();
                }
                return;
            }

            var tabInstance = me.getTab( tab );
            if( tabInstance ){
                tabInstance.refresh();
            }

        },

        /**
         *  调整tab内容区域的iframe的width以及height
         *  @public
         *  @instance
         *  @memberof       ebaui.web.Tabs 
         *  @method         resizeContent
         */
        resizeContent:function( size ){

            if( !size ){ return; }
            var me = this;
            if( me.isNull(size['width']) ){ return; }

            var $content = me._$contentRegion;
            var $ifm = $( 'iframe',$content );
            
            $ifm.width(size['width']);
            $ifm.height(size['height']);

        },

        /**
         *  jquery选择器
         *  ，用来指定tab内容的区域
         *  ，控件content内容将会输出在这个地方
         *  @public
         *  @instance
         *  @readonly
         *  @memberof       ebaui.web.Tabs 
         *  @member         {String}                        contentRegion
         */
        contentRegion:function(){ return this.options['contentRegion']; },

        /**
         *  默认首页，{ title:'',url:'' }，其中，url是必选项
         *  。如果没有指定title，则title默认为 Tab + tabIndex。
         *  @public
         *  @instance
         *  @readonly
         *  @memberof       ebaui.web.Tabs 
         *  @member         {Object}                        home
         */
        home:function( val ){
            if( !val ){ return this.options['home']; }
        },

        /**
         *  控件配置
         *  @private
         *  @instance
         *  @memberof   ebaui.web.Tabs
         *  @member     {Object}            options
         */
        options : {

            //  默认首页
            home:{ title:'',url:'',closable:false },

            //  jquery选择器，用来指定tab内容的区域, 控件输出的内容将会全部显示在这边
            contentRegion : '.eba-tabs-body'
        }

    });

})( jQuery,ebaui );