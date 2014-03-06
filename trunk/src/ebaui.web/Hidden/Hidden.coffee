class Hidden extends FormField
    ###
     *  获取或者设置控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Hidden
     *  @member     {Object}     value
     *  @example    <caption>get</caption>
     *      var pair = ctrl.value();
    ###
    _doValueAccess: ( val ) ->
        me = this
        return me._value unless val?
        me._value = val

    data: ( val ) -> @_doValueAccess( val )

    value: ( val ) -> @_doValueAccess( val )

ebaui['web'].registerFormControl( 'Hidden',Hidden )