/**
 *  ebaui.lang.zh_CN.js,简体中文本地化文件
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,ebaui ){

    if( moment ){ moment.lang('zh-cn'); }

    var webctrls                                                   = ebaui['web'];
    var validationRules                                            = webctrls['validationRules'];
    
    validationRules['required'].prototype.message                  = '该输入项为必输项';
    validationRules['email'].prototype.message                     = '请输入有效的电子邮件地址';
    validationRules['url'].prototype.message                       = '请输入有效的URL地址';
    
    validationRules['len'].prototype._parameterInvalidException    = '请设置合法的最小文本长度和最大文本长度';
    validationRules['len'].prototype._originalMessage              = '字符串长度应该介于 {0} 和 {1} 之间';
    validationRules['len'].prototype.message                       = '字符串长度应该介于 {0} 和 {1} 之间';
    
    validationRules['remote'].prototype._parameterInvalidException = '请正确配置remote验证规则的参数，其中url和pass参数是必选项';
    
    webctrls.Calendar.prototype._titleDisplayFormat                = 'YYYY年MM月';
    webctrls.Calendar.prototype._formatInvalidException            = '日期格式异常，请输入正确格式的日期!';
    webctrls.Calendar.prototype._weeks                             = ['日', '一', '二', '三', '四', '五', '六'];
    webctrls.Calendar.prototype._months                            = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    
    webctrls.DateTimePicker.prototype._buttons.today.text          = '今天';
    webctrls.DateTimePicker.prototype._buttons.ok.text             = '确定';
    webctrls.DateTimePicker.prototype._buttons.clear.text          = '清除';
    webctrls.DateTimePicker.prototype._formatInvalidException      = '日期格式异常，请输入正确格式的日期!';
    
    webctrls.FileUploader.prototype._uploadUrlEmptyException       = 'uploadUrl属性不能为空！';
    
    vex.dialog.buttons.YES.text                                    = '确认';
    vex.dialog.buttons.NO.text                                     = '取消';

    /*var uiLayoutPanesConf = ebaui.web.UiLayout.prototype.options['layout']['panes'];
    var westToggler = uiLayoutPanesConf['west']['toggler'];
    westToggler['open']['tip'] = '关闭';
    westToggler['close']['tip'] = '打开';

    var eastToggler = uiLayoutPanesConf['east']['toggler'];
    eastToggler['open']['tip'] = '关闭';
    eastToggler['close']['tip'] = '打开';

    var northToggler = uiLayoutPanesConf['north']['toggler'];
    northToggler['open']['tip'] = '关闭';
    northToggler['close']['tip'] = '打开';

    var southToggler = uiLayoutPanesConf['south']['toggler'];
    southToggler['open']['tip'] = '关闭';
    southToggler['close']['tip'] = '打开';*/
    

})( jQuery,ebaui );