/**
 *  ebaui的核心文件
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $ ){

    var uuid = 0;

    //  [Javascript Char Codes (Key Codes)](http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)
    var keycodes = {

        //  主键盘区的功能键
        backspace  : 8,
        tab        : 9,
        enter      : 13,
        shift      : 16,
        ctrl       : 17,
        alt        : 18,
        caps_lock  : 20,
        escape     : 27,
        
        //  主键盘区的功能键
        f1         : 112,
        f2         : 113,
        f3         : 114,
        f4         : 115,
        f5         : 116,
        f6         : 117,
        f7         : 118,
        f8         : 119,
        f9         : 120,
        f10        : 121,
        f11        : 122,
        f12        : 124,
        
        //  主键盘区的数字键
        number     : [48,49,50,51,52,53,54,55,56,57],

        //  主键盘上的'='符号
        equalSign:187,
        //  主键盘上的','符号
        comma:188,
        //  主键盘上的'-'符号
        dash:189,

        //  小键盘上功能键
        pause_break: 19,
        page_up    : 33,
        page_down  : 34,
        end        : 35,
        home       : 36,
        left_arrow : 37,
        up_arrow   : 38,
        right_arrow: 39,
        down_arrow : 40,
        insert     : 45,
        del        : 46,

        //  小键盘上的数字键
        numpad     : [96,97,98,99,100,101,102,103,104,105],

        /**
         *  判断键盘输入是否是数字
         *  @public
         *  @static
         *  @method     isNumber
         *  @memberof   ebaui.keycodes
         */
        isNumber:function( code ){

            if( typeof code !== 'number' ){
                return false;
            }
            
            /* 输入的值在数字键盘区域 */
            var inNumPad = ( 96 <= code && code <= 105 );
            /* 输入的值在主键盘区域 */
            var inMainPad = ( 48 <= code && code <= 57 );

            return (inNumPad || inMainPad);

        }

    };

    /** 
     *  ebaui 全局命名空间
     *  @namespace  ebaui
     */
    var ebaui = {
        
        /**
         *  键盘键位的key值
         *  @public
         *  @static
         *  @member     {Object}    keycodes
         *  @memberof   ebaui
         */
        keycodes       : keycodes,

        escape:function( str ){

            var re = /[&<>"']/g;
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;'
            };

            if (str == null){ 
                return ''; 
            }
            return ('' + str).replace(re, function(match) {
                return map[match];
            });

        },

        unescape:function( str ){
            var re = /(&amp;|&lt;|&gt;|&quot;|&#x27;)/g;
            var map = {
                '&amp;' : '&',
                '&lt;'  : '<',
                '&gt;'  : '>',
                '&quot;': '"',
                '&#x27;': "'"
            };

            if (str == null){ 
                return ''; 
            }
            return ('' + str).replace(re, function(match) {
                return map[match];
            });
        },

        /** 
         *  将javascript对象序列化成JSON字符串
         *  @public
         *  @static
         *  @method     toJSON
         *  @memberof   ebaui
         *  @param      {Object}    val     -   要进行JSON序列化的对象
         */
        toJSON : function( val ){

            if( !val ){ return ''; }

            return JSON.stringify( val );

        },

        /** 
         *  将JSON字符串反序列化成javascript对象
         *  @public
         *  @static
         *  @method     fromJSON
         *  @memberof   ebaui
         *  @param      {String}    json    -   JSON字符串
         */
        fromJSON : function( json ){

            if( !json ){ return null; }

            return JSON.parse( json );

        },



        /** 
         *  生成guid
         *  @public
         *  @static
         *  @method     guid
         *  @memberof   ebaui
         *  @return     {String}    guid
         */
        guid : function(){
            return 'eba-ui-' + ( ++uuid );
        },

        /** 
         *  根据控件ID获取控件对象
         *  @public
         *  @static
         *  @method     getById
         *  @memberof   ebaui
         *  @param      {String}    id              -   控件ID
         *  @param      {String}    [contextId]     -   控件上下文容器ID
         *  @return     {Object}
         */
        getById : function( id,contextId ){
            return ebaui.get( '#' + id,contextId );
        },

        /** 
         *  根据css选择器获取控件对象
         *  @public
         *  @static
         *  @method     get
         *  @memberof   ebaui
         *  @param      {String}    cssSelector   -   控件css选择器
         *  @param      {String}    [context]     -   控件上下文容器css选择器
         *  @return     {Object}
         */
        get : function( cssSelector,context ){
            var $dom = $( cssSelector,context );
            return $dom.data('model');
        },

        /** 
         *  加载PC端HTML模板信息，并且自动初始化每一个UI控件
         *  @public
         *  @static
         *  @method     parseUi
         *  @memberof   ebaui.web
         *  @param      {String}    上下文CSS选择器
         */
        parseUi : function( context ){
            this.web.parseUi( context );
        }

    };

    window.ebaui = ebaui;

    $( function(){ 

        ebaui.parseUi();

        var trigger = function( handle ){
            var fn = window[handle];
            if( fn && typeof fn == 'function' ){
                fn();
            }
        };

        trigger( 'initPage' );

        $( window ).on( 'load',function( eventArgs ){
            trigger( 'loadPage' );
        });

        $( window ).on( 'unload',function( eventArgs ){
            trigger( 'unloadPage' );
        } );

    } );

})( jQuery );

