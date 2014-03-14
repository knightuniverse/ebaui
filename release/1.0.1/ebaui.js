(function() {
  var ArrayProto, Button, ButtonEdit, Calendar, Captcha, CheckBox, CheckBoxList, Combo, ComboBox, ComboList, Control, DateTimePicker, DigitValidator, EmailValidator, FileUploader, Form, FormField, Hidden, IdentityValidator, Label, LengthValidator, ListBox, MainView, MiniGrid, MobileValidator, MonthView, ObjectProto, OnlyCnValidator, Panel, Password, RadioList, RangeValidator, RemoteValidator, RequiredValidator, Spinner, StringProto, Tab, Tabs, TelephoneValidator, TextArea, TextBox, TimeSpinner, UrlValidator, Validator, ZipValidator, ebaui, keyboard, nativeForEach, ns, slice, toString, uuid, vexDialog, web, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref3, _ref30, _ref31, _ref32, _ref33, _ref34, _ref35, _ref36, _ref37, _ref38, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  uuid = 0;

  /**
   *   ebaui 全局命名空间
   *   @namespace  ebaui
   *   @author Monkey <knightuniverse@qq.com>
  */


  ebaui = {
    escape: function(str) {
      var map, re;
      re = /[&<>"']/g;
      map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      if (str != null) {
        return ('' + str).replace(re, function(match) {
          return map[match];
        });
      }
      return '';
    },
    unescape: function(str) {
      var map, re;
      re = /(&amp;|&lt;|&gt;|&quot;|&#x27;)/g;
      map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#x27;': "'"
      };
      if (str != null) {
        return ('' + str).replace(re, function(match) {
          return map[match];
        });
      }
      return '';
    },
    /**
     *  生成guid
     *  @public
     *  @static
     *  @method     guid
     *  @memberof   ebaui
     *  @return     {String}    guid
    */

    guid: function() {
      return 'eba-ui-' + (++uuid);
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

    getById: function(id, context) {
      return ebaui.get('#' + id, context);
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

    get: function(selector, context) {
      return $(selector, context).data('model');
    },
    /**
     *  加载PC端HTML模板信息，并且自动初始化每一个UI控件
     *  @public
     *  @static
     *  @method     parseUi
     *  @memberof   ebaui.web
     *  @param      {String}    上下文CSS选择器
    */

    parseUi: function(context) {
      return this.web.parseUi(context);
    }
  };

  window['ebaui'] = ebaui;

  /**
   *  native对象拓展
   *  String.prototype.trim()
   *      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
  */


  StringProto = String.prototype;

  if (StringProto.trim == null) {
    StringProto.trim = function() {
      return this.replace(/^\s+|\s+$/gm, '');
    };
  }

  /**
   *   native class extension
  */


  Date.prototype.clone = function() {
    var timestamp;
    timestamp = this.getTime();
    return new Date(timestamp);
  };

  /**
   *  @namespace  ebaui.web
   *  @author     Monkey <knightuniverse@qq.com>
  */


  web = {
    baseUrl: '/',
    controls: [],
    formControls: [],
    _bridge: function(name, cls) {
      $.fn[name] = function(options) {
        return this.each(function(idx, el) {
          var $el, ins;
          $el = $(el);
          if ($el.attr('data-parsed') !== 'true') {
            return ins = new cls(el, options);
          }
        });
      };
      return void 0;
    },
    /**
     *  
     *  @private
     *  @static
     *  @method     _doRegister
     *  @memberof   ebaui.web
     *  @arg        {Boolean}       isFormField
     *  @arg        {String}        name
     *  @arg        {Function}      cls
    */

    _doRegister: function(isFormField, name, cls) {
      var JQPlugin, me;
      if (!name) {
        return;
      }
      if (!cls) {
        return;
      }
      me = this;
      me[name] = cls;
      cls.prototype['_namespace'] = 'ebaui.web';
      cls.prototype['_controlFullName'] = 'ebaui-web-' + name;
      JQPlugin = name.toLowerCase();
      me._bridge(JQPlugin, cls);
      me.controls.push(JQPlugin);
      if (isFormField) {
        me.formControls.push(JQPlugin);
      }
      return void 0;
    },
    /** 
     *  注册成为一个UI控件
     *  @public
     *  @static
     *  @method     registerControl
     *  @memberof   ebaui.web
     *  @param      {String}    name        - 控件名
    */

    registerControl: function(name, cls) {
      return this._doRegister(false, name, cls);
    },
    /** 
     *  注册成为一个Form表单UI控件
     *  @public
     *  @static
     *  @method     registerControl
     *  @memberof   ebaui.web
     *  @param      {String}    name        - 控件名
    */

    registerFormControl: function(name, cls) {
      return this._doRegister(true, name, cls);
    },
    /**
     *  注入一个html模板
     *  @public
     *  @static
     *  @method     injectTmpl
     *  @memberof   ebaui.web
     *  @arg        {String}    name        - 控件名
     *  @arg        {String}    prop        - 模板的属性名
     *  @arg        {String}    tmpl        - html模板字符串
    */

    injectTmpl: function(name, prop, tmpl) {
      var ctrl, me;
      me = this;
      ctrl = me[name];
      if (ctrl != null) {
        ctrl.prototype[prop] = tmpl;
      }
      return void 0;
    },
    /**
     *  注入负数个html模板
     *  @public
     *  @static
     *  @method     injectTmpls
     *  @memberof   ebaui.web
     *  @arg        {String}    name        - 控件名
     *  @arg        {Object}    map         - 哈希表，格式为 -> 模板的属性名 : html模板字符串
    */

    injectTmpls: function(name, map) {
      var ctrl, me, prop, tmpl;
      if (map == null) {
        return;
      }
      me = this;
      ctrl = me[name];
      if (ctrl != null) {
        for (prop in map) {
          tmpl = map[prop];
          ctrl.prototype[prop] = tmpl;
        }
      }
      return void 0;
    },
    /**
     *  自动初始化所有WEB控件。其实所有的控件最后都有一个对应的jquery插件方法，初始化的时候就是调用这个插件方法去实例化一个控件。
     *  @public
     *  @static
     *  @method     parseControls
     *  @memberof   ebaui.web
    */

    parseControls: function(context) {
      var $elements, control, controls, i, selector, _i, _len;
      controls = this.controls;
      for (i = _i = 0, _len = controls.length; _i < _len; i = ++_i) {
        control = controls[i];
        control = controls[i];
        selector = '[data-role="' + control + '"]';
        $elements = $(selector, context);
        if ($elements.size() > 0 && $elements[control]) {
          $elements[control]();
        }
      }
      return void 0;
    },
    /**
     *  加载PC端HTML模板信息，并且自动初始化每一个UI控件
     *  @public
     *  @static
     *  @method     parseUi
     *  @memberof   ebaui.web
     *  @param      {String}    上下文CSS选择器
    */

    parseUi: function(context) {
      return this.parseControls(context != null ? context : document);
    },
    /**
     *  表单控件验证规则的构造器工厂，默认提供required,email,url等验证规则  <br />
     *  关于如何启用验证规则请参考 {@tutorial form_index}  <br />
     *  关于拓展当前控件规则请参考 {@tutorial extend_validation}  <br />
     *  @public
     *  @member     {Object}    validation
     *  @memberof   ebaui.web
     *  @property   {RequiredValidator}     required        -       required验证规则构造函数
     *  @property   {EmailValidator}        email           -       email地址验证规则构造函数
     *  @property   {UrlValidator}          url             -       url地址验证规则构造函数
     *  @property   {UrlValidator}          captcha         -       认证码验证规则构造函数
    */

    validation: {},
    /**
     *  获取validator的构造器
     *  @public
     *  @static
     *  @method     getValidator
     *  @memberof   ebaui.web
     *  @param      {String}    上下文CSS选择器
    */

    getValidator: function(ruleName) {
      if (!ruleName) {
        return null;
      }
      return this.validation[ruleName];
    },
    /**
     *  向系统注册一个新的表单验证规则
     *  @public
     *  @static
     *  @method     registerValidator
     *  @memberof   ebaui.web
     *  @param      {String}    上下文CSS选择器
    */

    registerValidator: function(ruleName, constructor) {
      if (!(ruleName && typeof constructor === 'function')) {
        return;
      }
      return this.validation[ruleName] = constructor;
    },
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

    getForm: function(selector, context) {
      var $dom, model;
      $dom = $(selector, context);
      model = $dom.data('model');
      if (model) {
        return model;
      }
      $dom.form();
      return $dom.data('model');
    },
    _envCheck: function() {
      /* 判断是否原生就支持placeholder*/

      if ("placeholder" in document.createElement("input")) {
        return $('html').attr('data-native', 'placeholder');
      }
    },
    _baseUrlCheck: function() {
      var RE, item, matched, me, prefix, scripts, src, _i, _len, _results;
      me = this;
      RE = /(.*)\/(ebaui\.js|ebaui(-\d\.\d\.\d)?\.js|ebaui(-\d\.\d\.\d)?\.min\.js)(.*)$/;
      scripts = document.getElementsByTagName('script');
      _results = [];
      for (_i = 0, _len = scripts.length; _i < _len; _i++) {
        item = scripts[_i];
        src = item.src;
        if (RE.test(src)) {
          matched = RE.exec(src);
          prefix = matched[1];
          if (prefix.substring(prefix.length - 1, prefix.length) !== '/') {
            prefix += '/';
          }
          me.baseUrl = prefix;
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    /**
     *  框架是否已经初始化过了
     *  @private
     *  @static
     *  @member     {Boolean}   _inited
     *  @memberof   ebaui.web
    */

    _inited: false,
    init: function() {
      var me;
      me = this;
      if (me._inited) {
        return;
      }
      return $(function() {
        var trigger;
        if (me._inited) {
          return;
        }
        /*
        *   浏览器环境监测
        *   构建baseUrl
        */

        me._envCheck();
        me._baseUrlCheck();
        /*
        *   转换所有的ui控件
        */

        me.parseUi();
        /*
        *   page生命周期事件
        */

        trigger = function(eventHandle) {
          var fn;
          fn = window[eventHandle];
          if ($.type(fn) === 'function') {
            return fn();
          }
        };
        trigger('initPage');
        $(window).on('load', function(eventArgs) {
          return trigger('loadPage');
        });
        $(window).on('unload', function(eventArgs) {
          return trigger('unloadPage');
        });
        /*
        *   初始化结束
        */

        return me._inited = true;
      });
    }
  };

  ebaui['web'] = web;

  /**
  *   keyboard
  */


  keyboard = {
    /**
     *  判断键盘输入是否是enter键
     *  @public
     *  @static
     *  @method     isEnter
     *  @memberof   ebaui.keycodes
    */

    isEnter: function(keycode) {
      return keycode === 13;
    },
    /**
     *  判断键盘输入是否是数字
     *  @public
     *  @static
     *  @method     isNumber
     *  @memberof   keyboard
    */

    isNumber: function(code) {
      if (typeof code !== 'number') {
        return false;
      }
      return __indexOf.call([96, 97, 98, 99, 100, 101, 102, 103, 104, 105], code) >= 0 || __indexOf.call([48, 49, 50, 51, 52, 53, 54, 55, 56, 57], code) >= 0;
    }
  };

  web['keyboard'] = keyboard;

  /*
  *   框架初始化
  */


  web.init();

  ArrayProto = Array.prototype;

  slice = ArrayProto.slice;

  nativeForEach = ArrayProto.forEach;

  ObjectProto = Object.prototype;

  toString = ObjectProto.toString;

  /**
  *   @class      Control
  *   @classdesc
  *   @memberof   ebaui.web
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  */


  Control = (function() {
    function Control(element, options) {
      var attrOpts, dataOpts, me, opts;
      me = this;
      dataOpts = me._parseDataOptions(element);
      attrOpts = me._parseAttrOptions(element);
      opts = $.extend({}, dataOpts, attrOpts);
      if (options) {
        opts = $.extend({}, opts, options);
      }
      /*
      *   _eventHandlers是一个实例属性
      *   _eventHandlers如果放在类prototype上，则所有的类的实例会共享这个属性
      *   这样将会导致所有的实例的事件处理程序完全一样，失去了多态
      *   实际上，这涉及到了JS的写时复制机制: http://blog.baiwand.com/?post=209
      */

      me._eventHandlers = {};
      me._controlID = ebaui.guid();
      me._$root = me._parseUi(element);
      me._init(opts);
      me._setupEvents(opts);
      me._render();
      /*
      *   在某些特定场景下，有些class类并不一定会有$root这个属性
      *   非常明显的一个例子就是Tabs控件
      *   Tabs应该说是一个控件集合
      *   控件里每一个对象都是Tab控件对象
      *   Tab控件对象是没有_$root属性的
      */

      if (me._$root != null) {
        me._$root.data('model', me);
      }
      return void 0;
    }

    /**
     *  控件ID
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    _controlID
    */


    Control.prototype._controlID = void 0;

    /**
     *  
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    _namespace
    */


    Control.prototype._namespace = '';

    /**
     *  
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    _controlFullName
    */


    Control.prototype._controlFullName = '';

    /**
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    _rootTmpl
    */


    Control.prototype._rootTmpl = '';

    /**
     *  CSS长度单位的正则表达式匹配
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {RegExp}    _cssUnitRE
    */


    Control.prototype._cssUnitRE = /^(\d+)(%|in|cm|mm|em|ex|pt|pc|px)?$/;

    /**
     *  更新UI的宽度和高度
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _doUpdateCssSize
     *  @arg        {String}    cssProp
    */


    Control.prototype._doUpdateCssSize = function(cssProp) {
      var $root, cssUnit, isNum, me, propVal, result;
      me = this;
      $root = me._$root;
      if ($root == null) {
        return;
      }
      propVal = me[cssProp]();
      isNum = me.isNumber(propVal);
      if (isNum && propVal <= 0) {
        return;
      }
      result = me._cssUnitRE.exec(propVal);
      cssUnit = result[2];
      $root.css(cssProp, cssUnit != null ? propVal : propVal + 'px');
      return void 0;
    };

    /**
     *  更新UI的宽度
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssWidth
    */


    Control.prototype._updateCssWidth = function() {
      return this._doUpdateCssSize('width');
    };

    /**
     *  更新UI的高度
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssHeight
    */


    Control.prototype._updateCssHeight = function() {
      return this._doUpdateCssSize('height');
    };

    /**
     *  更新UI的位置，top或者是left
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssOffset
    */


    Control.prototype._updateCssOffset = function(cssProp) {
      var $root, me, val;
      me = this;
      $root = me._$root;
      if ($root == null) {
        return;
      }
      val = me[cssProp]();
      if (!isNaN(val) && val !== 0) {
        return $root.css(cssProp, val + 'px');
      }
    };

    /**
     *  更新UI的位置top
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssTop
    */


    Control.prototype._updateCssTop = function() {
      return this._updateCssOffset('top');
    };

    /**
     *  更新UI的位置left
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssLeft
    */


    Control.prototype._updateCssLeft = function() {
      return this._updateCssOffset('left');
    };

    /**
     *  更新UI的position属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssPosition
    */


    Control.prototype._updateCssPosition = function() {
      var $root, cssVal, me, position;
      me = this;
      $root = me._$root;
      if ($root == null) {
        return;
      }
      position = me.position();
      cssVal = !me.isEmpty(position) ? position : null;
      $root.css('position', cssVal);
      return void 0;
    };

    /**
     *  更新UI的title属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateAttrTitle
    */


    Control.prototype._updateAttrTitle = function() {
      var $root, me, title;
      me = this;
      $root = me._$root;
      if ($root == null) {
        return;
      }
      title = me._title;
      if (!me.isEmpty(title)) {
        $root.attr('title', title);
      }
      return void 0;
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _setupEvents
    */


    Control.prototype._setupEvents = $.noop;

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _init
    */


    Control.prototype._init = function(opts) {
      var me, _ref, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (opts == null) {
        return;
      }
      me = this;
      me._id = (_ref = opts['id']) != null ? _ref : '';
      me._title = (_ref1 = opts['title']) != null ? _ref1 : '';
      me._name = (_ref2 = opts['name']) != null ? _ref2 : '';
      me._width = (_ref3 = opts['width']) != null ? _ref3 : 0;
      me._height = (_ref4 = opts['height']) != null ? _ref4 : 0;
      me._top = (_ref5 = opts['top']) != null ? _ref5 : 0;
      me._left = (_ref6 = opts['left']) != null ? _ref6 : 0;
      me._position = (_ref7 = opts['position']) != null ? _ref7 : '';
      me._visible = (_ref8 = opts['visible']) != null ? _ref8 : true;
      me._enabled = (_ref9 = opts['enabled']) != null ? _ref9 : true;
      return me._focused = (_ref10 = opts['focused']) != null ? _ref10 : false;
    };

    /**
     *  获取焦点
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _focus
    */


    Control.prototype._focus = $.noop;

    /**
     *  失去焦点
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _blur
    */


    Control.prototype._blur = $.noop;

    /**
     *  更新控件enabled的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssEnabled
    */


    Control.prototype._updateCssEnabled = $.noop;

    /**
     *  设置或者移除据聚焦样式或者失焦样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssFocused
    */


    Control.prototype._updateCssFocused = $.noop;

    /**
     *  更新控件visible的UI样式
     *  @private
     *  @instance
     *  @memberof    ebaui.web.Control
     *  @method     _updateCssVisible
    */


    Control.prototype._updateCssVisible = function() {
      var $root, me, method;
      me = this;
      $root = me._$root;
      if ($root == null) {
        return;
      }
      method = me.visible() ? 'show' : 'hide';
      $root[method]();
      return void 0;
    };

    /**
     *  把HTML占位符转换成为控件自身的HTML结构
     *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _parseUi
     *  @param      {Object}    element HTML占位符
    */


    Control.prototype._parseUi = function(element) {
      /*
          创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
          _parseDataOptions
          _parseAttrOptions
          _parseUi
          _init
          _setupEvents
          _render
      
          self._$root.data( 'model',self );
      */

      var $el, $html, me;
      me = this;
      if (me._rootTmpl.length === 0) {
        return;
      }
      $el = $(element);
      $html = $(me._rootTmpl).attr('data-parsed', 'true');
      $el.replaceWith($html);
      return $html;
    };

    /**
     *  把html标签定义的data-options字符串转换成javascript对象
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _parseDataOptions
     *  @param      {Object}    element
    */


    Control.prototype._parseDataOptions = function(element) {
      /*
          创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
          _parseDataOptions
          _parseAttrOptions
          _parseUi
          _init
          _setupEvents
          _render
      
          self._$root.data( 'model',self );
      */

      var $el, attr, first, last, me, options;
      me = this;
      $el = $(element);
      options = {};
      if ($el.size() === 0) {
        return options;
      }
      attr = $el.attr('data-options');
      if (attr) {
        first = attr.substring(0, 1);
        last = attr.substring(attr.length - 1);
        if (first !== '{') {
          attr = '{' + attr;
        }
        if (last !== '}') {
          attr = attr + '}';
        }
        options = (new Function('return ' + attr))();
      }
      return options;
    };

    /**
     *  获取w3c中，html标签本身就支持的属性配置<br />
     *  ebaui框架中，html标签本身就支持的属性直接编写在html标签内，而不会放在data-option里面进行配置
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _parseAttrOptions
     *  @param      {Object}    element HTML占位符
    */


    Control.prototype._parseAttrOptions = function(element) {
      /*
          创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
          _parseDataOptions
          _parseAttrOptions
          _parseUi
          _init
          _setupEvents
          _render
      
          self._$root.data( 'model',self );
      */

      var $el, id, name, options, title, _ref, _ref1, _ref2;
      $el = $(element);
      id = (_ref = $el.attr('id')) != null ? _ref : '';
      name = (_ref1 = $el.attr('name')) != null ? _ref1 : '';
      title = (_ref2 = $el.attr('title')) != null ? _ref2 : '';
      options = {
        'id': id,
        'name': name,
        'title': title
      };
      return options;
    };

    /**
     *  更新$root的id属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateAttrId
    */


    Control.prototype._updateAttrId = function() {
      var id, me;
      me = this;
      id = me.id();
      if (!me.isEmpty(id)) {
        return me._$root.attr('id', id);
      }
    };

    /**
     *  更新UI显示
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _render
    */


    Control.prototype._render = function() {
      /*
          创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
          _parseDataOptions
          _parseAttrOptions
          _parseUi
          _init
          _setupEvents
          _render
      
          self._$root.data( 'model',self );
      */

      var me;
      me = this;
      me._updateCssWidth();
      me._updateCssHeight();
      me._updateCssPosition();
      me._updateCssTop();
      me._updateCssLeft();
      me._updateCssEnabled();
      me._updateCssVisible();
      me._updateAttrTitle();
      me._updateAttrId();
      return void 0;
    };

    /**
     *  获取控件类所属命名空间
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    namespace
     *  @example    <caption>get</caption>
     *      console.log( ctrl.namespace() );
    */


    Control.prototype.namespace = function() {
      return this._namespace;
    };

    /**
     *  获取包含命名空间在内的控件全名
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    controlFullName
     *  @example    <caption>get</caption>
     *      console.log( ctrl.controlFullName() );
    */


    Control.prototype.controlFullName = function() {
      return this._controlFullName;
    };

    Control.prototype._id = '';

    /**
     *  获取控件html标签的ID
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    id
     *  @example    <caption>get</caption>
     *      console.log( ctrl.id() );
    */


    Control.prototype.id = function() {
      return this._id;
    };

    Control.prototype._enabled = true;

    /**
     *  获取或者设置控件是否可用
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Boolean}   enabled
     *  @default    true
     *  @example    <caption>get</caption>
     *      console.log( ctrl.enabled() );
     *  @example    <caption>set</caption>
     *      ctrl.enabled( false )
    */


    Control.prototype.enabled = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._enabled;
      }
      me._enabled = val;
      return me._updateCssEnabled();
    };

    Control.prototype._title = '';

    /**
     *  获取或者设置控件是否可见
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}   title
     *  @default    ''
     *  @example    <caption>get</caption>
     *      console.log( ctrl.title() );
     *  @example    <caption>set</caption>
     *      ctrl.title( 'pls type user name' )
    */


    Control.prototype.title = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._title;
      }
      me._title = val;
      me._updateAttrTitle();
      return void 0;
    };

    Control.prototype._name = '';

    /**
     *  表单的name属性
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}   name
     *  @default    ''
     *  @example    <caption>get</caption>
     *      console.log( ctrl.name() );
     *  @example    <caption>set</caption>
     *      ctrl.name( '' )
    */


    Control.prototype.name = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._name;
      }
      me._name = val;
      return void 0;
    };

    Control.prototype._visible = true;

    /**
     *  获取或者设置控件是否可见
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Boolean}   visible
     *  @default    true
     *  @example    <caption>get</caption>
     *      console.log( ctrl.visible() );
     *  @example    <caption>set</caption>
     *      ctrl.visible( false )
    */


    Control.prototype.visible = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._visible;
      }
      me._visible = val;
      me._updateCssVisible();
      return void 0;
    };

    /**
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @virtual
     *  @readonly
     *  @memberof   ebaui.web.Control
     *  @member     {Boolean}   focusable
     *  @default    false
     *  @example    <caption>get</caption>
     *      console.log( ctrl.focusable() );
    */


    Control.prototype.focusable = function() {
      return false;
    };

    Control.prototype._focused = false;

    /**
     *  获取或者设置控件是否已经得到焦点
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Boolean}   focused
     *  @default    false
     *  @example    <caption>get</caption>
     *      console.log( ctrl.focused() );
     *  @example    <caption>set</caption>
     *      ctrl.focused( false );
    */


    Control.prototype.focused = function(val) {
      var me, method;
      me = this;
      if (!me.isBoolean(val)) {
        return me._focused;
      }
      me._focused = val;
      method = val ? '_focus' : '_blur';
      me[method]();
      return me._updateCssFocused();
    };

    Control.prototype._width = 0;

    /**
     *  获取或者设置控件宽度
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Number}    width
     *  @default    null
     *  @example    <caption>get</caption>
     *      console.log( ctrl.width() );
     *  @example    <caption>set</caption>
     *      ctrl.width( 100 );
    */


    Control.prototype.width = function(val) {
      var me;
      me = this;
      if (!me.isNumber(val)) {
        return me._width;
      }
      me._width = val;
      me._updateCssWidth();
      return void 0;
    };

    Control.prototype._height = 0;

    /**
     *  获取或者设置控件高度
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Number}    height
     *  @default    null
     *  @example    <caption>get</caption>
     *      console.log( ctrl.height() );
     *  @example    <caption>set</caption>
     *      ctrl.height( 100 );
    */


    Control.prototype.height = function(val) {
      var me;
      me = this;
      if (!me.isNumber(val)) {
        return me._height;
      }
      me._height = val;
      me._updateCssHeight();
      return void 0;
    };

    Control.prototype._top = 0;

    /**
     *  获取或者设置控件的位置top
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Number}    top
     *  @default    null
     *  @example    <caption>get</caption>
     *      console.log( ctrl.top() );
     *  @example    <caption>set</caption>
     *      ctrl.top( 100 );
    */


    Control.prototype.top = function(val) {
      var me;
      me = this;
      if (!me.isNumber(val)) {
        return me._top;
      }
      me._top = val;
      me._updateCssTop();
      return void 0;
    };

    Control.prototype._left = 0;

    /**
     *  获取或者设置控件的位置left
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Number}    left
     *  @default    null
     *  @example    <caption>get</caption>
     *      console.log( ctrl.left() );
     *  @example    <caption>set</caption>
     *      ctrl.left( 100 );
    */


    Control.prototype.left = function(val) {
      var me;
      me = this;
      if (!me.isNumber(val)) {
        return me._left;
      }
      me._left = val;
      me._updateCssLeft();
      return void 0;
    };

    Control.prototype._position = '';

    /**
     *  position设置
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    position
     *  @default    'static'
     *  @example    <caption>get</caption>
     *      console.log( ctrl.position() );
     *  @example    <caption>set</caption>
     *      ctrl.position( 'relative' );
    */


    Control.prototype.position = function(val) {
      var me, re;
      me = this;
      re = /^(absolute|fixed|relative|static|inherit|\s*)$/;
      if (!re.test(val)) {
        return me._position;
      }
      me._position = $.trim(val);
      me._updateCssPosition();
      return void 0;
    };

    /**
     *  获取控件ID
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    controlID
     *  @example    <caption>get</caption>
     *      console.log( ctrl.controlID() );
    */


    Control.prototype.controlID = function() {
      return this._controlID;
    };

    /**
     *  获取控件关联的HTML DOM对象的jQuery包装
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Object}    uiElement
     *  @example    <caption>get</caption>
     *      console.log( ctrl.uiElement() );
    */


    Control.prototype.uiElement = function() {
      return this._$root;
    };

    /**
     *  绑定控件事件处理程序
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     onEvent
     *  @arg        {String}        event
     *  @arg        {Function}      fn
     *  @example    
     *      ctrl.onEvent()
    */


    Control.prototype.onEvent = function() {
      var event, fn, handlers, len, me, parameters;
      me = this;
      parameters = ArrayProto.slice.apply(arguments);
      len = parameters.length;
      if (len !== 2) {
        return;
      }
      event = parameters[0];
      fn = parameters[1];
      if (!me.isFunc(fn)) {
        return;
      }
      handlers = me._eventHandlers[event];
      if (!handlers || handlers.length === 0) {
        me._eventHandlers[event] = [fn];
      } else {
        handlers.push(fn);
      }
      return void 0;
    };

    /**
     *  移除事件处理程序，如果第二个参数fn没有指定，那么将会移除所有指定event的事件处理程序
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     offEvent
     *  @arg        {String}        event
     *  @arg        {Function}      [fn]
     *  @example    
     *      ctrl.onEvent()
    */


    Control.prototype.offEvent = function(event, fn) {
      var handlers, i, item, me, _i, _len;
      me = this;
      if (!(me.isString(event) && event.length > 0)) {
        return;
      }
      handlers = me._eventHandlers[event];
      if (!(handlers && handlers.length > 0)) {
        return;
      }
      if (fn) {
        for (i = _i = 0, _len = handlers.length; _i < _len; i = ++_i) {
          item = handlers[i];
          if (item === fn) {
            /* remove this event handler*/

            me._eventHandlers[event].splice(i, 1);
            break;
          }
        }
      } else {
        /* remove all*/

        me._eventHandlers[event] = [];
      }
      return void 0;
    };

    /**
     *  触发控件的事件处理程序
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     triggerEvent
     *  @arg        {String}        event
     *  @arg        {Object}        [args]
     *  @example    
     *      ctrl.triggerEvent()
    */


    Control.prototype.triggerEvent = function(event, args) {
      var func, handlers, i, me, _i, _len;
      if (event == null) {
        return;
      }
      if (/^\s+$/.test(event)) {
        return;
      }
      me = this;
      handlers = me._eventHandlers[event];
      if (!handlers || handlers.length === 0) {
        return;
      }
      for (i = _i = 0, _len = handlers.length; _i < _len; i = ++_i) {
        func = handlers[i];
        func(me, args);
      }
    };

    Control.prototype.keys = function(obj) {
      var key, keys, me;
      me = this;
      if (!me.isObject(obj)) {
        throw new TypeError('Invalid object');
      }
      keys = [];
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      return keys;
    };

    /**
     *  编译HTML模板
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     compileTmpl
     *  @arg        tmpl
     *  @arg        data
     *  @example
     *      console.log( ctrl.compileTmpl( '' ) );
    */


    Control.prototype.compileTmpl = function(text, data) {
      var e, escaper, escapes, index, matcher, noMatch, render, settings, source, template;
      render = function() {};
      noMatch = /(.)^/;
      settings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };
      escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
      };
      escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
      matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');
      index = 0;
      source = "__p+='";
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, function(match) {
          return '\\' + escapes[match];
        });
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
      if (!settings.variable) {
        source = 'with(obj||{}){\n' + source + '}\n';
      }
      source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
      try {
        render = new Function(settings.variable || 'obj', source);
      } catch (_error) {
        e = _error;
        e.source = source;
        throw e;
      }
      if (data) {
        return render(data);
      }
      template = function(data) {
        return render.call(this, data);
      };
      template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
      return template;
    };

    /**
     *  forEach
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isNull
     *  @arg        obj
     *  @arg        iterator
     *  @arg        context
    */


    Control.prototype.each = function(obj, iterator, context) {
      var breaker, i, item, keys, me, _i, _j, _len, _len1;
      me = this;
      breaker = {};
      if (obj == null) {
        return;
      }
      if (nativeForEach && obj.forEach === nativeForEach) {
        return obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (i = _i = 0, _len = obj.length; _i < _len; i = ++_i) {
          item = obj[i];
          if (iterator.call(context, item, i, obj) === breaker) {
            return;
          }
        }
      } else {
        keys = me.keys(obj);
        for (i = _j = 0, _len1 = keys.length; _j < _len1; i = ++_j) {
          item = keys[i];
          if (iterator.call(context, item, i, obj) === breaker) {
            return;
          }
        }
      }
    };

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
     *  @memberof   ebaui.web.Control
     *  @method     isEmpty
     *  @arg        val
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isEmpty( '' ) );
    */


    Control.prototype.isEmpty = function(val) {
      var me;
      if (val == null) {
        return true;
      }
      me = this;
      if (me.isBoolean(val)) {
        return val;
      }
      if (me.isString(val || me.isArray(val))) {
        return val.length === 0;
      }
      if (me.isNumber(val)) {
        return val !== 0;
      }
      return true;
    };

    /**
     *  判断一个变量是否是null值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isNull
     *  @arg        val
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isNull( null ) );
    */


    Control.prototype.isNull = function(val) {
      return val === null || val === void 0;
    };

    /**
     *  判断一个变量是否是RegExp类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isRegExp
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isRegExp() );
    */


    Control.prototype.isRegExp = function(val) {
      return toString.call(val) === '[object RegExp]';
    };

    /**
     *  判断一个变量是否是Date类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isDate
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isDate() );
    */


    Control.prototype.isDate = function(val) {
      return toString.call(val) === '[object Date]';
    };

    /**
     *  判断一个变量是否是Object类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isObject
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isObject() );
    */


    Control.prototype.isObject = function(val) {
      return val === Object(val);
    };

    /**
     *  判断一个变量是否是Function类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isFunc
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isFunc() );
    */


    Control.prototype.isFunc = function(val) {
      return toString.call(val) === '[object Function]';
    };

    /**
     *  判断一个变量是否是String类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isString
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isString() );
    */


    Control.prototype.isString = function(val) {
      return toString.call(val) === '[object String]';
    };

    /**
     *  判断一个变量是否是数值类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isNumber
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isNumber() );
    */


    Control.prototype.isNumber = function(val) {
      return toString.call(val) === '[object Number]';
    };

    /**
     *  判断一个变量是否是Array类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isArray
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isArray() );
    */


    Control.prototype.isArray = function(val) {
      return toString.call(val) === '[object Array]';
    };

    /**
     *  判断一个变量是否是Boolean类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isBoolean
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isBoolean() );
    */


    Control.prototype.isBoolean = function(val) {
      return val === true || val === false || toString.call(val) === '[object Boolean]';
    };

    /**
     *  判断是否使用远程数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isUsingRemoteData
     *  @param      {Object|Array}          dataSource              - 如果dataSource是一个数组对象，则认为采用本地数据作为数据源；反之，如果dataSource包含了url属性，data属性（可选），怎认为是使用远程数据源
     *  @property   {String}                dataSource.url          - 服务端URL
     *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
    */


    Control.prototype.isUsingRemoteData = function(dataSource) {
      var me;
      if (!dataSource) {
        throw 'dataSource can not be null!';
      }
      me = this;
      if (me.isArray(dataSource)) {
        return false;
      }
      if (me.isObject(dataSource) && dataSource['url']) {
        return true;
      }
      return false;
    };

    /**
     *  移除所有事件监听，注销控件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     destroy
     *  @example    
     *      ctrl.destroy();
     *  @todo       暂时还没有任何相关实现
    */


    Control.prototype.destroy = function() {};

    return Control;

  })();

  ebaui.web.Control = Control;

  /**
  *   @class      Validator
  *   @classdesc
  *   @memberof   ebaui.web
  *   @author     monkey      <knightuniverse@qq.com>
  */


  Validator = (function() {
    /**
     *  构造函数
    */

    function Validator(params, msg) {
      var me;
      me = this;
      me.message = msg != null ? msg : '';
      me.parameters = params != null ? params : [];
    }

    /**
     *  validator验证的时候的参数
    */


    Validator.prototype.parameters = [];

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @memberof   ebaui.web.Validator
     *  @param      {Object}    value      -      要进行验证的值
    */


    Validator.prototype.validate = function(value) {};

    return Validator;

  })();

  /**
  *   Today's browsers define focus() on HTMLElement, but an element won't actually take focus unless it's one of:
  *   
  *       1.  HTMLAnchorElement/HTMLAreaElement with an href
  *       2.  HTMLInputElement/HTMLSelectElement/HTMLTextAreaElement/HTMLButtonElement but not with disabled (IE actually gives you an error if you try), 
  *           and file uploads have unusual behaviour for security reasons
  *       3.  HTMLIFrameElement (though focusing it doesn't do anything useful). Other embedding elements also, maybe, I haven't tested them all.
  *       4.  Any element with a tabindex
  *
  *   see { http://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus }
  *   
  *   @class      FormField
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  */


  FormField = (function(_super) {
    __extends(FormField, _super);

    function FormField() {
      _ref = FormField.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
     *  控件当前验证状态
     *  @private
     *  @instance
     *  @default    ebaui.web.validationStates.none
     *  @memberof   ebaui.web.FormField
     *  @member     {Number}    _currentStatus
    */


    FormField.prototype._currentStatus = 0;

    /**
     *  控件验证状态
     *  @private
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    _validationStatus
    */


    FormField.prototype._validationStatus = {
      none: 0,
      /* 验证成功*/

      success: 1,
      /* 提醒*/

      info: 2,
      /* 错误*/

      error: 3,
      /* 警告*/

      warning: 4,
      /* 忙碌*/

      busy: 5
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _updateCssReadonly
    */


    FormField.prototype._updateCssReadonly = $.noop;

    /**
     *  控件在所处的各个不同得validationState下对应的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    _statusCls
    */


    FormField.prototype._statusCls = ['', 'eba-success', 'eba-light', 'eba-error', 'eba-warning', 'eba-loading'];

    /**
     *  控件在所处的各个不同得validationState下对应的UI的icon类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    _statusIcon
    */


    FormField.prototype._statusIcon = {
      'eba-success': 'icon-ok',
      'eba-light': 'icon-lightbulb',
      'eba-error': 'icon-remove-circle',
      'eba-warning': 'icon-warning-sign',
      'eba-loading': 'icon-spinner icon-spin'
    };

    FormField.prototype._init = function(opts) {
      var me, _ref1, _ref2, _ref3;
      FormField.__super__._init.call(this, opts);
      me = this;
      /* 
      *   其实我本人非常不愿意这么做，
      *   但是老大强烈要求控件的属性必须是absolute
      *   他想要依赖手工去指定控件的位置 ，
      *   而不愿意相信CSS就能搞定这个问题
      *   我个人是认为应该有一套CSS框架
      *   排版布局，通过这CSS框架去做，比如CSS框架提供一个grid系统
      *   利用这个grid系统去布局表单
      */

      me._position = (_ref1 = opts['position']) != null ? _ref1 : 'absolute';
      /* 
      *   _error是一个验证失败的信息集合，
      *   这个对象的每一个属性对应一个validator，
      *   属性值则是validator验证失败时的提示信息
      */

      me._error = {};
      /* 
      *   初始化控件的value
      */

      if (opts['value'] != null) {
        me._value = opts['value'];
      }
      if (opts['readonly'] != null) {
        me._readonly = opts['readonly'];
      }
      me._enterAsTab = (_ref2 = opts['enterAsTab']) != null ? _ref2 : false;
      me._validateOnChange = (_ref3 = opts['validateOnChange']) != null ? _ref3 : false;
      /* 
      *   初始化设置控件的validators
      */

      me._validators = me._parseValidators(opts['validators']);
      return void 0;
    };

    /**
     *  将控件配置的验证规则，转化为相应的Javascript Validator对象
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _parseValidator
    */


    FormField.prototype._parseValidator = function(rule) {
      var constructor, name, ns, param, result, validator;
      if (rule == null) {
        return null;
      }
      result = /([a-z_]+)(.*)/i.exec(rule);
      name = result[1];
      param = eval(result[2]);
      ns = ebaui['web'];
      constructor = ns['validation'][name];
      if (constructor == null) {
        return null;
      }
      validator = new constructor(param);
      return validator;
    };

    /**
     *  将控件配置的验证规则，转化为相应的Javascript Validator对象
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _parseValidators
    */


    FormField.prototype._parseValidators = function(rules) {
      var i, me, returnValue, rule, validator, _i, _len;
      me = this;
      if ((rules == null) || rules.length === 0) {
        return [];
      }
      returnValue = [];
      for (i = _i = 0, _len = rules.length; _i < _len; i = ++_i) {
        rule = rules[i];
        validator = me._parseValidator(rule);
        if (validator) {
          returnValue.push(validator);
        }
      }
      return returnValue;
    };

    /**
     *  显示控件的各个验证状态样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _doRenderStyleTip
    */


    FormField.prototype._doRenderStyleTip = function(rootCls, tips) {
      var $border, $icon, $root, html, iconCls, item, me, status, statusCls;
      me = this;
      tips = tips != null ? tips : '';
      $root = me.uiElement();
      iconCls = me._statusIcon[rootCls];
      $border = $('[class*="border"]', $root);
      $icon = $border.next('i[class^="icon"]');
      status = me._validationStatus;
      statusCls = me._statusCls;
      for (item in status) {
        $root.removeClass(statusCls[status[item]]);
      }
      if (!$root.hasClass(rootCls)) {
        $root.addClass(rootCls);
      }
      if ($icon.size() === 0) {
        html = '<i class="{0}" title="{1}"></i>'.replace('{0}', iconCls).replace('{1}', tips);
        $border.after(html);
      } else {
        $icon.attr({
          'class': iconCls,
          'title': tips
        });
      }
      return void 0;
    };

    /**
     *  清除控件验证状态信息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _resetStatus
     *  @param      {String}  tips          - tooltips消息
    */


    FormField.prototype._resetStatus = function() {
      var $border, $icon, $root, cls, i, me, rootCls, _i, _len;
      me = this;
      $root = me._$root;
      $border = $('[class*="border"]', $root);
      $icon = $border.next('i[class^="icon"]');
      cls = me._statusCls;
      for (i = _i = 0, _len = cls.length; _i < _len; i = ++_i) {
        rootCls = cls[i];
        if (rootCls) {
          $root.removeClass(rootCls);
        }
      }
      if ($icon.size() > 0) {
        $icon.remove();
      }
      return void 0;
    };

    /**
     *  显示控件验证状态以及相应得消息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _renderStyleTips
     *  @param      {Number}  state         - 控件验证状态
     *  @param      {String}  tips          - tooltips消息
    */


    FormField.prototype._renderStyleTips = function(currentStatus, tips) {
      var me, rootCls, status, statusCls;
      me = this;
      rootCls = '';
      statusCls = me._statusCls;
      status = me._validationStatus;
      switch (currentStatus) {
        case status.success:
        case status.info:
        case status.error:
        case status.warning:
        case status.busy:
          rootCls = statusCls[currentStatus];
      }
      if (!rootCls) {
        me._resetStatus(tips);
        return;
      }
      return me._doRenderStyleTip(rootCls, tips);
    };

    /**
     *  更新验证后的样式信息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _updateStyleValidationResult
    */


    FormField.prototype._updateStyleValidationResult = function() {
      var me;
      me = this;
      if (me.isValid()) {
        me.success('');
      } else {
        me.error(me._getErrorMessage());
      }
      return void 0;
    };

    /**
     *  更新表单控件中input的name属性
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _updateAttrName
    */


    FormField.prototype._updateAttrName = function() {
      var me, name;
      me = this;
      name = me.name();
      if (me._$formInput && name) {
        return me._$formInput.attr('name', name);
      }
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _render
    */


    FormField.prototype._render = function() {
      var me;
      FormField.__super__._render.call(this);
      me = this;
      me._updateCssReadonly();
      return me._updateAttrName();
    };

    /**
     *  重置控件，清空验证状态，控件值，恢复到控件原始状态
     *  @public
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     reset
    */


    FormField.prototype.reset = function() {
      var me;
      me = this;
      me._value = null;
      me._data = null;
      me._isValid = true;
      me._error = {};
      /* refresh ui*/

      return me._render();
    };

    /**
     *  获取或者设置控件验证状态信息
     *  @public
     *  @instance
     *  @default    ebaui.web.validationStates.none
     *  @memberof   ebaui.web.FormField
     *  @method     tips
     *  @param      {Number}    state         - 控件验证状态
     *  @param      {String}    tips          - tooltips消息
     *  @example    <caption>get</caption>
     *       0,1,2,3,4
     *      详细的枚举值请查看ebaui.web.validationStates
     *      console.log( ctrl.tips() );
     *  @example    <caption>set</caption>
     *      设置info样式
     *      states = ebaui.web.validationStates;
     *      ctrl.tips( states.info,'info' )
     *      
     *      清除tips以及其样式
     *      states = ebaui.web.validationStates;
     *      ctrl.tips( states.none )
    */


    FormField.prototype.tips = function(status, tips) {
      var me;
      me = this;
      if (!me.isNumber(status)) {
        return me._currentStatus;
      }
      tips = tips != null ? tips : '';
      if ((__indexOf.call([0, 1, 2, 3, 4, 5], status) >= 0)) {
        me._currentStatus = status;
        me._renderStyleTips(status, tips);
      }
      return void 0;
    };

    /**
     *  清除所有状态以及状态信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     clearTips
     *  @example
     *      ctrl.clearTips()
    */


    FormField.prototype.clearTips = function() {
      return this.tips(this._validationStatus.none);
    };

    /**
     *  设置控件验证成功状态以及信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     success
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.success( 'info' )
    */


    FormField.prototype.success = function(tips) {
      return this.tips(this._validationStatus.success, tips);
    };

    /**
     *  设置控件提醒状态以及提醒信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     info
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.info('info' )
    */


    FormField.prototype.info = function(tips) {
      return this.tips(this._validationStatus.info, tips);
    };

    /**
     *  设置控件警告状态以及警告信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     warning
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.warning( 'info' )
    */


    FormField.prototype.warning = function(tips) {
      return this.tips(this._validationStatus.warning, tips);
    };

    /**
     *  设置控件验证错误状态以及错误信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     error
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.error( 'info' )
    */


    FormField.prototype.error = function(tips) {
      return this.tips(this._validationStatus.error, tips);
    };

    /**
     *  设置当前控件的状态为忙碌，在控件后面添加一个菊花转
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     busy
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.busy( 'i am busy now' )
    */


    FormField.prototype.busy = function(tips) {
      return this.tips(this._validationStatus.busy, tips);
    };

    /**
     *  errorMessage是一个验证失败的信息集合，这个对象的每一个属性对应一个validator，属性值则是validator验证失败时的提示信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    errorMessage
     *  @example
     *      var error = ctrl.errorMessage()
    */


    FormField.prototype.errorMessage = function() {
      return this._error;
    };

    /**
     *  errorTips是一个验证失败的信息集合，这个对象的每一个属性对应一个validator，属性值则是validator验证失败时的提示信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    errorTips
     *  @example
     *      var error = ctrl.errorTips()
    */


    FormField.prototype.errorTips = function() {
      return this._error;
    };

    /**
     *  获取控件验证完成之后产生的错误信息字符串
     *  @private
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.FormField
     *  @default    ''
     *  @member     {String}    _getErrorMessage
     *  @example    <caption>get</caption>
     *      tips = ctrl._getErrorMessage();
    */


    FormField.prototype._getErrorMessage = function() {
      var i, key, keys, max, me, tips, _i, _len;
      me = this;
      tips = '';
      keys = me.keys(me._error);
      max = keys.length - 1;
      for (i = _i = 0, _len = keys.length; _i < _len; i = ++_i) {
        key = keys[i];
        tips += me._error[key];
        if (i < max) {
          tips += '\n';
        }
      }
      return tips;
    };

    FormField.prototype._validateOnChange = false;

    /**
     *  是否在控件的值发生改变的时候就触发验证
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Boolean}     validateOnChange
     *  @default    false
     *  @example    <caption>get</caption>
     *      console.log( ctrl.validateOnChange() );
     *  @example    <caption>set</caption>
     *      ctrl.validateOnChange( true );
    */


    FormField.prototype.validateOnChange = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._validateOnChange;
      }
      me._validateOnChange = val;
      return void 0;
    };

    FormField.prototype._validators = [];

    /**
     *  表单控件验证规则
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.FormField
     *  @member     {Array}     validators
     *  @example
     *      [
     *          { name : 'required',parameters : {},message : '',validate : function( value,parameters ){} }
     *      ]
     *      console.log( ctrl.validators );
    */


    FormField.prototype.validators = function() {
      return this._validators;
    };

    /**
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _indexOf
     *  @param      {String}        rule
    */


    FormField.prototype._indexOf = function(rule) {
      var i, index, me, validator, validators, _i, _len;
      if (!rule) {
        return -1;
      }
      me = this;
      index = -1;
      validators = me._validators;
      for (i = _i = 0, _len = validators.length; _i < _len; i = ++_i) {
        validator = validators[i];
        if (validator['name'] === rule) {
          index = i;
          break;
        }
      }
      return index;
    };

    /**
     *  判断指定的验证规则是否已经存在
     *  ，合法的rule参数应该是cn,digit,email等
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     hasValidator
     *  @param      {String}        rule
    */


    FormField.prototype.hasValidator = function(rule) {
      return this._indexOf(rule) > -1;
    };

    /**
     *  添加新的验证规则
     *  ，合法的rule参数应该是cn,digit,email等
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     addValidator
     *  @param      {String|Validator}        rule
    */


    FormField.prototype.addValidator = function(rule) {
      var me, validator;
      if (!rule) {
        return;
      }
      me = this;
      if (me.isString(rule)) {
        validator = me._parseValidator(rule);
        /* we do not have me kind of validator OR validator already exist, then return*/

        if (!validator || me.hasValidator(validator['name'])) {
          return;
        }
      } else if (rule instanceof Validator) {
        if (!me.hasValidator(validator['name'])) {
          me._validators.push(rule);
        }
      }
      return void 0;
    };

    /**
     *  移除一条表单验证规则
     *  ，合法的rule参数应该是cn,digit,email等
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     removeValidator
     *  @param      {String}        rule
    */


    FormField.prototype.removeValidator = function(rule) {
      var index, me;
      me = this;
      index = me._indexOf(rule);
      if (index !== -1) {
        return me._validators.splice(index, 1);
      }
    };

    FormField.prototype._data = null;

    /**
     *  获取或者设置控件数据
     *  @public
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}        data
    */


    FormField.prototype.data = $.noop;

    FormField.prototype._value = null;

    /**
     *  获取或者设置控件值
     *  @public
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}        value
    */


    FormField.prototype.value = $.noop;

    FormField.prototype._enterAsTab = false;

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


    FormField.prototype.enterAsTab = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._enterAsTab;
      }
      me._enterAsTab = val;
      return void 0;
    };

    FormField.prototype._readonly = false;

    /**
     *  获取或者设置表单控件是否只读
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Boolean}   readonly
     *  @default    false
     *  @example    <caption>get</caption>
     *      readonly = ctrl.readonly();
     *  @example    <caption>set</caption>
     *      ctrl.readonly( true );
     *      ctrl.readonly( false );
    */


    FormField.prototype.readonly = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._readonly;
      }
      me._readonly = val;
      me._updateCssReadonly();
      return void 0;
    };

    FormField.prototype._isValid = true;

    /**
     *  获取控件值是否已经通过验证
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.FormField
     *  @default    true
     *  @member     {Boolean}   isValid
     *  @example    <caption>get</caption>
     *      //  isValid == true
     *      isValid = ctrl.isValid();
    */


    FormField.prototype.isValid = function() {
      return this._isValid;
    };

    /**
     *  验证控件，返回控件值的验证结果
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     validate
     *  @returns    {Boolean}
    */


    FormField.prototype.validate = function() {
      var errorMsg, first, i, isValid, me, validator, validators, value, _i, _len;
      me = this;
      validators = me.validators();
      if (validators.length === 0) {
        return true;
      }
      /* display busy status*/

      me.busy();
      /* starting validation*/

      errorMsg = me._error;
      value = me.value();
      first = validators[0];
      isValid = first.validate(value, first.parameters);
      if (!isValid) {
        errorMsg[first.name] = first.message;
      }
      for (i = _i = 0, _len = validators.length; _i < _len; i = ++_i) {
        validator = validators[i];
        isValid = isValid && validator.validate(value, validator.parameters);
        if (!isValid) {
          errorMsg[validator.name] = validator.message;
        }
      }
      /* 控件所有验证规则的验证结果*/

      me._isValid = isValid;
      /* 更新控件的错误提示样式*/

      if (isValid) {
        me.success('');
      } else {
        me.error(me._getErrorMessage());
      }
      return isValid;
    };

    return FormField;

  })(Control);

  /**
  *   @class      DigitValidator
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Validator
  *   @author     monkey      <knightuniverse@qq.com>
  *   @example
  *      &lt;input data-role="textbox" data-options="{ validators:['digit'] }"/&gt;
  */


  DigitValidator = (function(_super) {
    __extends(DigitValidator, _super);

    function DigitValidator() {
      _ref1 = DigitValidator.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    DigitValidator.prototype.name = 'digit';

    /**
     *  错误提示信息
     *  @public
     *  @instance
     *  @default    'Please only enter digit characters.'
     *  @member     {String}    message
     *  @memberof   DigitValidator
    */


    DigitValidator.prototype.message = 'Please only enter digit characters.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.DigitValidator
    */


    DigitValidator.prototype.validate = function(value) {
      return /\d+/.test(value);
    };

    return DigitValidator;

  })(Validator);

  ebaui['web'].registerValidator('digit', DigitValidator);

  /**
  *   @class      EmailValidator
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Validator
  *   @author     monkey      <knightuniverse@qq.com>
  *   @example
  *      &lt;input data-role="textbox" data-options="{ validators:['email'] }"/&gt;
  */


  EmailValidator = (function(_super) {
    __extends(EmailValidator, _super);

    function EmailValidator() {
      _ref2 = EmailValidator.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    EmailValidator.prototype.name = 'email';

    /**
     *  错误提示信息
     *  @public
     *  @instance
     *  @default    'Please enter a valid email address.'
     *  @member     {String}    message
     *  @memberof   EmailValidator
    */


    EmailValidator.prototype.message = 'Please enter a valid email address.';

    /*
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.EmailValidator
    */


    EmailValidator.prototype.validate = function(value) {
      return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
    };

    return EmailValidator;

  })(Validator);

  ebaui['web'].registerValidator('email', EmailValidator);

  /**
  *   @class      IdentityValidator
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Validator
  *   @author     monkey      <knightuniverse@qq.com>
  *   @example
  *      &lt;input data-role="textbox" data-options="{ validators:['id'] }"/&gt;
  */


  IdentityValidator = (function(_super) {
    __extends(IdentityValidator, _super);

    function IdentityValidator() {
      _ref3 = IdentityValidator.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    /**
     *  用于计算身份证校验码的系数
     *  @private
     *  @instance
     *  @member         {Array}    _factors
     *  @memberof       IdentityValidator
    */


    IdentityValidator.prototype._factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

    /*
     *  身份证校验码算法过程，余数对应的校验码码表
     *  @private
     *  @instance
     *  @member         {Array}    _checkcode
     *  @memberof       IdentityValidator
    */


    IdentityValidator.prototype._checkcode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    IdentityValidator.prototype.name = 'id';

    IdentityValidator.prototype.parameters = [];

    /**
     *  错误提示信息
     *  @public
     *  @instance
     *  @default        'Please enter a valid id number.'
     *  @member         {String}    message
     *  @memberof       IdentityValidator
    */


    IdentityValidator.prototype.message = 'Please enter a valid id number.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method         validate
     *  @param          {Object}    value      -      要进行验证的值
     *  @memberof       ebaui.web.IdentityValidator
    */


    IdentityValidator.prototype.validate = function(value) {
      /**
      *   @see {http://zhidao.baidu.com/question/202372140.html|javascript 正则判断是否是身份证 正则判断是否是手机号码 正则判断是否是汉字 并且大于3小于20.}
      */

      var i, idString, isValid, me, mod, sum, _i;
      isValid = /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/.test(value);
      if (!isValid) {
        return false;
      }
      idString = value.toString();
      if (idString.length === 18) {
        me = this;
        /**
         *  @see {http://baike.baidu.com/view/5112521.htm|身份证校验码}
         *  1、将前面的身份证号码17位数分别乘以不同的系数。第i位对应的数为[2^(18-i)]mod11。从第一位到第十七位的系数分别为：7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 ；
         *  2、将这17位数字和系数相乘的结果相加；
         *  3、用加出来和除以11，看余数是多少？；
         *  4、余数只可能有0 1 2 3 4 5 6 7 8 9 10这11个数字。其分别对应的最后一位身份证的号码为1 0 X 9 8 7 6 5 4 3 2；
         *  5、通过上面得知如果余数是2，就会在身份证的第18位数字上出现罗马数字的x。如果余数是10，身份证的最后一位号码就是2；
        */

        mod = 0;
        sum = 0;
        for (i = _i = 0; _i <= 16; i = ++_i) {
          sum += parseInt(idString[i]) * me._factors[i];
        }
        mod = sum % 11;
        isValid = isValid && (me._checkcode[mod] === idString[17]);
      }
      return isValid;
    };

    return IdentityValidator;

  })(Validator);

  ebaui['web'].registerValidator('id', IdentityValidator);

  /**
   *  控件文本值的长度验证规则，默认规则是[0,无穷大]
   *  @public
   *  @class      LengthValidator
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Validator
   *  @param      {Array}    params     -     传递给验证器的外部参数
   *  @example
   *      &lt;input data-role="textbox" data-options="{ validators:['len[0,100]'] }"/&gt;
  */


  LengthValidator = (function(_super) {
    __extends(LengthValidator, _super);

    function LengthValidator() {
      _ref4 = LengthValidator.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    LengthValidator.prototype.name = 'len';

    LengthValidator.prototype._parameterInvalidException = 'Max length must be less than min length, please set a valid validator parameters.';

    /**
     *  错误提示信息
     *  @public
     *  @instance
     *  @default    'Please enter a value between {0} and {1}.'
     *  @member     {String}    message
     *  @memberof   LengthValidator
    */


    LengthValidator.prototype._message = 'Please enter a value between {0} and {1}.';

    LengthValidator.prototype.message = 'Please enter a value between {0} and {1}.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method         validate
     *  @param          {Object}    value      -      要进行验证的值
     *  @memberof       ebaui.web.LengthValidator
    */


    LengthValidator.prototype.validate = function(value) {
      var isValid, len, max, me, min;
      if (!value) {
        return false;
      }
      me = this;
      /**
      *   once I thought if you assign this validator, 
      *   but you don't assign it's range 
      *   that means this validator is invalid itself
      */

      if (me.parameters.length === 0) {
        return true;
      }
      isValid = false;
      len = me.parameters.length;
      min = me.parameters[0];
      max = len > 1 ? me.parameters[1] : 0;
      if (min > max) {
        throw me._parameterInvalidException;
      }
      value = value.toString();
      if (len > 1 && min !== max) {
        isValid = (value.length > min) && (value.length < max);
      } else if (len > 1 && min === max) {
        isValid = value.length === min;
      } else {
        isValid = value.length > min;
      }
      me.message = me._message.replace('{0}', min).replace('{1}', len > 1 ? max : '');
      return isValid;
    };

    return LengthValidator;

  })(Validator);

  ebaui['web'].registerValidator('len', LengthValidator);

  /**
   *  手机号码验证规则
   *  @public
   *  @class      MobileValidator
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Validator
   *  @param      {Array}    params     -     传递给验证器的外部参数
   *  @example
   *      &lt;input data-role="textbox" data-options="{ validators:['required'] }"/&gt;
  */


  MobileValidator = (function(_super) {
    __extends(MobileValidator, _super);

    function MobileValidator() {
      _ref5 = MobileValidator.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    MobileValidator.prototype.name = 'mobi';

    MobileValidator.prototype.message = 'Please enter a valid mobilephone number.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method         validate
     *  @param          {Object}    value      -      要进行验证的值
     *  @memberof       ebaui.web.MobileValidator
    */


    MobileValidator.prototype.validate = function(value) {
      return /^(?:13\d|15[89]|18[019])-?\d{5}(\d{3}|\*{3})$/.test(value);
    };

    return MobileValidator;

  })(Validator);

  ebaui['web'].registerValidator('mobi', MobileValidator);

  /**
  *   @class      OnlyCnValidator
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Validator
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *      &lt;input data-role="textbox" data-options="{ validators:['cn'] }"/&gt;
  */


  OnlyCnValidator = (function(_super) {
    __extends(OnlyCnValidator, _super);

    function OnlyCnValidator() {
      _ref6 = OnlyCnValidator.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    OnlyCnValidator.prototype.name = 'cn';

    /**
     *  错误提示信息
     *  @public
     *  @instance
     *  @default    'Please only enter Chinese characters.'
     *  @member     {String}    message
     *  @memberof   OnlyCNValidator
    */


    OnlyCnValidator.prototype.message = 'Please only enter Chinese characters.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.OnlyCnValidator
    */


    OnlyCnValidator.prototype.validate = function(value) {
      /* 
      *   /[^\x00-\xff]+/ GBK中匹配 
      *   /[\u4e00-\u9fa5]+/ UTF8中匹配
      */

      return /[\u4e00-\u9fa5]+/.test(value) || /[^\x00-\xff]+/.test(value);
    };

    return OnlyCnValidator;

  })(Validator);

  ebaui['web'].registerValidator('cn', OnlyCnValidator);

  /**
   *  控件值为Number类型的值范围
   *  @public
   *  @class      RangeValidator
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Validator
   *  @param      {Array}    params     -     传递给验证器的外部参数
   *  @example
   *      &lt;input data-role="textbox" data-options="{ validators:['rng'] }"/&gt;
  */


  RangeValidator = (function(_super) {
    __extends(RangeValidator, _super);

    function RangeValidator() {
      _ref7 = RangeValidator.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    RangeValidator.prototype.name = 'rng';

    RangeValidator.prototype._message = 'Please enter a value between {0} ~ {1}.';

    RangeValidator.prototype.message = 'Please enter a value between {0} ~ {1}.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.RangeValidator
    */


    RangeValidator.prototype.validate = function(value) {
      var isValid, len, max, me, min, _msg;
      me = this;
      value = parseFloat(value);
      isValid = false;
      len = me.parameters.length;
      min = me.parameters[0];
      max = len > 1 ? me.parameters[1] : 0;
      _msg = me._message;
      me.message = _msg.replace('{0}', min).replace('{1}', len > 1 ? max : '');
      if (!/^\d+(\.\d+)?$/i.test(value.toString())) {
        return false;
      }
      if (me.parameters.length === 0) {
        return true;
      }
      isValid = value > min;
      if (len > 1) {
        max = me.parameters[1];
        isValid = isValid && (value < max);
      }
      return isValid;
    };

    return RangeValidator;

  })(Validator);

  ebaui['web'].registerValidator('rng', RangeValidator);

  /**
   *  发送请求，把控件值发送到服务端进行验证，validator的每个参数都是字符串类型，使用$作为分隔符。
   *  其中，url，pass参数以及token参数是必须指定的。
   *  url指定服务端地址
   *  ，token指定控件的值要以什么样的参数名发送到服务端。
   *  ，pass参数是一个方法，实现根据服务端返回值，判断控件值是否合法。该方法有两个参数：value serverData
   *  @public
   *  @class      RemoteValidator
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Validator
   *  @param      {Array}    params     -     传递给验证器的外部参数
   *  @example
   *      function captchaPass( value,serverData ){ 
   *          if( !serverData || serverData['result'] == null || serverData['result'] == undefined ){ return false; }
   *          return parseInt( serverData['result'] ) == 1;
   *      };
   *      &lt;input data-role="textbox" data-options="{ validators:['remote[\'url$http://192.168.102.159:8080/cas/captcha\',\'token$verify\',\'pass$captchaPass\']'] }"/&gt;
  */


  RemoteValidator = (function(_super) {
    __extends(RemoteValidator, _super);

    function RemoteValidator(params, msg) {
      var me, paramsType;
      me = this;
      me.message = msg != null ? msg : '';
      if (!params) {
        throw me._parameterInvalidException;
      }
      /* 解析参数，生成_ajaxConfig*/

      me.parameters = params;
      /**
      *   $.type
      *
      *   Returns the sort of types we'd expect:
      *   type("")         # "string"
      *   type(new String) # "string"
      *   type([])         # "array"
      *   type(/\d/)       # "regexp"
      *   type(new Date)   # "date"
      *   type(true)       # "boolean"
      *   type(null)       # "null"
      *   type({})         # "object"
      */

      paramsType = $.type(params);
      if (paramsType === 'array') {
        me._initFromParamsStr(params);
      } else {
        me._initFromParamsObj(params);
      }
    }

    RemoteValidator.prototype.name = 'remote';

    /**
    *   请求服务端进行验证的时候，
    *   控件值对应的参数名，e.g. http://aa.com?token=value
    */


    RemoteValidator.prototype._token = '';

    RemoteValidator.prototype._ajaxConfig = {
      url: '',
      async: false,
      dataType: 'json',
      /* 要提交到服务器的参数*/

      data: {}
    };

    RemoteValidator.prototype._isTmpl = function(str) {
      return /<%=value%>/i.test(str);
    };

    RemoteValidator.prototype._pass = function(value, serverData) {
      return false;
    };

    RemoteValidator.prototype._parameterInvalidException = 'Please set a valid validator parameters.';

    RemoteValidator.prototype.message = '';

    RemoteValidator.prototype._initFromParamsStr = function(params) {
      var ajaxConfig, i, j, key, keyValuePair, me, pair, paramItem, value, _i, _len, _results;
      me = this;
      ajaxConfig = me._ajaxConfig;
      /**
      *   解析参数，生成_ajaxConfig
      */

      _results = [];
      for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
        paramItem = params[i];
        keyValuePair = paramItem.split('$');
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (j = _j = 0, _len1 = keyValuePair.length; _j < _len1; j = ++_j) {
            pair = keyValuePair[j];
            pair = keyValuePair[j];
            key = keyValuePair[0];
            value = keyValuePair[1];
            switch (key) {
              case 'url':
                _results1.push(ajaxConfig['url'] = value);
                break;
              case 'dataType':
                _results1.push(ajaxConfig['dataType'] = value);
                break;
              case 'token':
                me._token = value;
                _results1.push(ajaxConfig['data'][value] = '');
                break;
              case 'pass':
                _results1.push(me._pass = eval(value));
                break;
              default:
                _results1.push(ajaxConfig['data'][key] = value);
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    RemoteValidator.prototype._initFromParamsObj = function(params) {
      var ajaxConfig, key, me, value, _results;
      me = this;
      ajaxConfig = me._ajaxConfig;
      /**
      *   解析参数，生成_ajaxConfig
      */

      _results = [];
      for (key in params) {
        value = params[key];
        switch (key) {
          case 'url':
            _results.push(ajaxConfig['url'] = value);
            break;
          case 'dataType':
            _results.push(ajaxConfig['dataType'] = value);
            break;
          case 'token':
            me._token = value;
            _results.push(ajaxConfig['data'][value] = '');
            break;
          case 'pass':
            _results.push(me._pass = eval(value));
            break;
          default:
            _results.push(ajaxConfig['data'][key] = value);
        }
      }
      return _results;
    };

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.RemoteValidator
    */


    RemoteValidator.prototype.validate = function(value) {
      var conf, data, extraAjaxConfig, me, _isValid;
      me = this;
      _isValid = false;
      extraAjaxConfig = {
        statusCode: {
          404: function(serverData, textStatus, jqXHR) {
            return _isValid = false;
          }
        },
        success: function(serverData) {
          var isFunc;
          isFunc = typeof me._pass === 'function';
          return _isValid = isFunc ? me._pass(value, serverData) : false;
        },
        error: function(jqXHR) {
          return me._isValid = false;
        }
      };
      /* 把占位符替换成控件的值*/

      data = me._ajaxConfig.data;
      data[me._token] = value;
      data['t'] = (new Date).getTime();
      conf = $.extend({}, me._ajaxConfig, extraAjaxConfig);
      $.ajax(conf);
      return _isValid;
    };

    return RemoteValidator;

  })(Validator);

  ebaui['web'].registerValidator('remote', RemoteValidator);

  /**
   *  Required验证规则
   *  @public
   *  @class      RequiredValidator
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Validator
   *  @param      {Array}    params     -     传递给验证器的外部参数
   *  @example
   *      &lt;input data-role="textbox" data-options="{ validators:['required'] }"/&gt;
  */


  RequiredValidator = (function(_super) {
    __extends(RequiredValidator, _super);

    function RequiredValidator() {
      _ref8 = RequiredValidator.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    RequiredValidator.prototype.name = 'required';

    RequiredValidator.prototype.message = 'This field is required.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.RequiredValidator
    */


    RequiredValidator.prototype.validate = function(value) {
      var t;
      toString = Object.prototype.toString;
      t = toString.call(value);
      if (t === '[object String]' || t === '[object Array]') {
        return value.length > 0;
      }
      if (t === '[object Boolean]' || value === true || value === false) {
        return true;
      }
      if (value) {
        return true;
      } else {
        return false;
      }
    };

    return RequiredValidator;

  })(Validator);

  ebaui['web'].registerValidator('required', RequiredValidator);

  /**
   *  电话号码验证规则
   *  @public
   *  @class      TelephoneValidator
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Validator
   *  @param      {Array}    params     -     传递给验证器的外部参数
   *  @example
   *      &lt;input data-role="textbox" data-options="{ validators:['tel'] }"/&gt;
  */


  TelephoneValidator = (function(_super) {
    __extends(TelephoneValidator, _super);

    function TelephoneValidator() {
      _ref9 = TelephoneValidator.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    TelephoneValidator.prototype.name = 'tel';

    TelephoneValidator.prototype.message = 'Please enter a valid telephone number.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.TelephoneValidator
    */


    TelephoneValidator.prototype.validate = function(value) {
      return /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value);
    };

    return TelephoneValidator;

  })(Validator);

  ebaui['web'].registerValidator('tel', TelephoneValidator);

  /**
  *  Url地址验证规则
  *  @public
  *  @class      UrlValidator
  *  @memberof   ebaui.web
  *  @extends    ebaui.web.Validator
  *  @param      {Array}    params     -     传递给验证器的外部参数
  *  @example
  *      &lt;input data-role="textbox" data-options="{ validators:['url'] }"/&gt;
  */


  UrlValidator = (function(_super) {
    __extends(UrlValidator, _super);

    function UrlValidator() {
      _ref10 = UrlValidator.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    UrlValidator.prototype.name = 'url';

    UrlValidator.prototype.message = 'Please enter a valid URL.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.UrlValidator
    */


    UrlValidator.prototype.validate = function(value) {
      return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    };

    return UrlValidator;

  })(Validator);

  ebaui['web'].registerValidator('url', UrlValidator);

  /**
   *  邮政编码验证规则
   *  @public
   *  @class      ZipValidator
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Validator
   *  @param      {Array}    params     -     传递给验证器的外部参数
   *  @example
   *      &lt;input data-role="textbox" data-options="{ validators:['zip'] }"/&gt;
  */


  ZipValidator = (function(_super) {
    __extends(ZipValidator, _super);

    function ZipValidator() {
      _ref11 = ZipValidator.__super__.constructor.apply(this, arguments);
      return _ref11;
    }

    ZipValidator.prototype.name = 'zip';

    ZipValidator.prototype.message = 'Please enter a valid postal code.';

    /**
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.ZipValidator
    */


    ZipValidator.prototype.validate = function(value) {
      return /^[1-9]\d{5}$/.test(value);
    };

    return ZipValidator;

  })(Validator);

  ebaui['web'].registerValidator('zip', ZipValidator);

  /**
  *   @class      Panel
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.Panel( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).panel( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="panel" data-options="{}" /&gt;
  */


  Panel = (function(_super) {
    __extends(Panel, _super);

    function Panel() {
      _ref12 = Panel.__super__.constructor.apply(this, arguments);
      return _ref12;
    }

    /**
     *  允许的button的state
     *  @private
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.Button
     *  @member     {String}    _availableState
    */


    Panel.prototype._availableState = /^(primary|info|success|warning|danger|inverse|\s+)$/i;

    /**
     *  panel的head的高度
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Number}   _headHeight
    */


    Panel.prototype._headHeight = null;

    /**
     *  panel整体的高度
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Number}   _ctrlHeight
    */


    Panel.prototype._ctrlHeight = null;

    /**
     *  控制当前panel是否展开body的变量
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Boolean}   _expanded
    */


    Panel.prototype._expanded = true;

    /**
     *  把HTML占位符转换成为控件自身的HTML结构
     *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _parseUi
     *  @param      {Object}    element HTML占位符
    */


    Panel.prototype._parseUi = function(element) {
      return $(element);
    };

    /**
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {String}    _headerTmpl
    */


    Panel.prototype._headerTmpl = '';

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         _init
    */


    Panel.prototype._init = function(opts) {
      var me, _ref13, _ref14, _ref15, _ref16;
      Panel.__super__._init.call(this, opts);
      me = this;
      /*
      *   by defaults, 
      *   panel's position css property will be 'relative'
      */

      me._buttons = (_ref13 = opts['buttons']) != null ? _ref13 : [];
      me._iconCls = (_ref14 = opts['iconCls']) != null ? _ref14 : '';
      me._position = (_ref15 = opts['position']) != null ? _ref15 : 'relative';
      return me._state = (_ref16 = opts['state']) != null ? _ref16 : '';
    };

    Panel.prototype._setupEvents = function(opts) {
      var me;
      me = this;
      return me._$root.on('click', function(eventArgs) {
        return eventArgs.stopPropagation();
      });
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _updateCssButtons
    */


    Panel.prototype._updateCssButtons = function() {
      var $buttons, $header, $root, btn, btnIconCls, buttons, clickHandle, me, _i, _len, _results;
      me = this;
      $root = me.uiElement();
      $header = $('.panel-head', $root);
      if (!($header.size() > 0)) {
        return;
      }
      buttons = me.buttons();
      /*
      *   if there is no button
      */

      if (buttons.length === 0) {
        return;
      }
      $buttons = $('div.action', $header);
      /*
      *   append dom element and bind event handles
      */

      _results = [];
      for (_i = 0, _len = buttons.length; _i < _len; _i++) {
        btn = buttons[_i];
        btnIconCls = btn.iconCls;
        if (btnIconCls) {
          /*
          *   获取onclick的事件处理程序
          *   这边必须使用闭包来做，否则btn是一个对象引用，如果直接绑定btn.onclick，那么会引起这么一个问题：
          *       所有的click事件处理程序，都会引用最后一个btn配置的事件处理程序
          */

          clickHandle = (function(config) {
            var fn;
            fn = config.onclick;
            if (typeof fn === "function") {
              return function(eventArgs) {
                return fn(me, eventArgs);
              };
            }
            return function(eventArgs) {};
          })(btn);
          $buttons.append("<a class='btn-" + btnIconCls + "' href='javascript:void(0);'><i class='" + btnIconCls + "'></i></a>");
          _results.push($buttons.on('click', ".btn-" + btnIconCls, clickHandle));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _updateCssTitle
    */


    Panel.prototype._updateCssHeader = function() {
      var $buttons, $header, $root, iconCls, me, showHeader, title;
      me = this;
      $root = me.uiElement();
      showHeader = me._couldShowHeader();
      $header = $('.panel-head', $root);
      title = me.title();
      iconCls = me.iconCls();
      if (showHeader) {
        $root.addClass('panel');
      } else {
        $root.removeClass('panel');
      }
      /*
      *   第一次_updateCssHeader的时候
      *   刚好没有满足出现header的条件，并且header并没有生成
      */

      if ($header.size() === 0 && !showHeader) {
        return;
      }
      /*
      *   $header exists
      */

      if ($header.size() > 0) {
        if (showHeader) {
          $header.show();
        } else {
          $header.hide();
        }
        return;
      }
      /*
      *   $header do not exist
      *   append html
      */

      $root.prepend(me._headerTmpl);
      $header = $('.panel-head', $root);
      $buttons = $('div.action', $header);
      /*
      *   set panel title
      */

      $('h5', $header).text(title);
      /*
      *   set panel title icon
      */

      if (iconCls) {
        $('div.caption', $header).prepend("<i class='" + iconCls + "'></i>");
      }
      /*
      *   set panel actions
      */

      me._updateCssButtons();
      /*
      *   panel的title以及border的颜色等
      */

      return me._updateCssStates();
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _updateCssTitle
    */


    Panel.prototype._updateCssStates = function() {
      var $root, cls, me, state, stateCls;
      me = this;
      /*
      *   如果panel没有显示header的话，我觉得还是不要放上这个state好了
      */

      if (!me._showHeader) {
        return;
      }
      state = $.trim(me.state());
      $root = me.uiElement();
      cls = $root.attr('class').replace(/panel-primary|panel-info|panel-success|panel-warning|panel-danger|panel-inverse/ig, '');
      stateCls = state ? "panel-" + state : "";
      if (state) {
        $root.attr('class', "" + cls + " " + stateCls);
      }
      return void 0;
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _render
    */


    Panel.prototype._render = function() {
      var $contents, $root, me;
      me = this;
      $root = me.uiElement();
      /*
      *   first step
      *   wrap panel content with """ <div class="panel-body"></div> """
      */

      $contents = $root.contents();
      $contents.wrapAll('<div class="panel-body"></div>');
      /*
      *   second
      *   judge if it's necessary to show panel header
      */

      me._updateCssHeader();
      /*
      *   调用父类的_render方法
      */

      Panel.__super__._render.call(this);
      /*
      *
      */

      me._ctrlHeight = me._height > 0 ? me._height : $root.height();
      return me._headHeight = $('.panel-head', $root).height();
    };

    /**
     *  是否显示panel header
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Boolean}   _showHeader
    */


    Panel.prototype._showHeader = false;

    /**
     *  是否显示panel header
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _couldShowHeader
    */


    Panel.prototype._couldShowHeader = function() {
      /*
      *   如果你既没有填写title也没有icon更不指定任何的button放在panel的顶部
      *   那么直接不进行处理
      */

      var buttons, iconCls, me, title;
      me = this;
      title = me.title();
      iconCls = me.iconCls();
      buttons = me.buttons();
      me._showHeader = title.length > 0 || iconCls.length > 0 || buttons.length > 0;
      return me._showHeader;
    };

    Panel.prototype._state = '';

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
     *  
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {String}    state
     *  @default    ''
     *  @example    <caption>get</caption>
     *      var state = ctrl.state();
     *  @example    <caption>set</caption>
     *      ctrl.state( '' );
    */


    Panel.prototype.state = function(val) {
      var availableState, me;
      me = this;
      availableState = me._availableState;
      if (!availableState.test(val)) {
        return me._state;
      }
      me._state = val.toLowerCase();
      return me._updateCssStates();
    };

    /**
     *  获取或者设置控件是否可见
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {String}   title
     *  @default    ''
     *  @example    <caption>get</caption>
     *      console.log( ctrl.title() );
     *  @example    <caption>set</caption>
     *      ctrl.title( 'pls type user name' )
    */


    Panel.prototype.title = function(val) {
      var $root, me;
      me = this;
      if (!me.isString(val)) {
        return me._title;
      }
      me._title = val;
      $root = me.uiElement();
      if (me._couldShowHeader()) {
        /*
        *   first we should make sure that header has been created before
        *   if header has been created before then it is no necessary to do it again
        *   else create header then update panel title
        */

        me._updateCssHeader();
        /*
        *   update title
        */

        if (me._title) {
          return $('.panel-head h5', $root).text(me._title);
        }
      }
    };

    Panel.prototype._buttons = [];

    /**
     *  panel标题栏的按钮
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @member         {Array}    buttons
    */


    Panel.prototype.buttons = function(val) {
      var $buttons, $header, btn, btnIconCls, me, old, _i, _len;
      me = this;
      if (!me.isArray(val)) {
        return me._buttons;
      }
      /*
      *   remove all old buttons
      *   unbind all old button click handles
      */

      old = me._buttons;
      if (old.length > 0) {
        $header = $('.panel-head', $root);
        $buttons = $('div.action', $header);
        /*
        *   off all event hanlds
        */

        for (_i = 0, _len = old.length; _i < _len; _i++) {
          btn = old[_i];
          btnIconCls = btn.iconCls;
          if (btnIconCls) {
            $buttons.off('click', btnIconCls);
          }
        }
        /*
        *   empty dom elements
        */

        $buttons.html('');
      }
      me._buttons = val;
      return me._updateCssButtons();
    };

    Panel.prototype._iconCls = '';

    /**
     *  panel标题的icon样式类
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @member         {String}    iconCls
    */


    Panel.prototype.iconCls = function(val) {
      var $dom, me;
      me = this;
      if (val == null) {
        return me._iconCls;
      }
      me._iconCls = $.trim(val);
      if (me._couldShowHeader()) {
        /*
        *   first we should make sure that header has been created before
        *   if header has been created before then it is no necessary to do it again
        *   else create header then update panel title
        */

        me._updateCssHeader();
        /*
        *   update title
        */

        $dom = $('div.caption', $header);
        if (me._iconCls) {
          return $dom.html("<i class='" + me._iconCls + "'></i>");
        } else {
          return $dom.html("");
        }
      }
    };

    /**
     *  显示或者关闭panel
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         toggle
    */


    Panel.prototype.toggle = function() {
      var me;
      me = this;
      return me.visible(!me.visible());
    };

    /**
     *  显示panel
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         open
    */


    Panel.prototype.open = function() {
      return this.visible(true);
    };

    /**
     *  关闭panel
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         close
    */


    Panel.prototype.close = function() {
      return this.visible(false);
    };

    /**
     *  移动panel
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         move
     *  @arg            {Object}    pos - new position { top left }
    */


    Panel.prototype.move = function(pos) {
      var me, opts;
      if (!pos) {
        return;
      }
      me = this;
      opts = me.options;
      if (pos['top'] != null) {
        me._top = pos['top'];
      }
      if (pos['left'] != null) {
        me._left = pos['left'];
      }
      me._$root.css({
        'top': me._top,
        'left': me._left
      });
      return void 0;
    };

    /**
     *  收起panel的内容区域
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         collapse
    */


    Panel.prototype.collapse = function() {
      var $body, $root, me;
      me = this;
      if (!me._expanded) {
        return;
      }
      me._expanded = false;
      $root = me.uiElement();
      $body = $('.panel-body', $root);
      return $root.animate({
        height: me._headHeight
      }, 400, 'swing', function() {
        me.height(me._headHeight);
        return $body.hide();
      });
    };

    /**
     *  展开panel的内容区域
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         expand
    */


    Panel.prototype.expand = function() {
      var $body, $root, me;
      me = this;
      if (me._expanded) {
        return;
      }
      me._expanded = true;
      $root = me.uiElement();
      $body = $('.panel-body', $root);
      return $root.animate({
        height: me._ctrlHeight
      }, 400, 'swing', function() {
        $body.show();
        return me.height(me._ctrlHeight);
      });
    };

    return Panel;

  })(Control);

  ebaui['web'].registerControl('Panel', Panel);

  /**
  *   IE下，Button有一个比较蛋疼的问题就是，当你按下回车键的时候
  *   浏览器会触发Button的click事件
  *   关于这个问题的解决方案，就是给button标签添加属性：type="button"
  *   see http://tjvantoll.com/2013/05/22/why-are-enter-keypresses-clicking-my-buttons-in-ie/
  */


  /**
  *   @class      Button
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.Button( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).button( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="button" data-options="{}" /&gt;
  */


  Button = (function(_super) {
    __extends(Button, _super);

    function Button() {
      _ref13 = Button.__super__.constructor.apply(this, arguments);
      return _ref13;
    }

    /**
     *  允许的button的state
     *  @private
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.Button
     *  @member     {String}    _availableState
    */


    Button.prototype._availableState = /^(primary|info|success|warning|danger|inverse|link|\s+)$/i;

    /**
     *  更新控件enabled的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @method     _updateCssEnabled
    */


    Button.prototype._updateCssEnabled = function() {
      var $root, cls, enabled, me, op;
      me = this;
      $root = me.uiElement();
      cls = 'eba-button-disabled';
      enabled = me.enabled();
      op = enabled ? 'removeClass' : 'addClass';
      $root[op](cls);
      return $root.prop('disabled', !enabled);
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @method     _updateAttrText
    */


    Button.prototype._updateAttrText = function() {
      var me, txt;
      me = this;
      txt = me.text();
      if (txt) {
        me._$btnText.text(txt);
      }
      return void 0;
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @method     _updateAttrHref
    */


    Button.prototype._updateAttrHref = function() {
      var attrVal, href, me;
      me = this;
      href = me.href();
      attrVal = me.enabled() && href ? href : 'javascript:void(0);';
      me._$root.attr('href', attrVal);
      return void 0;
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @method     _updateAttrTarget
    */


    Button.prototype._updateAttrTarget = function() {
      var me, target;
      me = this;
      target = me.target();
      me._$root.attr('target', target.length > 0 ? target : null);
      return void 0;
    };

    Button.prototype._updateCssStates = function() {
      var $root, cls, me, state, stateCls;
      me = this;
      state = $.trim(me.state());
      $root = me.uiElement();
      cls = $root.attr('class').replace(/eba-button-primary|eba-button-info|eba-button-success|eba-button-warning|eba-button-danger|eba-button-inverse|eba-button-link/ig, '');
      stateCls = state ? "eba-button-" + state : "";
      if (state) {
        $root.attr('class', "" + cls + " " + stateCls);
      }
      return void 0;
    };

    Button.prototype._updateCssIcon = function() {
      var $root, iconHtml, iconPosition, me;
      me = this;
      $root = me._$root;
      iconPosition = me.iconPosition();
      iconHtml = '<i class="{0}"></i>'.replace('{0}', me.iconCls());
      $('i', $root).remove();
      if (iconPosition !== 'left') {
        $root.append(iconHtml);
      } else {
        $root.prepend(iconHtml);
      }
      return void 0;
    };

    Button.prototype._render = function() {
      var me;
      Button.__super__._render.call(this);
      me = this;
      me._updateAttrText();
      me._updateCssIcon();
      me._updateAttrHref();
      me._updateAttrTarget();
      return me._updateCssStates();
    };

    Button.prototype._setupEvents = function(opts) {
      var $root, me;
      me = this;
      $root = me.uiElement();
      keyboard = ebaui['web'].keyboard;
      me.onEvent('click', opts['onclick']);
      $root.on('keydown', function(eventArgs) {
        var enter;
        enter = eventArgs.which === 13;
        if (me.enabled() && me.focused() && enter) {
          eventArgs.preventDefault();
          return me.triggerEvent('click', eventArgs);
        }
      });
      return $root.on('click', function(eventArgs) {
        if (me.enabled()) {
          eventArgs.preventDefault();
          return me.triggerEvent('click', eventArgs);
        }
      });
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   Button
     *  @method     _init
    */


    Button.prototype._init = function(opts) {
      var initState, me, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19;
      Button.__super__._init.call(this, opts);
      me = this;
      me._$btnText = $('.eba-button-text ', me._$root);
      initState = opts['state'];
      if (me._availableState.test(initState)) {
        me._state = initState.toLowerCase();
      }
      me._text = (_ref14 = opts['text']) != null ? _ref14 : '';
      me._href = (_ref15 = opts['href']) != null ? _ref15 : '';
      me._target = (_ref16 = opts['target']) != null ? _ref16 : 'blank';
      me._iconCls = (_ref17 = opts['iconCls']) != null ? _ref17 : '';
      me._iconPosition = (_ref18 = opts['iconPosition']) != null ? _ref18 : 'left';
      return me._enterAsTab = (_ref19 = opts['enterAsTab']) != null ? _ref19 : true;
    };

    Button.prototype._focus = function() {
      return this._$root.focus();
    };

    Button.prototype._blur = function() {
      return this._$root.blur();
    };

    Button.prototype._state = '';

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


    Button.prototype.state = function(val) {
      var availableState, me;
      me = this;
      availableState = me._availableState;
      if (!availableState.test(val)) {
        return me._state;
      }
      me._state = val.toLowerCase();
      return me._updateCssStates();
    };

    Button.prototype._text = 'button';

    /**
     *  获取或者设置button文本值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    text
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #text == 'text'
     *      var text = ctrl.text();
     *  @example    <caption>set</caption>
     *      ctrl.text( 'label' );
    */


    Button.prototype.text = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._text;
      }
      me._text = val;
      me._$btnText.text(val);
      return void 0;
    };

    Button.prototype._href = '';

    /**
     *  获取或者设置button超链接地址
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    href
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #href == 'href'
     *      var href = ctrl.href();
     *  @example    <caption>set</caption>
     *      ctrl.href( 'http://xxx.com/xxx' );
    */


    Button.prototype.href = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._href;
      }
      if ($.trim(val).length !== 0) {
        return me._href;
      }
      me._href = val;
      me._updateAttrHref();
      return void 0;
    };

    Button.prototype._target = 'blank';

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
     *      #_blank _parent _self _top 
     *      ctrl.target( '_blank' );
    */


    Button.prototype.target = function(val) {
      var me, re;
      me = this;
      re = /_parent|_blank|_self|_top/i;
      if (!re.test(val)) {
        return me._target;
      }
      me._target = val;
      return me._updateAttrTarget();
    };

    /**
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.Button
     *  @member     {Boolean}   focusable
     *  @default    false
     *  @example    <caption>get</caption>
     *      #false
     *      console.log( ctrl.focusable() );
    */


    Button.prototype.focusable = function() {
      return true;
    };

    Button.prototype._iconCls = '';

    /**
     *  获取或者设置button的icon图标CSS样式类
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    iconCls
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #iconCls == 'icon-add'
     *      var iconCls = ctrl.iconCls();
     *  @example    <caption>set</caption>
     *      ctrl.iconCls( 'icon-add' );
    */


    Button.prototype.iconCls = function(val) {
      var me;
      me = this;
      if (me.isEmpty(val)) {
        return me._iconCls;
      }
      me._iconCls = val;
      return me._updateCssIcon();
    };

    Button.prototype._iconPosition = 'left';

    /**
     *  获取或者设置button的icon图标位置，可选的值有：left right
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    iconPosition
     *  @default    'left'
     *  @example    <caption>get</caption>
     *      #position == 'left'
     *      var position = ctrl.iconPosition();
     *  @example    <caption>set</caption>
     *      ctrl.iconPosition( 'left' );
     *      ctrl.iconPosition( 'right' );
    */


    Button.prototype.iconPosition = function(val) {
      var me, re;
      me = this;
      re = /left|right/i;
      if (!re.test(val)) {
        return me._iconPosition;
      }
      me._iconPosition = val;
      return me._updateCssIcon();
    };

    Button.prototype._enterAsTab = true;

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


    Button.prototype.enterAsTab = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._enterAsTab;
      }
      return me._enterAsTab = val;
    };

    return Button;

  })(Control);

  ebaui['web'].registerControl('Button', Button);

  /**
  *   @class      TextBox
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormField
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.TextBox( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).textbox( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="textbox" data-options="{}" /&gt;
  */


  TextBox = (function(_super) {
    __extends(TextBox, _super);

    function TextBox() {
      _ref14 = TextBox.__super__.constructor.apply(this, arguments);
      return _ref14;
    }

    /**
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}    _JQSelector
    */


    TextBox.prototype._JQSelector = {
      'input': '.eba-textbox-input',
      'placeholder': '.eba-placeholder-lable'
    };

    /**
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}    _rootCls
    */


    TextBox.prototype._rootCls = {
      disabled: 'eba-disabled',
      focused: 'eba-textbox-focus',
      readonly: 'eba-readonly'
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _setupEvents
    */


    TextBox.prototype._setupEvents = function(opts) {
      var $input, $root, JQSelector, formInput, me, placeholder;
      me = this;
      $root = me._$root;
      $input = me._$formInput;
      JQSelector = me._JQSelector;
      formInput = JQSelector.input;
      placeholder = JQSelector.placeholder;
      keyboard = ebaui['web'].keyboard;
      /*
      *   绑定事件处理程序
      */

      me.onEvent('keydown', opts['onkeydown']);
      me.onEvent('keyup', opts['onkeyup']);
      me.onEvent('enter', opts['onenter']);
      me.onEvent('focus', opts['onfocus']);
      me.onEvent('blur', opts['onblur']);
      me.onEvent('change', opts['onchange']);
      $root.on('keydown', formInput, function(eventArgs) {
        var code;
        if (!me.enabled()) {
          return eventArgs.preventDefault();
        }
        code = eventArgs.which;
        switch (code) {
          case keyboard.isEnter(code):
            return me.triggerEvent('enter', eventArgs);
          default:
            return me.triggerEvent('keydown', eventArgs);
        }
      });
      /*
      *   切到中文輸入法后，输入文字将不会触发KeyPress事件，只有KeyDown，而且e.keyCode一律是229
      *       http://blog.darkthread.net/post-2011-04-26-keypress-event-under-ime.aspx
      *   另外，关于微软的IME标准，可以参考以下的链接
      *       http://www.cnblogs.com/freedomshe/archive/2012/11/30/ime_learning.html
      *       http://www.cnblogs.com/freedomshe/archive/2012/11/13/ime-resources.html
      */

      $root.on('keyup', formInput, function(eventArgs) {
        me._setValue($input.val(), false, true, eventArgs);
        return me.triggerEvent('keyup', eventArgs);
      });
      $root.on('focus', formInput, function(eventArgs) {
        me._focused = true;
        me._updateCssFocused();
        return me.triggerEvent('focus', eventArgs);
      });
      $root.on('blur', formInput, function(eventArgs) {
        me._focused = false;
        me._updateCssFocused();
        return me.triggerEvent('blur', eventArgs);
      });
      return void 0;
    };

    /**
     *  聚焦
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     focus
    */


    TextBox.prototype._focus = function() {
      var me;
      me = this;
      if (me.enabled() && !me.readonly()) {
        me._updateCssFocused();
      }
      me._$formInput.focus();
      return void 0;
    };

    /**
     *  失焦
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _blur
    */


    TextBox.prototype._blur = function() {
      var me;
      me = this;
      if (me.enabled()) {
        me._updateCssFocused();
      }
      me._$formInput.blur();
      return void 0;
    };

    /**
     *  更新UI的宽度
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   Control
     *  @method     _updateCssWidth
    */


    TextBox.prototype._updateCssWidth = function() {
      var $root, cssUnit, isNum, me, numeric, propVal, result;
      me = this;
      $root = me.uiElement();
      propVal = me.width();
      isNum = me.isNumber(propVal);
      if (isNum && propVal <= 0) {
        return;
      }
      result = me._cssUnitRE.exec(propVal);
      numeric = parseInt(result[1]);
      cssUnit = result[2];
      return $root.css('width', cssUnit != null ? propVal : propVal + 'px');
      /*
      *   border : solid 1px #a5acb5;
      *   margin-right: 22px;
      *   bolderW = 2
      *   iconW   = 22
      */

    };

    /**
     *  更新UI的高度
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   Control
     *  @method     _updateCssHeight
    */


    TextBox.prototype._updateCssHeight = function() {
      var $input, $label, $root, cssUnit, isNum, me, numeric, propVal, result, val;
      me = this;
      $input = me._$formInput;
      $root = me.uiElement();
      propVal = me.height();
      isNum = me.isNumber(propVal);
      if (isNum && propVal <= 0) {
        return;
      }
      result = me._cssUnitRE.exec(propVal);
      numeric = parseInt(result[1]);
      cssUnit = result[2];
      $root.css('height', cssUnit != null ? propVal : propVal + 'px');
      /*
      *   border : solid 1px #a5acb5;
      *   margin-right: 22px;
      *   bolderH = 2
      */

      val = $root.height() - 2;
      $input.height(val);
      /*
      *   设置placeholder的line-height
      */

      $label = $(me._JQSelector.placeholder, me._$root);
      if ($label.size() > 0) {
        return $label.css("line-height", "" + val + "px");
      }
    };

    /**
     *  设置或者移除据聚焦样式或者失焦样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssFocused
    */


    TextBox.prototype._updateCssFocused = function() {
      var $root, enabled, focused, me, ro, rootCls;
      me = this;
      focused = me.focused();
      ro = me.readonly();
      enabled = me.enabled();
      rootCls = me._rootCls;
      $root = me._$root;
      if (focused) {
        $root.addClass(rootCls['focused']);
        if (enabled && !!ro) {
          me._hidePlaceHolder();
        }
      } else {
        $root.removeClass(rootCls['focused']);
        if (enabled) {
          me._showPlaceHolder();
        }
      }
      return void 0;
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _showPlaceHolder
    */


    TextBox.prototype._showPlaceHolder = function() {
      var me, val;
      me = this;
      if (!me._nativePlaceHolder) {
        val = $.trim(me._$formInput.val());
        if (!val) {
          return $(me._JQSelector.placeholder, me._$root).show();
        }
      }
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _hidePlaceHolder
    */


    TextBox.prototype._hidePlaceHolder = function() {
      var me;
      me = this;
      if (!me._nativePlaceHolder) {
        return $(me._JQSelector.placeholder, me._$root).hide();
      }
    };

    /**
     *  更新placeholder的文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssPlaceHolder
    */


    TextBox.prototype._updateCssPlaceHolder = function() {
      var $input, $label, $root, lineHeight, me, placeholder;
      me = this;
      placeholder = me.placeHolder();
      $root = me.uiElement();
      $input = me._$formInput;
      if (me._nativePlaceHolder) {
        return $input.attr('placeholder', placeholder);
      }
      lineHeight = $root.height() - 2;
      $label = $(me._JQSelector.placeholder, $root);
      if ($label.size() > 0) {
        /* udpate placebolder text*/

        $label.text(placeholder).css('line-height', lineHeight);
      } else {
        /* create placeholder*/

        $label = "<label for='' class='eba-placeholder-lable' style='line-height:" + lineHeight + "px;'>" + placeholder + "</label>";
        $input.after($label);
      }
      return void 0;
    };

    /**
     *  更新控件enable的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssEnabled
    */


    TextBox.prototype._updateCssEnabled = function() {
      var $input, $root, me, rootCls;
      me = this;
      rootCls = me._rootCls;
      $root = me._$root;
      $input = me._$formInput;
      if (me.enabled()) {
        $root.removeClass(rootCls['disabled']);
        $input.attr('disabled', null);
      } else {
        $input.attr('disabled', 'disabled');
        $root.removeClass(rootCls['focused']);
        $root.addClass(rootCls['disabled']);
      }
      return void 0;
    };

    /**
     *  更新控件readonly的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssReadonly
    */


    TextBox.prototype._updateCssReadonly = function() {
      var $input, $root, me, prop, ro, rootCls;
      me = this;
      ro = me.readonly();
      rootCls = me._rootCls;
      $root = me._$root;
      $input = me._$formInput;
      prop = 'readonly';
      if (me.enabled() && ro) {
        $root.addClass(rootCls[prop]);
        $input.attr(prop, prop);
        return void 0;
      }
      if (!ro) {
        $root.removeClass(rootCls[prop]);
        $input.attr(prop, null);
      }
      return void 0;
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _init
    */


    TextBox.prototype._init = function(opts) {
      var me, _ref15, _ref16, _ref17, _ref18;
      TextBox.__super__._init.call(this, opts);
      me = this;
      /**
      *   初始化控件自身的一系列属性
      */

      me._width = (_ref15 = opts['width']) != null ? _ref15 : 150;
      me._height = (_ref16 = opts['height']) != null ? _ref16 : 21;
      me._maxLength = (_ref17 = opts['maxLength']) != null ? _ref17 : 0;
      me._iconCls = (_ref18 = opts['iconCls']) != null ? _ref18 : '';
      if (opts['placeHolder']) {
        me._placeHolder = opts['placeHolder'];
      }
      /* by defaults,enterAsTab is true*/

      me._enterAsTab = true;
      /* dom shortcuts*/

      me._$formInput = $(me._JQSelector.input, me._$root);
      me._$formInput.attr('name', me.name());
      /* 设置常量，是否原生支持placeholder*/

      me._nativePlaceHolder = $('html').attr('data-native') === 'placeholder';
      /* 设置控件的placeholder*/

      me._updateCssPlaceHolder();
      return void 0;
    };

    TextBox.prototype._updateAttrMaxLen = function() {
      var max, me;
      me = this;
      max = me.maxLength();
      return me._$formInput.attr('maxlength', max > 0 ? max : null);
    };

    TextBox.prototype._updateAttrValue = function() {
      var me, value;
      me = this;
      value = me.value();
      if (!me.isEmpty(value)) {
        me._$formInput.val(value);
        me._hidePlaceHolder();
      } else {
        me._$formInput.val('');
        me._showPlaceHolder();
      }
      return void 0;
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _render
    */


    TextBox.prototype._render = function() {
      var me;
      TextBox.__super__._render.call(this);
      me = this;
      me._updateAttrMaxLen();
      me._updateAttrValue();
      return me._updateCssIcon();
    };

    /**
     *  更新控件内部前面icon的相关样式属性
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssIcon
    */


    TextBox.prototype._updateCssIcon = function() {
      var $iconLabel, $root, borderCls, borderSelector, icon, iconSelector, me;
      me = this;
      $root = me.uiElement();
      icon = me.iconCls();
      borderCls = 'eba-textbox-icon';
      borderSelector = '[class$="border"]';
      iconSelector = '.eba-textbox-icon i';
      if (icon) {
        $(borderSelector, $root).addClass(borderCls);
        $iconLabel = $(iconSelector, $root);
        if ($iconLabel.size() > 0) {
          /* update icon class*/

          $iconLabel.attr('class', icon);
        } else {
          /* create icon label dom*/

          $("<i class='" + icon + "'></i>").insertBefore(me._$formInput);
        }
      } else {
        /* if icon is null or empty, then remove icon dom*/

        $(iconSelector, $root).remove();
        $(borderSelector, $root).removeClass(borderCls);
      }
      return void 0;
    };

    TextBox.prototype._iconCls = '';

    /**
     *  获取或者设置button的icon图标CSS样式类
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    TextBox
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #  iconCls == 'icon-add'
     *      iconCls = ctrl.iconCls();
     *  @example    <caption>set</caption>
     *      ctrl.iconCls( 'icon-add' );
    */


    TextBox.prototype.iconCls = function(val) {
      var me;
      me = this;
      if ($.trim(val) === '') {
        return me._iconCls;
      }
      me._iconCls = val;
      me._updateCssIcon();
      return void 0;
    };

    TextBox.prototype._maxLength = 0;

    /**
     *  获取或者设置文本域输入文本的最大长度，默认值是-1，不做任何限制
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Number}    maxLength
     *  @default    -1
     *  @example    <caption>get</caption>
     *      #  max == -1
     *      max = ctrl.maxLength();
     *  @example    <caption>set</caption>
     *      ctrl.maxLength( 100 );
    */


    TextBox.prototype.maxLength = function(val) {
      var me, old, text;
      me = this;
      if (!me.isNumber(val)) {
        return me._maxLength;
      }
      old = me._maxLength;
      /* max值小于等于0，表示input可输入的文本长度不做限制；否则，根据适当情况，考虑截断字符串*/

      if (0 < val && val < old) {
        text = me.value();
        me.value(text.substr(0, val));
      }
      me._maxLength = val;
      return me._$formInput.attr('maxlength', val > 0 ? val : null);
    };

    /**
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.TextBox
     *  @member     {Boolean}   focusable
     *  @example    <caption>get</caption>
     *      #  false
     *      console.log( ctrl.focusable() );
    */


    TextBox.prototype.focusable = function() {
      return true;
    };

    TextBox.prototype._placeHolder = '';

    /**
     *  获取或者设置文本占位符
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {String}    placeHolder
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #  holder == ''
     *      holder = ctrl.placeHolder();
     *  @example    <caption>set</caption>
     *      ctrl.placeHolder( 'your text value' );
    */


    TextBox.prototype.placeHolder = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._placeHolder;
      }
      me._placeHolder = val;
      return me._updateCssPlaceHolder();
    };

    /**
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _setValue
     *  @arg        {String}     val    -   
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    */


    TextBox.prototype._setValue = function(val, updateHtml, dispatchEvent, eventArgs) {
      var max, me;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      /* max值小于等于0，表示input可输入的文本长度不做限制；否则，根据适当情况，考虑截断字符串*/

      max = me.maxLength();
      if (max > 0 && (val.length > max)) {
        val = val.substr(0, max);
      }
      /*
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      if (me._value === val) {
        return void 0;
      }
      /* 更新控件值*/

      me._value = val;
      if (updateHtml === true) {
        me._$formInput.val(val);
      }
      if (!val) {
        me._showPlaceHolder();
      } else {
        me._hidePlaceHolder();
      }
      /*
      *   如果允许触发事件，触发change事件
      */

      if (dispatchEvent === true) {
        me.triggerEvent('change', eventArgs);
      }
      if (me.validateOnChange()) {
        me.validate();
      }
      return void 0;
    };

    /**
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( 'your text value' );
    */


    TextBox.prototype.value = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._value;
      }
      return me._setValue(val, true);
    };

    /**
     *  获取或者设置控件数据
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}        data
     *  @example    <caption>get</caption>
     *      #  { text : '' ,value : '' };
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      pair = { text : '' ,value : '' };
     *      ctrl.data( pair );
    */


    TextBox.prototype.data = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._value;
      }
      return me._setValue(val, true);
    };

    return TextBox;

  })(FormField);

  ebaui['web'].registerFormControl('TextBox', TextBox);

  /**
  *   @class      TextArea
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.TextBox
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.TextArea( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).textarea( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="textarea" data-options="{}" /&gt;
  */


  TextArea = (function(_super) {
    __extends(TextArea, _super);

    function TextArea() {
      _ref15 = TextArea.__super__.constructor.apply(this, arguments);
      return _ref15;
    }

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextArea
     *  @method     _init
    */


    TextArea.prototype._init = function(opts) {
      var me;
      TextArea.__super__._init.call(this, opts);
      me = this;
      /* 
      *   初始化控件自身的一系列属性
      *   默认情况下，textarea要支持换行，但是说，不能一换行就自动切换了
      */

      me._enterAsTab = false;
      return void 0;
    };

    return TextArea;

  })(TextBox);

  ebaui['web'].registerFormControl('TextArea', TextArea);

  /**
  *   @class      Password
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.Password( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).password( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="password" data-options="{}" /&gt;
  */


  Password = (function(_super) {
    __extends(Password, _super);

    function Password() {
      _ref16 = Password.__super__.constructor.apply(this, arguments);
      return _ref16;
    }

    Password.prototype._init = function(opts) {
      Password.__super__._init.call(this, opts);
      /* password 的长度不做任何限制*/

      return this._maxLength = 0;
    };

    return Password;

  })(TextBox);

  ebaui['web'].registerFormControl('Password', Password);

  /**
  *   @class      ButtonEdit
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.TextBox
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.ButtonEdit( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).buttonedit( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="buttonedit" data-options="{}" /&gt;
  */


  ButtonEdit = (function(_super) {
    __extends(ButtonEdit, _super);

    function ButtonEdit() {
      _ref17 = ButtonEdit.__super__.constructor.apply(this, arguments);
      return _ref17;
    }

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}    _JQSelector
    */


    ButtonEdit.prototype._JQSelector = {
      'input': '.eba-buttonedit-input',
      'placeholder': '.eba-placeholder-lable',
      'icon': '.eba-label-icon',
      'btnClose': '.eba-buttonedit-close',
      'btnToggle': '.eba-buttonedit-button'
    };

    /**
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Object}    _rootCls
    */


    ButtonEdit.prototype._rootCls = {
      disabled: 'eba-buttonedit-disabled',
      focused: 'eba-buttonedit-focus',
      readonly: 'eba-readonly'
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _updateCssReadonly
    */


    ButtonEdit.prototype._updateCssReadonly = function() {
      var $root, $toggleBtn, me;
      ButtonEdit.__super__._updateCssReadonly.call(this);
      me = this;
      $root = me.uiElement();
      $toggleBtn = me._$btnToggle;
      if (me.readonly()) {
        $toggleBtn.hide();
      } else {
        $toggleBtn.show();
      }
      return me._updateCssCloseButton();
    };

    /**
     *  更新UI的宽度
     *  @private
     *  @instance
     *  @memberof   Control
     *  @method     _updateCssWidth
    */


    ButtonEdit.prototype._updateCssWidth = function() {
      var $root, cssUnit, isNum, me, numeric, propVal, result;
      me = this;
      $root = me.uiElement();
      propVal = me.width();
      isNum = me.isNumber(propVal);
      if (isNum && propVal <= 0) {
        return;
      }
      result = me._cssUnitRE.exec(propVal);
      numeric = parseInt(result[1]);
      cssUnit = result[2];
      return $root.css('width', cssUnit != null ? propVal : propVal + 'px');
      /*
      *   border : solid 1px #a5acb5;
      *   margin-right: 22px;
      *   $( 'span.eba-buttonedit-buttons',$root ).outerWidth() == 18
      *   bolderW = 2
      *   iconW   = 22
      *   btnsW   = 18
      */

    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _setupEvents
    */


    ButtonEdit.prototype._setupEvents = function(opts) {
      var $input, $root, btnCloseSelector, btnToggleSelector, inputSelector, me, phSelector, _JQSelector;
      me = this;
      $root = me._$root;
      $input = me._$formInput;
      _JQSelector = me._JQSelector;
      phSelector = _JQSelector.placeholder;
      inputSelector = _JQSelector.formInput;
      btnToggleSelector = '.eba-buttonedit-button';
      btnCloseSelector = _JQSelector.btnClose;
      me.onEvent('keydown', opts['onkeydown']);
      me.onEvent('keyup', opts['onkeyup']);
      me.onEvent('enter', opts['onenter']);
      me.onEvent('focus', opts['onfocus']);
      me.onEvent('blur', opts['onblur']);
      me.onEvent('change', opts['onchange']);
      me.onEvent('btnclick', opts['onbtnclick']);
      me.onEvent('clsclick', opts['onclsclick']);
      /*  
          when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
          when you click on this label
          remove this label then focus in the input
      */

      $root.on('click', phSelector, function(eventArgs) {
        $(this).hide();
        return me._$formInput.focus();
      });
      $root.on('click', btnToggleSelector, function(eventArgs) {
        if (me.enabled()) {
          return me.triggerEvent('btnclick', eventArgs);
        }
      });
      $root.on('click', btnCloseSelector, function(eventArgs) {
        if (!(me.showClose() && me.enabled())) {
          return eventArgs.preventDefault();
        }
        return me.triggerEvent('clsclick', eventArgs);
      });
      /* 如果不允许手工输入文本，返回false，阻止文字输入*/

      $root.on('keydown', inputSelector, function(eventArgs) {
        var code;
        if (!(me.enabled() && me.allowInput())) {
          return eventArgs.preventDefault();
        }
        code = eventArgs.which;
        switch (code) {
          case keyboard.isEnter(code):
            return me.triggerEvent('enter', eventArgs);
          default:
            return me.triggerEvent('keydown', eventArgs);
        }
      });
      $root.on('keyup', inputSelector, function(eventArgs) {
        /* 
        *   更新控件的值
        */

        var val;
        val = $input.val();
        me.text(val);
        me._setValue(val, true, eventArgs);
        return me.triggerEvent('keyup', eventArgs);
      });
      $root.on('focus', inputSelector, function(eventArgs) {
        me._focused = true;
        me._updateCssFocused();
        return me.triggerEvent('focus', eventArgs);
      });
      $root.on('blur', inputSelector, function(eventArgs) {
        me._focused = false;
        me._updateCssFocused();
        return me.triggerEvent('blur', eventArgs);
      });
      return void 0;
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _init
    */


    ButtonEdit.prototype._init = function(opts) {
      var $root, me, selectors;
      ButtonEdit.__super__._init.call(this, opts);
      me = this;
      $root = me._$root;
      selectors = me._JQSelector;
      me._$btnToggle = $(selectors.btnToggle, $root);
      me._$btnClose = $(selectors.btnClose, $root);
      /* 
      *   从TextBox会继承_iconCls属性，这属性在buttonEdit似乎没什么用
      */

      return me._iconCls = '';
    };

    /**
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _setValue
     *  @arg        {String}     val    -   
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    */


    ButtonEdit.prototype._setValue = function(val, dispatchEvent, eventArgs) {
      var me;
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      /* 要更新的值必须和原来的值是不同的，否则直接返回*/

      if (me._value === val) {
        return;
      }
      /* 
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      if (me._value && me._value === val) {
        return;
      }
      me._value = val;
      if (!val) {
        me._showPlaceHolder();
      } else {
        me._hidePlaceHolder();
      }
      /*
      *   如果允许触发事件，触发change事件
      */

      if (dispatchEvent === true) {
        me.triggerEvent('change', eventArgs);
      }
      if (me.validateOnChange()) {
        me.validate();
      }
      return void 0;
    };

    ButtonEdit.prototype._render = function() {
      var me;
      ButtonEdit.__super__._render.call(this);
      me = this;
      me._updateAttrText();
      return me._updateCssCloseButton();
    };

    ButtonEdit.prototype._showClose = false;

    /**
     *  获取或者设置是否显示关闭按钮
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Boolean}   showClose
     *  @default    false
     *  @example    <caption>get</caption>
     *      // showCloseBtn == true
     *      showCloseBtn = buttonedit.showClose();
     *  @example    <caption>set</caption>
     *      buttonedit.showClose( true );
     *      buttonedit.showClose( false );
    */


    ButtonEdit.prototype.showClose = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._showClose;
      }
      me._showClose = val;
      return me._updateCssCloseButton();
    };

    /**
     *  更新控件enable的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssEnabled
    */


    ButtonEdit.prototype._updateCssEnabled = function() {
      ButtonEdit.__super__._updateCssEnabled.call(this);
      return this._updateCssCloseButton();
    };

    /**
     *  更新UI的input后面的x的icon
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _updateCssCloseButton
    */


    ButtonEdit.prototype._updateCssCloseButton = function() {
      var $closeBtn, $root, enabled, me, ro, rootCls, showCloseBtn;
      me = this;
      $root = me.uiElement();
      showCloseBtn = me.showClose();
      $closeBtn = me._$btnClose;
      rootCls = 'eba-buttonedit-switch';
      ro = me.readonly();
      enabled = me.enabled();
      if (ro || !enabled) {
        $closeBtn.css('display', 'none');
        $root.removeClass(rootCls);
        return;
      }
      if (showCloseBtn) {
        $root.addClass(rootCls);
        return $closeBtn.css('display', 'inline-block');
      } else {
        $closeBtn.css('display', 'none');
        return $root.removeClass(rootCls);
      }
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _updateAttrText
    */


    ButtonEdit.prototype._updateAttrText = function() {
      var me, txt;
      me = this;
      txt = me.text();
      me._$formInput.val(txt);
      if (txt) {
        return me._hidePlaceHolder();
      } else {
        return me._showPlaceHolder();
      }
    };

    ButtonEdit.prototype._text = '';

    /**
     *  获取或者设置buttonedit文本值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {String}    text
     *  @default    ''
     *  @example    <caption>get</caption>
     *      text = buttonedit.text();
     *  @example    <caption>set</caption>
     *      buttonedit.text( 'your text value' );
    */


    ButtonEdit.prototype.text = function(val) {
      var me;
      me = this;
      if (!(me.isString(val) && me._text !== val)) {
        return me._text;
      }
      me._text = val;
      return me._updateAttrText();
    };

    /**
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Object}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( true );
     *      ctrl.value( false );
    */


    ButtonEdit.prototype.value = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._value;
      }
      return me._setValue(val);
    };

    /**
     *  获取或者设置控件数据
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Object}        data
     *  @example    <caption>get</caption>
     *      // { text : '' ,value : '' };
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      pair = { text : '' ,value : '' };
     *      ctrl.data( pair );
    */


    ButtonEdit.prototype.data = function(val) {
      var isValid, me, textField, valueField;
      me = this;
      textField = me.textField();
      valueField = me.valueField();
      isValid = val && (val[textField] != null) && (val[valueField] != null);
      /* get*/

      if (!isValid) {
        return me._data;
      }
      /* set*/

      me._data = val;
      /* 更新text以及value*/

      me.text(val[textField]);
      return me.value(val[valueField]);
    };

    ButtonEdit.prototype._valueField = 'value';

    /**
     *  控件数据源对象字段中，用于作为控件值的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {String}      valueField
     *  @default    'value'
     *  @example    <caption>get</caption>
     *      valueField = ctrl.valueField();
     *  @example    <caption>set</caption>
     *      ctrl.valueField( '' );
    */


    ButtonEdit.prototype.valueField = function(val) {
      var me;
      me = this;
      if (me.isEmpty(val)) {
        return me._valueField;
      }
      if (me.isString(val)) {
        return me._valueField;
      }
      return me._valueField = val;
    };

    ButtonEdit.prototype._textField = 'text';

    /**
     *  控件数据源对象字段中，用于作为控件文本的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {String}      textField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      textField = ctrl.textField();
     *  @example    <caption>set</caption>
     *      ctrl.textField( '' );
    */


    ButtonEdit.prototype.textField = function(val) {
      var me;
      me = this;
      if (me.isEmpty(val)) {
        return me._textField;
      }
      if (me.isString(val)) {
        return me._textField;
      }
      return me._textField = val;
    };

    ButtonEdit.prototype._allowInput = true;

    /**
     *  获取或者设置是否允许手工输入文本
     *  @public
     *  @instance
     *  @tutorial   buttonedit_allowInput
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Boolean}    allowInput
     *  @default    true
     *  @example    <caption>get</caption>
     *      allowed = ctrl.allowInput();
     *  @example    <caption>set</caption>
     *      ctrl.allowInput( false );
    */


    ButtonEdit.prototype.allowInput = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._allowInput;
      }
      return me._allowInput = val;
    };

    return ButtonEdit;

  })(TextBox);

  ebaui['web'].registerFormControl('ButtonEdit', ButtonEdit);

  /**
  *   @class      Captcha
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.TextBox
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.Captcha( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).captcha( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="captcha" data-options="{}" /&gt;
  */


  Captcha = (function(_super) {
    __extends(Captcha, _super);

    function Captcha() {
      _ref18 = Captcha.__super__.constructor.apply(this, arguments);
      return _ref18;
    }

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     _setupEvents
    */


    Captcha.prototype._setupEvents = function(opts) {
      var $root, me;
      Captcha.__super__._setupEvents.call(this, opts);
      me = this;
      $root = me._$root;
      return $root.on('click', '[data-role="btn-reload"]', function(event) {
        return me.refresh();
      });
    };

    /**
     *  数据源格式错误
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @member     {String}    _dataSourceInvalidException
    */


    Captcha.prototype._serverDataInvalidException = 'captcha code server response is invalid!!';

    /**
     *  数据源格式错误
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @member     {String}    _dataSourceInvalidException
    */


    Captcha.prototype._dataSourceInvalidException = 'the dataSource format is invalid, only remote dataSource supported!';

    /**
     *  加载验证码图片以及图片的字符串
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     _loadCaptcha
    */


    Captcha.prototype._loadCaptcha = function() {
      var dataSource, isRemote, me, now, postData, rnd, url;
      me = this;
      dataSource = me.dataSource();
      isRemote = me.isUsingRemoteData(dataSource);
      if (!isRemote) {
        throw me._dataSourceInvalidException;
      }
      url = dataSource.url;
      postData = {};
      if (me.isFunc(dataSource.data)) {
        postData = dataSource.data();
      } else {
        $.extend(postData, dataSource.data);
      }
      now = (new Date).getTime();
      rnd = parseInt(Math.random() * 1000);
      postData['t'] = '{0}_{1}'.replace('{0}', now).replace('{1}', rnd);
      url += '?' + $.param(postData);
      return me._$codeImg.attr('src', url);
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     _initControl
    */


    Captcha.prototype._init = function(opts) {
      var config, me, _ref19, _ref20, _ref21, _ref22, _ref23, _ref24;
      Captcha.__super__._init.call(this, opts);
      /* 初始化控件自身的一系列属性*/

      me = this;
      config = 'validationUrl';
      me._width = (_ref19 = opts['width']) != null ? _ref19 : 250;
      me._height = (_ref20 = opts['height']) != null ? _ref20 : 21;
      me._validateOnServer = (_ref21 = opts['validateOnServer']) != null ? _ref21 : true;
      /* 
      *   init validation url, by defualts, it is the same with dataSource
      */

      me._validationUrl = (_ref22 = opts[config]) != null ? _ref22 : '';
      me._queryKey = (_ref23 = opts['queryKey']) != null ? _ref23 : 'verify';
      me._dataSource = (_ref24 = opts['dataSource']) != null ? _ref24 : '';
      /* 
      *   dom
      */

      me._$codeImg = $('.eba-code-img', me._$root);
      me._$btnReload = me._$codeImg.parent();
      /*
       *  if validateOnServer and you did not config remote validation rule 
       *  then add remote validation rule automatically
      */

      me._configRemoteValidator(me._validateOnServer);
      /* load captcha code image from remote server*/

      return me._loadCaptcha();
    };

    /**
     *  刷新验证码
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     refresh
     *  @example
     *      ctrl.refresh();
    */


    Captcha.prototype.refresh = function() {
      return this._loadCaptcha();
    };

    Captcha.prototype._dataSource = '';

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
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : {}
     *      } );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : function(){ 
     *              # your logic
     *              return {};
     *          }
     *      } );
    */


    Captcha.prototype.dataSource = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._dataSource;
      }
      return me._dataSource = val;
    };

    /**
     *  初始化服务端验证
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     _configRemoteValidator
    */


    Captcha.prototype._configRemoteValidator = function(validateOnServer) {
      var captchaPass, me, validatorConfig;
      me = this;
      /*
      *   init remote validator
      */

      if (validateOnServer && !me.hasValidator('remote')) {
        captchaPass = function(value, serverData) {
          if (!serverData) {
            return false;
          }
          if (serverData['result'] == null) {
            return false;
          }
          return parseInt(serverData['result']) === 1;
        };
        validatorConfig = {
          url: me.validationUrl(),
          token: me.queryKey(),
          pass: captchaPass
        };
        me._validators.push(new RemoteValidator(validatorConfig));
        return void 0;
      }
      if (!validateOnServer) {
        return me.removeValidator('remote');
      }
    };

    Captcha.prototype._validateOnServer = true;

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


    Captcha.prototype.validateOnServer = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._validateOnServer;
      }
      me._validateOnServer = val;
      return me._configRemoteValidator(val);
    };

    Captcha.prototype._validationUrl = '';

    /**
     *  验证码的服务端验证地址，默认和dataSource里面配置的url一样
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @member     {String}                validationUrl
     *  @example    <caption>get</caption>
     *      var src = ctrl.validationUrl();
     *  @example    <caption>set</caption>
     *      ctrl.validationUrl( 'http:#' );
    */


    Captcha.prototype.validationUrl = function(val) {
      var me, re;
      me = this;
      re = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
      if (!re.test(val)) {
        return me._validationUrl;
      }
      return me._validationUrl = val;
    };

    Captcha.prototype._queryKey = 'verify';

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


    Captcha.prototype.queryKey = function(val) {
      var me;
      me = this;
      if (!!me.isEmpty(val)) {
        return me._queryKey;
      }
      return me._queryKey = val;
    };

    return Captcha;

  })(TextBox);

  ebaui.web.registerFormControl('Captcha', Captcha);

  /**
  *   @class      Combo
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.ButtonEdit
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  */


  Combo = (function(_super) {
    __extends(Combo, _super);

    function Combo() {
      _ref19 = Combo.__super__.constructor.apply(this, arguments);
      return _ref19;
    }

    /**
     *  下拉菜单的弹出框
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @member     _panel
    */


    Combo.prototype._panel = null;

    /**
     *  下拉菜单包含的控件对象，Combobox中就是一个ListBox
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @member     _panelContent
    */


    Combo.prototype._panelContent = null;

    /**
     *  获取或者设置文本占位符
    */


    Combo.prototype._placeHolder = '';

    /**
     *  更新valueField textField等配置，同时要同步到_panelContent控件里
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _doFieldAccess
     *  @arg        {String}
    */


    Combo.prototype._doFieldAccess = function(field, val, sync) {
      var me, panelContent, prop;
      if (sync == null) {
        sync = true;
      }
      me = this;
      prop = '_' + field;
      panelContent = me._panelContent;
      if (!me.isString(val)) {
        return me[prop];
      }
      me[prop] = val;
      if (sync && panelContent[field]) {
        return panelContent[field](val);
      }
    };

    Combo.prototype._idField = 'id';

    /**
     *  控件数据源对象的ID字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {String}      idField
     *  @default    'id'
     *  @example    <caption>get</caption>
     *      idField = ctrl.idField();
     *  @example    <caption>set</caption>
     *      ctrl.idField( '' );
    */


    Combo.prototype.idField = function(val) {
      return this._doFieldAccess('idField', val);
    };

    Combo.prototype._textField = 'text';

    /**
     *  控件数据源对象字段中，用于作为控件文本的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {String}      textField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      textField = ctrl.textField();
     *  @example    <caption>set</caption>
     *      ctrl.textField( '' );
    */


    Combo.prototype.textField = function(val) {
      return this._doFieldAccess('textField', val);
    };

    Combo.prototype._valueField = 'value';

    /**
     *  控件数据源对象字段中，用于作为控件值的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {String}      valueField
     *  @default    'value'
     *  @example    <caption>get</caption>
     *      valueField = ctrl.valueField();
     *  @example    <caption>set</caption>
     *      ctrl.valueField( '' );
    */


    Combo.prototype.valueField = function(val) {
      return this._doFieldAccess('valueField', val);
    };

    /**
     *  数据加载开始前的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _beforeLoading
    */


    Combo.prototype._beforeLoading = function() {};

    /**
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _finishLoading
    */


    Combo.prototype._finishLoading = function() {};

    /**
     *  加载数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _loadData
    */


    Combo.prototype._loadData = function() {};

    /**
     *  构建下来菜单容器
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @method     _initPanel
    */


    Combo.prototype._initPanel = function() {
      var $popup, me;
      me = this;
      $popup = $('<div data-options="{ visible:false,position: \'absolute\' }" style="display:none;"><input /></div>').appendTo(document.body);
      /*
      *   18是表单控件外围status的icon宽度
      */

      return me._panel = new ebaui.web.Panel($popup, {
        id: 'panel-' + me.id(),
        width: 0,
        height: 0
      });
    };

    /**
     *  调整下拉菜单的位置
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @method     _reposition
    */


    Combo.prototype._reposition = function() {
      var $popup, $root, me, panel, popupHeight, rootPos, scrollTop, top;
      me = this;
      panel = me._panel;
      if (!panel.visible()) {
        return;
      }
      $root = me.uiElement();
      $popup = panel.uiElement();
      rootPos = $root.offset();
      popupHeight = $popup.outerHeight();
      scrollTop = $(document).scrollTop();
      top = rootPos.top + $root.outerHeight();
      if (top + popupHeight > $(window).height() + scrollTop) {
        top = rootPos.top - popupHeight;
      }
      panel.move({
        'top': top,
        'left': rootPos.left
      });
      $popup.css('width', me.width() - 24);
      return void 0;
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @method     _setupEvents
    */


    Combo.prototype._setupEvents = function(opts) {
      var $panelRoot, $root, input, me, panel, placeholder;
      me = this;
      panel = me._panel;
      input = '.eba-buttonedit-input';
      placeholder = '.eba-placeholder-lable';
      $root = me.uiElement();
      $panelRoot = panel.uiElement();
      me.onEvent('focus', opts['onfocus']);
      me.onEvent('blur', opts['onblur']);
      $panelRoot.on('click', function(event) {
        return event.stopPropagation();
      });
      /*
       *  downArrow button click
      */

      $root.on('click', '.eba-buttonedit-button', function(event) {
        event.stopPropagation();
        if (me.enabled() && !me.readonly()) {
          panel.toggle();
          return me._reposition();
        }
      });
      /*
       *  focus && blur
      */

      $root.on('focus', input, function(eventArgs) {
        me._focused = true;
        me._updateCssFocused();
        return me.triggerEvent('focus', eventArgs);
      });
      $root.on('blur', input, function(eventArgs) {
        me._focused = false;
        me._updateCssFocused();
        return me.triggerEvent('blur', eventArgs);
      });
      /*  
          when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
          when you click on this label
          remove this label then focus in the input
      */

      $root.on('click', placeholder, function(eventArgs) {
        var $input;
        $(this).hide();
        $input = me._$formInput;
        if ($input) {
          return $input.focus();
        }
      });
      /*
       *  在document上注册一个click事件，当触发这个事件的时候，会自动收起下拉菜单
      */

      $(document).on('click', function(event) {
        return panel.close();
      });
      /*
       *  windows的窗口位置改变的时候，下拉菜单的位置应该跟着移动
      */

      return $(window).resize(function() {
        return me._reposition();
      });
    };

    return Combo;

  })(ButtonEdit);

  /**
  *   @class      ListBox
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormField
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.ListBox( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).listbox( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="listbox" data-options="{}" /&gt;
  */


  ListBox = (function(_super) {
    __extends(ListBox, _super);

    function ListBox() {
      _ref20 = ListBox.__super__.constructor.apply(this, arguments);
      return _ref20;
    }

    /**
     *  listbox列表项目的模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {String}    _itemTmpl
    */


    ListBox.prototype._itemTmpl = '';

    /**
     *  已经编译好的ListBox项HTML模板，后续会重复使用
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     _compiledItemTmpl
    */


    ListBox.prototype._compiledItemTmpl = $.noop;

    /**
     *  显示listbox正在加载的样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     _loadMask
     *  @param      {Boolean}    loading
    */


    ListBox.prototype._loadMask = function() {
      var $root, html, me;
      me = this;
      $root = me._$root;
      html = me._compiledItemTmpl({
        'loading': true
      });
      return $('table.eba-listbox-items', $root).html(html);
    };

    /**
     *  更新listbox列表项
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     _renderData
     *  @param      {Boolean}    loading
    */


    ListBox.prototype._renderData = function() {
      var $root, html, me;
      me = this;
      $root = me._$root;
      html = me._compiledItemTmpl({
        'loading': false,
        'multi': me.multiSelect(),
        'textField': me.textField(),
        'valueField': me.valueField(),
        'selectedItems': me.selectedItems(),
        'dataItems': me.items()
      });
      return $('table.eba-listbox-items', $root).html(html);
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     _render
    */


    ListBox.prototype._render = function() {
      var me;
      me = this;
      me._loadData();
      return ListBox.__super__._render.call(this);
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     _setupEvents
    */


    ListBox.prototype._setupEvents = function(opts) {
      var $root, me;
      me = this;
      $root = me._$root;
      /**
      * 绑定事件处理程序
      */

      me.onEvent('itemclick', opts['onitemclick']);
      me.onEvent('loadfail', opts['onloadfail']);
      me.onEvent('load', opts['onload']);
      me.onEvent('loadcomplete', opts['onloadcomplete']);
      return $root.on('click', 'tr.eba-listbox-item', function(eventArgs) {
        var $target, itemIdx;
        $target = $(this);
        itemIdx = parseInt($target.attr('data-index'));
        /* 
        * ctrl + click then remove item
        */

        if (eventArgs.ctrlKey) {
          me.deselect(itemIdx);
        } else {
          me.select(itemIdx);
        }
        return me.triggerEvent('itemclick', eventArgs);
      });
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     _init
    */


    ListBox.prototype._init = function(opts) {
      var me, _ref21, _ref22, _ref23;
      me = this;
      /* 
      *   初始化控件自身的一系列属性
      */

      me._width = (_ref21 = opts['width']) != null ? _ref21 : 150;
      me._height = (_ref22 = opts['height']) != null ? _ref22 : 0;
      me._dataSource = (_ref23 = opts['dataSource']) != null ? _ref23 : [];
      if (opts['idField'] != null) {
        me._idField = opts['idField'];
      }
      if (opts['textField'] != null) {
        me._textField = opts['textField'];
      }
      if (opts['valueField'] != null) {
        me._valueField = opts['valueField'];
      }
      /* 
      *   预编译模板
      */

      return me._compiledItemTmpl = me.compileTmpl(me._itemTmpl);
    };

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


    ListBox.prototype.focusable = function() {
      return true;
    };

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
     *      text = buttonedit.text();
    */


    ListBox.prototype.text = function() {
      var data, field, item, me, toRet;
      me = this;
      toRet = [];
      field = me.textField();
      data = me.data();
      toRet = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          _results.push(item[field]);
        }
        return _results;
      })();
      return toRet;
    };

    /**
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {Object|Array}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( [] );
    */


    ListBox.prototype.value = function(val) {
      var field, items, me, obj, objArray, value, _i, _j, _len, _len1;
      me = this;
      /**
      * get
      */

      if (!val) {
        return me._value;
      }
      /*
      unless val
        field = me.valueField()
        data  = me.data()
        toRet = (item[field] for item in data)
        return toRet
      */

      /**
      * set
      */

      items = me.items();
      field = me.valueField();
      if (!me.isArray(val)) {
        val = [val];
      }
      objArray = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        obj = items[_i];
        for (_j = 0, _len1 = val.length; _j < _len1; _j++) {
          value = val[_j];
          if (value === obj[field]) {
            objArray.push(obj);
          }
        }
      }
      return me.select(objArray);
      /**
      val          = [ val ] unless me.isArray( val )
      selectedVal  = null
      selectedData = null
      field        = me.valueField()
      items        = me.items()
      multiSelect  = me.multiSelect()
      
      if not multiSelect
        for item,i in items
          if item[field] == val[0]
            selectedVal  = items[i]
            selectedData = item
            break
      
      else
        selectedVal  = []
        selectedData = []
        for item in items
          for value in val
            if value == item[field]
              selectedVal.push( value )
              selectedData.push( item )
      
      me._value = selectedVal
      me._data  = selectedData
      
      me.select( selectedData )
      */

    };

    /**
     *  获取或者设置选中的项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {Array}        data
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( [] );
    */


    ListBox.prototype.data = function(val) {
      var me;
      me = this;
      /**
      * get
      */

      if (!val) {
        return me.selectedItems();
      }
      /**
      * set
      */

      return me.select(val);
      /*
      val = [val] unless me.isArray( val )
      me.deselectAll() if val.length is 0
      
      selectedVal  = null
      selectedData = null
      items = me.items()
      field = me.valueField()
      
      if not me.multiSelect()
        for item,i in items
          itemValue = val[0][field]
          if item[field] == itemValue
            selectedVal  = itemValue
            selectedData = items[i]
            break
      else
        selectedVal  = []
        selectedData = []
        for item in items
          for value in val
            if value[field] == item[field]
              selectedVal.push( value[field] )
              selectedData.push( item )
      
      me._value = selectedVal
      me._data  = selectedData
      
      me.select( selectedData )
      */

    };

    /**
     *  listBox项的集合
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {Array}  _items
    */


    ListBox.prototype._items = [];

    /**
     *  数据加载开始前的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _beforeLoading
    */


    ListBox.prototype._beforeLoading = function() {
      return this._loadMask();
    };

    /**
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _finishLoading
    */


    ListBox.prototype._finishLoading = function() {
      var me;
      me = this;
      /* 重置控件的状态*/

      me._currItemIdx = -1;
      me._selectedItems = [];
      /* 渲染数据*/

      return me._renderData();
    };

    /**
     *  加载listbox的列表数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     _loadData
     *  @param      {Function}  beforeLoad
     *  @param      {Function}  afterLoad
    */


    ListBox.prototype._loadData = function(beforeFn, afterFn) {
      var dataSource, me, remoteDate, toServer;
      me = this;
      dataSource = me.dataSource();
      remoteDate = me.isUsingRemoteData(dataSource);
      if (remoteDate) {
        me._items = [];
        me._selectedItems = [];
        toServer = {};
        if (me.isFunc(dataSource.data)) {
          toServer = dataSource.data();
        } else {
          $.extend(toServer, dataSource.data);
        }
        me._beforeLoading();
        return $.ajax({
          url: dataSource.url,
          data: toServer,
          dataType: 'json',
          error: function(eventArgs) {
            return me.triggerEvent('loadfail', eventArgs);
          },
          success: function(serverData) {
            me._items = serverData;
            me._finishLoading();
            return me.triggerEvent('load', serverData);
          },
          complete: function(eventArgs) {
            return me.triggerEvent('loadcomplete', eventArgs);
          }
        });
      } else {
        me._beforeLoading();
        me._items = dataSource;
        return me._finishLoading();
      }
    };

    /**
     *  listBox项的集合
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.ListBox
     *  @member     {Array}  items
    */


    ListBox.prototype.items = function() {
      return this._items;
    };

    /**
     *  选中的项
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {Array}  _selectedItems
    */


    ListBox.prototype._selectedItems = [];

    /**
     *  获取选中的项
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.ListBox
     *  @member     {Array}  selectedItems
     *  @example    <caption>get</caption>
     *      //  [{ text : '' ,value : '' }];
     *      items = ctrl.selectedItems();
     *  @example    <caption>set</caption>
     *      ctrl.selectedItems( [] );
    */


    ListBox.prototype.selectedItems = function() {
      return this._selectedItems;
    };

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


    ListBox.prototype.add = function(toAdd) {
      var me;
      if (toAdd == null) {
        return;
      }
      me = this;
      if (!me.isArray(toAdd)) {
        toAdd = [toAdd];
      }
      if (toAdd.length > 0) {
        me._items = me._items.concat(toAdd);
        return me._renderData();
      }
    };

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


    ListBox.prototype.remove = function(toRm) {
      var dataItem, i, item, j, me, valueField, _i, _j, _len, _len1, _ref21;
      if (toRm == null) {
        return;
      }
      me = this;
      if (!me.isArray(toRm)) {
        toRm = [toRm];
      }
      if (toRm.length > 0) {
        valueField = me.valueField();
        for (i = _i = 0, _len = toRm.length; _i < _len; i = ++_i) {
          item = toRm[i];
          _ref21 = me._items;
          for (j = _j = 0, _len1 = _ref21.length; _j < _len1; j = ++_j) {
            dataItem = _ref21[j];
            if (dataItem[valueField] === item[valueField]) {
              me._items.splice(j, 1);
              break;
            }
          }
        }
        return me._renderData();
      }
    };

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


    ListBox.prototype.update = function(toUp) {
      var dataItem, i, item, j, me, valueField, _i, _j, _len, _len1, _ref21;
      if (toUp == null) {
        return;
      }
      me = this;
      if (!me.isArray(toUp)) {
        toUp = [toUp];
      }
      if (toUp.length > 0) {
        valueField = me.valueField();
        for (i = _i = 0, _len = toUp.length; _i < _len; i = ++_i) {
          item = toUp[i];
          _ref21 = me._items;
          for (j = _j = 0, _len1 = _ref21.length; _j < _len1; j = ++_j) {
            dataItem = _ref21[j];
            if (dataItem[valueField] === item[valueField]) {
              me._items[j] = item;
              break;
            }
          }
        }
        return me._renderData();
      }
    };

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


    ListBox.prototype.move = function(source, dist) {
      var items, me, temp;
      me = this;
      if (!(me.isNumber(source) && me.isNumber(dist))) {
        return;
      }
      items = me._items;
      temp = items[source];
      items[source] = items[dist];
      items[dist] = temp;
      return me._renderData();
    };

    /**
     *  当前选中项目的index
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     _currItemIdx
    */


    ListBox.prototype._currItemIdx = -1;

    /**
     *  选中前一个项目
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     select
     *  @example    
     *      ctrl.selectPrev();
    */


    ListBox.prototype.selectPrev = function() {
      var currIdx, dataItems, me;
      me = this;
      currIdx = me._currItemIdx;
      dataItems = me.items();
      if (!(dataItems && dataItems.length > 0)) {
        return;
      }
      if (currIdx - 1 < 0) {
        return;
      }
      --currIdx;
      me._currItemIdx = currIdx;
      me.select(currIdx);
      return me.highlight(currIdx);
    };

    /**
     *  选中前一个项目
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     select
     *  @example    
     *      ctrl.selectNext();
    */


    ListBox.prototype.selectNext = function() {
      var currIdx, dataItems, me;
      me = this;
      currIdx = me._currItemIdx;
      dataItems = me.items();
      if (!(dataItems && dataItems.length > 0)) {
        return;
      }
      if (currIdx + 1 >= dataItems.length) {
        return;
      }
      ++currIdx;
      me._currItemIdx = currIdx;
      me.select(currIdx);
      return me.highlight(currIdx);
    };

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


    ListBox.prototype.select = function(items) {
      /**
      * 实际上data属性，返回的也是_selectedItems
      * 所以不要重复已经有的方法
      * data以及value属性的变更，我想应该是可以整合到select方法来实现的
      */

      var alreadySelected, dataItems, i, isNum, item, j, me, selectedData, selectedVal, source, valueField, _i, _j, _len, _len1;
      me = this;
      if (items == null) {
        return;
      }
      isNum = me.isNumber(items);
      dataItems = me.items();
      if (isNum && !(items >= 0 && items < dataItems.length)) {
        return;
      }
      /**
      *  如果参数是一个index选项，
      *  并且这个index在合理的范围内
      */

      if (isNum) {
        items = [dataItems[items]];
      }
      if (!me.isArray(items)) {
        items = [items];
      }
      if (!items.length) {
        return;
      }
      selectedVal = me._value;
      selectedData = me._selectedItems;
      valueField = me.valueField();
      if (me.multiSelect()) {
        for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
          source = items[i];
          alreadySelected = false;
          for (j = _j = 0, _len1 = selectedData.length; _j < _len1; j = ++_j) {
            item = selectedData[j];
            if (item[valueField] === source[valueField]) {
              alreadySelected = true;
              break;
            }
          }
          if (!alreadySelected) {
            selectedVal.push(item[valueField]);
            selectedData.push(source);
          }
        }
      } else {
        selectedVal = items[0][valueField];
        selectedData = items[0];
      }
      me._value = selectedVal;
      me._selectedItems = selectedData;
      return me._renderData();
    };

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


    ListBox.prototype.deselect = function(items) {
      var dataItems, i, isNum, j, me, selected, selectedItems, toRm, valueField, _i, _j, _len, _len1;
      me = this;
      if (items == null) {
        return;
      }
      isNum = me.isNumber(items);
      dataItems = me.items();
      if (isNum && !(items >= 0 && items < dataItems.length)) {
        return;
      }
      /*
      *  如果参数是一个index选项，
      *  并且这个index在合理的范围内
      */

      if (isNum) {
        items = [dataItems[items]];
      }
      if (!me.isArray(items)) {
        items = [items];
      }
      if (!items.length) {
        return;
      }
      selectedItems = me._selectedItems;
      if (items.length <= 0 || selectedItems.length <= 0) {
        return;
      }
      valueField = me.valueField();
      for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
        toRm = items[i];
        for (j = _j = 0, _len1 = selectedItems.length; _j < _len1; j = ++_j) {
          selected = selectedItems[j];
          if (selected[valueField] === toRm[valueField]) {
            selectedItems.splice(j, 1);
            break;
          }
        }
      }
      me._currItemIdx = -1;
      return me._renderData();
    };

    /**
     *  取消所有选中项目
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @method     deselectAll
    */


    ListBox.prototype.deselectAll = function() {
      var me;
      me = this;
      me._currItemIdx = -1;
      me._selectedItems = [];
      return me._renderData();
    };

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


    ListBox.prototype.highlight = function(target) {
      var $root, field, hoverCls, i, item, itemIndex, jq, me, _i, _len, _ref21;
      me = this;
      if (target == null) {
        return;
      }
      itemIndex = -1;
      if (me.isNumber(target)) {
        if (target >= me._items.length) {
          return;
        }
        itemIndex = target;
      } else {
        field = me.valueField();
        _ref21 = me._items;
        for (i = _i = 0, _len = _ref21.length; _i < _len; i = ++_i) {
          item = _ref21[i];
          item = me._items[i];
          if (target[field] && item[field] === target[field]) {
            itemIndex = i;
            break;
          }
        }
      }
      $root = me._$root;
      hoverCls = 'eba-listbox-item-hover';
      $('.eba-listbox-item-hover', $root).removeClass(hoverCls);
      if (itemIndex > -1) {
        jq = ".eba-listbox-item:eq(" + itemIndex + ")";
        return $(jq, $root).addClass(hoverCls);
      }
    };

    /**
     *  控件数据源对象的ID字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {String}      idField
     *  @default    'id'
     *  @example    <caption>get</caption>
     *      idField = ctrl.idField();
     *  @example    <caption>set</caption>
     *      ctrl.idField( '' );
    */


    ListBox.prototype._idField = 'id';

    ListBox.prototype.idField = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._idField;
      }
      return me._idField = val;
    };

    /**
     *  控件数据源对象字段中，用于作为控件值的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {String}      valueField
     *  @default    'value'
     *  @example    <caption>get</caption>
     *      valueField = ctrl.valueField();
     *  @example    <caption>set</caption>
     *      ctrl.valueField( '' );
    */


    ListBox.prototype._valueField = 'value';

    ListBox.prototype.valueField = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._valueField;
      }
      me._valueField = val;
      return me._renderData();
    };

    /**
     *  控件数据源对象字段中，用于作为控件文本的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {String}      textField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      textField = ctrl.textField();
     *  @example    <caption>set</caption>
     *      ctrl.textField( '' );
    */


    ListBox.prototype._textField = 'text';

    ListBox.prototype.textField = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._textField;
      }
      me._textField = val;
      return me._renderData();
    };

    /**
     *  数据源，可以是URL地址或者是一个javascript数组对象作为数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {String|Array}      dataSource
     *  @default    []
     *  @example    <caption>get</caption>
     *      src = ctrl.dataSource();
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


    ListBox.prototype._dataSource = {};

    ListBox.prototype.dataSource = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._dataSource;
      }
      me._dataSource = val;
      return me._loadData();
    };

    ListBox.prototype._multiSelect = false;

    /**
     *  获取或者设置控件是否支持多选
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ListBox
     *  @member     {Boolean}    multiSelect
    */


    ListBox.prototype.multiSelect = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._multiSelect;
      }
      return me._multiSelect = val;
    };

    return ListBox;

  })(FormField);

  ebaui['web'].registerFormControl('ListBox', ListBox);

  /**
  *   @private
  *   @class      MiniGrid
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  */


  MiniGrid = (function(_super) {
    __extends(MiniGrid, _super);

    function MiniGrid() {
      _ref21 = MiniGrid.__super__.constructor.apply(this, arguments);
      return _ref21;
    }

    /**
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @member     {String}    _headerTmpl
    */


    MiniGrid.prototype._headerTmpl = '';

    /**
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @member     {String}    _itemTmpl
    */


    MiniGrid.prototype._itemTmpl = '';

    /**
     *  已经编译好的ListBox项HTML模板，后续会重复使用
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _compiledHeaderTmpl
    */


    MiniGrid.prototype._compiledHeaderTmpl = $.noop;

    /**
     *  已经编译好的ListBox项HTML模板，后续会重复使用
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _compiledItemTmpl
    */


    MiniGrid.prototype._compiledItemTmpl = $.noop;

    /**
     *  更新UI的宽度和高度
     *  @private
     *  @instance
     *  @memberof   Control
     *  @method     _doUpdateCssSize
     *  @arg        {String}    cssProp
    */


    MiniGrid.prototype._doUpdateCssSize = function(cssProp) {
      var $root, $view, isNum, me, propVal, result;
      me = this;
      propVal = me[cssProp]();
      isNum = me.isNumber(propVal);
      $root = me._$root;
      $view = $('.eba-listbox-view', $root);
      if (isNum && propVal <= 0) {
        return void 0;
      }
      /*
      *   if width is string and width.length > 0
      */

      if (propVal) {
        result = me._cssUnitRE.exec(propVal);
        $view.css(cssProp, result[1] != null ? propVal : propVal + 'px');
      }
      return void 0;
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _setupEvents
    */


    MiniGrid.prototype._setupEvents = function(opts) {
      var $root, me;
      me = this;
      $root = me._$root;
      me.onEvent('selectrow', opts['onSelectRow']);
      me.onEvent('selectall', opts['onSelectAll']);
      me.onEvent('load', opts['loadComplete']);
      $root.on('change', ':checkbox', function(event) {
        var $grandParent, $this, checked, selectedCls, value;
        $this = $(this);
        value = $this.val();
        checked = $this.is(':checked');
        selectedCls = 'eba-listbox-item-selected';
        if (value === 'selectall') {
          if (checked) {
            $(':checkbox[value!="selectall"]', $root).prop('checked', true);
            $('.eba-listbox-view tr[data-index!=""]', $root).addClass(selectedCls);
            me.triggerEvent('selectall', event);
          } else {
            me.resetSelection();
            $(".eba-listbox-view ." + selectedCls, $root).removeClass(selectedCls);
            me.triggerEvent('selectall', event);
          }
        } else {
          $grandParent = $this.parent().parent();
          if (checked) {
            $grandParent.addClass(selectedCls);
            me.triggerEvent('selectrow', event);
          } else {
            $grandParent.removeClass(selectedCls);
            me.triggerEvent('selectrow', event);
          }
        }
        return void 0;
      });
      return void 0;
    };

    /**
     *  判断是否使用本地数据源还是使用remote数据源
     *  ，因为我直接整合jqgrid的配置，并没有做过多的修改
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _isRemoteDataSource
    */


    MiniGrid.prototype._isRemoteDataSource = function() {
      var dataSource, me, url;
      me = this;
      dataSource = me._data;
      url = me._url;
      /*
      *  优先加载远程数据，然后才是本地数据
      */

      if (url) {
        return true;
      }
      if (dataSource && me.isArray(dataSource)) {
        return false;
      }
      me._data = [];
      return false;
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _init
    */


    MiniGrid.prototype._init = function(opts) {
      var me, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29;
      MiniGrid.__super__._init.call(this, opts);
      me = this;
      /*
      *   初始化控件自身的一系列属性
      */

      me._width = (_ref22 = opts['width']) != null ? _ref22 : 400;
      me._height = (_ref23 = opts['height']) != null ? _ref23 : 120;
      me._url = (_ref24 = opts['url']) != null ? _ref24 : '';
      me._data = (_ref25 = opts['data']) != null ? _ref25 : [];
      me._datatype = (_ref26 = opts['datatype']) != null ? _ref26 : 'local';
      me._colModel = (_ref27 = opts['colModel']) != null ? _ref27 : [
        {
          name: 'id',
          label: 'ID',
          width: 150
        }, {
          name: 'text',
          label: 'Text',
          width: 150
        }
      ];
      me._autowidth = (_ref28 = opts['autowidth']) != null ? _ref28 : true;
      me._multiselect = (_ref29 = opts['multiselect']) != null ? _ref29 : true;
      /*
      *   预编译html模板
      */

      me._compiledHeaderTmpl = me.compileTmpl(me._headerTmpl);
      return me._compiledItemTmpl = me.compileTmpl(me._itemTmpl);
    };

    /**
    *   _autowidth
    */


    MiniGrid.prototype._autowidth = true;

    /**
    *   local data array
    */


    MiniGrid.prototype._data = [];

    /**
    *   remote data source
    */


    MiniGrid.prototype._url = '';

    /**
    *  xml 
    *  xmlstring 
    *  json 
    *  jsonstring 
    *  local 
    *  javascript 
    *  function 
    *  clientSide
    */


    MiniGrid.prototype._datatype = 'local';

    /**
    *   使用远程数据的时候，随着url一起提交到服务器的数据
    *   [{}]
    */


    MiniGrid.prototype._postData = [];

    /**
    *   控件数据源对象的ID字段名
    */


    MiniGrid.prototype._colModel = [
      {
        name: 'id',
        label: 'ID',
        width: 150
      }, {
        name: 'text',
        label: 'Text',
        width: 150
      }
    ];

    /**
    *   是否允许多选
    */


    MiniGrid.prototype._multiselect = true;

    /**
     *  加载控件数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _loadData
    */


    MiniGrid.prototype._loadData = function() {
      var dataItem, dataSource, loadFromRemote, me, parameters, postData, _i, _len;
      me = this;
      loadFromRemote = me._isRemoteDataSource();
      if (loadFromRemote) {
        dataSource = me._url;
        postData = me._postData;
        parameters = {};
        if (postData) {
          for (_i = 0, _len = postData.length; _i < _len; _i++) {
            dataItem = postData[_i];
            $.extend(parameters, dataItem);
          }
        }
        $.getJSON(dataSource, parameters, function(serverData) {
          me._items = serverData;
          me._finishLoading();
          return me.triggerEvent('load');
        });
      } else {
        me._items = me._data;
        me._finishLoading();
        me.triggerEvent('load');
      }
      return void 0;
    };

    MiniGrid.prototype._finishLoading = function() {
      var $root, colModel, headerHtml, itemsHtml, me;
      me = this;
      $root = me._$root;
      colModel = me._colModel;
      headerHtml = me._compiledHeaderTmpl({
        'headers': colModel
      });
      itemsHtml = me._compiledItemTmpl({
        'headers': colModel,
        'rows': me.items(),
        'autowidth': me._autowidth
      });
      if (me._autowidth) {
        $('.eba-listbox-headerInner', $root).html(headerHtml);
        return $('.eba-listbox-items', $root).html(itemsHtml);
      } else {
        return $('.eba-listbox-items', $root).html(headerHtml + itemsHtml);
      }
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _render
    */


    MiniGrid.prototype._render = function() {
      var me;
      me = this;
      me._loadData();
      me._updateCssWidth();
      return me._updateCssHeight();
    };

    MiniGrid.prototype._items = [];

    /**
     *  当前MiniGrid的数据源
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @member     items
    */


    MiniGrid.prototype.items = function() {
      return this._items;
    };

    /**
     *  当前MiniGrid的已经选中的项目
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @member     selectedItems
    */


    MiniGrid.prototype.selectedItems = function() {
      var $root, i, idx, index, items, me, selected, _i, _len;
      me = this;
      if (!(me._items.length > 0)) {
        return [];
      }
      idx = [];
      $root = me._$root;
      $(':checked', $root).each(function(index, el) {
        var $this, value;
        $this = $(el);
        value = $this.val();
        if (el.checked && value !== "selectall") {
          return idx.push(parseInt(value));
        }
      });
      items = me._items;
      selected = [];
      for (i = _i = 0, _len = idx.length; _i < _len; i = ++_i) {
        index = idx[i];
        selected.push(items[index]);
      }
      return selected;
    };

    /**
     *  清空选中的项。如果有指定的数据行，则清空指定数据行的选中状态；
     *  否则，清空所有选中的数据行。
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     resetSelection
     *  @param      {String}        rowId
    */


    MiniGrid.prototype.resetSelection = function(rowId) {
      var $checkboxes, $checked, $root, allChecked, checkedItemCount, me, resetAll;
      me = this;
      $root = me._$root;
      $checked = $(':checked', $root);
      $checkboxes = $(':checkbox', $root);
      checkedItemCount = $checked.size();
      allChecked = checkedItemCount === me._items.length;
      resetAll = !me.isNumber(rowId);
      if (!(checkedItemCount > 0)) {
        return;
      }
      if (!resetAll) {
        if (allChecked) {
          $checkboxes.get(0).checked = false;
          $checkboxes.get(rowId + 1).checked = false;
        } else {
          $checkboxes.get(rowId + 1).checked = false;
        }
        return void 0;
      }
      $('.eba-listbox-item-selected', $root).removeClass('eba-listbox-item-selected');
      $checked.prop('checked', false);
      return void 0;
    };

    /**
     *  选中指定的数据行
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     setSelection
     *  @param      {String}        rowId
    */


    MiniGrid.prototype.setSelection = function(rowId) {
      var $tr, me, selector;
      me = this;
      selector = 'tr[data-index="{0}"]'.replace('{0}', rowId);
      $tr = $(selector, me._$root);
      if (!($tr.size() > 0)) {
        return void 0;
      }
      $tr.find(':checkbox').get(0).checked = true;
      $tr.addClass('eba-listbox-item-selected');
      return me.triggerEvent('selectrow');
    };

    /**
     *  获取grid的配置
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     getGridParam
     *  @arg        {String}        name
    */


    MiniGrid.prototype.getGridParam = function(name) {
      var me, prop;
      me = this;
      prop = '_' + name;
      return me[prop];
    };

    /**
     *  更新grid的配置   { data : [] }
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     setGridParam
     *  @param      {Object}        options
    */


    MiniGrid.prototype.setGridParam = function(parameters) {
      var key, me, prop, value;
      if (parameters == null) {
        return;
      }
      me = this;
      for (key in parameters) {
        value = parameters[key];
        prop = '_' + key;
        me[prop] = value;
      }
      return void 0;
    };

    /**
     *  使用grid配置重新加载grid
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     reloadGrid
    */


    MiniGrid.prototype.reloadGrid = function() {
      return this._render();
    };

    return MiniGrid;

  })(Control);

  ebaui['web'].registerControl('MiniGrid', MiniGrid);

  /**
  *   @class      CheckBox
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormField
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.CheckBox( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).checkbox( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="checkbox" data-options="{}" /&gt;
  */


  CheckBox = (function(_super) {
    __extends(CheckBox, _super);

    function CheckBox() {
      _ref22 = CheckBox.__super__.constructor.apply(this, arguments);
      return _ref22;
    }

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _render
    */


    CheckBox.prototype._render = function() {
      var me;
      CheckBox.__super__._render.call(this);
      me = this;
      me._updateCssChecked();
      return me._updateAttrText();
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _setupEvents
    */


    CheckBox.prototype._setupEvents = function(opts) {
      var $root, me;
      me = this;
      $root = me._$root;
      me.onEvent('change', opts['onchange']);
      $root.on('change', 'input', function(event) {
        me._checked = this.checked;
        return me.triggerEvent('change', event);
      });
      return void 0;
    };

    /**
     *  重写Control类的_updateAttrId方法
     *  ，更新$root的id属性的同时
     *  ，会更新input以及label的id for属性，增加可用性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _updateAttrId
    */


    CheckBox.prototype._updateAttrId = function() {
      var $input, $root, controlID, me;
      CheckBox.__super__._updateAttrId.call(this);
      me = this;
      $root = me.uiElement();
      $input = me._$formInput;
      controlID = me.controlID();
      $input.attr('id', controlID);
      return $('label', $root).attr('for', controlID);
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _init
    */


    CheckBox.prototype._init = function(opts) {
      var me, _ref23, _ref24, _ref25, _ref26, _ref27;
      CheckBox.__super__._init.call(this, opts);
      me = this;
      me._$formInput = $('input', me._$root);
      /* 初始化控件自身的一系列属性*/

      me._text = (_ref23 = opts['text']) != null ? _ref23 : false;
      me._checked = (_ref24 = opts['checked']) != null ? _ref24 : false;
      me._valueField = (_ref25 = opts['valueField']) != null ? _ref25 : 'value';
      me._value = (_ref26 = opts['value']) != null ? _ref26 : true;
      return me._textField = (_ref27 = opts['textField']) != null ? _ref27 : 'text';
    };

    /**
     *  更新UI界面的label文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _updateAttrText
    */


    CheckBox.prototype._updateAttrText = function() {
      var $root, me;
      me = this;
      $root = me.uiElement();
      return $('label', $root).text(me.text());
    };

    /**
     *  更新CheckBox的选中样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _updateCssChecked
    */


    CheckBox.prototype._updateCssChecked = function() {
      var me;
      me = this;
      return me._$formInput.get(0).checked = me.checked();
    };

    CheckBox.prototype._text = '';

    /**
     *  获取或者设置CheckBox控件的文本
     *  @public
     *  @instance
     *  @default    ''
     *  @memberof   ebaui.web.CheckBox
     *  @member     {String}        text
     *  @example    <caption>get</caption>
     *      pair = ctrl.text();
     *  @example    <caption>set</caption>
     *      ctrl.text( 'label' );
    */


    CheckBox.prototype.text = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._text;
      }
      me._text = val;
      return me._updateAttrText();
    };

    /**
     *  获取或者设置控件的所有值
     *  { 'text' : '','value' : null,'checked' : false }
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @member     {Object}        data
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data(  { 'text' : '','value' : null,'checked' : false } );
    */


    CheckBox.prototype.data = function(val) {
      var me, text, value;
      me = this;
      if (me.isNull(val)) {
        return me._checked;
      }
      text = val[me.textField()];
      if (text) {
        me.text(text);
      }
      value = val[me.valueField()];
      if (!me.isNull(val)) {
        me.value(value);
      }
      if (me.isBoolean(val['checked'])) {
        me.checked(val['checked']);
      }
      return void 0;
    };

    /**
     *  获取或者设置CheckBox是否选中，同checked
     *  @public
     *  @instance
     *  @default    ''
     *  @memberof   ebaui.web.CheckBox
     *  @member     {Object}     value
     *  @example    <caption>get</caption>
     *      pair = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( 'value' );
    */


    CheckBox.prototype.value = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._value;
      }
      if (me._value === val) {
        return;
      }
      return me._value = val;
    };

    CheckBox.prototype._checked = false;

    /**
     *  获取或者设置CheckBox是否选中
     *  @public
     *  @instance
     *  @readonly
     *  @default    false
     *  @memberof   ebaui.web.CheckBox
     *  @member     {Boolean}     checked
     *  @example    <caption>get</caption>
     *      pair = ctrl.checked();
     *  @example    <caption>set</caption>
     *      ctrl.checked( true );
    */


    CheckBox.prototype.checked = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._checked;
      }
      me._checked = val;
      return me._updateCssChecked();
    };

    CheckBox.prototype._valueField = 'value';

    /**
     *  控件数据源对象字段中，用于作为控件值的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @member     {String}      valueField
     *  @default    'value'
     *  @example    <caption>get</caption>
     *      valueField = ctrl.valueField();
     *  @example    <caption>set</caption>
     *      ctrl.valueField( '' );
    */


    CheckBox.prototype.valueField = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._valueField;
      }
      return me._valueField = val;
    };

    CheckBox.prototype._textField = 'text';

    /**
     *  控件数据源对象字段中，用于作为控件文本的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @member     {String}      textField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      textField = ctrl.textField();
     *  @example    <caption>set</caption>
     *      ctrl.textField( '' );
    */


    CheckBox.prototype.textField = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._textField;
      }
      return me._textField = val;
    };

    return CheckBox;

  })(FormField);

  ebaui['web'].registerFormControl('CheckBox', CheckBox);

  /**
  *   @class      CheckBoxList
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormField
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.CheckBoxList( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).checkboxlist( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="checkboxlist" data-options="{}" /&gt;
  */


  CheckBoxList = (function(_super) {
    __extends(CheckBoxList, _super);

    function CheckBoxList() {
      _ref23 = CheckBoxList.__super__.constructor.apply(this, arguments);
      return _ref23;
    }

    /**
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {String}    _itemTmpl
    */


    CheckBoxList.prototype._itemTmpl = '';

    /**
     *  已经编译好的checkbox模板，使用underscore模板引擎，后续会重复使用
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _compiledItemTmpl
    */


    CheckBoxList.prototype._compiledItemTmpl = $.noop;

    /**
     *  显示checkbox列表
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _renderItems
    */


    CheckBoxList.prototype._renderItems = function() {
      var $root, dataItems, html, me;
      me = this;
      $root = me.uiElement();
      dataItems = me.items();
      if (dataItems.length === 0) {
        return;
      }
      html = me._compiledItemTmpl({
        'name': me.name(),
        'controlID': me.controlID(),
        'textField': me.textField(),
        'valueField': me.valueField(),
        'dataItems': dataItems
      });
      return $('tr', $root).html(html);
    };

    CheckBoxList.prototype._items = [];

    /**
     *  CheckBoxList数据源
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}     _items
    */


    CheckBoxList.prototype.items = function() {
      return this._items;
    };

    /**
     *  数据加载开始前的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _beforeLoading
    */


    CheckBoxList.prototype._beforeLoading = function() {};

    /**
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _finishLoading
    */


    CheckBoxList.prototype._finishLoading = function() {
      var checkedVal, dataItem, i, items, j, me, value, valueField, _i, _j, _len, _len1;
      me = this;
      /*
       *  首次输出UI界面的时候，应该检查初始值，看看是否有设置已经选中的项目
       *  如果有，那么应该在初始化的时候，自动勾选
      */

      checkedVal = me.value();
      items = me.items();
      valueField = me.valueField();
      if (checkedVal && checkedVal.length > 0) {
        for (j = _i = 0, _len = checkedVal.length; _i < _len; j = ++_i) {
          value = checkedVal[j];
          for (i = _j = 0, _len1 = items.length; _j < _len1; i = ++_j) {
            dataItem = items[i];
            dataItem['checked'] = dataItem[valueField] === value;
          }
        }
      }
      return me._renderItems();
    };

    /**
     *  加载数据源，加载成功后填充本地数据源_items
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _loadData
    */


    CheckBoxList.prototype._loadData = function() {
      var data, dataSource, loadRemoteData, me, toServer, url;
      me = this;
      dataSource = me.dataSource();
      loadRemoteData = me.isUsingRemoteData(dataSource);
      if (loadRemoteData) {
        toServer = me.isFunc(data) ? data() : typeof data !== "undefined" && data !== null ? data : {};
        url = dataSource.url;
        data = dataSource.data;
        me._beforeLoading();
        $.getJSON(url, toServer).done(function(serverData) {
          me._items = serverData;
          return me._finishLoading();
        });
      } else {
        me._beforeLoading();
        me._items = dataSource;
        me._finishLoading();
      }
      return void 0;
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _render
    */


    CheckBoxList.prototype._render = function() {
      var me;
      CheckBoxList.__super__._render.call(this);
      me = this;
      /* load data then render CheckBoxList*/

      me._loadData($.noop, function() {
        /*
         *  首次输出UI界面的时候，应该检查初始值，看看是否有设置已经选中的项目
         *  如果有，那么应该在初始化的时候，自动勾选
        */

        var checkedVal, dataItem, i, items, j, value, valueField, _i, _j, _len, _len1;
        checkedVal = me.value();
        items = me.items();
        valueField = me.valueField();
        if (checkedVal && checkedVal.length > 0) {
          for (j = _i = 0, _len = checkedVal.length; _i < _len; j = ++_i) {
            value = checkedVal[j];
            for (i = _j = 0, _len1 = items.length; _j < _len1; i = ++_j) {
              dataItem = items[i];
              dataItem['checked'] = dataItem[valueField] === value;
            }
          }
        }
        return me._renderItems();
      });
      return void 0;
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _setupEvents
    */


    CheckBoxList.prototype._setupEvents = function(opts) {
      var $root, me;
      me = this;
      $root = me._$root;
      me.onEvent('change', opts['onchange']);
      $root.on('change', 'input', function(event) {
        return me.triggerEvent('change', event);
      });
      return void 0;
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _init
    */


    CheckBoxList.prototype._init = function(opts) {
      var me, _ref24, _ref25, _ref26;
      CheckBoxList.__super__._init.call(this, opts);
      me = this;
      /* 初始化控件自身的一系列属性*/

      me._dataSource = (_ref24 = opts['dataSource']) != null ? _ref24 : '';
      me._valueField = (_ref25 = opts['valueField']) != null ? _ref25 : 'value';
      me._textField = (_ref26 = opts['textField']) != null ? _ref26 : 'text';
      return me._compiledItemTmpl = me.compileTmpl(me._itemTmpl);
    };

    /**
     *  获取或者设置CheckBoxList的选中项
     *  ，参数格式示例：[{ text : '',value : '' }]
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}        data
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( [] );
    */


    CheckBoxList.prototype.data = function(val) {
      var ctrlVal, i, item, me, valueField, _i, _len;
      me = this;
      if (!((val != null) && me.isArray(val))) {
        return me._data;
      }
      /*
      *   set
      */

      ctrlVal = [];
      valueField = me.valueField();
      for (i = _i = 0, _len = val.length; _i < _len; i = ++_i) {
        item = val[i];
        if (item[valueField] != null) {
          ctrlVal.push(item[valueField]);
        }
      }
      me._data = val;
      me.value(ctrlVal);
      return void 0;
    };

    /**
     *  获取或者设置CheckBoxList的选中项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}     value
     *  @example    <caption>get</caption>
     *      pair = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( [1,2,3] );
    */


    CheckBoxList.prototype.value = function(val) {
      var $root, me;
      me = this;
      $root = me.uiElement();
      me._value = me._getValue();
      /*
      *   get value
      */

      if (!me.isArray(val)) {
        return me._value;
      }
      /*
      *   set value
      */

      return me._setValue(val);
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _getValue
    */


    CheckBoxList.prototype._getValue = function() {
      var $root, checkedItems, me;
      me = this;
      $root = me.uiElement();
      checkedItems = [];
      $('input:checked', $root).each(function(idx, el) {
        return checkedItems.push($(el).val());
      });
      return checkedItems;
    };

    /**
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _setValue
     *  @arg        {String}     val    -   
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    */


    CheckBoxList.prototype._setValue = function(val, updateHtml, dispatchEvent, eventArgs) {
      var $root, i, item, me, _i, _len;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      $root = me.uiElement();
      /*
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      if (me._value && me._value.join('') === val.join('')) {
        return;
      }
      me._value = val;
      if (updateHtml) {
        $('input:checked', $root).prop('checked', false);
        for (i = _i = 0, _len = val.length; _i < _len; i = ++_i) {
          item = val[i];
          $("input[value='" + item + "']", $root).prop('checked', true);
        }
      }
      if (dispatchEvent === true) {
        return me.triggerEvent('change', eventArgs);
      }
    };

    /**
     *  valueField以及textField属性访问器
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _doFieldAccess
    */


    CheckBoxList.prototype._doFieldAccess = function(name, val) {
      var me, prop;
      me = this;
      prop = '_' + name;
      if (!me.isString(val)) {
        return me[prop];
      }
      return me[prop] = val;
    };

    CheckBoxList.prototype._valueField = 'value';

    /**
     *  控件数据源对象字段中，用于作为控件值的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {String}      valueField
     *  @default    'value'
     *  @example    <caption>get</caption>
     *      valueField = ctrl.valueField();
     *  @example    <caption>set</caption>
     *      ctrl.valueField( '' );
    */


    CheckBoxList.prototype.valueField = function(val) {
      return this._doFieldAccess('valueField', val);
    };

    CheckBoxList.prototype._textField = 'text';

    /**
     *  控件数据源对象字段中，用于作为控件文本的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {String}      textField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      textField = ctrl.textField();
     *  @example    <caption>set</caption>
     *      ctrl.textField( '' );
    */


    CheckBoxList.prototype.textField = function(val) {
      return this._doFieldAccess('textField', val);
    };

    CheckBoxList.prototype._dataSource = '';

    /**
     *  CheckBoxList选项的数据源，可以是远程数据源URL配置对象或者是一个javascript数组对象作为数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Object|Array}          dataSource
     *  @property   {String}                dataSource.url          - 服务端URL
     *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
     *  @tutorial   texboxlist_local
     *  @tutorial   texboxlist_remote
     *  @example    <caption>get</caption>
     *      src = ctrl.dataSource();
     *  @example    <caption>set</caption>
     *      #  本地数据
     *      ctrl.dataSource( [] );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : {}
     *      } );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : function(){ 
     *              # your logic
     *              return {};
     *          }
     *      } );
    */


    CheckBoxList.prototype.dataSource = function(val) {
      var me;
      me = this;
      if (!val) {
        return me._dataSource;
      }
      me._dataSource = val;
      return me._loadData($.noop, function() {
        return me._renderItems();
      });
    };

    return CheckBoxList;

  })(FormField);

  ebaui['web'].registerFormControl('CheckBoxList', CheckBoxList);

  /**
  *   @class      RadioList
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.CheckBoxList
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.RadioList( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).radiolist( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="radiolist" data-options="{}" /&gt;
  */


  RadioList = (function(_super) {
    __extends(RadioList, _super);

    function RadioList() {
      _ref24 = RadioList.__super__.constructor.apply(this, arguments);
      return _ref24;
    }

    /**
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _finishLoading
    */


    RadioList.prototype._finishLoading = function() {
      var $radio, $root, checkedVal, me;
      me = this;
      me._renderItems();
      $root = me.uiElement();
      checkedVal = me.value();
      $radio = $("input[value='" + checkedVal + "']", $root);
      return $radio.prop('checked', true);
    };

    /**
     *  获取或者设置CheckBoxList的选中项
     *  ，参数格式示例：[{ text : '',value : '' }]
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}        data
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( [] );
    */


    RadioList.prototype.data = function(val) {
      var me, valueField;
      me = this;
      valueField = me.valueField();
      if (!((val != null) && (val[valueField] != null))) {
        return me._data;
      }
      /* set*/

      me.value(val[valueField]);
      return void 0;
    };

    /**
     *  获取或者设置CheckBoxList的选中项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}     value
     *  @example    <caption>get</caption>
     *      pair = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( [1,2,3] );
    */


    RadioList.prototype.value = function(val) {
      var $radio, $root, me;
      me = this;
      $root = me.uiElement();
      if (!((val != null) && me._value !== val)) {
        return me._value;
      }
      me._value = val;
      $radio = $("input[value='" + val + "']", $root);
      if ($radio.size() > 0) {
        return $radio.prop('checked', true);
      }
    };

    return RadioList;

  })(CheckBoxList);

  ebaui['web'].registerFormControl('RadioList', RadioList);

  /**
  *   @class      Hidden
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormField
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.Hidden( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).hidden( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="hidden" data-options="{}" /&gt;
  */


  Hidden = (function(_super) {
    __extends(Hidden, _super);

    function Hidden() {
      _ref25 = Hidden.__super__.constructor.apply(this, arguments);
      return _ref25;
    }

    /**
     *  获取或者设置控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Hidden
     *  @member     {Object}     value
     *  @example    <caption>get</caption>
     *      var pair = ctrl.value();
    */


    Hidden.prototype._doValueAccess = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._value;
      }
      return me._value = val;
    };

    Hidden.prototype.data = function(val) {
      return this._doValueAccess(val);
    };

    Hidden.prototype.value = function(val) {
      return this._doValueAccess(val);
    };

    return Hidden;

  })(FormField);

  ebaui['web'].registerFormControl('Hidden', Hidden);

  /**
  *   @class      Label
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormField
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.Label( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).label( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="label" data-options="{}" /&gt;
  */


  Label = (function(_super) {
    __extends(Label, _super);

    function Label() {
      _ref26 = Label.__super__.constructor.apply(this, arguments);
      return _ref26;
    }

    /**
     *  允许的button的state
     *  @private
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.Button
     *  @member     {String}    _availableState
    */


    Label.prototype._availableState = /white|primary|info|success|warning|danger|\s+/i;

    /**
     *  更新lable标签的边框
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @method     _updateCssBorder
    */


    Label.prototype._updateCssBorder = function() {
      var $root, cls, hasCss, me;
      me = this;
      $root = me.uiElement();
      cls = $root.attr('class');
      hasCss = cls.indexOf('eba-nobor') > -1 || cls.indexOf('eba-bor') > -1;
      if (hasCss) {
        if (me.hasBorder()) {
          cls.replace('eba-nobor', 'eba-bor');
        } else {
          cls.replace('eba-bor', 'eba-nobor');
        }
      } else if (me.hasBorder()) {
        cls += " eba-bor";
      }
      return $root.attr('class', cls);
    };

    /**
     *  更新lable标签的文字对其方式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @method     _updateCssTextAlign
    */


    Label.prototype._updateCssTextAlign = function() {
      var $root, align, alignment, cls, me;
      me = this;
      $root = me.uiElement();
      align = me.textAlign();
      cls = $root.attr('class');
      alignment = {
        'left': 'eba-txtl',
        'center': 'eba-txtc',
        'right': 'eba-txtr'
      };
      cls.replace('eba-txtl', ' ').replace('eba-txtc', ' ').replace('eba-txtr', ' ');
      cls += ' ' + alignment[align];
      return $root.attr('class', cls);
    };

    /**
     *  更新lable标签的文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @method     _updateAttrText
    */


    Label.prototype._updateAttrText = function() {
      var $root, me;
      me = this;
      $root = me.uiElement();
      return $root.text(me.text());
    };

    /**
     *  更新lable标签的for属性
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @method     _updateAttrText
    */


    Label.prototype._updateAttrFor = function() {
      var $root, me;
      me = this;
      $root = me.uiElement();
      return $root.attr('for', me["for"]());
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @method     _render
    */


    Label.prototype._render = function() {
      var me;
      Label.__super__._render.call(this);
      me = this;
      me._updateCssBorder();
      me._updateCssTextAlign();
      me._updateAttrText();
      return me._updateCssStates();
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _init
     *  @todo       maxlength等属性的初始化
    */


    Label.prototype._init = function(opts) {
      var me, _ref27, _ref28, _ref29, _ref30, _ref31;
      Label.__super__._init.call(this, opts);
      me = this;
      me._text = (_ref27 = opts['text']) != null ? _ref27 : '';
      me._for = (_ref28 = opts['for']) != null ? _ref28 : '';
      me._state = (_ref29 = opts['state']) != null ? _ref29 : '';
      me._hasBorder = (_ref30 = opts['hasBorder']) != null ? _ref30 : false;
      return me._textAlign = (_ref31 = opts['textAlign']) != null ? _ref31 : 'right';
    };

    Label.prototype._state = '';

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


    Label.prototype.state = function(val) {
      var me;
      me = this;
      if (!me._availableState.test(val)) {
        return me._state;
      }
      me._state = val.toLowerCase();
      return me._updateCssStates();
    };

    /**
     *  更新label文字的颜色
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @method     _updateCssStates
    */


    Label.prototype._updateCssStates = function() {
      var $root, cls, me, state;
      me = this;
      $root = me.uiElement();
      state = me.state();
      cls = $root.attr('class');
      if (state.length > 0) {
        return $root.attr('class', "" + cls + " label-" + state);
      }
    };

    Label.prototype._hasBorder = false;

    /**
     *  获取或者设置是否显示label边框
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @member     {Boolean}   hasBorder
     *  @default    false
     *  @example    <caption>get</caption>
     *      //  hasBorder == true
     *      hasBorder = ctrl.hasBorder();
     *  @example    <caption>set</caption>
     *      ctrl.hasBorder( true );
     *      ctrl.hasBorder( false );
    */


    Label.prototype.hasBorder = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._hasBorder;
      }
      me._hasBorder = val;
      return me._updateCssBorder();
    };

    Label.prototype._text = '';

    /**
     *  获取或者设置label文本值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @member     {String}    text
     *  @default    ''
     *  @example    <caption>get</caption>
     *      //  text == 'text'
     *      text = ctrl.text();
     *  @example    <caption>set</caption>
     *      ctrl.text( 'label' );
    */


    Label.prototype.text = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._text;
      }
      me._text = val;
      return me._updateAttrText();
    };

    Label.prototype._for = '';

    /**
     *  获取或者设置for属性
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @member     {String}    for
     *  @default    ''
     *  @example    <caption>get</caption>
     *      for = ctrl.for();
     *  @example    <caption>set</caption>
     *      ctrl.for( 'label' );
    */


    Label.prototype["for"] = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._for;
      }
      me._for = val;
      return me._updateAttrFor();
    };

    /**
     *  同text
     *  @see ebaui.web.Label.text
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @member     {Object}        data
     *  @example    <caption>get</caption>
     *      //  { text : '' ,value : '' };
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      pair = { text : '' ,value : '' };
     *      ctrl.data( pair );
    */


    Label.prototype.data = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._text;
      }
      me._text = val;
      return me._updateAttrText();
    };

    Label.prototype._textAlign = 'right';

    /**
     *  获取或者设置label文本对其方式，目前只支持'left','center','right'三种对齐方式
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Label
     *  @member     {String}    textAlign
     *  @default    'right'
     *  @example    <caption>get</caption>
     *      //  textAlign == 'right'
     *      textAlign = ctrl.textAlign();
     *  @example    <caption>set</caption>
     *      ctrl.textAlign( 'left' );
     *      ctrl.textAlign( 'center' );
     *      ctrl.textAlign( 'right' );
    */


    Label.prototype.textAlign = function(val) {
      var me, re;
      me = this;
      re = /left|center|right/i;
      if (!re.test(val)) {
        return me._textAlign;
      }
      me._textAlign = val;
      return me._updateCssTextAlign();
    };

    return Label;

  })(FormField);

  ebaui['web'].registerFormControl('Label', Label);

  /**
   *  @class      Spinner 
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.FormElement
   *  @tutorial   spinner_index
   *  @param      {Object}    element     -   dom对象
   *  @param      {Object}    options     -   控件配置参数
   *  @example
   *      //  初始化方式一
   *      var ns = ebaui.web;
   *      var btn = new ns.Spinner( $( '' ),{ title:'',id:'',name:'' } );
   *      //  初始化方式二
   *      $( '' ).spinner( { title:'',id:'',name:'' } )
   *      //  初始化方式三
   *      &lt;input id="" title="" name="" data-role="spinner" data-options="{}" /&gt;
  */


  Spinner = (function(_super) {
    __extends(Spinner, _super);

    function Spinner() {
      _ref27 = Spinner.__super__.constructor.apply(this, arguments);
      return _ref27;
    }

    /**
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Object}    _rootCls
    */


    Spinner.prototype._rootCls = {
      disabled: 'eba-disabled',
      focused: 'eba-buttonedit-focus',
      readonly: 'eba-readonly'
    };

    /**
     *  获取焦点
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _focus
     *  @todo       test
    */


    Spinner.prototype._focus = function() {
      var me;
      me = this;
      if (me.enabled() && !me.readonly()) {
        me._updateCssFocused();
        return me._$formInput.focus();
      }
    };

    /**
     *  失去焦点
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _blur
     *  @todo       test
    */


    Spinner.prototype._blur = function() {
      var me;
      me = this;
      if (me.enabled()) {
        return me._$formInput.blur();
      }
    };

    /**
     *  设置或者移除据聚焦样式或者失焦样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _updateCssFocused
    */


    Spinner.prototype._updateCssFocused = function() {
      var $root, cls, me;
      me = this;
      cls = me._rootCls['focused'];
      $root = me._$root;
      if (me.focused()) {
        return $root.addClass(cls);
      } else {
        return $root.removeClass(cls);
      }
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _updateCssEnabled
    */


    Spinner.prototype._updateCssEnabled = function() {
      var $input, $root, disabledCls, focusCls, me, rootCls;
      me = this;
      $root = me._$root;
      rootCls = me._rootCls;
      $input = me._$formInput;
      focusCls = rootCls['focused'];
      disabledCls = rootCls['disabled'];
      if (me.enabled()) {
        $input.attr('disabled', null);
        return $root.removeClass(disabledCls);
      } else {
        $input.attr('disabled', 'disabled');
        return $root.removeClass(focusCls).addClass(disabledCls);
      }
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _updateCssReadonly
    */


    Spinner.prototype._updateCssReadonly = function() {
      var $btns, $input, $root, attr, me, roCls;
      me = this;
      roCls = me._rootCls['readonly'];
      $root = me._$root;
      $btns = $('.eba-buttonedit-buttons', $root);
      $input = me._$formInput;
      attr = 'readonly';
      if (me.readonly()) {
        $root.addClass(roCls);
        $btns.hide();
        return $input.attr(attr, attr);
      } else {
        $root.removeClass(roCls);
        $input.attr(attr, null);
        return $btns.show();
      }
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _fixNumber
    */


    Spinner.prototype._fixNumber = function(val) {
      var fixed, me, places;
      me = this;
      if (val == null) {
        val = me.value();
      }
      places = me.decimalPlaces();
      fixed = places < 0 ? val.toString() : val.toFixed(places);
      return fixed;
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _render
    */


    Spinner.prototype._render = function() {
      var me;
      Spinner.__super__._render.call(this);
      me = this;
      return me._$formInput.val(me._fixNumber());
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _setupEvents
    */


    Spinner.prototype._setupEvents = function(opts) {
      var $input, $root, key, me;
      me = this;
      $root = me._$root;
      $input = me._$formInput;
      key = ebaui.web.keyboard;
      me.onEvent('focus', opts['onfocus']);
      me.onEvent('blur', opts['onblur']);
      me.onEvent('change', opts['onchange']);
      me.onEvent('spinup', opts['onspinup']);
      me.onEvent('spindown', opts['onspindown']);
      $root.on('keydown', 'input', function(event) {
        if (!key.isNumber(event.which)) {
          return event.preventDefault();
        }
      });
      $root.on('keyup', 'input', function(event) {
        /*
        *   upArrow   : 38
        *   downArrow : 40
        */

        switch (event.which) {
          case 38:
            return me.stepUp();
          case 40:
            return me.stepDown();
          default:
            return me._setValue($input.val(), false, true, event);
        }
      });
      $root.on('focus', 'input', function(event) {
        me._focused = true;
        me._updateCssFocused();
        return me.triggerEvent('focus', event);
      });
      $root.on('blur', 'input', function(event) {
        me._focused = false;
        me._updateCssFocused();
        return me.triggerEvent('blur', event);
      });
      $root.on('click', '.eba-buttonedit-up', function(event) {
        me.stepUp(true, true, event);
        return me.triggerEvent('spinup', event);
      });
      return $root.on('click', '.eba-buttonedit-down', function(event) {
        me.stepDown(true, true, event);
        return me.triggerEvent('spindown', event);
      });
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _init
    */


    Spinner.prototype._init = function(opts) {
      var $root, initVal, me, _ref28, _ref29, _ref30, _ref31, _ref32;
      Spinner.__super__._init.call(this, opts);
      /**
      *   初始化控件自身的一系列属性
      */

      me = this;
      $root = me._$root;
      me._$formInput = $('input', $root);
      me._step = (_ref28 = opts['step']) != null ? _ref28 : 1;
      me._min = (_ref29 = opts['min']) != null ? _ref29 : 0;
      me._max = (_ref30 = opts['max']) != null ? _ref30 : 100;
      me._width = (_ref31 = opts['width']) != null ? _ref31 : 150;
      me._height = (_ref32 = opts['height']) != null ? _ref32 : 21;
      initVal = me.isNumber(opts['value']) ? opts['value'] : 0;
      return me._setValue(initVal);
    };

    /**
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.Spinner
     *  @member     {Boolean}   focusable
     *  @example    <caption>get</caption>
     *      #   false
     *      console.log( ctrl.focusable() );
    */


    Spinner.prototype.focusable = function() {
      return true;
    };

    /**
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _setValue
     *  @arg        {String}     val    -   
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    */


    Spinner.prototype._setValue = function(val, updateHtml, dispatchEvent, eventArgs) {
      var fixed, max, me, min;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      if (val == null) {
        return;
      }
      me = this;
      val = parseFloat(val);
      if (isNaN(val)) {
        return;
      }
      max = me.max();
      min = me.min();
      if (val < min) {
        val = min;
      }
      if (val > max) {
        val = max;
      }
      fixed = me._fixNumber(val);
      /**
      *   格式化数据
      */

      val = parseFloat(fixed);
      /**
      *   更新控件值
      */

      me._value = val;
      if (updateHtml) {
        me._$formInput.val(fixed);
      }
      /**
      *   如果允许触发事件，触发change事件
      */

      if (dispatchEvent === true) {
        me.triggerEvent('change', eventArgs);
      }
      /**
      *   触发控件验证
      */

      if (me.validateOnChange()) {
        me.validate();
      }
      return void 0;
    };

    /**
     *  获取或者设置spinner值,同value属性一致
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {String}        data
     *  @example    <caption>get</caption>
     *      data = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( '19:20' );
    */


    Spinner.prototype.data = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._value;
      }
      return me._setValue(val);
    };

    /**
     *  获取或者设置spinner值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {String}     value
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( '19:20' );
    */


    Spinner.prototype.value = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._value;
      }
      return me._setValue(val);
    };

    Spinner.prototype._step = 1;

    /**
     *  获取或者设置秒微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Number}     step
     *  @default    1
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.step();
     *  @example    <caption>set</caption>
     *      ctrl.step( 20 );
    */


    Spinner.prototype.step = function(val) {
      var me;
      me = this;
      if (!me.isNumber(val)) {
        return me._step;
      }
      return me._step = val;
    };

    /**
     *  
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     stepUp
     *  @example    
     *      ctrl.stepUp();
    */


    Spinner.prototype.stepUp = function(updateHtml, dispatchEvent, eventArgs) {
      var max, me, val;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      max = me.max();
      val = me.value() + me.step();
      val = val > max ? max : val;
      return me._setValue(val, updateHtml, dispatchEvent, eventArgs);
    };

    /**
     *  
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     stepDown
     *  @example    
     *      ctrl.stepDown();
    */


    Spinner.prototype.stepDown = function(updateHtml, dispatchEvent, eventArgs) {
      var me, min, val;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      min = me.min();
      val = me.value() - me.step();
      val = val < min ? min : val;
      return me._setValue(val, updateHtml, dispatchEvent, eventArgs);
    };

    Spinner.prototype._min = 0;

    /**
     *  获取或者设置秒微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Number}     min
     *  @default    0
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.min();
     *  @example    <caption>set</caption>
     *      ctrl.min( 20 );
    */


    Spinner.prototype.min = function(val) {
      var me;
      me = this;
      if (!me.isNumber(val)) {
        return me._min;
      }
      return me._min = val;
    };

    Spinner.prototype._max = 100;

    /**
     *  获取或者设置秒微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Number}     max
     *  @default    100
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.max();
     *  @example    <caption>set</caption>
     *      ctrl.max( 20 );
    */


    Spinner.prototype.max = function(val) {
      var me;
      me = this;
      if (!me.isNumber(val)) {
        return me._max;
      }
      return me._max = val;
    };

    Spinner.prototype._decimalPlaces = 0;

    /**
     *  保留的小数点位数。默认值是-1，表示不作任何限制
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Number}     decimalPlaces
     *  @default    0
     *  @example    <caption>get</caption>
     *      decimalPlaces = ctrl.decimalPlaces();
     *  @example    <caption>set</caption>
     *      ctrl.decimalPlaces( 20 );
    */


    Spinner.prototype.decimalPlaces = function(val) {
      var me;
      me = this;
      if (!me.isNumber(val)) {
        return me._decimalPlaces;
      }
      return me._decimalPlaces = val;
    };

    return Spinner;

  })(FormField);

  ebaui['web'].registerFormControl('Spinner', Spinner);

  /**
  *   @class      TimeSpinner
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormField
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.TimeSpinner( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).timespinner( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="timespinner" data-options="{}" /&gt;
  */


  TimeSpinner = (function(_super) {
    __extends(TimeSpinner, _super);

    function TimeSpinner() {
      _ref28 = TimeSpinner.__super__.constructor.apply(this, arguments);
      return _ref28;
    }

    /**
     *  当前正在调整的input的索引
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Object}    _current
    */


    TimeSpinner.prototype._current = 'hour';

    /**
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Object}    _rootCls
    */


    TimeSpinner.prototype._rootCls = {
      disabled: 'eba-disabled',
      focused: 'eba-buttonedit-focus',
      readonly: 'eba-readonly'
    };

    /**
     *  各个不同时间单位的最大值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Object}    _max
    */


    TimeSpinner.prototype._max = {
      'hour': 23,
      'minute': 59,
      'second': 59
    };

    /**
     *  各个不同时间单位的最小值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Object}    _min
    */


    TimeSpinner.prototype._min = {
      'hour': 0,
      'minute': 0,
      'second': 0
    };

    /**
     *  获取焦点
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _focus
    */


    TimeSpinner.prototype._focus = function() {
      var me;
      me = this;
      if (me.enabled()) {
        me._updateCssFocused();
        return $("input[data-pos='" + me._current + "']", me._$root).focus();
      }
    };

    /**
     *  失去焦点
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _blur
    */


    TimeSpinner.prototype._blur = function() {
      var me;
      me = this;
      if (me.enabled()) {
        me._updateCssFocused();
        return $("input[data-pos='" + me._current + "']", me._$root).blur();
      }
    };

    /**
     *  更新UI的宽度
     *  @private
     *  @instance
     *  @tutorial   timespinner_width
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssWidth
    */


    TimeSpinner.prototype._updateCssWidth = function() {
      var me;
      me = this;
      me._$root.width(me.width());
      /**
      *   更新在不同的format格式下，UI界面显示要有所不同
      */

      return me._updateCssFormat();
    };

    /**
     *  设置或者移除据聚焦样式或者失焦样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssFocused
    */


    TimeSpinner.prototype._updateCssFocused = function() {
      var $root, cls, me;
      me = this;
      $root = me._$root;
      cls = me._rootCls['focused'];
      if (me.focused()) {
        return $root.addClass(cls);
      } else {
        return $root.removeClass(cls);
      }
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssEnabled
    */


    TimeSpinner.prototype._updateCssEnabled = function() {
      var $input, $root, cls, daCls, dis, foCls, me;
      me = this;
      cls = me._rootCls;
      dis = 'disabled';
      foCls = cls['focused'];
      daCls = cls['disabled'];
      $root = me._$root;
      $input = $('input', $root);
      if (me.enabled()) {
        $input.attr(dis, null);
        return $root.removeClass(daCls);
      } else {
        $input.attr(dis, dis);
        return $root.removeClass(foCls).addClass(daCls);
      }
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssEnabled
    */


    TimeSpinner.prototype._updateCssReadonly = function() {
      var $btn, $input, $root, cls, me, ro, roCls;
      me = this;
      cls = me._rootCls;
      ro = 'readonly';
      roCls = cls[ro];
      $root = me._$root;
      $input = $('input', $root);
      $btn = $('.eba-buttonedit-buttons', $root);
      if (me.readonly()) {
        $root.addClass(roCls);
        $btn.hide();
        return $input.attr(ro, ro);
      } else {
        $root.removeClass(roCls);
        $input.attr(ro, null);
        return $btn.show();
      }
    };

    /**
     *  更新在不同的format格式下，UI界面显示要有所不同
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssFormat
    */


    TimeSpinner.prototype._updateCssFormat = function() {
      var $hour, $inputs, $minute, $minuteP, $root, $second, $secondP, len, me, totalWidth, width;
      me = this;
      $root = me._$root;
      len = me.format().split(':').length;
      totalWidth = width = $root.width() - $('.eba-buttonedit-button', $root).outerWidth();
      /**
      *   我们约定
      *   hour minute second对应的index为0 1 2
      */

      $inputs = $('input', $root);
      $hour = $inputs.eq(0);
      $minute = $inputs.eq(1);
      $second = $inputs.eq(2);
      $minuteP = $minute.parent();
      $secondP = $second.parent();
      switch (len) {
        case 1:
          $hour.width(width);
          $minuteP.hide();
          $secondP.hide();
          break;
        case 2:
          width = totalWidth * 0.4;
          $hour.width(width);
          $minute.width(width);
          $secondP.hide();
          break;
        case 3:
          width = totalWidth * 0.3;
          $hour.width(width);
          $minute.width(width);
          $second.width(width);
      }
      return void 0;
    };

    /**
     *  更新value在界面的显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateAttrText
    */


    TimeSpinner.prototype._updateAttrText = function() {
      var $inputs, i, me, mo, splited, _i, _ref29, _results;
      me = this;
      $inputs = $('input', me._$root);
      mo = new moment(me.value());
      splited = mo.format(me.format()).split(':');
      _results = [];
      for (i = _i = 0, _ref29 = splited.length - 1; 0 <= _ref29 ? _i <= _ref29 : _i >= _ref29; i = 0 <= _ref29 ? ++_i : --_i) {
        _results.push($inputs.eq(i).val(splited[i]));
      }
      return _results;
    };

    /**
     *  更新UI显示
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _render
    */


    TimeSpinner.prototype._render = function() {
      TimeSpinner.__super__._render.call(this);
      return this._updateAttrText();
    };

    /**
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _setValue
     *  @arg        {Date}       val    -   
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    */


    TimeSpinner.prototype._setValue = function(val, updateHtml, dispatchEvent, eventArgs) {
      var $root, me;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      if (val == null) {
        return;
      }
      /**
      *   在javascript里，date是一个引用类型的对象
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      me = this;
      if (me._value && me._value.getTime() === val.getTime()) {
        return;
      }
      me._value = val;
      $root = me.uiElement();
      if (updateHtml === true) {
        me._updateAttrText();
      }
      if (dispatchEvent === true) {
        return me.triggerEvent('change', eventArgs);
      }
    };

    /**
     *  单步调整
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     stepUp
     *  @arg        {String}    which     -   可选值有['hour','minute','second']
     *  @example    
     *      ctrl.stepUp();
    */


    TimeSpinner.prototype.stepUp = function(pos, updateHtml, dispatchEvent, eventArgs) {
      var $input, $root, change, less, max, me, old, val;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      if (!pos) {
        return;
      }
      me = this;
      $root = me.uiElement();
      $input = $("input[data-pos='" + pos + "']", $root);
      max = me._max[pos];
      val = me.value().clone();
      old = 0;
      switch (pos) {
        case "hour":
          old = val.getHours();
          break;
        case "minute":
          old = val.getMinutes();
          break;
        case "second":
          old = val.getSeconds();
      }
      change = old + me["" + pos + "Step"]();
      less = change < max;
      if (me.circular()) {
        change = less ? change : change - max;
      } else {
        change = less ? change : max;
      }
      switch (pos) {
        case "hour":
          val.setHours(change);
          break;
        case "minute":
          val.setMinutes(change);
          break;
        case "second":
          val.setSeconds(change);
      }
      return me._setValue(val, updateHtml, dispatchEvent, eventArgs);
    };

    /**
     *  单步调整
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     stepDown
     *  @arg        {String}    which     -   可选值有['hour','minute','second']
     *  @example    
     *      ctrl.stepDown();
    */


    TimeSpinner.prototype.stepDown = function(pos, updateHtml, dispatchEvent, eventArgs) {
      var $input, $root, change, great, max, me, min, old, val;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      if (!pos) {
        return;
      }
      me = this;
      $root = me.uiElement();
      $input = $("input[data-pos='" + pos + "']", $root);
      max = me._max[pos];
      min = me._min[pos];
      val = me.value().clone();
      old = 0;
      switch (pos) {
        case "hour":
          old = val.getHours();
          break;
        case "minute":
          old = val.getMinutes();
          break;
        case "second":
          old = val.getSeconds();
      }
      change = old - me["" + pos + "Step"]();
      great = change > min;
      if (me.circular()) {
        change = great ? change : max - Math.abs(change - min);
      } else {
        change = great ? change : min;
      }
      switch (pos) {
        case "hour":
          val.setHours(change);
          break;
        case "minute":
          val.setMinutes(change);
          break;
        case "second":
          val.setSeconds(change);
      }
      return me._setValue(val, updateHtml, dispatchEvent, eventArgs);
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _setupEvents
    */


    TimeSpinner.prototype._setupEvents = function(opts) {
      var $root, key, me;
      me = this;
      $root = me._$root;
      key = ebaui.web.keyboard;
      me.onEvent('change', opts['onchange']);
      me.onEvent('spinup', opts['onspinup']);
      me.onEvent('spindown', opts['onspindown']);
      $root.on('keydown', 'input', function(event) {
        var code;
        code = event.which;
        /**
        *   backspace
        *   tab
        *   enter
        *   up arrow
        *   down arrow
        *   number
        */

        if (!((code === 8 || code === 9 || code === 13 || code === 38 || code === 40) || key.isNumber(code))) {
          return event.preventDefault();
        }
      });
      $root.on('keyup', 'input', function(event) {
        var $inputs, $target, enter, goToNext, index, len, val;
        $target = $(this);
        $inputs = $('input', $root);
        enter = key.isEnter(event.which);
        index = $inputs.index($target);
        len = me.format().split(':').length;
        goToNext = len > 1 && (index < (len - 1));
        if (enter && goToNext) {
          $inputs.eq(index + 1).focus();
          return;
        }
        val = $target.val().toString();
        if (!enter && goToNext) {
          if (val.length === 2) {
            $inputs.eq(index + 1).focus();
          } else if (val.length > 2) {
            $target.val(val.substr(0, 2));
            $inputs.eq(index + 1).focus();
          }
          return;
        }
        /**
        *   当前已经是最后一个input的时候，
        *   如果输入超过两位数，那么直接截断
        */

        if (val.length > 2) {
          return $target.val(val.substr(0, 2));
        }
      });
      $root.on('focus', 'input', function(event) {
        me._current = $(this).attr('data-pos');
        me._focused = true;
        me._updateCssFocused();
        return me.triggerEvent('focus', event);
      });
      $root.on('blur', 'input', function(event) {
        me._focused = false;
        me._updateCssFocused();
        return me.triggerEvent('blur', event);
      });
      $root.on('click', '.eba-buttonedit-up', function(event) {
        me.stepUp(me._current, true, true, event);
        return me.triggerEvent('spinup', event);
      });
      return $root.on('click', '.eba-buttonedit-down', function(event) {
        me.stepDown(me._current, true, true, event);
        return me.triggerEvent('spindown', event);
      });
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _init
    */


    TimeSpinner.prototype._init = function(opts) {
      var me, mo, _ref29, _ref30;
      TimeSpinner.__super__._init.call(this, opts);
      /**
      *   初始化控件自身的一系列属性
      */

      me = this;
      me._width = (_ref29 = opts['width']) != null ? _ref29 : 150;
      me._height = (_ref30 = opts['height']) != null ? _ref30 : 21;
      if (opts['format'] != null) {
        me._format = opts['format'];
      }
      if (opts['hourStep'] != null) {
        me._hourStep = opts['hourStep'];
      }
      if (opts['minuteStep'] != null) {
        me._minuteStep = opts['minuteStep'];
      }
      if (opts['secondStep'] != null) {
        me._secondStep = opts['secondStep'];
      }
      /* 
      *   init value
      */

      mo = new moment(me._value);
      return me._value = (me._value != null) && mo.isValid() ? mo.toDate() : new Date;
    };

    /**
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Boolean}   focusable
     *  @example    <caption>get</caption>
     *      #  false
     *      console.log( ctrl.focusable() );
    */


    TimeSpinner.prototype.focusable = function() {
      return true;
    };

    TimeSpinner.prototype._format = 'HH:mm';

    /**
     *  时间格式化字符串,HH:mm或者HH:mm:ss
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @default    'HH:mm'
     *  @member     {String}        format
     *  @example    <caption>get</caption>
     *      format = ctrl.format();
     *  @example    <caption>set</caption>
     *      ctrl.format( 'HH:mm:ss' );
    */


    TimeSpinner.prototype.format = function(val) {
      var me;
      me = this;
      if (!val) {
        return me._format;
      }
      me._format = val.toString();
      /*
      *   更新在不同的format格式下，UI界面显示要有所不同
      */

      return me._updateCssFormat();
    };

    /**
     *  获取或者设置timeSpinner值,同value属性一致
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {String}        data
     *  @example    <caption>get</caption>
     *      data = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( '19:20' );
    */


    TimeSpinner.prototype.data = function(val) {
      var me;
      me = this;
      if (!me.isDate(val)) {
        return me._value;
      }
      return me._setValue(val);
    };

    /**
     *  获取或者设置timeSpinner值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {String}     value
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( '19:20' );
    */


    TimeSpinner.prototype.value = function(val) {
      var me;
      me = this;
      if (!me.isDate(val)) {
        return me._value;
      }
      return me._setValue(val);
    };

    TimeSpinner.prototype._circular = false;

    /**
     *  获取或者设置是否允许循环调整时间
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Boolean}     circular
     *  @default    false   
     *  @tutorial   timespinner_circular
     *  @example    <caption>get</caption>
     *      value = ctrl.circular();
     *  @example    <caption>set</caption>
     *      ctrl.circular( true );
    */


    TimeSpinner.prototype.circular = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._circular;
      }
      return me._circular = val;
    };

    /**
     *  获取或者设置微调步进
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _step
     *
     *  @example    <caption>get</caption>
     *      value = ctrl._step();
     *  @example    <caption>set</caption>
     *      ctrl._step( true );
    */


    TimeSpinner.prototype._step = function(which, val) {
      var me, prop;
      me = this;
      prop = "_" + which;
      if (!me.isNumber(val)) {
        return me[prop];
      }
      return me[prop] = val;
    };

    TimeSpinner.prototype._hourStep = 1;

    /**
     *  获取或者设置小时微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Number}     hourStep
     *  @default    1
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.hourStep();
     *  @example    <caption>set</caption>
     *      ctrl.hourStep( 2 );
    */


    TimeSpinner.prototype.hourStep = function(val) {
      return this._step('hourStep', val);
    };

    TimeSpinner.prototype._minuteStep = 10;

    /**
     *  获取或者设置分钟微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Number}     minuteStep
     *  @default    10
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.minuteStep();
     *  @example    <caption>set</caption>
     *      ctrl.minuteStep( 20 );
    */


    TimeSpinner.prototype.minuteStep = function(val) {
      return this._step('minuteStep', val);
    };

    TimeSpinner.prototype._secondStep = 10;

    /**
     *  获取或者设置秒微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Number}     secondStep
     *  @default    10
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.secondStep();
     *  @example    <caption>set</caption>
     *      ctrl.secondStep( 20 );
    */


    TimeSpinner.prototype.secondStep = function(val) {
      return this._step('secondStep', val);
    };

    return TimeSpinner;

  })(FormField);

  ebaui['web'].registerFormControl('TimeSpinner', TimeSpinner);

  /**
  *   @private
  *   @class      MainView
  *   @classdesc  MainView，Calendar的主视图
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  */


  MainView = (function(_super) {
    __extends(MainView, _super);

    function MainView() {
      _ref29 = MainView.__super__.constructor.apply(this, arguments);
      return _ref29;
    }

    MainView.prototype._headerTmpl = '';

    /**
     *  已经编译好的日历Week文本HTML模板
     *  ，'日', '一', '二', '三', '四', '五', '六'
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _compiledHeaderTmpl
    */


    MainView.prototype._compiledHeaderTmpl = $.noop;

    MainView.prototype._weekTmpl = '';

    /**
     *  已经编译好的日历Week的HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _compiledWeekTmpl
    */


    MainView.prototype._compiledWeekTmpl = $.noop;

    /**
     *  日期文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Array}    _weeks
    */


    MainView.prototype._weeks = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    /**
     *  get weeks data
     *  @private
     *  @instance
     *  @memberof       ebaui.web.MainView
     *  @method         _genWeeksData
     *  @param          {Number}    year
     *  @param          {Number}    month   0 ~ 11
     *  @returns        {Array}     [year,month,date]
    */


    MainView.prototype._genWeeksData = function(year, month) {
      var date, dates, firstDate, firstWeek, i, item, lastDate, lastDay, lastWeek, week, weeks, _i, _j;
      lastDay = new Date(year, month + 1, 0).getDate();
      dates = (function() {
        var _i, _results;
        _results = [];
        for (item = _i = 1; 1 <= lastDay ? _i <= lastDay : _i >= lastDay; item = 1 <= lastDay ? ++_i : --_i) {
          _results.push([year, month, item]);
        }
        return _results;
      })();
      week = [];
      weeks = [];
      while (dates.length > 0) {
        date = dates.shift();
        week.push(date);
        if (new Date(date[0], date[1], date[2]).getDay() === 6) {
          weeks.push(week);
          week = [];
        }
      }
      if (week.length) {
        weeks.push(week);
      }
      firstWeek = weeks[0];
      if (firstWeek.length < 7) {
        while (firstWeek.length < 7) {
          firstDate = firstWeek[0];
          date = new Date(firstDate[0], firstDate[1], firstDate[2] - 1);
          firstWeek.unshift([date.getFullYear(), date.getMonth(), date.getDate()]);
        }
      } else {
        firstDate = firstWeek[0];
        week = [];
        for (i = _i = 1; _i <= 7; i = ++_i) {
          date = new Date(firstDate[0], firstDate[1], firstDate[2] - i);
          week.unshift([date.getFullYear(), date.getMonth(), date.getDate()]);
        }
        weeks.unshift(week);
      }
      lastWeek = weeks[weeks.length - 1];
      while (lastWeek.length < 7) {
        lastDate = lastWeek[lastWeek.length - 1];
        date = new Date(lastDate[0], lastDate[1], lastDate[2] + 1);
        lastWeek.push([date.getFullYear(), date.getMonth(), date.getDate()]);
      }
      if (weeks.length < 6) {
        lastDate = lastWeek[lastWeek.length - 1];
        week = [];
        for (i = _j = 1; _j <= 7; i = ++_j) {
          date = new Date(lastDate[0], lastDate[1], lastDate[2] + i);
          week.push([date.getFullYear(), date.getMonth(), date.getDate()]);
        }
        weeks.push(week);
      }
      return weeks;
    };

    MainView.prototype._currentYear = null;

    /**
     *  当前显示的年份
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Number}    currentYear
    */


    MainView.prototype.currentYear = function() {
      var me;
      me = this;
      if (typeof val === "undefined" || val === null) {
        return me._currentYear;
      }
      return me._currentYear = val;
    };

    MainView.prototype._currentMonth = null;

    /**
     *  当前显示的月份
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Number}    currentMonth
    */


    MainView.prototype.currentMonth = function() {
      var me;
      me = this;
      if (typeof val === "undefined" || val === null) {
        return me._currentMonth;
      }
      return me._currentMonth = val;
    };

    MainView.prototype._currentDate = null;

    /**
     *  当前选中日期
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Number}    currentDate
    */


    MainView.prototype.currentDate = function(val) {
      var me;
      me = this;
      if (!me.isDate(val)) {
        return me._currentDate;
      }
      me._currentDate = val;
      me._currentYear = val.getFullYear();
      me._currentMonth = val.getMonth();
      me._renderTitle();
      return me._renderWeeks();
    };

    MainView.prototype._titleFormat = 'MMM YYYY';

    /**
     *  当前标题的格式，比如是xxxx年xx月或者是Sep 2013之类的
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {String}    titleFormat
    */


    MainView.prototype.titleFormat = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._titleFormat;
      }
      if (!val) {
        return me._titleFormat = val;
      }
    };

    MainView.prototype._showButtons = false;

    /**
     *  是否显示按钮，目前只要显示两个按钮：今天 和 确定 按钮即可
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Boolean}    showButtons
    */


    MainView.prototype.showButtons = function(val) {
      var $btns, $root, me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._showButtons;
      }
      me._showButtons = val;
      $root = me.uiElement();
      $btns = $('[data-inner-role="buttons"]', $root);
      if (val) {
        $btns.show();
      } else {
        $btns.hide();
      }
      me._updateFooterCssVisible();
      return void 0;
    };

    MainView.prototype._showSpinner = false;

    /**
     *  是否显示timeSpinner
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Boolean}    showSpinner
    */


    MainView.prototype.showSpinner = function(val) {
      var $root, $spinner, me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._showSpinner;
      }
      me._showSpinner = val;
      $root = me.uiElement();
      $spinner = $('[data-inner-role="spinner"]', $root);
      if (val) {
        $spinner.show();
      } else {
        $spinner.hide();
      }
      me._updateFooterCssVisible();
      return void 0;
    };

    /**
     *  输出calendar标题部分，比如2013年09月
     *  @private
     *  @instance
     *  @memberof       ebaui.web.MainView
     *  @method         _renderTitle
     *  @param          {Number}    year
     *  @param          {Number}    month   0 ~ 11
    */


    MainView.prototype._renderTitle = function() {
      var $root, me, mo, month, title, year;
      me = this;
      $root = me._$root;
      year = me.currentYear();
      month = me.currentMonth();
      mo = new moment(new Date(year, month, 1));
      title = mo.format(me.titleFormat());
      return $('.eba-calendar-title', $root).text(title);
    };

    /**
     *  输出calendar日期的表头
     *  ，['日', '一', '二', '三', '四', '五', '六']
     *  @private
     *  @instance
     *  @memberof       ebaui.web.MainView
     *  @method         _renderHeader
    */


    MainView.prototype._renderHeader = function() {
      var $root, html, me;
      me = this;
      $root = me.uiElement();
      html = me._compiledHeaderTmpl({
        text: me._weeks
      });
      return $('[data-inner-role="header"]', $root).html(html);
    };

    /**
     *  输出calendar的日期
     *  @private
     *  @instance
     *  @memberof       ebaui.web.MainView
     *  @method         _renderWeeks
     *  @param          {Date}      date，当前选中日期
     *  @param          {Number}    year，当前年份
     *  @param          {Number}    month，当前月份
    */


    MainView.prototype._renderWeeks = function() {
      var $root, date, me, month, output, weeks, year;
      me = this;
      $root = me.uiElement();
      date = me.currentDate();
      year = me.currentYear();
      month = me.currentMonth();
      weeks = me._genWeeksData(year, month);
      output = me._compiledWeekTmpl({
        year: year,
        month: month,
        value: [date.getFullYear(), date.getMonth(), date.getDate()],
        weeks: weeks
      });
      $('.eba-calendar-days', $root).remove();
      return $('[data-inner-role="footer"]', $root).before(output);
    };

    /**
     *  只有当timespinner或者是button显示出来的时候，footer才显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _updateFooterCssVisible
    */


    MainView.prototype._updateFooterCssVisible = function() {
      var $btns, $footer, $root, $spn, me, showBtn, showSpn, visible;
      me = this;
      showBtn = me.showButtons();
      showSpn = me.showSpinner();
      visible = showSpn || showBtn;
      $root = me.uiElement();
      $spn = $('[data-inner-role="spinner"]', $root);
      $btns = $('[data-inner-role="buttons"]', $root);
      $footer = $('[data-inner-role="footer"]', $root);
      if (visible) {
        $footer.show();
      } else {
        $footer.hide();
      }
      if (showBtn) {
        $btns.show();
      } else {
        $btns.hide();
      }
      if (showSpn) {
        $spn.show();
      } else {
        $spn.hide();
      }
      return void 0;
    };

    /**
     *  更新UI显示
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _render
    */


    MainView.prototype._render = function() {
      var me;
      MainView.__super__._render.call(this);
      me = this;
      me._renderTitle();
      me._renderHeader();
      me._renderWeeks();
      return me._updateFooterCssVisible();
    };

    /**
     *  对当前月份或者年份，进行递增或者递减的操作
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _doIncrease
    */


    MainView.prototype._doRealStuff = function(prop, incremental) {
      var currDate, currMonth, currYear, me;
      me = this;
      if (!me.enabled()) {
        return;
      }
      if (incremental) {
        ++me[prop];
      } else {
        --me[prop];
      }
      currDate = me.currentDate();
      currYear = me.currentYear();
      currMonth = me.currentMonth();
      me._renderTitle(currYear, currMonth);
      return me._renderWeeks(currDate, currYear, currMonth);
    };

    /**
     *  切换到下一个月
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     nextMonth
    */


    MainView.prototype.nextMonth = function() {
      return this._doRealStuff('_currentMonth', true);
    };

    /**
     *  切换到上一个月
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     nextMonth
    */


    MainView.prototype.prevMonth = function() {
      return this._doRealStuff('_currentMonth', false);
    };

    /**
     *  切换到下一年
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     nextYear
    */


    MainView.prototype.nextYear = function() {
      return this._doRealStuff('_currentYear', true);
    };

    /**
     *  切换到上一年
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     prevYear
    */


    MainView.prototype.prevYear = function() {
      return this._doRealStuff('_currentYear', false);
    };

    /**
     *  选中日期
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     pickUp
     *  @arg        {Date}  date     -   要选中的日期
    */


    MainView.prototype.pickUp = function(date) {
      var me;
      if (date == null) {
        return;
      }
      me = this;
      me.currentDate(date);
      return void 0;
    };

    /**
     *  选中今天
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     pickUpToday
    */


    MainView.prototype.pickUpToday = function() {
      return this.pickUp(new Date);
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _setupEvents
    */


    MainView.prototype._setupEvents = function(opts) {
      var $root, me;
      me = this;
      $root = me.uiElement();
      /*
      *   绑定事件处理程序
      */

      me.onEvent('click', opts['onclick']);
      /*
      *   上一月
      *   下一月
      *   上一年
      *   下一年
      */

      $root.on('click', '.eba-calendar-monthPrev', function(event) {
        return me.prevMonth();
      });
      $root.on('click', '.eba-calendar-monthNext', function(event) {
        return me.nextMonth();
      });
      $root.on('click', '.eba-calendar-yearPrev', function(event) {
        return me.prevYear();
      });
      $root.on('click', '.eba-calendar-yearNext', function(event) {
        return me.nextYear();
      });
      return $root.on('click', '.eba-calendar-date', function(event) {
        /*
        *   日历控件上的日期点击事件触发
        */

        var $this, currMonth, date, mo, selected;
        if (me.enabled()) {
          $this = $(this);
          mo = new moment($this.attr('data-value'), 'YYYY-M-D');
          currMonth = !$this.hasClass('eba-calendar-othermonth');
          /*
          *   显然，你只能选择当前月份的日期
          */

          if (currMonth) {
            selected = mo.toDate();
            date = me.currentDate();
            date.setFullYear(selected.getFullYear());
            date.setMonth(selected.getMonth());
            date.setDate(selected.getDate());
            me.pickUp(date);
            /*
            *   触发click事件
            */

            return me.triggerEvent('click', event);
          }
        }
      });
    };

    /**
     *  初始化控件，声明内部变量
     *  ，在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _init
    */


    MainView.prototype._init = function(opts) {
      var init, me, _ref30, _ref31;
      MainView.__super__._init.call(this, opts);
      me = this;
      /* 
      *   初始化控件自身的一系列属性
      */

      init = opts['currentDate'] ? opts['currentDate'] : new Date();
      me._currentDate = init;
      me._currentYear = init.getFullYear();
      me._currentMonth = init.getMonth();
      me._showSpinner = (_ref30 = opts['showSpinner']) != null ? _ref30 : false;
      me._showButtons = (_ref31 = opts['showButtons']) != null ? _ref31 : false;
      /*
      *   预编译以后要用到的HTML模板
      */

      me._compiledWeekTmpl = me.compileTmpl(me._weekTmpl);
      me._compiledHeaderTmpl = me.compileTmpl(me._headerTmpl);
      return me._height = '100%';
    };

    return MainView;

  })(Control);

  ebaui['web'].registerControl('MainView', MainView);

  /**
  *   @private
  *   @class      MonthView
  *   @classdesc  MonthView，Calendar的month视图，用来切换calendar当前的month以及year
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  */


  MonthView = (function(_super) {
    __extends(MonthView, _super);

    function MonthView() {
      _ref30 = MonthView.__super__.constructor.apply(this, arguments);
      return _ref30;
    }

    MonthView.prototype._monthsTmpl = '';

    /**
     *  已经编译好的日历Week文本HTML模板
     *  ，'日', '一', '二', '三', '四', '五', '六'
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _compiledMonthsTmpl
    */


    MonthView.prototype._compiledMonthsTmpl = $.noop;

    MonthView.prototype._yearsTmpl = '';

    /**
     *  已经编译好的日历Week文本HTML模板
     *  ，'日', '一', '二', '三', '四', '五', '六'
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _compiledYearsTmpl
    */


    MonthView.prototype._compiledYearsTmpl = $.noop;

    /**
     *  月份文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Array}    _months
    */


    MonthView.prototype._months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /**
     *  menu界面，点击月份的时候触发
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _select
     *  @arg        {DOM}       chosen  - 当前点击的dom引用
     *  @arg        {String}    context - css 选择器
    */


    MonthView.prototype._select = function(chosen, context) {
      var $chosen, $context, $root, cls, me;
      me = this;
      $root = me.uiElement();
      $chosen = $(chosen);
      cls = 'eba-calendar-menu-selected';
      /*
      *   如果当前点击的dom已经是选中状态，直接返回
      */

      if ($chosen.hasClass(cls)) {
        return;
      }
      $context = $(context, $root);
      /*
      *   menu界面的月份点击的时候触发
      *   移除上一个选中的项目的选中样式
      */

      $("." + cls, $context).removeClass(cls);
      /*
      *   为当前选中项添加选中样式
      */

      $chosen.addClass(cls);
      return void 0;
    };

    MonthView.prototype._renderMonths = function() {
      var $root, me, output;
      me = this;
      $root = me.uiElement();
      output = me._compiledMonthsTmpl({
        currentMonth: me.currentMonth(),
        months: me._months
      });
      return $('.eba-calendar-menu-months', $root).html(output);
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _renderYearRange
    */


    MonthView.prototype._renderYears = function(range) {
      var $root, currMonth, currYear, me, output, _i, _ref31, _results;
      me = this;
      $root = me._$root;
      currYear = me.currentYear();
      currMonth = me.currentMonth();
      if (!range) {
        range = (function() {
          _results = [];
          for (var _i = currYear, _ref31 = currYear + 9; currYear <= _ref31 ? _i <= _ref31 : _i >= _ref31; currYear <= _ref31 ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
      }
      output = me._compiledYearsTmpl({
        value: [currYear, currMonth, 1],
        years: range
      });
      return $('.eba-calendar-menu-years', $root).html(output);
    };

    /**
     *  更新UI显示
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _render
    */


    MonthView.prototype._render = function() {
      var me;
      me = this;
      me._renderMonths();
      me._renderYears();
      return me._updateCssVisible();
    };

    /**
     *  menu界面，点击上一个十年或者下一个十年的时候触发
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _switchYearRange
     *  @arg        {Number}       start
    */


    MonthView.prototype._switchYearRange = function(start) {
      var me, menuYears;
      me = this;
      start = parseInt(start);
      menuYears = me._getMenuYears(start);
      return me._renderMenu(menuYears, me._currYear, me._currMonth);
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _init
    */


    MonthView.prototype._init = function(opts) {
      var me;
      MonthView.__super__._init.call(this, opts);
      me = this;
      /* 初始化控件自身的一系列属性*/

      me._currentDate = opts['currentDate'] ? opts['currentDate'] : new Date();
      /*
      *   预编译以后要用到的HTML模板
      */

      me._compiledMonthsTmpl = me.compileTmpl(me._monthsTmpl);
      me._compiledYearsTmpl = me.compileTmpl(me._yearsTmpl);
      return me._height = '100%';
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _setupEvents
    */


    MonthView.prototype._setupEvents = function(opts) {
      var $root, cancel, me, month, ok, year;
      me = this;
      $root = me.uiElement();
      me.onEvent('apply', opts['onapply']);
      me.onEvent('cancel', opts['oncancel']);
      year = '.eba-calendar-menu-year';
      month = '.eba-calendar-menu-month';
      ok = '.eba-calendar-okButton';
      cancel = '.eba-calendar-cancelButton';
      $root.on('click', '.eba-calendar-menu-prevYear', function(event) {
        var start;
        start = parseInt($(this).attr('data-value'));
        return me._renderYears(start);
      });
      $root.on('click', '.eba-calendar-menu-nextYear', function(event) {
        var start;
        start = parseInt($(this).attr('data-value'));
        return me._renderYears(start);
      });
      $root.on('click', month, function(event) {
        return me._select(this, '.eba-calendar-menu-months');
      });
      $root.on('click', year, function(event) {
        return me._select(this, '.eba-calendar-menu-years');
      });
      $root.on('click', cancel, function(event) {
        return me.triggerEvent('cancel', event);
      });
      return $root.on('click', ok, function(event) {
        var $month, $year, cls;
        cls = '.eba-calendar-menu-selected';
        /*
        *   更新值
        */

        $month = $(".eba-calendar-menu-months ." + cls, $root);
        $year = $(".eba-calendar-menu-years ." + cls, $root);
        me._currentYear = parseInt($year.attr('data-value'));
        me._currentMonth = parseInt($month.attr('data-value'));
        /*
        *   触发事件
        */

        return me.triggerEvent('apply', event);
      });
    };

    /**
     *  当前显示的年份
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @member     {Number}    currentYear
    */


    MonthView.prototype.currentYear = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._currentDate.getFullYear();
      }
      me._currentDate.setFullYear(val);
      return me._renderYears();
    };

    /**
     *  当前显示的月份
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @member     {Number}    currentMonth
    */


    MonthView.prototype.currentMonth = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._currentDate.getMonth();
      }
      me._currentDate.setMonth(val);
      return me._renderMonths();
    };

    MonthView.prototype._currentDate = null;

    /**
     *  当前选中日期
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @member     {Number}    currentDate
    */


    MonthView.prototype.currentDate = function(val) {
      var me;
      me = this;
      if (!me.isDate(val)) {
        return me._currentDate;
      }
      me._currentDate = val;
      me._renderMonths();
      return me._renderYears();
    };

    return MonthView;

  })(Control);

  ebaui['web'].registerControl('MonthView', MonthView);

  /**
  *   depend on MainView and MonthView
  *   所有原生JS对象的拓展代码，放在了web.coffee文件，
  *   比如Date.prototype.clone
  */


  /**
  *   @class      Calendar
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormElement
  *   @tutorial   calendar_index
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.Calendar( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).calendar( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="calendar" data-options="{}" /&gt;
  */


  Calendar = (function(_super) {
    __extends(Calendar, _super);

    function Calendar() {
      _ref31 = Calendar.__super__.constructor.apply(this, arguments);
      return _ref31;
    }

    Calendar.prototype._timeSpinner = null;

    /**
     *  timespinner控件
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {TimeSpinner}    timeSpinner
    */


    Calendar.prototype.timeSpinner = function() {
      return this._timeSpinner;
    };

    Calendar.prototype._todayButtonText = 'Today';

    Calendar.prototype._todayButton = null;

    /**
     *  选择今天按钮
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Button}    todayButton
    */


    Calendar.prototype.todayButton = function() {
      return this._todayButton;
    };

    Calendar.prototype._applyButtonText = 'Done';

    Calendar.prototype._applyButton = null;

    /**
     *  确定按钮
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Button}    applyButton
    */


    Calendar.prototype.applyButton = function() {
      return this._applyButton;
    };

    /**
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Object}    _rootCls
    */


    Calendar.prototype._rootCls = {
      disabled: 'eba-calendar-disabled',
      selected: 'eba-calendar-selected'
    };

    /**
     *  通过代码设置calendar.value属性的时候，如果传入错误的日期，抛出的异常提示信息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {String}    _formatInvalidException
    */


    Calendar.prototype._formatInvalidException = 'The date is invalid, please input a valid date!';

    /**
     *  更新控件enabled的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _updateCssEnabled
    */


    Calendar.prototype._updateCssEnabled = function() {
      var $root, cls, me;
      me = this;
      $root = me._$root;
      cls = me._rootCls['disabled'];
      if (me.enabled()) {
        return $root.removeClass(cls);
      } else {
        return $root.addClass(cls);
      }
    };

    Calendar.prototype._showButtons = false;

    /**
     *  是否显示按钮，目前只要显示两个按钮：今天 和 确定 按钮即可
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Boolean}    showButtons
    */


    Calendar.prototype.showButtons = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._showButtons;
      }
      me._showButtons = val;
      me._mainView.showButtons(val);
      if (!me._todayButton) {
        return me._initButtons();
      }
    };

    Calendar.prototype._showSpinner = false;

    /**
     *  是否显示timeSpinner
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Boolean}    showSpinner
    */


    Calendar.prototype.showSpinner = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._showSpinner;
      }
      me._showSpinner = val;
      me._mainView.showSpinner(val);
      /*
      *   当启用timeSpinner,并且还没有初始化的时候
      *   初始化timeSpinner
      */

      if ((me._timeSpinner == null) && val) {
        return me._initSpinner();
      }
    };

    /**
     *  获取或者设置控件是否可用
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Boolean}   enabled
     *  @default    true
     *  @example    <caption>get</caption>
     *      //  true
     *      console.log( ctrl.enabled() );
     *  @example    <caption>set</caption>
     *      //  disable control
     *      ctrl.enabled( false )
    */


    Calendar.prototype.enabled = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._enabled;
      }
      me._enabled = val;
      me._mainView.enabled(val);
      me._monthView.enabled(val);
      return me._updateCssEnabled();
    };

    Calendar.prototype._toggled = true;

    /**
     *  显示或者隐藏  年份月份选择  界面
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _toggleViews
    */


    Calendar.prototype._toggleViews = function() {
      var main, me, month, toggled;
      me = this;
      main = me._mainView;
      month = me._monthView;
      toggled = me._toggled;
      if (toggled) {
        main.visible(false);
        month.visible(true);
      } else {
        main.visible(true);
        month.visible(false);
      }
      return me._toggled = !toggled;
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _setupEvents
    */


    Calendar.prototype._setupEvents = function(opts) {
      var $root, mainView, me, monthView;
      me = this;
      $root = me.uiElement();
      /*
      *   绑定事件处理程序
      */

      me.onEvent('click', opts['onclick']);
      $root.on('click', '.eba-calendar-header', function(eventArgs) {
        return me._toggleViews();
      });
      mainView = me._mainView;
      monthView = me._monthView;
      /*
      *
      */

      mainView.onEvent('click', function(sender, eventArgs) {
        var val;
        val = sender.currentDate().clone();
        return me._setValue(val, true, eventArgs);
      });
      /*
      *
      */

      monthView.onEvent('apply', function(sender) {
        var date;
        date = me.value().clone();
        date.setFullYear(sender.currentYear());
        date.setMonth(sender.currentMonth());
        date.setDate(1);
        /*
        *   更新主视图数据
        */

        mainView.currentDate(date);
        return me._toggleViews();
      });
      return monthView.onEvent('cancel', function(sender) {
        var date;
        date = me.value().clone();
        /*
        *   回滚month的数据
        */

        monthView.currentDate(date);
        return me._toggleViews();
      });
    };

    /**
     *  初始化timeSpinner控件
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _initSpinner
    */


    Calendar.prototype._initSpinner = function() {
      var $context, $el, $viewRoot, me, ns, spn;
      me = this;
      ns = ebaui['web'];
      $viewRoot = me._mainView.uiElement();
      $context = $('[data-inner-role="spinner"]', $viewRoot);
      $el = $('input', $context);
      spn = new ns.TimeSpinner($el, {
        'position': '',
        'width': 120,
        'value': me.value().clone()
      });
      spn.onEvent('change', function(sender, eventArgs) {
        var calValue, spnValue;
        spnValue = spn.value();
        calValue = me.value().clone();
        calValue.setHours(spnValue.getHours());
        calValue.setMinutes(spnValue.getMinutes());
        /*
        *   update control's vlaue
        *   include mainView, monthView, timeSpinner
        */

        return me._setValue(calValue, true, eventArgs);
      });
      return me._timeSpinner = spn;
    };

    /**
     *  初始化button控件
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _initButtons
    */


    Calendar.prototype._initButtons = function() {
      var $context, $el, $viewRoot, applyButton, main, me, ns, todayButton;
      me = this;
      ns = ebaui['web'];
      main = me._mainView;
      $viewRoot = main.uiElement();
      $context = $('[data-inner-role="buttons"]', $viewRoot);
      $el = $('[data-inner-role="today"]', $context);
      todayButton = new ns.Button($el, {
        text: me._todayButtonText
      });
      $el = $('[data-inner-role="apply"]', $context);
      applyButton = new ns.Button($el, {
        text: me._applyButtonText
      });
      /*
      *   today按钮点击的时候，mainView只是选中了今天
      */

      todayButton.onEvent('click', function(button, eventArgs) {
        main.pickUpToday();
        return me._setValue(main.currentDate(), true, eventArgs);
      });
      /*
      *   apply按钮点击的时候，选中mainview中选中的日期
      */

      applyButton.onEvent('click', function(button, eventArgs) {});
      me._todayButton = todayButton;
      return me._applyButton = applyButton;
    };

    /**
     *  初始化控件，声明内部变量
     *  ，在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _init
    */


    Calendar.prototype._init = function(opts) {
      var $root, initVal, mainConfig, me, mo, monthConfig, ns, _ref32, _ref33, _ref34, _ref35;
      Calendar.__super__._init.call(this, opts);
      me = this;
      $root = me.uiElement();
      /* 
      *   初始化控件自身的一系列属性  
      *   默认情况下
      *   calendar主界面是不会显示底部的按钮和time spinner的
      */

      me._width = (_ref32 = opts['width']) != null ? _ref32 : 220;
      me._height = (_ref33 = opts['height']) != null ? _ref33 : 0;
      me._showSpinner = (_ref34 = opts['showSpinner']) != null ? _ref34 : false;
      me._showButtons = (_ref35 = opts['showButtons']) != null ? _ref35 : false;
      /*
      *   当opts['value'] == null的时候
      *   new moment( opts['value'] )会返回一个空对象:{}
      *   这个空对象没有任何属性和方法
      */

      mo = new moment(opts['value']);
      initVal = (opts['value'] != null) && mo.isValid() ? mo.toDate() : new Date;
      ns = ebaui['web'];
      mainConfig = {
        currentDate: initVal.clone(),
        position: '',
        showSpinner: me._showSpinner,
        showButtons: me._showButtons
      };
      monthConfig = {
        position: '',
        currentDate: initVal.clone(),
        visible: false
      };
      me._mainView = new ns.MainView($('[data-inner-role="mainview"]', $root), mainConfig);
      me._monthView = new ns.MonthView($('[data-inner-role="monthview"]', $root), monthConfig);
      /* 
      *   决定是否初始化timeSpinner或者是Buttons
      */

      if (me._showSpinner) {
        me._initSpinner(opts);
      }
      if (me._showButtons) {
        me._initButtons(opts);
      }
      /* 
      *   设置控件初始值
      */

      me._value = initVal;
      me._currYear = initVal.getFullYear();
      return me._currMonth = initVal.getMonth();
    };

    /**
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _setValue
     *  @arg        {String}     val    -   控件的值
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    */


    Calendar.prototype._setValue = function(val, dispatchEvent, eventArgs) {
      var me, mo;
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      mo = new moment(val);
      if (!mo.isValid()) {
        throw me._formatInvalidException;
      }
      /*
      *   update subcontrol's vlaue
      *   include mainView, monthView, timeSpinner
      */

      val = mo.toDate();
      /* 
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      if (me._value && me._value.getTime() === val.getTime()) {
        return;
      }
      me._value = val.clone();
      me._mainView.currentDate(val.clone());
      me._monthView.currentDate(val.clone());
      if (me.showSpinner()) {
        me._timeSpinner.value(val.clone());
      }
      if (dispatchEvent === true) {
        me.triggerEvent('change', eventArgs);
      }
      return void 0;
    };

    /**
     *  访问和设置calendar的值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Date}        data
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( new Date );
    */


    Calendar.prototype.data = function(val) {
      var me;
      me = this;
      if (!val) {
        return me._value;
      }
      return me._setValue(val);
    };

    /**
     *  访问和设置calendar的值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Date}     value
     *  @example    <caption>get</caption>
     *      pair = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( new Date );
    */


    Calendar.prototype.value = function(val) {
      var me;
      me = this;
      if (!val) {
        return me._value;
      }
      return me._setValue(val);
    };

    Calendar.prototype.reset = function() {
      var me;
      Calendar.__super__.reset.call(this);
      me = this;
      /*
      *   我认为以后可以尝试加入一个新特性，就是reset直接充值到初始化状态
      *   而不是new Date这样
      *   因为初始的值是有可能其他值
      */

      return me.value(new Date());
    };

    return Calendar;

  })(FormField);

  ebaui['web'].registerFormControl('Calendar', Calendar);

  /**
   *  @class      DateTimePicker 
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Combo
   *  @tutorial   datetimepicker_index
   *  @param      {Object}    element     -   dom对象
   *  @param      {Object}    options     -   控件配置参数
   *  @example
   *      //  初始化方式一
   *      var ns = ebaui.web;
   *      var btn = new ns.DateTimePicker( $( '' ),{ title:'',id:'',name:'' } );
   *      //  初始化方式二
   *      $( '' ).datetimepicker( { title:'',id:'',name:'' } )
   *      //  初始化方式三
   *      &lt;input id="" title="" name="" data-role="datetimepicker" data-options="{}" /&gt;
  */


  DateTimePicker = (function(_super) {
    __extends(DateTimePicker, _super);

    function DateTimePicker() {
      _ref32 = DateTimePicker.__super__.constructor.apply(this, arguments);
      return _ref32;
    }

    DateTimePicker.prototype._showSpinner = false;

    /**
     *  是否显示timeSpinner
     *  @public
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @member     {Boolean}    showSpinner
    */


    DateTimePicker.prototype.showSpinner = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._showSpinner;
      }
      me._showSpinner = val;
      return me._panelContent.showSpinner(val);
    };

    DateTimePicker.prototype._showButtons = true;

    /**
     *  是否显示按钮，目前只要显示两个按钮：今天 和 确定 按钮即可
     *  @public
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @member     {Boolean}    showButtons
    */


    DateTimePicker.prototype.showButtons = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._showButtons;
      }
      me._showButtons = val;
      return me._panelContent.showButtons(val);
    };

    DateTimePicker.prototype._format = 'YYYY-MM-DD HH:mm';

    /**
     *  日期时间格式化字符串，参考momengjs的官方文档 http://momentjs.com/docs/
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


    DateTimePicker.prototype.format = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._format;
      }
      me._format = val;
      /*
      *   _text是从buttonEdit继承下来的属性
      *   _updateAttrText是从buttonEdit继承下来的方法
      */

      me._text = mo.format(val);
      return me._updateAttrText();
    };

    /**
     *  通过代码设置calendar.value属性的时候，如果传入错误的日期，抛出的异常提示信息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @member     {String}    _formatInvalidException
    */


    DateTimePicker.prototype._formatInvalidException = 'The date is invalid, please input a valid date!';

    /**
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @method     _setValue
     *  @arg        {String}     val    -   控件的值
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    */


    DateTimePicker.prototype._setValue = function(val, updateHtml, updatePopup, dispatchEvent, eventArgs) {
      var me, mo;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (updatePopup == null) {
        updatePopup = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      mo = new moment(val);
      if (!mo.isValid()) {
        throw me._formatInvalidException;
      }
      /* 
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      if (me._value && val.getTime() === me._value.getTime()) {
        return;
      }
      me._value = val;
      /*
      *   update sub control's value
      */

      if (updatePopup === true) {
        me._panelContent.value(val.clone());
      }
      /*
      *   update text
      *   _text是从buttonEdit继承下来的属性
      *   _updateAttrText是从buttonEdit继承下来的方法
      */

      me._text = mo.format(me.format());
      if (updateHtml === true) {
        me._updateAttrText();
      }
      /*
      *   trigger 'onchange' event
      */

      if (dispatchEvent === true) {
        return me.triggerEvent('change', eventArgs);
      }
    };

    /**
     *  创建并且初始化下拉菜单的listbox
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @method     _initPanelContent
    */


    DateTimePicker.prototype._initPanelContent = function() {
      var $panel, cal, me, ns, panel, showButtons, showSpinner;
      me = this;
      ns = ebaui.web;
      panel = me._panel;
      $panel = panel.uiElement();
      showSpinner = me.showSpinner();
      showButtons = me.showButtons();
      cal = new ns.Calendar($('input', $panel), {
        'width': 260,
        'value': me.value().clone(),
        'showSpinner': showSpinner,
        'showButtons': showButtons,
        'position': ''
      });
      cal.onEvent('change', function(sender, eventArgs) {
        /**
        *   _setValue方法参数
        *       val,
        *       updateHtml = true,
        *       updatePopup = true, 
        *       dispatchEvent = false, 
        *       eventArgs = {}
        */

        var val;
        val = sender.value().clone();
        return me._setValue(val, true, false, true, eventArgs);
      });
      cal._todayButton.onEvent('click', function(sender, eventArgs) {
        return panel.close();
      });
      cal._applyButton.onEvent('click', function(sender, eventArgs) {
        return panel.close();
      });
      return me._panelContent = cal;
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @method     _setupEvents
    */


    DateTimePicker.prototype._setupEvents = function(opts) {
      var me;
      DateTimePicker.__super__._setupEvents.call(this, opts);
      me = this;
      return me.onEvent('change', opts['onchange']);
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @method     _initControl
    */


    DateTimePicker.prototype._init = function(opts) {
      var initVal, me, mo;
      DateTimePicker.__super__._init.call(this, opts);
      me = this;
      /*
      *  初始化控件自身的一系列属性
      */

      mo = new moment(opts['value']);
      initVal = (opts['value'] != null) && mo.isValid() ? mo.toDate() : new Date;
      me._value = initVal;
      if (opts['format'] != null) {
        me._format = opts['format'];
      }
      if (opts['showSpinner'] != null) {
        me._showSpinner = opts['showSpinner'];
      }
      if (opts['showButtons'] != null) {
        me._showButtons = opts['showButtons'];
      }
      mo = new moment(initVal);
      me._text = mo.format(me._format);
      /*
      *   创建下拉菜单，并且进行初始化，设置数据源等
      */

      me._initPanel();
      return me._initPanelContent();
    };

    DateTimePicker.prototype.reset = function() {
      DateTimePicker.__super__.reset.call(this);
      return this.value(new Date());
    };

    return DateTimePicker;

  })(Combo);

  ebaui['web'].registerFormControl('DateTimePicker', DateTimePicker);

  /**
  *   @class      FileUploader
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.FormField
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.FileUploader( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).fileuploader( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="fileuploader" data-options="{}" /&gt;
  */


  FileUploader = (function(_super) {
    __extends(FileUploader, _super);

    function FileUploader() {
      _ref33 = FileUploader.__super__.constructor.apply(this, arguments);
      return _ref33;
    }

    /**
     *  内部上传控件实例
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {SWFUpload}    _uploader
    */


    FileUploader.prototype._uploader = null;

    /**
     *  uploadUrl是必须有值的属性，如果该属性为空，抛出此异常
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    _uploadUrlEmptyException
    */


    FileUploader.prototype._uploadUrlEmptyException = 'the uploadUrl property can not be null or empty!';

    /**
     *  更新UI的按钮文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     _updateAttrBtnText
    */


    FileUploader.prototype._updateAttrBtnText = function() {
      var $root, me, txt;
      me = this;
      txt = me.buttonText();
      $root = me.uiElement();
      return $('.eba-buttonedit-button', $root).text(txt);
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     _render
    */


    FileUploader.prototype._render = function() {
      FileUploader.__super__._render.call(this);
      return this._updateAttrBtnText();
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _setupEvents
    */


    FileUploader.prototype._setupEvents = function(opts) {
      var me;
      me = this;
      me.onEvent('start', opts['onstart']);
      me.onEvent('progress', opts['onprogress']);
      me.onEvent('error', opts['onerror']);
      me.onEvent('succ', opts['onsucc']);
      return me.onEvent('complete', opts['oncomplete']);
    };

    /**
     *  返回swfUploader的事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     _getEvtHandlers
    */


    FileUploader.prototype._getEvtHandlers = function() {
      var evtHandles, me, uper;
      me = this;
      uper = me._uploader;
      /**
      fileinfo = {
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

      evtHandles = {
        upload_start_handler: function(fileinfo) {
          uper.setButtonDisabled(true);
          return me.triggerEvent('start', {
            'file': fileinfo
          });
        },
        upload_progress_handler: function(fileinfo, complete, total) {
          return me.triggerEvent('progress', {
            'file': fileinfo,
            'bytesComplete': complete,
            'totalBytes': total
          });
        },
        upload_error_handler: function(fileinfo, errorCode, message) {
          uper.setButtonDisabled(false);
          return me.triggerEvent('error', {
            'file': fileinfo,
            'errorMsg': message
          });
        },
        upload_success_handler: function(fileinfo, data, response) {
          uper.setButtonDisabled(false);
          return me.triggerEvent('succ', {
            'file': fileinfo,
            'serverData': data,
            'serverResponse': response
          });
        },
        upload_complete_handler: function(fileinfo) {
          return me.triggerEvent('complete', {
            'file': fileinfo
          });
        },
        file_dialog_start_handler: function() {
          return uper.cancelQueue();
        },
        file_queued_handler: function(fileinfo) {
          return me._$formInput.val(fileinfo.name);
        },
        file_queue_error_handler: function(fileinfo, errorCode, message) {
          switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
              break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
              break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
              break;
            case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
          }
        },
        file_dialog_complete_handler: function(fileSelectedCount, fileQueuedCount, fileQueueLength) {
          if (me.uploadOnSelect()) {
            return uper.startUpload();
          }
        }
      };
      return evtHandles;
    };

    FileUploader.prototype._swf = {
      use_query_string: false,
      requeue_on_error: true,
      http_success: [201, 202],
      assume_success_timeout: 0,
      file_types_description: "",
      debug: false,
      debug_handler: $.noop,
      prevent_swf_caching: false,
      preserve_relative_urls: false,
      button_text: '',
      button_image_url: '',
      button_text: '',
      button_text_style: '',
      button_text_left_padding: 3,
      button_text_top_padding: 2,
      button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES,
      button_disabled: false,
      button_cursor: SWFUpload.CURSOR.HAND,
      button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     _init
    */


    FileUploader.prototype._init = function(opts) {
      var $root, $swp, btnID, customer, evtHandles, libBaseUrl, me, name, offset, settings, swpHtml, uper, value, _ref34, _ref35, _ref36, _ref37, _ref38, _ref39, _ref40, _ref41, _results;
      me = this;
      /**
      *   初始化控件自身的一系列属性
      */

      me._uploadUrl = (_ref34 = opts['uploadUrl']) != null ? _ref34 : '';
      if (!me._uploadUrl) {
        throw me._uploadUrlEmptyException;
      }
      FileUploader.__super__._init.call(this, opts);
      $root = me.uiElement();
      libBaseUrl = ebaui['web'].baseUrl;
      /**
      *   初始化控件自身的一系列属性
      */

      me._width = (_ref35 = opts['width']) != null ? _ref35 : 150;
      me._height = (_ref36 = opts['height']) != null ? _ref36 : 21;
      me._extraParams = (_ref37 = opts['extraParams']) != null ? _ref37 : {};
      me._fileType = (_ref38 = opts['fileType']) != null ? _ref38 : '*.jpg;*.gif;*.png';
      me._fileSizeLimit = (_ref39 = opts['fileSizeLimit']) != null ? _ref39 : '10MB';
      me._filePostName = (_ref40 = opts['filePostName']) != null ? _ref40 : 'ebauiUploadedFiles';
      if (opts['buttonText']) {
        me._buttonText = opts['buttonText'];
      }
      me._$formInput = $('input', $root);
      btnID = me.controlID() + '$span';
      offset = $root.offset();
      swpHtml = "<div><span id=\"" + btnID + "\" \n        style=\"position:'absolute';\n                top:" + offset.top + "px;\n                left:" + offset.left + "px;\n                width:" + ($root.width()) + "px;\n                height:" + ($root.height()) + "px;\"></span>\n</div>";
      $swp = $(swpHtml).appendTo(document.body);
      customer = {
        button_placeholder_id: btnID,
        flash_url: "" + libBaseUrl + "lib/SWFUpload/Flash/swfupload.swf",
        post_params: me.extraParams(),
        file_post_name: me._filePostName,
        file_types: me._fileType,
        file_size_limit: me._fileSizeLimit,
        upload_url: me._uploadUrl,
        file_queue_limit: 0,
        file_upload_limit: 0,
        button_width: '100%',
        button_height: '100%'
      };
      evtHandles = me._getEvtHandlers();
      settings = $.extend(me._swf, customer, evtHandles);
      uper = me._uploader = new SWFUpload(settings);
      _ref41 = me._extraParams;
      _results = [];
      for (name in _ref41) {
        value = _ref41[name];
        _results.push(uper.addPostParam(name, value));
      }
      return _results;
    };

    /**
     *  开始上传文件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     startUpload
     *  @param      {Object}    file
    */


    FileUploader.prototype.startUpload = function(file) {
      var uper;
      uper = this._uploader;
      if (uper) {
        return uper.startUpload(file);
      }
    };

    /**
     *  添加POST提交的参数
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     addPostParam
     *  @param      {String}    name
     *  @param      {String}    value
    */


    FileUploader.prototype.addPostParam = function(name, value) {
      var uper;
      uper = this._uploader;
      if (uper && name && value) {
        return uper.addPostParam(name, value);
      }
    };

    FileUploader.prototype._uploadUrl = '';

    /**
     *  服务端上传文件处理地址
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    uploadUrl
    */


    FileUploader.prototype.uploadUrl = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._uploadUrl;
      }
      return me._uploadUrl = val;
    };

    FileUploader.prototype._buttonText = '浏览...';

    /**
     *  按钮的文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    buttonText
    */


    FileUploader.prototype.buttonText = function(val) {
      var me, uper;
      me = this;
      if (!me.isString(val)) {
        return me._buttonText;
      }
      me._buttonText = val;
      me._updateAttrBtnText();
      uper = me._uploader;
      if (uper) {
        return uper.setButtonText(val);
      }
    };

    FileUploader.prototype._uploadOnSelect = false;

    /**
     *  文件选择后即上传
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {Boolean}    uploadOnSelect
    */


    FileUploader.prototype.uploadOnSelect = function(val) {
      var me;
      me = this;
      if (!me.isBoolean(val)) {
        return me._uploadOnSelect;
      }
      return me._uploadOnSelect = val;
    };

    FileUploader.prototype._fileType = '*.jpg;*.gif;*.png';

    /**
     *  允许上传的文件类型,使用";"分割，默认只允许上传图片
     *  @private
     *  @instance
     *  @default    '*.jpg;*.gif;*.png'
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    fileType
    */


    FileUploader.prototype.fileType = function(val) {
      var me, uper;
      me = this;
      if (!me.isString(val)) {
        return me._fileType;
      }
      me._fileType = val;
      uper = me._uploader;
      if (uper) {
        return uper.setFileTypes(val);
      }
    };

    FileUploader.prototype._fileSizeLimit = '10MB';

    /**
     *  上传文件大小限制，默认文件大小上限是10MB
     *  @private
     *  @instance
     *  @default    '10MB'
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    fileSizeLimit
    */


    FileUploader.prototype.fileSizeLimit = function(val) {
      var me, uper;
      me = this;
      if (!me.isString(val)) {
        return me._fileSizeLimit;
      }
      me._fileSizeLimit = val;
      uper = me._uploader;
      if (uper) {
        return uper.setFileSizeLimit(val);
      }
    };

    FileUploader.prototype._filePostName = 'ebauiUploadedFiles';

    /**
     *  文件提交到服务端的时候，post的key值，比如在asp.net你可以使用Request.Files[filePostName]进行访问
     *  @private
     *  @instance
     *  @default    'ebauiUploadedFiles'
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    fileSizeLimit
    */


    FileUploader.prototype.filePostName = function(val) {
      var me, uper;
      me = this;
      if (!me.isString(val)) {
        return me._filePostName;
      }
      me._filePostName = val;
      uper = me._uploader;
      if (uper) {
        return uper.setFilePostName(val);
      }
    };

    FileUploader.prototype._extraParams = {};

    /**
     *  通过POST额外上传到服务器的参数
     *  @private
     *  @instance
     *  @default    {}
     *  @memberof   ebaui.web.FileUploader
     *  @member     {Object}    extraParams
    */


    FileUploader.prototype.extraParams = function(val) {
      var me, name, old, uper, value;
      me = this;
      if (val == null) {
        return me._extraParams;
      }
      /**
      *   This applies to all future files that are queued. 
      *   The file_size_limit parameter will accept a unit. 
      *   Valid units are B, KB, MB, and GB. The default unit is KB.
      */

      uper = me._uploader;
      old = me._extraParams;
      if (uper) {
        if (old) {
          for (name in old) {
            value = old[name];
            uper.removePostParam(name);
          }
        }
        if (val) {
          for (name in val) {
            value = val[name];
            uper.addPostParam(name, value);
          }
        }
      }
      return me._extraParams = val;
    };

    return FileUploader;

  })(FormField);

  ebaui['web'].registerFormControl('FileUploader', FileUploader);

  ns = ebaui;

  vexDialog = vex.dialog;

  /**
   *  文档请参考 http://api.jquery.com/jQuery.ajax/
   *  @static
   *  @method     ajax
   *  @memberof   ebaui
  */


  ns['ajax'] = jQuery.ajax;

  /**
   *  文档请参考 http://api.jquery.com/jQuery.get/
   *  @static
   *  @method     httpGet
   *  @memberof   ebaui
  */


  ns['httpGet'] = jQuery.get;

  /**
   *  http://api.jquery.com/jQuery.post/
   *  @static
   *  @method     httpPost
   *  @memberof   ebaui
  */


  ns['httpPost'] = jQuery.post;

  /**
   *  给指定的HTML元素设置遮罩
   *  @static
   *  @method     mask
   *  @memberof   ebaui
   *  @param      {Object}    selector           -   必选，jquery 选择器
   *  @param      {String}    [label='']         -   可选，遮罩层的文本信息
   *  @param      {Number}    [delay=null]       -   可选，在HTML元素打上遮罩之前的延迟时间
   *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
  */


  ns['mask'] = function(selector, label, delay, context) {
    label = !label ? '' : label;
    return $(selector, context).mask(label, delay);
  };

  /**
   *  取消指定HTML元素上的遮罩
   *  @static
   *  @method     unmask
   *  @memberof   ebaui
   *  @param      {Object}    selector           -   必选，jquery 选择器
   *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
  */


  ns['unmask'] = function(selector, context) {
    return $(selector, context).unmask();
  };

  /**
   *  判断指定的HTML元素是否有遮罩
   *  @static
   *  @method     isMasked
   *  @memberof   ebaui
   *  @param      {Object}    selector           -   必选，jquery 选择器
   *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
  */


  ns['isMasked'] = function(selector, context) {
    return $(selector, context).isMasked();
  };

  /**
   *  alert对话框
   *  @static
   *  @method     alert
   *  @memberof   ebaui
   *  @param      {String}        message        -   alert的提示消息
   *  @example
   *    ebaui.alert( 'alert message' )
  */


  ns['alert'] = function(msg) {
    return vexDialog.alert({
      title: '提示',
      iconCls: 'icon-warning-sign',
      className: 'vex-theme-default',
      message: msg
    });
  };

  /**
   *  confirm对话框
   *  @static
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


  ns['confirm'] = function(opts) {
    var vexOpts;
    vexOpts = $.extend({}, {
      title: '确认',
      iconCls: 'icon-question-sign',
      className: 'vex-theme-default',
      buttons: [vexDialog.buttons.NO, vexDialog.buttons.YES]
    }, opts);
    return vexDialog.confirm(vexOpts);
  };

  /**
   *  prompt对话框
   *  @static
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


  ns['prompt'] = function(opts) {
    opts = $.extend({}, {
      title: '提示',
      className: 'vex-theme-default',
      buttons: [vexDialog.buttons.NO, vexDialog.buttons.YES]
    }, opts);
    return vexDialog.prompt(opts);
  };

  /**
   *  打开一个新的窗口
   *  @static
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
   *          title  : 'baidu',
   *          width  : 400
   *          height : 300
   *      });
  */


  ns['win'] = function(opts) {
    var $vex, $vexContent, defaults, html, iframe, wrapper;
    if (!opts) {
      return;
    }
    if (!opts['url'] || opts['content']) {
      return;
    }
    iframe = opts['url'] ? true : false;
    if (iframe) {
      html = "<iframe src=\"" + opts['url'] + "\" style=\"width:100%;\" frameborder=\"0\" scrolling=\"auto\"></iframe>";
    } else {
      html = $(opts['content']).html();
    }
    wrapper = "<div class=\"vex-dialog-form\" style=\"height:100%;\">\n    <div class=\"vex-dialog-title\">\n        <i class=\"" + opts['iconCls'] + "\"></i>" + opts['title'] + "\n    </div>\n    <div class=\"vex-c\"></div>\n    <div class=\"vex-close\"></div>\n</div>";
    defaults = {
      title: '',
      content: wrapper,
      width: 800,
      height: 600,
      className: 'vex-theme-default',
      showCloseButton: true,
      overlayClosesOnClick: false,
      id: 'dialog-win-draggable',
      beforeclose: $.noop,
      afterclose: $.noop
    };
    opts = $.extend(defaults, opts);
    $vexContent = vex.open(opts);
    $vex = $vexContent.parent();
    $vex.css({
      'padding-top': '50px',
      'padding-bottom': '0'
    });
    $vexContent.css({
      'left': $(window).width() * 0.5 - opts['width'] * 0.5,
      'position': 'absolute',
      'border': '1px #eee solid',
      'width': opts['width'],
      'height': opts['height']
    });
    $("#" + defaults.id).draggable({
      cursor: "move",
      distance: 10,
      containment: 'window',
      iframeFix: true,
      start: function() {
        return $(this).hide();
      },
      helper: function() {
        return '<div style="width:' + opts['width'] + 'px;height:' + opts['height'] + 'px;z-index:' + 1001 + ';background:black;opacity:0.4;"></div>';
      },
      stop: function(event, ui) {
        $(this).css({
          'top': ui.position.top,
          'left': ui.position.left
        });
        return $(this).show();
      }
    });
    /**
    * 优化性能
    * 首先先打开dialog
    * 然后在更新dialog content（ content有可能就是一个iframe ）
    */

    return setTimeout(function() {
      var titleH;
      $('div.vex-c', $vex).replaceWith(html);
      if (iframe) {
        titleH = $('.vex-dialog-title', $vexContent).outerHeight();
        return $('iframe', $vexContent).css('height', $vexContent.height() - titleH);
      }
    }, 100);
  };

  /**
   *  @class      ComboBox 
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Combo
   *  @param      {Object}    element     -   dom对象
   *  @param      {Object}    options     -   控件配置参数
   *  @example
   *      valueField默认值:value
   *      valueField默认值:text
   *      filterField默认值:text
   *
   *      data-options={
   *          text       : '',
   *          value      : null,
   *          idField    : 'id',
   *          textField  : 'text',
   *          filterField: 'text',
   *          valueField : 'value',
   *          dataSource : '' ,
   *          onchange   : $.noop
   *      }
   *
   *       //  初始化方式一
   *       var ns = ebaui.web;
   *       var btn = new ns.ComboBox( $( '' ),{ title:'',id:'',name:'' } );
   *       //  初始化方式二
   *       $( '' ).combobox( { title:'',id:'',name:'' } )
   *       //  初始化方式三
   *       &lt;input id="" title="" name="" data-role="combobox" data-options="{}" /&gt;
  */


  ComboBox = (function(_super) {
    __extends(ComboBox, _super);

    function ComboBox() {
      _ref34 = ComboBox.__super__.constructor.apply(this, arguments);
      return _ref34;
    }

    /**
     *  下拉菜单包含的控件对象，Combobox中就是一个ListBox
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     _panelContent
    */


    ComboBox.prototype._panelContent = null;

    /**
     *  创建并且初始化下拉菜单的listbox
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _initPanelContent
    */


    ComboBox.prototype._initPanelContent = function() {
      var $panel, listbox, me, panel;
      me = this;
      ns = ebaui.web;
      panel = me._panel;
      $panel = panel.uiElement();
      /*
      *   width     : me.width() - 24
      *   是因为我们每个控件都有24px的icon
      */

      listbox = new ns.ListBox($('input', $panel), {
        position: null,
        width: me.width() - 24,
        height: 0,
        idField: me.idField(),
        textField: me.textField(),
        valueField: me.valueField(),
        dataSource: [],
        onitemclick: function(sender, event) {
          var selected;
          selected = sender.selectedItems();
          /*
          *   data方法参数
          *       val,
          *       updateHtml = true,
          *       updatePopup = true, 
          *       dispatchEvent = false, 
          *       eventArgs = {}
          */

          me.data(selected, true, false, true, event);
          /*
          *   如果是单选的情况
          *   那么在选中其中的一个项目之后
          *   就把下拉菜单收起来
          */

          return panel.close();
        }
      });
      return me._panelContent = listbox;
    };

    /**
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _finishLoading
    */


    ComboBox.prototype._finishLoading = function() {
      var listbox, me;
      me = this;
      listbox = me._panelContent;
      listbox.dataSource(me.items());
      return me._reposition();
    };

    /**
     *  加载combobox的数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _loadData
     *  @arg        {String}    txt             -   筛选下拉菜单数据的关键字
     *  @arg        {Boolean}   initRender      -   本次加载数据的过程，是否是发生在初始化输出的时候
    */


    ComboBox.prototype._loadData = function(txt, initRender) {
      var dataItems, dataSource, filterField, i, include, isRemoteSource, item, me, postData, remote, updateInitVal, _i, _len, _ref35;
      if (initRender == null) {
        initRender = false;
      }
      /*
      *   combobox目前只能单选
      *   多选的话，还是启用其他的控件吧
      *   这样会比较东西会比较容易实现
      */

      me = this;
      dataSource = me.dataSource();
      postData = (_ref35 = dataSource.data) != null ? _ref35 : {};
      include = me.filter();
      filterField = me.filterField();
      isRemoteSource = me.isUsingRemoteData(dataSource);
      /*
      *   如果是初始化输出，并且这个时候控件已经有值了
      *   那么在输出的时候要更新控件的值，并且正确更新下拉菜单的值
      */

      updateInitVal = function(initRender, panelData) {
        var index, initVal, item, txtField, valField, _i, _len, _results;
        if (!initRender) {
          return;
        }
        initVal = me.value();
        if (initVal != null) {
          txtField = me.textField();
          valField = me.valueField();
          _results = [];
          for (index = _i = 0, _len = panelData.length; _i < _len; index = ++_i) {
            item = panelData[index];
            if (item[valField] === initVal) {
              me._text = item[txtField];
              me._data = item;
              me._updateAttrText();
              /*
              *   更新下拉菜单的值
              */

              me._panelContent.data(item);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };
      me._items = [];
      if (isRemoteSource) {
        /*
        *   加载远程数据
        */

        remote = dataSource.url;
        postData = me.isFunc(postData) ? postData() : postData != null ? postData : {};
        if (txt) {
          postData[filterField] = txt;
        }
        me._beforeLoading();
        $.post(remote, postData, function(serverData, textStatus, jqXHR) {
          me._items = serverData;
          me._finishLoading();
          /*
          *   更新控件的初始化的值
          */

          return updateInitVal(initRender, serverData);
        }, 'json');
      } else {
        /*
        *   加载本地数据
        */

        me._beforeLoading();
        /*
        *   获取下拉菜单的数据
        */

        if (txt) {
          /*
          *   如果已经初始值，那么要先进行过滤
          */

          dataItems = [];
          for (i = _i = 0, _len = dataSource.length; _i < _len; i = ++_i) {
            item = dataSource[i];
            if (include(item, txt, filterField)) {
              dataItems.push(item);
            }
          }
          me._items = dataItems;
        } else {
          /*
          *   如果初始值为空，那么不进行过滤
          */

          me._items = dataSource;
        }
        me._finishLoading();
        /*
        *   更新控件的初始化的值
        */

        updateInitVal(initRender, me._items);
      }
      return void 0;
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _setupEvents
    */


    ComboBox.prototype._setupEvents = function(opts) {
      var $root, inputSelector, me;
      ComboBox.__super__._setupEvents.call(this, opts);
      me = this;
      $root = me.uiElement();
      inputSelector = '.eba-buttonedit-input';
      me.onEvent('enter', opts['onenter']);
      me.onEvent('change', opts['onchange']);
      $root.on('keydown', inputSelector, function(event) {
        /*
        *   如果不允许手工输入文本，返回false，阻止文字输入
        */

        var allowed, code;
        if (me.readonly()) {
          return event.preventDefault();
        }
        allowed = me.enabled() && me.allowInput();
        if (!allowed) {
          return event.preventDefault();
        }
        code = event.which;
        /*
        *   我们暂时只允许按下enter键    13
        *   ，小键盘的向上按键           38
        *   ，小键盘的向下按键           40
        */

        switch (code) {
          case 13:
          case 38:
          case 40:
            allowed = true;
        }
        if (!allowed) {
          return event.preventDefault();
        }
      });
      $root.on('keyup', inputSelector, function(event) {
        var $input, code, defaults, listbox, onDownArrow, onEnter, onUpArrow, panel;
        if (me.readonly() || !me.enabled()) {
          return event.preventDefault();
        }
        $input = me._$formInput;
        listbox = me._panelContent;
        panel = me._panel;
        code = event.which;
        /* 
        *   小键盘的向下按键
        */

        onDownArrow = function(sender, event) {
          return listbox.selectNext();
        };
        /* 
        *   小键盘的向上按键
        */

        onUpArrow = function(sender, event) {
          return listbox.selectPrev();
        };
        /* 
        *   enter键
        */

        onEnter = function(sender, event) {
          if (panel.visible()) {
            /*
            *  按下回车键选中下拉菜单的某一个项的时候，
            *  下拉菜单的listbox控件也要选中这个项 
            *   data方法参数
            *       val,
            *       updateHtml = true,
            *       updatePopup = true, 
            *       dispatchEvent = false, 
            *       eventArgs = {}
            */

            me.data(listbox.data(), true, false, true, event);
            panel.close();
            return;
          }
          return me.triggerEvent('enter', event);
        };
        /* 
        *   默认keyup事件处理程序
        */

        defaults = function(sender, event) {
          /*
           *  输入正常字符，进行过滤
           *  如果使用远程数据，则发送AJAX请求去获取数据，然后把得到的数据赋值给this._dataItems变量； 
           *  如果使用的是本地数据，则对dataSource进行filter操作，然后把结果值赋值给this._dataItems变量；
           *  清零this._currDataItemIndex
           *  UI加载并且显示this._dataItems
          */

          var _txt;
          _txt = $input.val();
          me.text(_txt);
          me._loadData(_txt);
          return panel.open();
        };
        /*
        *   我们暂时只允许按下enter键    13
        *   ，小键盘的向上按键           38
        *   ，小键盘的向下按键           40
        */

        switch (code) {
          case 13:
            return onEnter(me, event);
          case 38:
            return onUpArrow(me, event);
          case 40:
            return onDownArrow(me, event);
          default:
            return defaults(me, event);
        }
      });
      return void 0;
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _render
    */


    ComboBox.prototype._render = function() {
      var me;
      ComboBox.__super__._render.call(this);
      me = this;
      /*
      *   加载数据
      */

      return me._loadData(null, true);
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _init
    */


    ComboBox.prototype._init = function(opts) {
      var $root, me, _ref35, _ref36, _ref37, _ref38;
      ComboBox.__super__._init.call(this, opts);
      me = this;
      $root = me._$root;
      /*
       *  初始化控件自身的一系列属性
       *  过滤字段,使用remote 数据源的时候，发起请求时input值对应的url参数得KEY
       *  该参数默认等同于textField参数
      */

      me._dataSource = (_ref35 = opts['dataSource']) != null ? _ref35 : [];
      me._idField = (_ref36 = opts['idField']) != null ? _ref36 : 'id';
      me._textField = (_ref37 = opts['textField']) != null ? _ref37 : 'text';
      me._valueField = (_ref38 = opts['valueField']) != null ? _ref38 : 'value';
      me._filterField = opts['filterField'] != null ? opts['filterField'] : me._textField;
      $root.addClass('eba-combobox eba-popupedit');
      /*
      *   创建下拉菜单，并且进行初始化，设置数据源等
      */

      me._initPanel();
      me._initPanelContent();
      return void 0;
    };

    ComboBox.prototype._items = [];

    /**
     *  下拉菜单数据
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.Combo
     *  @member     {Array}  items
    */


    ComboBox.prototype.items = function() {
      return this._items;
    };

    /**
     *  重置控件的数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _cleanUp
    */


    ComboBox.prototype._cleanUp = function() {
      var me;
      me = this;
      me._text = '';
      me._value = null;
      me._data = null;
      return me._updateAttrText();
    };

    /**
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {Object}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( {} );
    */


    ComboBox.prototype.value = function(val, updateHtml, updatePopup, dispatchEvent, eventArgs) {
      var data, dataItem, i, index, items, me, text, textField, update, valueField, _i, _len;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (updatePopup == null) {
        updatePopup = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      /*
      *   get
      */

      if (val == null) {
        return me._value;
      }
      /*
      *   set
      */

      if (!me.isArray(val)) {
        val = [val];
      }
      if (val.length === 0) {
        return me._cleanUp();
      }
      /*
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      update = val[0];
      if (me._value === update) {
        return;
      }
      index = -1;
      data = null;
      text = '';
      textField = me.textField();
      valueField = me.valueField();
      items = me.items();
      for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
        dataItem = items[i];
        if (dataItem[valueField] === update) {
          index = i;
          data = dataItem;
          text = dataItem[textField];
          break;
        }
      }
      /*
      *   如果没有找到这个项，直接返回
      */

      if (index === -1) {
        return;
      }
      me._data = data;
      me._text = text;
      me._value = update;
      /*
      *   更新文本值
      */

      if (updateHtml === true) {
        me._updateAttrText();
      }
      /*
      *   更新控件下拉菜单的值
      */

      if (updatePopup === true) {
        me._panelContent.data(data);
      }
      /*
      *   触发change事件
      */

      if (dispatchEvent === true) {
        return me.triggerEvent('change', eventArgs);
      }
    };

    /**
     *  获取或者设置选中的项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {Object}        data
     *  @default    null
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( {} );
    */


    ComboBox.prototype.data = function(val, updateHtml, updatePopup, dispatchEvent, eventArgs) {
      var data, items, me, textField, valueField;
      if (updateHtml == null) {
        updateHtml = true;
      }
      if (updatePopup == null) {
        updatePopup = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      if (val == null) {
        return me._data;
      }
      if (!me.isArray(val)) {
        val = [val];
      }
      if (val.length === 0) {
        return me._cleanUp();
      }
      data = val[0];
      items = me.items();
      if (__indexOf.call(items, data) < 0) {
        return;
      }
      textField = me.textField();
      valueField = me.valueField();
      /*
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      if (me._value === data[valueField]) {
        return;
      }
      me._data = data;
      me._text = data[textField];
      me._value = data[valueField];
      /*
      *   更新文本值
      */

      if (updateHtml === true) {
        me._updateAttrText();
      }
      /*
      *   更新控件下拉菜单的值
      */

      if (updatePopup === true) {
        me._panelContent.data(data);
      }
      /*
      *   触发change事件
      */

      if (dispatchEvent === true) {
        return me.triggerEvent('change', eventArgs);
      }
    };

    ComboBox.prototype._filterField = 'text';

    /**
     *  控件数据源对象字段中，用于筛选的对象字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {String}      filterField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      filterField = ctrl.filterField();
     *  @example    <caption>set</caption>
     *      ctrl.filterField( '' );
    */


    ComboBox.prototype.filterField = function(val) {
      var me;
      me = this;
      if (!me.isString(val)) {
        return me._filterField;
      }
      return me._filterField = val;
    };

    ComboBox.prototype._dataSource = {};

    /**
     *  下拉菜单选项的数据源，可以是URL地址或者是一个javascript数组对象作为数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @member     {Object|Array}          dataSource
     *  @property   {String}                dataSource.url          - 服务端URL
     *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
     *  @example    <caption>get</caption>
     *      src = ctrl.dataSource();
     *  @example    <caption>set</caption>
     *      #  本地数据
     *      ctrl.dataSource( [] );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : {}
     *      } );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : function(){ 
     *              # your logic
     *              return {};
     *          }
     *      } );
    */


    ComboBox.prototype.dataSource = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._dataSource;
      }
      return me._dataSource = val;
    };

    ComboBox.prototype._filter = function(item, value, filterField) {
      return item[filterField].indexOf(value) > -1;
    };

    /**
    *   使用array作为数据源时
    *   ，作为数据过滤的函数
    */


    ComboBox.prototype.filter = function(val) {
      var me;
      me = this;
      if (!me.isFunc(val)) {
        return me._filter;
      }
      return me._filter = val;
    };

    return ComboBox;

  })(Combo);

  ebaui['web'].registerFormControl('ComboBox', ComboBox);

  /**
   *  @class      ComboList 
   *  @memberof   ebaui.web
   *  @extends    ebaui.web.Combo
   *  @param      {Object}    element     -   dom对象
   *  @param      {Object}    options     -   控件配置参数
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
   *       //  初始化方式一
   *       var ns = ebaui.web;
   *       var btn = new ns.ComboList( $( '' ),{ title:'',id:'',name:'' } );
   *       //  初始化方式二
   *       $( '' ).comboList( { title:'',id:'',name:'' } )
   *       //  初始化方式三
   *       &lt;input id="" title="" name="" data-role="comboList" data-options="{}" /&gt;
  */


  ComboList = (function(_super) {
    __extends(ComboList, _super);

    function ComboList() {
      _ref35 = ComboList.__super__.constructor.apply(this, arguments);
      return _ref35;
    }

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _updateCssEnabled
    */


    ComboList.prototype._updateCssEnabled = function() {
      var $input, $root, cls, disabledCls, focusedCls, me;
      me = this;
      $root = me._$root;
      $input = me._$formInput;
      cls = me._rootCls;
      disabledCls = cls['disabled'];
      focusedCls = cls['focused'];
      if (me.enabled()) {
        return $root.removeClass(disabledCls);
      } else {
        return $root.removeClass(focusedCls).addClass(disabledCls);
      }
    };

    /**
     *  更新已经选中的文本列表
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _updateAttrText
     *  @arg        {Array}     texts=[]
     *  @arg        {Boolean}   updateInput=false
    */


    ComboList.prototype._updateAttrText = function(texts, updateInput) {
      var $input, me, update;
      if (texts == null) {
        texts = [];
      }
      if (updateInput == null) {
        updateInput = true;
      }
      me = this;
      $input = me._$formInput;
      if (texts.length === 0) {
        if (updateInput) {
          $input.val('');
        }
        me._showPlaceHolder();
        return;
      }
      update = texts.join(';');
      if (updateInput) {
        $input.val(update);
      }
      if (me.isEmpty(update)) {
        return me._showPlaceHolder();
      } else {
        return me._hidePlaceHolder();
      }
    };

    ComboList.prototype._gridConfig = null;

    /**
     *  获取或者设置grid的配置文件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @member     {Object}    _gridConfig
     *  @default    ''
     *  @example    <caption>get</caption>
     *      conf = ctrl.gridConfig();
     *  @example    <caption>set</caption>
     *      ctrl.gridConfig( 'your text value' );
    */


    ComboList.prototype.gridConfig = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._gridConfig;
      }
      return me._gridConfig = val;
    };

    /**
     *  初始化内部控件MiniGrid的配置
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _initPanelContent
    */


    ComboList.prototype._initPanelContent = function() {
      var $panel, config, initVal, loadCompleteHandle, me, minigrid, onSelectAllHandle, onSelectRowHandle, panel, textField, valueField;
      me = this;
      ns = ebaui.web;
      panel = me._panel;
      $panel = panel.uiElement();
      initVal = me.value();
      textField = me.textField();
      valueField = me.valueField();
      /*
      *   data方法参数
      *       val,
      *       updateGrid = true,
      *       dispatchEvent = false, 
      *       eventArgs = {}
      */

      onSelectRowHandle = function(sender, eventArgs) {
        return me.data(sender.selectedItems(), false, true, eventArgs);
      };
      onSelectAllHandle = function(sender, eventArgs) {
        return me.data(sender.selectedItems(), false, true, eventArgs);
      };
      loadCompleteHandle = function(sender, eventArgs) {
        var gridData, i, idx, item, val, _i, _len, _results;
        if (!initVal) {
          return;
        }
        gridData = sender.items();
        _results = [];
        for (i = _i = 0, _len = initVal.length; _i < _len; i = ++_i) {
          val = initVal[i];
          _results.push((function() {
            var _j, _len1, _results1;
            _results1 = [];
            for (idx = _j = 0, _len1 = gridData.length; _j < _len1; idx = ++_j) {
              item = gridData[idx];
              if (item[valueField] === val) {
                _results1.push(sender.setSelection(idx));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        }
        return _results;
      };
      /*
      *   初始化mini grid
      */

      config = me.gridConfig();
      config['onSelectRow'] = onSelectRowHandle;
      config['onSelectAll'] = onSelectAllHandle;
      config['loadComplete'] = loadCompleteHandle;
      $.each(config['colModel'], function(index, model) {
        if (!model['width']) {
          return model['width'] = 150;
        }
      });
      if (!config['width']) {
        config['width'] = 400;
      }
      if (!config['height']) {
        config['height'] = 120;
      }
      minigrid = new ns.MiniGrid($('input', $panel), config);
      return me._panelContent = minigrid;
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _setupEvents
    */


    ComboList.prototype._setupEvents = function(opts) {
      var me;
      ComboList.__super__._setupEvents.call(this, opts);
      me = this;
      return me.onEvent('change', opts['onchange']);
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _init
    */


    ComboList.prototype._init = function(opts) {
      var $root, defaultConfig, me, _ref36, _ref37, _ref38;
      ComboList.__super__._init.call(this, opts);
      me = this;
      $root = me._$root;
      /*
       *  初始化控件自身的一系列属性
       *  过滤字段,使用remote 数据源的时候，发起请求时input值对应的url参数得KEY
       *  该参数默认等同于textField参数
      */

      me._idField = (_ref36 = opts['idField']) != null ? _ref36 : 'id';
      me._textField = (_ref37 = opts['textField']) != null ? _ref37 : 'text';
      me._valueField = (_ref38 = opts['valueField']) != null ? _ref38 : 'value';
      defaultConfig = {
        autowidth: true,
        width: 400,
        height: 120,
        url: '',
        data: [],
        datatype: "local",
        postData: [],
        colModel: [
          {
            name: 'id',
            label: 'ID',
            width: 150
          }, {
            name: 'text',
            label: 'Text',
            width: 150
          }
        ],
        multiselect: true,
        onSelectRow: $.noop,
        onSelectAll: $.noop,
        loadComplete: $.noop
      };
      if (opts['grid'] != null) {
        me._gridConfig = $.extend(defaultConfig, opts['grid']);
      } else {
        me._gridConfig = defaultConfig;
      }
      $root.addClass('eba-combobox eba-popupedit').attr('data-role', 'combolist');
      me._initPanel();
      return me._initPanelContent();
    };

    ComboList.prototype._render = function() {
      ComboList.__super__._render.call(this);
      /*
      *   input 始终禁用
      */

      return this._$formInput.prop('readonly', true);
    };

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
     *      src = ctrl.dataSource();
     *  @example    <caption>set</caption>
     *      #  本地数据
     *      ctrl.dataSource( [] );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : {}
     *      } );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : function(){ 
     *              # your logic
     *              return {};
     *          }
     *      } );
    */


    ComboList.prototype.dataSource = function(val) {
      var grid, me;
      me = this;
      if (!val) {
        return me._gridConfig;
      }
      grid = me._panelContent;
      grid.setGridParam(val);
      return grid.reloadGrid();
    };

    /**
     *  获取文本值
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.ComboList
     *  @member     {Array}    text
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #  text == ['','']
     *      text = ctrl.text();
    */


    ComboList.prototype.text = function(val) {
      return this._text;
    };

    /**
     *  重置控件的数据，以及显示的文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _cleanUp
    */


    ComboList.prototype._cleanUp = function() {
      var grid, me;
      me = this;
      me._data = [];
      me._text = [];
      me._value = [];
      grid = me._panelContent;
      grid.resetSelection();
      return me._updateAttrText([]);
    };

    /**
     *  更新控件的数据，以及panel中的DataGrid中选中的数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _setValue
     *  @arg        {Array}     val
     *  @arg        {Boolean}   updateGrid   -   指示是否更新grid的内容
     *  @arg        {Boolean}   isLiteral    -   指示过滤函数的参数都是对象类型，还是直接量类型
    */


    ComboList.prototype._setValue = function(val, isLiteral, updateGrid, dispatchEvent, eventArgs) {
      var dataArray, dataItem, grid, gridData, gridRowIds, i, isEqual, j, me, rowId, textArray, textField, valueArray, valueField, valueItem, _i, _j, _k, _len, _len1, _len2;
      if (isLiteral == null) {
        isLiteral = true;
      }
      if (updateGrid == null) {
        updateGrid = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      if (!me.isArray(val)) {
        val = [val];
      }
      if (val.length === 0) {
        if (me._value && me._value.length > 0 && dispatchEvent === true) {
          me.triggerEvent('change', eventArgs);
        }
        me._cleanUp();
        return;
      }
      gridRowIds = [];
      valueArray = [];
      textArray = [];
      dataArray = [];
      grid = me._panelContent;
      textField = me.textField();
      valueField = me.valueField();
      gridData = grid.items();
      isEqual = function(source, target, literal) {
        if (literal) {
          return source === target;
        } else {
          return source === target[valueField];
        }
      };
      for (j = _i = 0, _len = val.length; _i < _len; j = ++_i) {
        valueItem = val[j];
        for (rowId = _j = 0, _len1 = gridData.length; _j < _len1; rowId = ++_j) {
          dataItem = gridData[rowId];
          /*
          *   iterate through array or object
          */

          if (isEqual(dataItem[valueField], valueItem, isLiteral)) {
            /* 
            *   by this way
            *   I can get values that real exist
            */

            dataArray.push(dataItem);
            valueArray.push(dataItem[valueField]);
            textArray.push(dataItem[textField]);
            gridRowIds.push(rowId);
          }
        }
      }
      /*
      *   如果控件值如果value没有变化，则不应该更新控件的值；
      *   否则，更新控件的值
      */

      if (me._value && me._value.join('') === valueArray.join('')) {
        return;
      }
      me._data = dataArray;
      me._text = textArray;
      me._value = valueArray;
      if (updateGrid) {
        grid.resetSelection();
        for (i = _k = 0, _len2 = gridRowIds.length; _k < _len2; i = ++_k) {
          rowId = gridRowIds[i];
          grid.setSelection(rowId);
        }
      }
      /*
      *   update text display
      */

      me._updateAttrText(textArray);
      /*
      *   triggerEvent
      */

      if (dispatchEvent === true) {
        me.triggerEvent('change', eventArgs);
      }
      return void 0;
    };

    /**
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @member     {Object}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( [] );
    */


    ComboList.prototype.value = function(val, updateGrid, dispatchEvent, eventArgs) {
      var me;
      if (updateGrid == null) {
        updateGrid = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      if (!val) {
        return me._value;
      }
      return me._setValue(val, true, updateGrid, dispatchEvent, eventArgs);
    };

    /**
     *  获取或者设置选中的项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @member     {Object}        data
     *  @default    null
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( [{ name : value },{ name : value }] );
    */


    ComboList.prototype.data = function(val, updateGrid, dispatchEvent, eventArgs) {
      var me;
      if (updateGrid == null) {
        updateGrid = true;
      }
      if (dispatchEvent == null) {
        dispatchEvent = false;
      }
      if (eventArgs == null) {
        eventArgs = {};
      }
      me = this;
      if (!val) {
        return me._data;
      }
      return me._setValue(val, false, updateGrid, dispatchEvent, eventArgs);
    };

    return ComboList;

  })(Combo);

  ebaui['web'].registerFormControl('ComboList', ComboList);

  /**
  *   @class      Tab
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  */


  Tab = (function(_super) {
    __extends(Tab, _super);

    function Tab() {
      _ref36 = Tab.__super__.constructor.apply(this, arguments);
      return _ref36;
    }

    Tab.prototype._headerTmpl = '';

    /**
     *  dom对象引用
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Object}    _$header
    */


    Tab.prototype._$header = null;

    Tab.prototype._contentTmpl = '';

    /**
     *  dom对象引用
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Object}    _$header
    */


    Tab.prototype._$content = null;

    /**
     *  更新选项卡的icon
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Tab
     *  @method     _updateCssIcon
    */


    Tab.prototype._updateCssIcon = function() {
      var cls, iconCls, me;
      me = this;
      iconCls = me.iconCls();
      cls = 'eba-tab-icon ';
      if (iconCls) {
        cls += iconCls;
      }
      return $('.eba-tab-icon', me._$header).attr('class', cls);
    };

    /**
     *  更新选项卡的关闭按钮
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Tab
     *  @method     _updateCssClosable
    */


    Tab.prototype._updateCssClosable = function() {
      var $btnClose, $root, closable, me, size;
      me = this;
      closable = me.closable();
      $root = me.headerDom();
      $btnClose = $('span.eba-tab-close', $root);
      size = $btnClose.size();
      if (!closable && size > 0) {
        return $btnClose.remove();
      }
      return void 0;
    };

    /**
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Tab
     *  @method     _updateAttrTitle
    */


    Tab.prototype._updateAttrTitle = function() {
      var me;
      me = this;
      return $('.eba-tab-text', me._$header).text(me.title());
    };

    /**
     *  tab的header dom对象
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Object}    headerDom
    */


    Tab.prototype.headerDom = function() {
      return this._$header;
    };

    /**
     *  tab的content dom对象
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Object}    contentDom
    */


    Tab.prototype.contentDom = function() {
      return this._$content;
    };

    Tab.prototype._title = '';

    /**
     *  tab的标题
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {String}    title
    */


    Tab.prototype.title = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._title;
      }
      me._title = val;
      return me._updateAttrTitle();
    };

    Tab.prototype._url = '';

    /**
     *  tab内容的URL
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {String}    url
    */


    Tab.prototype.url = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._url;
      }
      me._url = val;
      return me.refresh();
    };

    Tab.prototype._closable = true;

    /**
     *  获取或者设置tab是否可以关闭
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {String}    closable
    */


    Tab.prototype.closable = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._closable;
      }
      me._closable = val;
      return me._updateCssClosable();
    };

    Tab.prototype._iconCls = '';

    /**
     *  tab的icon
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {String}    iconCls
    */


    Tab.prototype.iconCls = function(val) {
      var me;
      me = this;
      if (val == null) {
        return me._iconCls;
      }
      me._iconCls = val;
      me._updateCssIcon();
      return void 0;
    };

    Tab.prototype._isActived = false;

    /**
     *  tab是否激活
     *  @public
     *  @instance
     *  @default        false
     *  @memberof       eabui.web.Tab
     *  @member         {Boolean}    isActived
    */


    Tab.prototype.isActived = function(val) {
      var $content, $header, cls, me;
      me = this;
      if (me.isClosed()) {
        return;
      }
      if (typeof val !== 'boolean') {
        return me._isActived;
      }
      cls = 'eba-tab-active';
      $header = me._$header;
      $content = me._$content;
      me._isActived = val;
      if (val) {
        $header.addClass(cls);
        $content.show();
      } else {
        $header.removeClass(cls);
        $content.hide();
      }
      return void 0;
    };

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


    Tab.prototype.refresh = function() {
      var me, timestamp, url;
      me = this;
      return me.isClosed();
      timestamp = (new Date).getTime();
      url = me.url();
      url += url.indexOf('?') === -1 ? "?t=" + timestamp : "&t=" + timestamp;
      return $('iframe', me._$content).attr('src', url);
    };

    Tab.prototype._closed = false;

    /**
     *  指示该选项卡是否已经被关闭了
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Boolean}   isClosed
    */


    Tab.prototype.isClosed = function() {
      return this._closed;
    };

    /**
     *  关闭选项卡
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @method         close
    */


    Tab.prototype.close = function() {
      var me;
      me = this;
      $('iframe', me._$content).off('load');
      me._closed = true;
      me._$header.remove();
      me._$content.remove();
      delete me._$header;
      return delete me._$content;
    };

    Tab.prototype._render = function() {
      var me;
      me = this;
      me._updateAttrTitle();
      me._updateCssClosable();
      return me._updateCssIcon();
    };

    /**
     *  初始化
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @method         _init
    */


    Tab.prototype._init = function(opts) {
      var html, me, _ref37, _ref38, _ref39, _ref40, _ref41;
      me = this;
      /* 
      *   初始化控件自身的一系列属性
      */

      me._iconCls = (_ref37 = opts['iconCls']) != null ? _ref37 : '';
      me._url = (_ref38 = opts['url']) != null ? _ref38 : '';
      me._title = (_ref39 = opts['title']) != null ? _ref39 : me._url;
      me._closable = (_ref40 = opts['closable']) != null ? _ref40 : true;
      me._isActived = (_ref41 = opts['isActived']) != null ? _ref41 : false;
      /* 
      *   render header
      */

      me._$header = $(me._headerTmpl);
      /* 
      *   render content
      */

      html = me._contentTmpl.replace('{0}', me.url());
      return me._$content = $(html);
    };

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         _setupEvents
    */


    Tab.prototype._setupEvents = function(opts) {
      var $content, $header, me;
      me = this;
      $header = me._$header;
      $content = me._$content;
      /**
      *   绑定事件处理程序
      */

      me.onEvent('load', opts['onload']);
      /**
      *   mouseenter
      *   https://developer.mozilla.org/en-US/docs/DOM/DOM_event_reference/mouseenter
      *
      *   当鼠标移到tab选项卡的时候，要添加关闭按钮
      *   当鼠标移出tab选项卡的时候，要删除关闭按钮
      *   <span class="eba-tab-close"></span>
      *   span.eba-tab-close的click事件，由tabs集合负责处理
      *   单个tab对象，不应该处理自己的关闭事件，应该是由容器来统一负责移除，添加的操作
      */

      $header.on('mouseenter', function(eventArgs) {
        var $btn;
        $btn = $('span.eba-tab-close', $header);
        if (me.closable() && $btn.size() === 0) {
          $btn = $('<span class="eba-tab-close"></span>');
          return $header.append($btn);
        }
      });
      $header.on('mouseleave', function(eventArgs) {
        var $btn;
        $btn = $('span.eba-tab-close', $header);
        return $btn.remove();
      });
      /**
      *   触发iframe的load事件
      */

      return $('iframe', $content).on('load', function(eventArgs) {
        var contentDoc, error;
        try {
          contentDoc = this.contentDocument || this.contentWindow.document;
          if (contentDoc) {
            $(contentDoc).on('click', function(eventArgs) {
              /*
              *   判断当前是否处在iframe里
              */

              var top, win;
              win = contentDoc.defaultView;
              top = win.top;
              /*
              *   如果当前页面是在iframe里面，则触发父页面document的click事件处理程序
              */

              if (win && top !== win) {
                return $(top.document).trigger('click');
              }
            });
          }
        } catch (_error) {
          error = _error;
          /*
          *   考虑到有跨域的可能，因此还是要try catch一下的
          */

        }
        return me.triggerEvent('load', eventArgs);
      });
    };

    return Tab;

  })(Control);

  ebaui['web'].registerControl('Tab', Tab);

  /**
  *   @class      Tabs
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  *   @example
  *       //  初始化方式一
  *       var ns = ebaui.web;
  *       var btn = new ns.Tabs( $( '' ),{ title:'',id:'',name:'' } );
  *       //  初始化方式二
  *       $( '' ).tabs( { title:'',id:'',name:'' } )
  *       //  初始化方式三
  *       &lt;input id="" title="" name="" data-role="tabs" data-options="{}" /&gt;
  */


  Tabs = (function(_super) {
    __extends(Tabs, _super);

    function Tabs() {
      _ref37 = Tabs.__super__.constructor.apply(this, arguments);
      return _ref37;
    }

    /**
     *  
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @member         {jQuery}    -   contentRegion
    */


    Tabs.prototype._$contentRegion = null;

    /**
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         _setupEvents
    */


    Tabs.prototype._setupEvents = function(opts) {
      var $root, me;
      me = this;
      $root = me.uiElement();
      $root.on('click', '.eba-tab', function(event) {
        var tabIndex;
        tabIndex = $('.eba-tab', $root).index(this);
        if (tabIndex === -1) {
          return;
        }
        return me.activateTab(tabIndex);
      });
      return $root.on('click', '.eba-tab-close', function(event) {
        var tabIndex;
        tabIndex = $('.eba-tab', $root).index($(this).parent());
        if (tabIndex === -1) {
          return;
        }
        return me.closeTab(tabIndex);
      });
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         _init
    */


    Tabs.prototype._init = function(opts) {
      var $region, isValid, me, tab, _ref38;
      Tabs.__super__._init.call(this, opts);
      me = this;
      /**
      *   初始化控件自身的一系列属性
      *   contentRegion是必选参数
      */

      if (opts['home'] != null) {
        me._home = opts['home'];
      }
      if (opts['contentRegion'] != null) {
        me._contentRegion = opts['contentRegion'];
      }
      me._$contentRegion = $(me._contentRegion);
      /**
      *   如果指定的contentRegion里面没有ul，那么初始化的时候append一个新的ul
      *   我们的content的html格式是<li><iframe src=""></iframe></li>
      */

      $region = me._$contentRegion;
      if ($('ul', $region).size() === 0) {
        $region.append('<ul></ul>');
      }
      /**
      *   默认添加homeTab
      */

      tab = me._home;
      isValid = tab && tab['url'] ? true : false;
      if (isValid) {
        tab['title'] = (_ref38 = tab['title']) != null ? _ref38 : tab['url'];
        return me.addTab(tab);
      }
    };

    /**
     *  私有变量，用来保存所有tab对象
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Array}         _tabs
    */


    Tabs.prototype._tabs = [];

    /**
     *  homeTab配置，homeTab是默认首页
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Object}         _homeTab
    */


    Tabs.prototype._homeTab = null;

    /**
     *  当前激活的tab选项卡的对应引用
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Tab}        _currentTab
    */


    Tabs.prototype._currentTab = null;

    /**
     *  设置或者获取当前激活的tab选项卡对象
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Tab}                           currentTab
     *  @example        <caption>get</caption>
     *      tab = console.log( ctrl.currentTab() );
     *  @example        <caption>set</caption>
     *      console.log( ctrl.currentTab( {Number|String|Function} ) );
    */


    Tabs.prototype.currentTab = function(tab) {
      var curr, instance, me;
      me = this;
      if (tab == null) {
        return me._currentTab;
      }
      curr = me._currentTab;
      instance = me.getTab(tab);
      if (curr && !curr.isClosed()) {
        curr.isActived(false);
      } else {
        /*
        *   当前tab已经关闭了，那么就移除其引用
        */

        me._currentTab = null;
      }
      if (instance) {
        instance.isActived(true);
        me._currentTab = instance;
      }
      return void 0;
    };

    /**
     *  添加一个新的选项卡
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         addTab
     *  @param          {Tab}                           tab
    */


    Tabs.prototype.addTab = function(tab) {
      var instance, me, tabIndex;
      if (tab == null) {
        return;
      }
      me = this;
      tabIndex = me.indexOf(tab['url']);
      if (tabIndex !== -1) {
        return;
      }
      tabIndex = me._tabs.length;
      instance = new Tab(null, tab);
      me._tabs.push(instance);
      $('ul', me._$root).append(instance.headerDom());
      $('ul', me._$contentRegion).append(instance.contentDom());
      me.activateTab(tabIndex);
      return void 0;
    };

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


    Tabs.prototype.closeTab = function(tab) {
      var currTab, lastIndex, me, myTabs, tabIndex, tabToClose;
      me = this;
      tabIndex = me.indexOf(tab);
      if (tabIndex === -1) {
        return;
      }
      myTabs = me._tabs;
      lastIndex = tabIndex === 0 ? 1 : (tabIndex - 1 > 0 ? tabIndex - 1 : 0);
      if (lastIndex > myTabs.length) {
        lastIndex = myTabs.length - 1;
      }
      tabToClose = myTabs[tabIndex];
      currTab = me.currentTab();
      if (currTab === tabToClose) {
        me.activateTab(lastIndex);
      }
      tabToClose.close();
      tabToClose = null;
      myTabs.splice(tabIndex, 1);
      return me._tabs = myTabs;
    };

    /**
     *  关闭所有选项卡
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         closeAllTab
    */


    Tabs.prototype.closeAllTab = function() {
      var i, item, keep, me, myTabs, removal, rm, _i, _j, _len, _len1;
      me = this;
      keep = [];
      removal = [];
      myTabs = me._tabs;
      for (i = _i = 0, _len = myTabs.length; _i < _len; i = ++_i) {
        item = myTabs[i];
        item = myTabs[i];
        if (item.closable()) {
          removal.push(item);
        } else {
          keep.push(item);
        }
      }
      for (i = _j = 0, _len1 = removal.length; _j < _len1; i = ++_j) {
        rm = removal[i];
        rm.close();
      }
      me._tabs = keep;
      if (keep.length > 0) {
        me.activateTab(0);
      }
      return void 0;
    };

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


    Tabs.prototype.closeOtherTabs = function(but) {
      var excludeTab, i, item, me, tabIndex, tabs, _i, _len;
      me = this;
      tabIndex = me.indexOf(but);
      if (tabIndex === -1) {
        return;
      }
      me.activateTab(tabIndex);
      tabs = me._tabs;
      for (i = _i = 0, _len = tabs.length; _i < _len; i = ++_i) {
        item = tabs[i];
        if (tabIndex !== i) {
          item.close();
        }
      }
      excludeTab = me.getTab(tabIndex);
      me._tabs = [excludeTab];
      return void 0;
    };

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


    Tabs.prototype.getTab = function(tab) {
      var me, tabIndex;
      me = this;
      tabIndex = me.indexOf(tab);
      if (tabIndex === -1) {
        return null;
      }
      return me._tabs[tabIndex];
    };

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


    Tabs.prototype.indexOf = function(isEqual) {
      var fn, i, item, me, size, tabIndex, tabs, _i, _len;
      me = this;
      tabs = me._tabs;
      size = tabs.length;
      if (me.isNull(isEqual) || size === 0) {
        return -1;
      }
      tabIndex = -1;
      if (me.isNumber(isEqual)) {
        tabIndex = parseInt(isEqual);
        if (isNaN(tabIndex) || tabIndex < 0 || tabIndex >= size) {
          tabIndex = -1;
        }
        return tabIndex;
      }
      fn = null;
      if (me.isString(isEqual)) {
        /* 
        *   well, tab parameter is a instance of Tab class
        */

        fn = function(tab) {
          return tab['url']() === isEqual;
        };
      } else if (me.isFunc(isEqual)) {
        fn = isEqual;
      } else {
        return -1;
      }
      for (i = _i = 0, _len = tabs.length; _i < _len; i = ++_i) {
        item = tabs[i];
        if (fn(item)) {
          tabIndex = i;
          break;
        }
      }
      return tabIndex;
    };

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


    Tabs.prototype.activateTab = function(tab) {
      var me, tabIndex;
      me = this;
      tabIndex = me.indexOf(tab);
      if (tabIndex === -1) {
        return;
      }
      return me.currentTab(tabIndex);
    };

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


    Tabs.prototype.refreshTab = function(tab) {
      var currTab, me, tabInstance;
      me = this;
      /* 
      *   if tab parameter was not been assigned,
      *   the current active tab will be refreshed
      */

      if (me.isNull(tab)) {
        currTab = me.currentTab();
        if (currTab) {
          currTab.refresh();
        }
        return;
      }
      tabInstance = me.getTab(tab);
      if (tabInstance) {
        return tabInstance.refresh();
      }
    };

    /**
     *  调整tab内容区域的iframe的width以及height
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @method         resizeContent
    */


    Tabs.prototype.resizeContent = function(size) {
      var $ifm, me;
      if (!size) {
        return;
      }
      me = this;
      if (size['width'] == null) {
        return;
      }
      $ifm = $('iframe', me._$contentRegion);
      $ifm.width(size['width']);
      return $ifm.height(size['height']);
    };

    Tabs.prototype._contentRegion = '.eba-tabs-body';

    /**
     *  jquery选择器
     *  ，用来指定tab内容的区域
     *  ，控件content内容将会输出在这个地方
     *  @public
     *  @instance
     *  @readonly
     *  @default        .eba-tabs-body
     *  @memberof       ebaui.web.Tabs 
     *  @member         {String}            contentRegion
    */


    Tabs.prototype.contentRegion = function() {
      return this._contentRegion;
    };

    Tabs.prototype._home = {
      title: '',
      url: '',
      closable: false
    };

    /**
     *  默认首页，{ title:'',url:'' }，其中，url是必选项。
     *  如果没有指定title，则title默认为 Tab + tabIndex。
     *  @public
     *  @instance
     *  @readonly
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Object}                        home
    */


    Tabs.prototype.home = function(val) {
      return this._home;
    };

    return Tabs;

  })(Control);

  ebaui['web'].registerControl('Tabs', Tabs);

  /**
  *   @class      Form
  *   @classdesc
  *   @memberof   ebaui.web
  *   @extends    ebaui.web.Control
  *   @author     monkey      <knightuniverse@qq.com>
  *   @param      {Object}    element     -   dom对象
  *   @param      {Object}    options     -   控件配置参数
  */


  Form = (function(_super) {
    __extends(Form, _super);

    function Form() {
      _ref38 = Form.__super__.constructor.apply(this, arguments);
      return _ref38;
    }

    /**
     *  所有form表单控件类。在form控件初始化的时候，会自动加载当前DOM上下文中的这个集合内的控件到作为表单的一个字段
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {Array}     _formControls
    */


    Form.prototype._formControls = function() {
      return ebaui.web.formControls;
    };

    /**
     *  所有form表单控件类。在form控件初始化的时候，会自动加载当前DOM上下文中的这个集合内的控件到作为表单的一个字段
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {Array}     _ctrlJQSelector
    */


    Form.prototype._ctrlJQSelector = '[data-ns="web.form"]';

    /**
     *  表单是否通过验证
     *  @private
     *  @instance
     *  @memberof ebaui.web.Form
     *  @member {Boolean}   _isValid
    */


    Form.prototype._isValid = true;

    /**
     *  遍历form控件内所有的表单控件
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _eachField
     *  @param      {Function}  iterator - 迭代器
    */


    Form.prototype._eachField = function(iterator) {
      var field, fields, _i, _len, _results;
      fields = this.fields();
      _results = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        _results.push(iterator(field));
      }
      return _results;
    };

    /**
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _render
    */


    Form.prototype._render = function() {
      var id, me;
      me = this;
      id = me.id();
      if (!me.isEmpty(id)) {
        me._$root.attr('id', id);
      }
      return me._updateCssVisible();
    };

    /**
     *  把HTML占位符转换成为控件自身的HTML结构
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _parseUi
     *  @param      {Object}    element HTML占位符
    */


    Form.prototype._parseUi = function(element) {
      return $(element);
    };

    Form.prototype._setupEvents = function(opts) {
      var $doms, $root, JQSelector, len, me;
      me = this;
      $root = me._$root;
      JQSelector = me._ctrlJQSelector;
      $doms = $(JQSelector, $root);
      len = $doms.size();
      /*
      $root.on( 'keypress',( event ) -> 
          event.preventDefault() if event.which is 13
      )
      */

      return $root.on('keyup', function(event) {
        var $target, ctrl, enter, i, index, item, itemIsFocusable, nextCtrl, _i, _ref39, _ref40;
        $target = $(event.target).parents(JQSelector, $root).eq(0);
        index = $doms.index($target);
        enter = event.which === 13;
        ctrl = ebaui.get($target);
        if (!((ctrl != null) && ctrl.enterAsTab && ctrl.enterAsTab() && enter)) {
          return;
        }
        /*
        *   定位下一个控件
        */

        nextCtrl = null;
        if (index + 1 === len - 1) {
          item = ebaui.get($doms.eq(index + 1));
          itemIsFocusable = item && item.focusable && item.focusable();
          if (itemIsFocusable) {
            nextCtrl = item;
          }
        } else {
          for (i = _i = _ref39 = index + 1, _ref40 = len - 1; _ref39 <= _ref40 ? _i <= _ref40 : _i >= _ref40; i = _ref39 <= _ref40 ? ++_i : --_i) {
            item = ebaui.get($doms.eq(i));
            itemIsFocusable = item && item.focusable && item.focusable();
            if (itemIsFocusable) {
              nextCtrl = item;
              break;
            }
          }
        }
        if (nextCtrl != null) {
          ctrl.focused(false);
          return nextCtrl.focused(true);
        }
      });
    };

    /**
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _initControl
    */


    Form.prototype._init = function(opts) {
      var $doms, $root, JQSelector, controls, formFields, len, me, _ref39, _ref40, _ref41;
      Form.__super__._init.call(this, opts);
      me = this;
      /* 
      *   初始化控件自身的一系列属性
      */

      me._action = (_ref39 = opts['action']) != null ? _ref39 : '';
      me._method = (_ref40 = opts['method']) != null ? _ref40 : 'GET';
      me._acceptCharset = (_ref41 = opts['acceptCharset']) != null ? _ref41 : '';
      if (opts['enctype']) {
        me._enctype = opts['enctype'];
      }
      /*
      *   init fields
      */

      $root = me._$root;
      JQSelector = me._ctrlJQSelector;
      controls = me._formControls();
      $doms = $(JQSelector, $root);
      len = $doms.size();
      formFields = [];
      $doms.each(function(index, el) {
        var ctrl;
        ctrl = ebaui.get(el);
        if (ctrl && ctrl.value) {
          return formFields.push(ctrl);
          /*
          *   设置当前控件的按下tab之后的下一个要聚焦的控件
          */

          /*
          for j in [index + 1..len-1]
              next = ebaui.get( $doms.eq( j ) )
              if next and next.focusable()
                  ctrl['__nextTab__'] = next
                  break
          */

        }
      });
      return me._fields = formFields;
    };

    Form.prototype._fields = [];

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


    Form.prototype.fields = function() {
      return this._fields;
    };

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


    Form.prototype.elements = function() {
      return this._fields;
    };

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


    Form.prototype.data = function(data) {
      var formData, me;
      me = this;
      if (!data) {
        formData = {};
        me._eachField(function(field) {
          var name;
          if (!field['data']) {
            return;
          }
          name = field.name();
          data = field.data();
          return formData[name] = data;
        });
        return formData;
      }
      formData = me.isString(data) ? ebaui.fromJSON(data) : data;
      me._eachField(function(field) {
        var fieldData, name;
        name = field.name();
        fieldData = formData[name];
        if (fieldData) {
          return field.data(fieldData);
        }
      });
      return void 0;
    };

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


    Form.prototype.value = function(formValue) {
      var formVal, me;
      me = this;
      /*
      *   get value
      */

      if (!formValue) {
        formVal = {};
        me._eachField(function(field) {
          var name, val;
          if (!field['value']) {
            return;
          }
          name = field.name();
          if (!name) {
            return;
          }
          val = field.value();
          /*
          *   如果不是checkbox控件
          */

          if (!field['checked']) {
            /*
            *   如果控件的值是数组
            */

            if (me.isArray(val)) {
              formVal[name] = val.join(',');
            } else {
              formVal[name] = val;
            }
            return;
          }
          /*
          *   如果是checkbox控件
          */

          if (field['checked'] && field['checked']()) {
            formVal[name] = val;
          }
        });
        return formVal;
      }
      /*
      *   set value
      */

      if (me.isString(formValue)) {
        formValue = ebaui.fromJSON(formValue);
      }
      me._eachField(function(field) {
        var name, val;
        name = field.name();
        val = formValue[name];
        if (val) {
          return field.value(val);
        }
      });
      return void 0;
    };

    Form.prototype._action = '';

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


    Form.prototype.action = function(val) {
      var me;
      me = this;
      val = $.trim(val);
      if (!(val.length > 0)) {
        return me._action;
      }
      return me._action = val;
    };

    Form.prototype._method = 'GET';

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


    Form.prototype.method = function(val) {
      var me;
      me = this;
      if (!/get|post/i.test(val)) {
        return me._method;
      }
      return me._method = val.toUpperCase();
    };

    Form.prototype._acceptCharset = 'uft-8';

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


    Form.prototype.acceptCharset = function(val) {
      var me;
      me = this;
      val = $.trim(val);
      if (!(val.length > 0)) {
        return me._acceptCharset;
      }
      return me._acceptCharset = val;
    };

    Form.prototype._enctype = 'application/x-www-form-urlencoded';

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


    Form.prototype.enctype = function(val) {
      var me;
      me = this;
      val = $.trim(val);
      if (!(val.length > 0)) {
        return me._enctype;
      }
      return me._enctype = val;
    };

    /**
     *  验证表单
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     validate
     *  @tutorial   form_data
     *  @return     {Boolean}
    */


    Form.prototype.validate = function() {
      var field, fields, i, isValid, len, me, _i, _len;
      me = this;
      fields = me.fields();
      if (fields.length === 0) {
        return true;
      }
      len = fields.length;
      isValid = fields[0].validate();
      if (len > 1) {
        for (i = _i = 0, _len = fields.length; _i < _len; i = ++_i) {
          field = fields[i];
          isValid = (fields[i].validate()) && isValid;
        }
      }
      me._isValid = isValid;
      return isValid;
    };

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


    Form.prototype.reset = function() {
      return this._eachField(function(field) {
        if (field['reset']) {
          return field.reset();
        }
      });
    };

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


    Form.prototype.submit = function(settings) {
      var action, ajaxConf, isGET, me, toSubmit;
      me = this;
      action = me.action();
      isGET = me.method() === 'GET';
      toSubmit = me.value();
      if (settings && settings.data) {
        toSubmit = $.extend(toSubmit, settings.data);
        delete settings.data;
      }
      ajaxConf = $.extend({
        type: isGET ? 'GET' : 'POST',
        url: action,
        data: toSubmit
      }, settings);
      return $.ajax(ajaxConf);
    };

    return Form;

  })(Control);

  ebaui.web.registerControl('Form', Form);

}).call(this);
