class RadioList extends CheckBoxList
    ###
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _finishLoading
    ###
    _finishLoading:() ->
        me = this
        me._renderItems()
        $root      = me.uiElement()
        checkedVal = me.value()

        $radio = $( "input[value='#{checkedVal}']", $root )
        $radio.prop('checked',true)

    ###
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
    ###
    data: ( val ) ->
        me         = this
        valueField = me.valueField()
        # get #
        return me._data unless val? and val[valueField]?

        ### set ###
        me.value( val[valueField] )

        return undefined

    ###
     *  获取或者设置CheckBoxList的选中项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}     value
     *  @example    <caption>get</caption>
     *      pair = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( [1,2,3] );
    ###
    value : ( val ) ->
        me    = this
        $root = me.uiElement()
        # get #
        return me._value unless val? and me._value isnt val

        me._value = val
        $radio = $( "input[value='#{val}']",$root)
        $radio.prop('checked',true) if $radio.size() > 0

ebaui['web'].registerFormControl( 'RadioList',RadioList )