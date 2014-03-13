###*
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
###
class Password extends TextBox

    _init:( opts ) ->
        super( opts )
        ### password 的长度不做任何限制 ###
        this._maxLength = 0

ebaui['web'].registerFormControl( 'Password',Password )