/**
 *  ebaui.web
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ){

    var namespace = {
        
        /** 
         *  项目引用eba.ui框架的时候，自动算出ebaui.js前面的URL路径
         *  @public
         *  @static
         *  @member     {String}    templates
         *  @memberof   ebaui.web
         */
        urlRoot : '',

        formControls : [],

        controls : [],

        /** 
         *  HTML模板
         *  @public
         *  @static
         *  @member     {String}    templateString
         *  @memberof   ebaui.web
         */
        templateString : '',

        /** 
         *  HTML模板的URL地址
         *  @public
         *  @static
         *  @member     {String}    templates
         *  @memberof   ebaui.web
         */
        templateUrl : '',

        /** 
         *  
         *  @public
         *  @static
         *  @method     _loadRemoteTemplates
         *  @memberof   ebaui.web
         *  @param      {Function}  success     - HTML模板加载成功的回调
         *  @param      {Function}  error       - HTML模板加载失败的回调
         */
        _loadRemoteTemplates:function(success,error){

            var me = this;
            var templatesUrl = me.templateUrl;
            if( !me.urlRoot ){

                var RE = /(.*)\/(ebaui\.js|ebaui(-\d\.\d\.\d)?\.js|ebaui(-\d\.\d\.\d)?\.min\.js)(.*)$/;
                var scripts = document.getElementsByTagName('script');
                for( var i = 0 ,l = scripts.length;i < l;i++ ){
                    var scriptSrc = scripts[i].src;
                    if( RE.test( scriptSrc ) ){
                        var matched = RE.exec( scriptSrc );
                        var prefix = matched[1];
                        if( prefix.substring( prefix.length - 1,prefix.length ) != '/' ){
                            prefix += '/';
                        }
                        me.urlRoot = prefix;
                        break;
                    }
                }

            }

            if( !me.templateUrl ){
                templatesUrl = me.urlRoot + 'ebaui.templates.html';
            }

            if( templatesUrl ){

                $.ajax({
                    type    : 'GET',
                    dataType: 'html',
                    url     : templatesUrl,
                    async   : false,
                    success : function( serverData ){
                        success( serverData );
                    }
                });

            }else{

                ebaui.log( 'loadTemplates error' );
                if(typeof error === 'function' ){
                    error();
                }

            }

        },

        /** 
         *  
         *  @public
         *  @static
         *  @method     _loadLocalTemplates
         *  @memberof   ebaui.web
         *  @param      {Function}  success     - HTML模板加载成功的回调
         *  @param      {Function}  error       - HTML模板加载失败的回调
         */
        _loadLocalTemplates:function(success,error){
            success( this.templateString );
        },

        /** 
         *  加载WEB控件的HTML模板
         *  @public
         *  @static
         *  @method     loadTemplates
         *  @memberof   ebaui.web
         *  @param      {Function}  successFn     - HTML模板加载成功的回调
         *  @param      {Function}  errorFn       - HTML模板加载失败的回调
         */
        loadTemplates : function( successFn,errorFn ){
            var me = this;
            if( !me.templateString ){
                me._loadRemoteTemplates( successFn,errorFn );
            }else{
                me._loadLocalTemplates( successFn,errorFn );
            }
        },

        /** 
         *  注册成为一个UI控件
         *  @public
         *  @static
         *  @method     registerControl
         *  @memberof   ebaui.web
         *  @param      {String}    name        - 控件名
         */
        registerControl : function( name ){
            if( !name ){ return; }
            this.controls.push( name.toLocaleLowerCase() );
        },

        /** 
         *  注册成为一个Form表单UI控件
         *  @public
         *  @static
         *  @method     registerControl
         *  @memberof   ebaui.web
         *  @param      {String}    name        - 控件名
         */
        registerFormControl:function( name ){
            if( !name ){ return; }
            name = name.toLocaleLowerCase();
            this.controls.push( name );
            this.formControls.push( name );
        },

        /** 
         *  自动初始化所有WEB控件。其实所有的控件最后都有一个对应的jquery插件方法，初始化的时候就是调用这个插件方法去实例化一个控件。
         *  @public
         *  @static
         *  @method     parseControls
         *  @memberof   ebaui.web
         */
        parseControls : function( context ){

            var controls = this.controls;
            for( var i = 0,l = controls.length; i<l; i++ ){

                var control = controls[i];
                var jqSelector = '[data-role="' + control + '"]';
                var $elements = $( jqSelector,context );
                if( $elements.size() > 0 && $elements[control]){
                    $elements[control]();
                }

            }

        },

        /** 
         *  加载PC端HTML模板信息，并且自动初始化每一个UI控件
         *  @public
         *  @static
         *  @method     parseUi
         *  @memberof   ebaui.web
         *  @param      {String}    上下文CSS选择器
         */
        parseUi : function( context ){

            var self = this;
            var controlParser = self.parser;

            context  = context || document;

            self.loadTemplates( function( serverData ){

                var selector = '#ebaui-templates';
                var $dom = $(selector);
                if( $dom.size() == 0 ){
                    $dom = $( '<div id="ebaui-templates" style="display:none;"></div>' ).appendTo(document.body);
                }

                $dom.html( serverData );
                self.parseControls( context );

            } );

        },

        /**
         *  ebaui前端框架执行的一系列浏览器特性检测以及BUG的结果
         *  @memberof   ebaui.web
         *  @member     {Object}    support
         */
        support : {},

        /**
         *  表单控件验证规则的构造器工厂，默认提供required,email,url等验证规则  <br />
         *  关于如何启用验证规则请参考 {@tutorial form_index}  <br />
         *  关于拓展当前控件规则请参考 {@tutorial extend_validationRules}  <br />
         *  @public
         *  @member     {Object}    validationRules
         *  @memberof   ebaui.web
         *  @property   {RequiredValidator}     required        -       required验证规则构造函数
         *  @property   {EmailValidator}        email           -       email地址验证规则构造函数
         *  @property   {UrlValidator}          url             -       url地址验证规则构造函数
         *  @property   {UrlValidator}          captcha         -       认证码验证规则构造函数
         */
        validationRules:{}
    };

    /** 
     *  PC端浏览器控件所属命名空间
     *  @namespace  ebaui.web
     */
    ebaui['web'] = namespace;

    /** 
     *  给指定的HTML元素设置遮罩
     *  @method     mask
     *  @memberof   ebaui
     *  @param      {Object}    selector                 -   必选，jquery 选择器
     *  @param      {String}    [label='']       -   可选，遮罩层的文本信息
     *  @param      {Number}    [delay=null]             -   可选，在HTML元素打上遮罩之前的延迟时间
     *  @param      {Object}    [context=null]           -   可选，jquery 选择器上下文
     */
    ebaui['mask'] = function( selector, label, delay, context ){
        label = ( !label ) ? '' : label;
        return $( selector,context ).mask(label, delay);
    };

    /** 
     *  取消指定HTML元素上的遮罩
     *  @method     unmask
     *  @memberof   ebaui
     *  @param      {Object}    selector           -   必选，jquery 选择器
     *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
     */
    ebaui['unmask'] = function( selector, context ){
        return $( selector,context ).unmask();
    };

    /** 
     *  判断指定的HTML元素是否有遮罩
     *  @method     isMasked
     *  @memberof   ebaui
     *  @param      {Object}    selector           -   必选，jquery 选择器
     *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
     */
    ebaui['isMasked'] = function( selector, context ){
        return $( selector,context ).isMasked();
    };

    /** 
     *  alert对话框
     *  @method     alert
     *  @memberof   ebaui
     *  @param      {String}        message                     -   alert的提示消息
     */
    ebaui['alert'] = function( msg ){
        vex.dialog.alert({
            title  : '提示',
            iconCls: 'icon-warning-sign',
            className: 'vex-theme-default',
            message: msg
        });
    };

    /** 
     *  confirm对话框
     *  @method     confirm
     *  @memberof   ebaui
     *  @param      {Object}        options                     -  配置对象
     *  @prop       {String}        options.message             -   confirm的提示消息
     *  @prop       {Function}      options.callback            -   点击确定或者取消按钮的回调函数
     *  @example    
     *      ebaui.confirm({
     *          message  : 'confirm',
     *          callback : function( value ){
     *              //  true or false
     *              console.log( value );
     *          }
     *      });
     */
    ebaui['confirm'] = function( opts ){
        var vexOpts = $.extend({}, {
            title    : '确认',
            iconCls  : 'icon-question-sign',
            className: 'vex-theme-default',
            buttons  : [vex.dialog.buttons.NO,vex.dialog.buttons.YES]
        }, opts);
        vex.dialog.confirm( vexOpts );
    };

    /** 
     *  prompt对话框
     *  @method     prompt
     *  @memberof   ebaui
     *  @param      {Object}        options                      -  配置对象
     *  @prop       {String}        options.message             -   prompt的提示消息
     *  @prop       {String}        options.placeholder         -   prompt的文本占位符
     *  @prop       {Function}      options.callback            -   点击确定或者取消按钮的回调函数
     *  @example    
     *      ebaui.prompt({
     *          message      : 'prompt',
     *          placeholder  : 'placeholder',
     *          callback     : function( value ){
     *              //  the value is what user has typed in the textbox
     *              console.log( value );
     *          }
     *      });
     */
    ebaui['prompt'] = function( opts ){
        opts = $.extend({}, {
            title    : '提示',
            className: 'vex-theme-default',
            buttons  : [vex.dialog.buttons.NO,vex.dialog.buttons.YES]
        }, opts);
        vex.dialog.prompt( opts );
    };

    /** 
     *  打开一个新的窗口
     *  @method     win
     *  @memberof   ebaui
     *  @param      {Object}        options                   -   配置对象
     *  @prop       {String}        options.title             -   窗口的标题
     *  @prop       {String}        options.url               -   窗口的url地址，优先使用
     *  @prop       {String}        options.iconCls           -   窗口的icon
     *  @prop       {String}        options.content           -   作为窗口的静态内容，如果url为空，则采用content作为窗口内容
     *  @prop       {Number}        options.width             -   窗口的宽度
     *  @prop       {Number}        options.height            -   窗口的高度
     *  @prop       {Function}      options.beforeclose       -   关闭窗口前的事件处理程序
     *  @prop       {Function}      options.afterclose        -   关闭窗口后的事件处理程序
     *  @example    
     *      ebaui.win({
     *          url    : 'http://www.baidu.com',
     *          title  : 'baidu'
     *      });
     */
    ebaui['win'] = function( opts ){

        if( !opts ){ return;}
        if( !opts['url'] || opts['content'] ){ return; }

        var winContent = '';
        var isIframe = (opts['url']) ? true : false;
        if( isIframe ){
            winContent = '';
        }else{
            winContent = $( opts['content'] ).html();
        }

        var html = '';
        var wrapper = '<div class="vex-dialog-form" style="height:100%;"><div class="vex-dialog-title"><i class="{0}"></i>{1}</div>{2}<div class="vex-close"></div></div>'
                      .replace('{0}',opts['iconCls'])
                      .replace('{1}',opts['title']);

        if( isIframe ){
            html = '<iframe src="{0}" style="width:100%;" frameborder="0" scrolling="no"></iframe>'.replace('{0}',opts['url']);
            opts['content'] = wrapper.replace( '{2}',html );

        }else{
            html = $( opts['content'] ).html();
            opts['content'] = wrapper.replace( '{2}',html );
        }

        var defaults = {
            title               : '',
            content             : '',
            width               : 800,
            height              : 600,
            className           : 'vex-theme-default',
            showCloseButton     : true,
            overlayClosesOnClick: false,
            
            beforeclose         : $.noop,
            afterclose          : $.noop
        };

        opts = $.extend(defaults,opts);

        var $vexContent = vex.open(opts);
        var $vex = $vexContent.parent();

        $vexContent.css({
            'border'          : '1px #eee solid',
            'width'           : opts['width'],
            'height'          : opts['height']
        });

        $vex.css({
            'padding-top'   : '50px',
            'padding-bottom': '0'
        });

        if( isIframe ){
            titleH = $('.vex-dialog-title',$vexContent).outerHeight();
            $( 'iframe',$vexContent ).css( 'height',$vexContent.height() - titleH );
        }

    };

    /** 
     *  文档请参考 http://api.jquery.com/jQuery.ajax/
     *  @method     ajax
     *  @memberof   ebaui
     */
    ebaui['ajax'] = jQuery.ajax;

    /** 
     *  文档请参考 http://api.jquery.com/jQuery.get/
     *  @method     httpGet
     *  @memberof   ebaui
     */
    ebaui['httpGet'] = jQuery.get;

    /** 
     *  http://api.jquery.com/jQuery.post/
     *  @method     httpPost
     *  @memberof   ebaui
     */
    ebaui['httpPost'] = jQuery.post;

})( jQuery,ebaui );
/**
 *  ebaui.web.support，ebaui前端框架执行的一系列浏览器特性检测以及BUG的结果
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,support ){

    support['placeholder'] = ( "placeholder" in document.createElement( "input" ) );

})( jQuery,ebaui.web.support );