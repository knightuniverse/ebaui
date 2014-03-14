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
;(function($){
/**
 * jqGrid Chinese Translation for v4.2
 * henryyan 2011.11.30
 * http://www.wsria.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * update 2011.11.30
 *		add double u3000 SPACE for search:odata to fix SEARCH box display err when narrow width from only use of eq/ne/cn/in/lt/gt operator under IE6/7
**/
$.jgrid = $.jgrid || {};
$.extend($.jgrid,{
	defaults : {
		recordtext: "{0} - {1}\u3000共 {2} 条",	// 共字前是全角空格
		emptyrecords: "无数据显示",
		loadtext: "读取中...",
		pgtext : " {0} 共 {1} 页"
	},
	search : {
		caption: "搜索...",
		Find: "查找",
		Reset: "重置",
		odata : [{oper:'eq', text:'等于\u3000\u3000'},{oper:'ne', text: '不等\u3000\u3000'}, { oper:'lt', text:'小于\u3000\u3000'},{ oper:'le', text: '小于等于'},{ oper:'gt', text:'大于\u3000\u3000'},{ oper:'ge', text:'大于等于'},
			{oper:'bw', text:'开始于'},{ oper:'bn', text:'不开始于'},{ oper:'in', text:'属于\u3000\u3000'},{ oper:'ni', text:'不属于'},{ oper:'ew', text:'结束于'},{ oper:'en', text:'不结束于'},{ oper:'cn', text:'包含\u3000\u3000'},{ oper:'nc', text:'不包含'},{ oper:'nu', text:'空值于\u3000\u3000'},{ oper:'nn', text:'非空值'}],
		groupOps: [	{ op: "AND", text: "所有" },	{ op: "OR",  text: "任一" }	]
	},
	edit : {
		addCaption: "添加记录",
		editCaption: "编辑记录",
		bSubmit: "提交",
		bCancel: "取消",
		bClose: "关闭",
		saveData: "数据已改变，是否保存？",
		bYes : "是",
		bNo : "否",
		bExit : "取消",
		msg: {
			required:"此字段必需",
			number:"请输入有效数字",
			minValue:"输值必须大于等于 ",
			maxValue:"输值必须小于等于 ",
			email: "这不是有效的e-mail地址",
			integer: "请输入有效整数",
			date: "请输入有效时间",
			url: "无效网址。前缀必须为 ('http://' 或 'https://')",
			nodefined : " 未定义！",
			novalue : " 需要返回值！",
			customarray : "自定义函数需要返回数组！",
			customfcheck : "Custom function should be present in case of custom checking!"
			
		}
	},
	view : {
		caption: "查看记录",
		bClose: "关闭"
	},
	del : {
		caption: "删除",
		msg: "删除所选记录？",
		bSubmit: "删除",
		bCancel: "取消"
	},
	nav : {
		edittext: "",
		edittitle: "编辑所选记录",
		addtext:"",
		addtitle: "添加新记录",
		deltext: "",
		deltitle: "删除所选记录",
		searchtext: "",
		searchtitle: "查找",
		refreshtext: "",
		refreshtitle: "刷新表格",
		alertcap: "注意",
		alerttext: "请选择记录",
		viewtext: "",
		viewtitle: "查看所选记录"
	},
	col : {
		caption: "选择列",
		bSubmit: "确定",
		bCancel: "取消"
	},
	errors : {
		errcap : "错误",
		nourl : "没有设置url",
		norecords: "没有要处理的记录",
		model : "colNames 和 colModel 长度不等！"
	},
	formatter : {
		integer : {thousandsSeparator: " ", defaultValue: '0'},
		number : {decimalSeparator:".", thousandsSeparator: " ", decimalPlaces: 2, defaultValue: '0.00'},
		currency : {decimalSeparator:".", thousandsSeparator: " ", decimalPlaces: 2, prefix: "", suffix:"", defaultValue: '0.00'},
		date : {
			dayNames:   [
				"Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat",
		         "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			],
			AmPm : ["am","pm","AM","PM"],
			S: function (j) {return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th'},
			srcformat: 'Y-m-d',
			newformat: 'm-d-Y',
			parseRe : /[Tt\\\/:_;.,\t\s-]/,
			masks : {
				ISO8601Long:"Y-m-d H:i:s",
				ISO8601Short:"Y-m-d",
				ShortDate: "Y/j/n",
				LongDate: "l, F d, Y",
				FullDateTime: "l, F d, Y g:i:s A",
				MonthDay: "F d",
				ShortTime: "g:i A",
				LongTime: "g:i:s A",
				SortableDateTime: "Y-m-d\\TH:i:s",
				UniversalSortableDateTime: "Y-m-d H:i:sO",
				YearMonth: "F, Y"
			},
			reformatAfterEdit : false
		},
		baseLinkUrl: '',
		showAction: '',
		target: '',
		checkbox : {disabled:true},
		idName : 'id'
	}
});
})(jQuery);
