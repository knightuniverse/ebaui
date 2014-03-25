###*
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
###
class CheckBox extends FormField
    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _render
    ###
    _render: () ->
        super()
        me = this
        me._updateCssChecked()
        me._updateAttrText()

    ###*
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _setupEvents
    ###
    _setupEvents: ( opts ) ->
        me    = this
        $root = me._$root
        me.onEvent( 'change',opts['onchange'] )
        
        $root.on( 'change','input',( event ) ->
            me._checked = this.checked
            me.triggerEvent( 'change',event )
        )

        return undefined

    ###*
     *  重写Control类的_updateAttrId方法
     *  ，更新$root的id属性的同时
     *  ，会更新input以及label的id for属性，增加可用性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _updateAttrId
     ###
    _updateAttrId:() ->
        super()
        me        = this
        $root     = me.uiElement()
        $input    = me._$formInput;
        controlID = me.controlID()
        #  控件的可用性 #
        $input.attr( 'id',controlID )
        $( 'label',$root ).attr( 'for',controlID )

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _init
    ###
    _init : ( opts ) ->
        super( opts )
        me             = this
        me._$formInput = $( 'input',me._$root )
        
        ### 初始化控件自身的一系列属性  ###
        me._text       = opts['text'] ? false
        me._checked    = opts['checked'] ? false
        me._valueField = opts['valueField'] ? 'value'
        me._value      = opts['value'] ? true
        me._textField  = opts['textField'] ? 'text'

    ###*
     *  更新UI界面的label文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _updateAttrText
    ###
    _updateAttrText:() -> 
        me    = this
        $root = me.uiElement()
        $( 'label',$root ).text( me.text() )

    ###*
     *  更新CheckBox的选中样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBox
     *  @method     _updateCssChecked
    ###
    _updateCssChecked : () ->
        me = this
        me._$formInput.prop( 'checked',me.checked() )
        
    _text: ''
    ###*
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
    ###
    text:( val ) ->
        me = this
        return me._text unless me.isString( val )
        me._text = val
        me._updateAttrText()

    ###*
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
    ###
    data: ( val ) ->
        me = this
        return me._checked if me.isNull(val)

        text = val[me.textField()]
        me.text( text ) if text

        value = val[me.valueField()]
        me.value( value ) unless me.isNull(val)
        me.checked( val['checked'] ) if me.isBoolean( val['checked'] )

        return undefined

    ###*
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
    ###
    value : ( val ) ->
        me = this
        return me._value unless val?
        return if me._value is val
        me._value = val

    _checked: false
    ###*
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
    ###
    checked : ( val ) ->
        me = this
        return me._checked unless me.isBoolean( val )
        me._checked = val
        me._updateCssChecked()

    _valueField: 'value'
    ###*
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
    ###
    valueField : ( val ) ->
        me = this
        return me._valueField unless me.isString( val )
        me._valueField = val

    _textField: 'text'
    ###*
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
    ###
    textField : ( val ) ->
        me = this
        return me._textField unless me.isString( val )
        me._textField = val

ebaui['web'].registerFormControl( 'CheckBox',CheckBox )