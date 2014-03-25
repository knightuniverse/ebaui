#!/usr/bin/env coffee
ns = ebaui

###*
 *  文档请参考 http://api.jquery.com/jQuery.ajax/
 *  @static
 *  @method     ajax
 *  @memberof   ebaui
###
ns['ajax'] = jQuery.ajax

###*
 *  文档请参考 http://api.jquery.com/jQuery.get/
 *  @static
 *  @method     httpGet
 *  @memberof   ebaui
###
ns['httpGet'] = jQuery.get

###*
 *  http://api.jquery.com/jQuery.post/
 *  @static
 *  @method     httpPost
 *  @memberof   ebaui
###
ns['httpPost'] = jQuery.post

###*
 *  给指定的HTML元素设置遮罩
 *  @static
 *  @method     mask
 *  @memberof   ebaui
 *  @param      {Object}    selector           -   必选，jquery 选择器
 *  @param      {String}    [label='']         -   可选，遮罩层的文本信息
 *  @param      {Number}    [delay=null]       -   可选，在HTML元素打上遮罩之前的延迟时间
 *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
###
ns['mask'] = (selector, label, delay, context) ->
  label = unless label then '' else label
  $(selector, context).mask(label, delay)

###*
 *  取消指定HTML元素上的遮罩
 *  @static
 *  @method     unmask
 *  @memberof   ebaui
 *  @param      {Object}    selector           -   必选，jquery 选择器
 *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
###
ns['unmask'] = (selector, context) -> $(selector, context).unmask()

###*
 *  判断指定的HTML元素是否有遮罩
 *  @static
 *  @method     isMasked
 *  @memberof   ebaui
 *  @param      {Object}    selector           -   必选，jquery 选择器
 *  @param      {Object}    [context=null]     -   可选，jquery 选择器上下文
###
ns['isMasked'] = (selector, context) -> $(selector, context).isMasked()