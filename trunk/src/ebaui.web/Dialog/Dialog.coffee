ns = ebaui
vexDialog = vex.dialog

### 
 *  文档请参考 http://api.jquery.com/jQuery.ajax/
 *  @method     ajax
 *  @memberof   ebaui
###
ns['ajax'] = jQuery.ajax

### 
 *  文档请参考 http://api.jquery.com/jQuery.get/
 *  @method     httpGet
 *  @memberof   ebaui
###
ns['httpGet'] = jQuery.get

### 
 *  http://api.jquery.com/jQuery.post/
 *  @method     httpPost
 *  @memberof   ebaui
###
ns['httpPost'] = jQuery.post

###
 *  给指定的HTML元素设置遮罩
 *  @method     mask
 *  @memberof   ebaui
 *  @param      {Object}    selector                 -   必选，jquery 选择器
 *  @param      {String}    [label='']       -   可选，遮罩层的文本信息
 *  @param      {Number}    [delay=null]             -   可选，在HTML元素打上遮罩之前的延迟时间
 *  @param      {Object}    [context=null]           -   可选，jquery 选择器上下文
###
ns['mask'] = (selector, label, delay, context) ->
  label = unless label then '' else label
  $(selector, context).mask(label, delay)

### 
 *  取消指定HTML元素上的遮罩
 *  @method     unmask
 *  @memberof   ebaui
 *  @param      {Object}    selector           -   必选，jquery 选择器
 *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
###
ns['unmask'] = (selector, context) ->
  $(selector, context).unmask()

### 
 *  判断指定的HTML元素是否有遮罩
 *  @method     isMasked
 *  @memberof   ebaui
 *  @param      {Object}    selector           -   必选，jquery 选择器
 *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
###
ns['isMasked'] = (selector, context) ->
  $(selector, context).isMasked()

### 
 *  alert对话框
 *  @method     alert
 *  @memberof   ebaui
 *  @param      {String}        message                     -   alert的提示消息
###
ns['alert'] = (msg) ->
  vexDialog.alert(
    title: '提示'
    iconCls: 'icon-warning-sign'
    className: 'vex-theme-default'
    message: msg
  )

### 
 *  confirm对话框
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

### 
 *  prompt对话框
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

### 
 *  打开一个新的窗口
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
 *          title  : 'baidu'
 *      });
###
ns['win'] = (opts) ->
  return unless opts
  return if not opts['url'] or opts['content']

  iframe = if opts['url'] then true else false
  if iframe
    html = """<iframe src="#{opts['url']}" style="width:100%;" frameborder="0" scrolling="auto"></iframe>"""
  else
    html = $(opts['content']).html()

  wrapper = """
    <div class="vex-dialog-form" style="height:100%;">
        <div class="vex-dialog-title">
            <i class="#{opts['iconCls']}"></i>#{opts['title']}
        </div>
        <div class="vex-c"></div>
        <div class="vex-close"></div>
    </div>
    """
  defaults =
    title               : ''
    content             : wrapper
    width               : 800
    height              : 600
    className           : 'vex-theme-default'
    showCloseButton     : true
    overlayClosesOnClick: false
    id:'dialog-win-draggable'
    
    beforeclose         : $.noop
    afterclose          : $.noop

  opts = $.extend(defaults, opts)

  $vexContent = vex.open(opts)
  $vex = $vexContent.parent()

  $vex.css(
    'padding-top': '50px'
    'padding-bottom': '0'
  )

  $vexContent.css(
    'left' : $(window).width() * 0.5 - opts['width'] * 0.5
    'position':'absolute'
    'border': '1px #eee solid'
    'width': opts['width']
    'height': opts['height']
  )
  $("##{defaults.id}").draggable({
    cursor: "move",
    distance: 10,
    containment:'window'
    iframeFix: true
    start:() ->
      $(this).hide()

    helper:() ->
      return '<div style="width:'+opts['width']+'px;height:'+opts['height']+'px;z-index:'+1001+';background:black;opacity:0.4;"></div>'

    stop:(event,ui) ->
      $(this).css({'top':ui.position.top,'left':ui.position.left})
      $(this).show()
    })

  ###
  * 优化性能
  * 首先先打开dialog
  * 然后在更新dialog content（ content有可能就是一个iframe ）
  ###
  setTimeout( () ->

    $( 'div.vex-c',$vex ).replaceWith( html )

    if iframe
      titleH = $('.vex-dialog-title', $vexContent).outerHeight()
      $('iframe', $vexContent).css('height', $vexContent.height() - titleH)

  ,100 )