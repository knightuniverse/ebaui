###*
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
###
class Hidden extends FormField
    ###*
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