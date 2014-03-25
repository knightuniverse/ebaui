ns        = ebaui
vexDialog = vex.dialog

###*
*   @class      Dialog
*   @memberof   ebaui.web
*   @author     monkey          <knightuniverse@qq.com>
*   @param      {Object}        element     -   dom对象
*   @param      {Object}        options     -   控件配置参数
*   @prop       {String}        options.title             -   窗口的标题
*   @prop       {String}        options.url               -   窗口的url地址，优先使用
*   @prop       {String}        options.iconCls           -   窗口的icon
*   @prop       {String}        options.content           -   作为窗口的静态内容，如果url为空，则采用content作为窗口内容
*   @prop       {Number}        options.width             -   窗口的宽度
*   @prop       {Number}        options.height            -   窗口的高度
*   @prop       {Function}      options.beforeclose       -   关闭窗口前的事件处理程序
*   @prop       {Function}      options.afterclose        -   关闭窗口后的事件处理程序
*   @prop       {Boolean}       options.showButtons       -   是否显示按钮
###

###*
*   apply button按下后出发该事件
*   @event      ebaui.web.Dialog#apply
*   @arg        {ebaui.web.Dialog}  sender
*   @arg        {Object}            eventArgs
###

###*
*   cancel button按下后出发该事件
*   @event      ebaui.web.Dialog#cancel
*   @arg        {ebaui.web.Dialog}  sender
*   @arg        {Object}            eventArgs
###
class Dialog extends Control

    _updateCssWidth:() ->
    
    _updateCssHeight:() ->
    
    ###*
    *  初始化控件，声明内部变量
    *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
    *  @private
    *  @instance
    *  @memberof   ebaui.web.Dialog
    *  @method     _init
    ###
    _init : ( opts ) ->
        super( opts )
        me                      = this
        ns                      = ebaui.web
        me._id                  = me._controlID
        me._vexOptions          = $.extend( {}, ns.Dialog.defaults, opts )
        me._vexOptions['id']    = me._controlID
        
        ###
        *   设置contentType
        ###
        me._contentType = if opts['url'] then 'iframe' else 'html'
        
        me.open()
    
    ###*
    *   初始化DOM事件处理程序
    *   @private
    *   @instance
    *   @memberof   ebaui.web.Dialog
    *   @method     _setupEvents
    *   @param      {Object}        options     -   控件配置参数
    ###
    _setupEvents:( opts )->
        me      = this
        $root   = me._$root
        
        return unless $root
        
        me.onEvent( 'apply' , opts['apply'] )
        me.onEvent( 'cancel', opts['cancel'] )
        
        ###
        *   setup event handles
        ###
        $root.on( 'click','input.vex-dialog-button-primary',( eventArgs ) ->
            me.triggerEvent( 'apply',eventArgs )
        )
        
        $root.on( 'click','input.vex-dialog-button-secondary',( eventArgs ) ->
            me.triggerEvent( 'cancel',eventArgs )
            me.close()
        )
    
    ###*
    *  
    *  @private
    *  @instance
    *  @memberof   ebaui.web.Dialog
    *  @method     _compiledRootTmpl
    *  @arg        {Object}    options
    ###
    _compiledRootTmpl:( opts ) ->
        ###
        *   vex dialog的content的outter html
        ###
        wrapper = """
            <div class="vex-dialog-form" style="height:100%;">
                <div class="vex-dialog-title">
                    <i class="#{opts['iconCls']}"></i>#{opts['title']}
                </div>
                <div class="vex-c"></div>
                <div class="vex-b"></div>
            </div>
        """
        
        return wrapper
    
    ###*
    *  
    *  @private
    *  @instance
    *  @memberof   ebaui.web.Dialog
    *  @method     _compiledBtnTmpl
    *  @arg        {Array}    buttons
    ###
    _compiledBtnTmpl:( buttons )->
        return '' unless buttons? and buttons.length > 0
        ###
        *   $( '.vex-dialog-buttons' ).outerHeight == 40
        ###
        html = """<div class="vex-dialog-buttons" style="border:none;background: none;">"""
        max  = buttons.length - 1
        for button, index in buttons  
            html += """
                <input class="#{button.className}
                          vex-dialog-button
                          #{index is 0 ? 'vex-first ' : ''}
                          #{index is max ? 'vex-last ' : ''}"
                          type="#{button.type}" value="#{button.text}" />
            """
          
        html += """</div>"""
        return html
    
    _contentType : null
    ###*
    *  获取dialog的内容类型
    *  @public
    *  @readonly
    *  @instance
    *  @member     {String}    contentType
    *  @memberof       eabui.web.Dialog
    *  @example    <caption>get</caption>
    *      console.log( ctrl.contentType() );
    ###
    contentType  : () -> this._contentType
    
    _contentLoaded : false
    ###*
    *  判断tab的内容是否已经加载完成
    *  @public
    *  @instance
    *  @member         {Boolean}    contentLoaded
    *  @memberof       eabui.web.Dialog
    *  @example        <caption>get</caption>
    *      var loaded = tab.contentLoaded()
    ###
    contentLoaded  : () -> this._contentLoaded
    
    ###*
    *  如果dialog内是一个iframe窗口，返回iframe窗口的window对象；否则，返回null
    *  @public
    *  @instance
    *  @member         {Object}    contentWindow
    *  @returns        contentWindows或者null
    *  @example        <caption>get</caption>
    *      var contentWindow = tab.contentWindow()
    ###
    contentWindow: () ->
        me   = this
        return null unless me.contentLoaded()
        
        $ifm = $( 'iframe', me._$root )
        return null if $ifm.size() is 0
        
        win = null
        try
            win = $ifm.get(0).contentWindow
        catch e
        
        return win
    
    ###*
    *  打开dialog
    *  @public
    *  @instance
    *  @method         open
    *  @memberof       ebaui.web.Dialog
    ###
    open:()->
        me          = this
        id          = me.id()
        opts        = me._vexOptions
        showBtns    = opts.showButtons
        iframe      = me.contentType() is 'iframe'
        ###
        *   vex dialog的content的outter html
        ###
        wrapper = me._compiledRootTmpl( opts )
        
        ###
        *   设置默认的win窗口content配置
        ###
        opts['content'] = wrapper unless opts['content']
        
        if iframe
            contentHtml = """<iframe src="#{opts['url']}" style="width:100%;" frameborder="0" scrolling="auto"></iframe>"""
        else
            contentHtml = $(opts['content']).html()
          
        ###
        *   win窗口底部的buttons按钮的html
        ###
        btnsHtml = if showBtns then me._compiledBtnTmpl( opts.buttons ) else ''
        
        $vexContent = vex.open( opts )
        $vex        = $vexContent.parent()
        
        ###
        *   设置$root属性
        ###
        me._$root = $vex
        
        ###
        *   窗口默认居中
        ###
        $vex.css(
            'padding-top'   : '50px'
            'padding-bottom': '0'
        )
      
        $vexContent.css(
            'left'    : $(window).width() * 0.5 - opts['width'] * 0.5
            'position': 'absolute'
            'border'  : '1px #eee solid'
            'width'   : opts['width']
            'height'  : opts['height']
        )
        
        ###
        *   支持窗口的拖放功能
        ###
        $("##{id}").draggable({
            cursor: "move",
            distance: 10,
            containment:'window'
            iframeFix: true
            start:() -> $(this).hide()
        
            helper:() ->
                return '<div style="width:'+opts['width']+'px;height:'+opts['height']+'px;z-index:'+1001+';background:black;opacity:0.4;"></div>'
        
            stop:(event,ui) ->
                $this = $( this )
                $this.css({'top':ui.position.top,'left':ui.position.left})
                $this.show()
        })
    
        ###
        * 优化性能
        * 首先先打开dialog
        * 然后在更新dialog content（ content有可能就是一个iframe ）
        ###
        setTimeout( () ->
            ###
            *   注入iframe的html
            ###
            $( 'div.vex-c',$vex ).replaceWith( contentHtml )
            ###
            *   注入win窗口底部的buttons的html
            ###
            $( 'div.vex-b',$vex ).replaceWith( btnsHtml )
            
            if iframe
                titleH = $('.vex-dialog-title', $vexContent).outerHeight()
                ###
                *   resize iframe height
                ###
                ifmHeight = $vexContent.height() - titleH
                ###
                *   如果win窗口还要显示底部的Buttons，那么还是要剪掉Buttons的高度的
                ###
                ifmHeight = ifmHeight - 40 if opts.showButtons
                $ifm = $('iframe', $vexContent)
                $ifm.css('height', ifmHeight).on( 'load',( eventArgs ) -> me._contentLoaded = true )
          
        ,500 )
    
    ###*
    *  关闭dialog
    *  @public
    *  @instance
    *  @method         close
    *  @memberof       ebaui.web.Dialog
    ###
    close:() ->
        me      = this
        ###
        *   remove all event handles
        ###
        me._$root.off()
        ###
        *   because you are close the window
        ###
        me._contentLoaded = false
        ###
        *   close dialog
        ###
        vex.close( me.id() )

