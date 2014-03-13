###*
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
###
class Label extends FormField
  ###*
   *  允许的button的state
   *  @private
   *  @instance
   *  @virtual
   *  @memberof   ebaui.web.Button
   *  @member     {String}    _availableState
  ###
  _availableState: /white|primary|info|success|warning|danger|\s+/i

  ###*
   *  更新lable标签的边框
   *  @private
   *  @instance
   *  @memberof   ebaui.web.Label
   *  @method     _updateCssBorder
  ###
  _updateCssBorder: () ->
    me    = this
    $root = me.uiElement()
    cls   = $root.attr('class')

    hasCss = cls.indexOf( 'eba-nobor' ) > -1 or cls.indexOf( 'eba-bor' ) > -1
    if hasCss
      if me.hasBorder() 
        cls.replace('eba-nobor', 'eba-bor')
      else
        cls.replace('eba-bor', 'eba-nobor')
    else if me.hasBorder()
      cls += " eba-bor"

    $root.attr('class', cls)

  ###*
   *  更新lable标签的文字对其方式
   *  @private
   *  @instance
   *  @memberof   ebaui.web.Label
   *  @method     _updateCssTextAlign
  ###
  _updateCssTextAlign: () ->
    me = this
    $root = me.uiElement()
    align = me.textAlign()
    cls = $root.attr('class')
    alignment =
      'left': 'eba-txtl'
      'center': 'eba-txtc'
      'right': 'eba-txtr'

    cls.replace('eba-txtl', ' ')
    .replace('eba-txtc', ' ')
    .replace('eba-txtr', ' ')

    cls += ' ' + alignment[align]
    $root.attr('class', cls)

  ###*
   *  更新lable标签的文本
   *  @private
   *  @instance
   *  @memberof   ebaui.web.Label
   *  @method     _updateAttrText
  ###
  _updateAttrText: () ->
    me = this
    $root = me.uiElement()
    $root.text(me.text())

  ###*
   *  更新lable标签的for属性
   *  @private
   *  @instance
   *  @memberof   ebaui.web.Label
   *  @method     _updateAttrText
  ###
  _updateAttrFor: () ->
    me = this
    $root = me.uiElement()
    $root.attr('for', me.for())

  ###*
   *  更新UI显示
   *  @private
   *  @instance
   *  @memberof   ebaui.web.Label
   *  @method     _render
  ###
  _render: () ->
    super()
    me = this
    me._updateCssBorder()
    me._updateCssTextAlign()
    me._updateAttrText()
    me._updateCssStates()

  ###*
   *  初始化控件，声明内部变量
   *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
   *  @private
   *  @instance
   *  @memberof   ebaui.web.TextBox
   *  @method     _init
   *  @todo       maxlength等属性的初始化
   ###
  _init: (opts) ->
    super(opts)
    me = this
    me._text = opts['text'] ? ''
    me._for = opts['for'] ? ''
    me._state = opts['state'] ? ''
    me._hasBorder = opts['hasBorder'] ? false
    me._textAlign = opts['textAlign'] ? 'right'

  _state: ''
  ###*
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
  ###
  state: (val) ->
    me = this
    return me._state unless me._availableState.test(val)
    me._state = val.toLowerCase()
    me._updateCssStates()

  ###*
   *  更新label文字的颜色
   *  @private
   *  @instance
   *  @memberof   ebaui.web.Label
   *  @method     _updateCssStates
  ###
  _updateCssStates: () ->
    me = this
    $root = me.uiElement()
    state = me.state()
    cls = $root.attr('class')
    $root.attr('class', "#{cls} label-#{state}") if state.length > 0

  _hasBorder: false
  ###*
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
  ###
  hasBorder: (val) ->
    me = this
    return me._hasBorder unless me.isBoolean(val)

    me._hasBorder = val
    me._updateCssBorder()

  _text: ''
  ###*
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
  ###
  text: (val) ->
    me = this
    return me._text unless me.isString(val)
    me._text = val
    me._updateAttrText()

  _for: ''
  ###*
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
  ###
  for: (val) ->
    me = this
    return me._for unless me.isString(val)
    me._for = val
    me._updateAttrFor()

  ###*
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
  ###
  data: (val) ->
    me = this
    return me._text unless me.isString(val)
    me._text = val
    me._updateAttrText()

  _textAlign: 'right'
  ###*
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
  ###
  textAlign: (val) ->
    me = this
    re = /left|center|right/i
    return me._textAlign unless re.test(val)
    me._textAlign = val
    me._updateCssTextAlign()

ebaui['web'].registerFormControl('Label', Label)