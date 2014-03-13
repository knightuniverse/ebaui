###*
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
###
class TextArea extends TextBox
    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextArea
     *  @method     _init
     ###
    _init : ( opts ) ->
        super( opts )
        me = this
        ### 
        *   初始化控件自身的一系列属性
        *   默认情况下，textarea要支持换行，但是说，不能一换行就自动切换了
        ###
        me._enterAsTab = false
        return undefined

ebaui['web'].registerFormControl( 'TextArea',TextArea )