###*
*   Dialog的默认配置
*   @static
*   @memberof   ebaui.web.Dialog
###
Dialog.defaults =
    title               : ''
    content             : ''
    width               : 800
    height              : 600
    className           : 'vex-theme-default'
    showCloseButton     : true
    overlayClosesOnClick: false
    id                  : 'dialog-win-draggable'
    
    beforeclose         : $.noop
    afterclose          : $.noop
    apply               : $.noop
    cancel              : $.noop
    
    showButtons         : false
    buttons             : [
                            {text: 'Cancel',type: 'button',className: 'vex-dialog-button-secondary'},
                            {text: 'OK',type: 'submit',className: 'vex-dialog-button-primary'}
                          ]

ebaui['web']['Dialog'] = Dialog

###*
*  打开一个新的窗口
*  @static
*  @method     win
*  @memberof   ebaui
*  @returns    {String}        窗口ID
*  @param      {Object}        options                   -   配置对象
*  @prop       {String}        options.title             -   窗口的标题
*  @prop       {String}        options.url               -   窗口的url地址，优先使用
*  @prop       {String}        options.iconCls           -   窗口的icon
*  @prop       {String}        options.content           -   作为窗口的静态内容，如果url为空，则采用content作为窗口内容
*  @prop       {Number}        options.width             -   窗口的宽度
*  @prop       {Number}        options.height            -   窗口的高度
*  @prop       {Function}      options.beforeclose       -   关闭窗口前的事件处理程序
*  @prop       {Function}      options.afterclose        -   关闭窗口后的事件处理程序
*  @prop       {Boolean}       options.showButtons       -   是否显示按钮
*  @example
*      ebaui.win({
*          url    : 'http://www.baidu.com',
*          title  : 'baidu',
*          width  : 400
*          height : 300
*      });
###
ns['win'] = ( opts ) -> new Dialog( null,opts )

