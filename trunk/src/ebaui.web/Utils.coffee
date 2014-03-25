#!/usr/bin/env coffee
ns = ebaui

###*
 *  �ĵ���ο� http://api.jquery.com/jQuery.ajax/
 *  @static
 *  @method     ajax
 *  @memberof   ebaui
###
ns['ajax'] = jQuery.ajax

###*
 *  �ĵ���ο� http://api.jquery.com/jQuery.get/
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
 *  ��ָ����HTMLԪ����������
 *  @static
 *  @method     mask
 *  @memberof   ebaui
 *  @param      {Object}    selector           -   ��ѡ��jquery ѡ����
 *  @param      {String}    [label='']         -   ��ѡ�����ֲ���ı���Ϣ
 *  @param      {Number}    [delay=null]       -   ��ѡ����HTMLԪ�ش�������֮ǰ���ӳ�ʱ��
 *  @param      {Object}    [context=null]     -   ��ѡ��jquery ѡ����������
###
ns['mask'] = (selector, label, delay, context) ->
  label = unless label then '' else label
  $(selector, context).mask(label, delay)

###*
 *  ȡ��ָ��HTMLԪ���ϵ�����
 *  @static
 *  @method     unmask
 *  @memberof   ebaui
 *  @param      {Object}    selector           -   ��ѡ��jquery ѡ����
 *  @param      {Object}    [context=null]     -   ��ѡ��jquery ѡ����������
###
ns['unmask'] = (selector, context) -> $(selector, context).unmask()

###*
 *  �ж�ָ����HTMLԪ���Ƿ�������
 *  @static
 *  @method     isMasked
 *  @memberof   ebaui
 *  @param      {Object}    selector           -   ��ѡ��jquery ѡ����
 *  @param      {Object}    [context=null]     -   ��ѡ��jquery ѡ����������
###
ns['isMasked'] = (selector, context) -> $(selector, context).isMasked()