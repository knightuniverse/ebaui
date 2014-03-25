###
*  native对象拓展
*  String.prototype.trim()
*      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
###
StringProto      = String.prototype
StringProto.trim ?= () -> this.replace(/^\s+|\s+$/gm, '')

uuid  = 0
###*
*   ebaui 全局命名空间
*   @namespace  ebaui
*   @author Monkey <knightuniverse@qq.com>
###
ebaui = 
    escape: ( str ) -> 
        re = /[&<>"']/g
        map = 
            '&': '&amp;'
            '<': '&lt;'
            '>': '&gt;'
            '"': '&quot;'
            "'": '&#x27;'

        return ('' + str).replace(re, ( match ) -> map[match]) if str?
        return ''

    unescape: ( str ) ->
        re = /(&amp;|&lt;|&gt;|&quot;|&#x27;)/g;
        map = 
            '&amp;' : '&'
            '&lt;'  : '<'
            '&gt;'  : '>'
            '&quot;': '"'
            '&#x27;': "'"

        return ('' + str).replace(re,( match ) -> map[match]) if str?
        return ''
    
    ###*
     *  生成guid
     *  @public
     *  @static
     *  @method     guid
     *  @memberof   ebaui
     *  @return     {String}    guid
     ###
    guid:() -> "eba-ui-#{++uuid}"

    ###*
     *  根据控件ID获取控件对象
     *  @public
     *  @static
     *  @method     getById
     *  @memberof   ebaui
     *  @param      {String}    id              -   控件ID
     *  @param      {String}    [contextId]     -   控件上下文容器ID
     *  @return     {Object}
     ###
    getById:( id,context ) -> ebaui.get('#' + id,context)

    ###*
     *  根据css选择器获取控件对象
     *  @public
     *  @static
     *  @method     get
     *  @memberof   ebaui
     *  @param      {String}    cssSelector   -   控件css选择器
     *  @param      {String}    [context]     -   控件上下文容器css选择器
     *  @return     {Object}
     ###
    get:( selector,context ) -> $( selector,context ).data('model')

    ###*
     *  加载PC端HTML模板信息，并且自动初始化每一个UI控件
     *  @public
     *  @static
     *  @method     parseUi
     *  @memberof   ebaui.web
     *  @param      {String}    上下文CSS选择器
     ###
    parseUi:( context ) -> this.web.parseUi( context )

window['ebaui'] = ebaui