###*
*  关闭窗口
*  @static
*  @method     closeWin
*  @memberof   ebaui
*  @param      {String}    id  -   窗口ID
*  @example
*      ebaui.closeWin();
###
ns['closeWin'] = ( id ) -> vex.close( id )

###*
 *  alert对话框
 *  @static
 *  @method     alert
 *  @memberof   ebaui
 *  @param      {String}        message        -   alert的提示消息
 *  @example
 *    ebaui.alert( 'alert message' )
###
ns['alert'] = (msg) ->
  vexDialog.alert(
    title: '提示'
    iconCls: 'icon-warning-sign'
    className: 'vex-theme-default'
    message: msg
  )

###*
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
###
ns['confirm'] = (opts) ->
  vexOpts = $.extend({}, {
    title: '确认'
    iconCls: 'icon-question-sign'
    className: 'vex-theme-default'
    buttons: [vexDialog.buttons.NO, vexDialog.buttons.YES]
  }, opts)
  vexDialog.confirm(vexOpts)

###*
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
###
ns['prompt'] = (opts) ->
  opts = $.extend({}, {
    title: '提示'
    className: 'vex-theme-default'
    buttons: [vexDialog.buttons.NO, vexDialog.buttons.YES]
  }, opts)
  vexDialog.prompt(opts)