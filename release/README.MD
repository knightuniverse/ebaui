[ebaui发布日志]

##2014/01/15 09:50##

1.	移除	对第三方类库underscore.js的依赖
2.	新增	对整个UI库进行全部的code review，并且进行重构，大量删除老旧性能低下的代码。在移除了underscore.js的依赖以后，整体代码体积下降了近** 20K **
3.	新增	公共方法

isRegExp方法
isDate方法
isObject方法
isFunc方法
isString方法
isArray方法
isBoolean方法

4.	新增	Button的state属性，获取或者设置button的状态 可选的值： primary info success warning danger inverse link

doc:

http://eba.ui/trunk/build/doc/ebaui.web.Button.html#state

5.	新增	拆分出独立的DataGrid以及TreeView组件

使用时，需要额外引入以下几个文件：

ui_datagrid.min.css
ebaui.datagrid.min.js

ui_treeview.min.css
ebaui.treeview.min.js

##2014/01/09 17:51##

### Control ###

1.	新增	isUsingRemoteData，工具方法，判断是否使用远程数据源
1.	新增	isNull方法，判断一个变量是否是null值

### Combo ###

1.	新增	ebaui.Combo.js文件，加入ebaui.web.Combo类型，定义combobox combolist dateTimePicker的基类

### ComboBox ###

1.	新增	_reposition方法，这个方法调整下拉菜单的位置
2.	重构	_showPopup方法，精简冗余代码。代码都已经整合到了_reposition方法里
3.	移除	_showPopup以及_hidePopup等若干方法
4.	重构	_createPopup方法 -> _initPanel ，并且popup直接复用panel控件
1.	重构	_setupEvents方法，大量的方法直接复用listbox的代码，这部分代码在后续的TextBoxList也会复用
1.	重构	_setupEvents方法，因为之前采用的是  事件委托  模型，因此有时候因为  事件冒泡  的关系，会导致点击下拉菜单的时候，自动关闭下拉菜单
2.	重构	从Combo类继承下来

### ComboList ###

1.	新增	_reposition方法，这个方法调整下拉菜单的位置
2.	重构	_showPopup方法，精简冗余代码。代码都已经整合到了_reposition方法里
3.	移除	_showPopup以及_hidePopup等若干方法
4.	重构	_createPopup方法 -> _initPanel ，并且popup直接复用panel控件
1.	重构	_setupEvents方法，因为之前采用的是  事件委托  模型，因此有时候因为  事件冒泡  的关系，会导致点击下拉菜单的时候，自动关闭下拉菜单
1.	重构	删除_parseAttrOptions这个方法重写，因为以后的value直接是放在了data-options属性里
2.	重构	从Combo类继承下来

### Panel ###

1.	新增	toggle方法，显示或者关闭panel
1.	新增	open方法，显示panel
1.	新增	close方法，关闭panel
1.	新增	move方法，移动panel

### ButtonEdit ###

1.	删除	_parseAttrOptions的重写，目前除了id name title之外，基本上所有的属性都要放在data-options属性里

### MiniGrid ###

1.	修复	默认情况下，如果指定data:[]，而url有值的情况下，这个时候，minigrid不会加载远程数据的问题

### ListBox ###

1.	重构	move方法
2.	新增	selectPrev以及selectNext方法
1.	重构	重命名highLight -》 highlight
1.	重构	select方法，现在select方法可以支持index索引作为参数了
1.	重构	deselect方法，现在deselect方法可以支持index索引作为参数了	

### TextBoxList ###

1.	重构	删除_render这个重写
2.	重构	删除_parseAttrOptions这个重写，因为所有配置都放在了data-options这个attributes里
2.	重构	_updateValue方法，现在data属性返回的值是一个对象数组，包含服务端对象所有的字段数据
1.	重构	_indexOf方法
1.	新增	_removeItem方法，这个方法用来删除指定的已选中项
1.	新增	_addItem方法，这个方法用来添加一个新的选中项
1.	新增	_query方法，根据对象的值，在dataSource查找并且返回对象，如果没有找到对象，则返回null值
2.	重构	_setupEvents里的大部分事件出来程序
1.	修复	在某些场景下，不能正确删除最后一个选中元素的问题
2.	新增	_pop方法，删除并且返回最后一个选中对象
3.	重构	_setupEvents方法
3.	重构	_addItem -> _add
3.	重构	_removeItem -> _remove
3.	重构	_initControl方法
4.	删除	_zip方法，这个方法把text以及value数组，打包合并成一个项为{ text:'', value:''}的对象列表，目前已经没用了
5.	删除	_unzip方法，这个方法把项为{ text:'', value:''}的对象列表,拆分成为text以及value两个单独的列表，目前已经没用了
6.	删除	ebaui.ListBoxItem模板，原来的模板的内容，整合到了ebaui.ListBox里

### Calendar ###

1.	重构	删除_parseAttrOptions，因为现在value是放在了data-options里面去实现了，因此这个方法可删掉了

### DateTimePicker ###

1.	重构	popup直接使用panel来实现，复用代码
2.	修复	点击popup的某些区域会导致popup自动关闭
2.	重构	从Combo类继承下来
2.	重构	删除_setupEvents方法

### CSS  ###

1.	新增	整合伟榕新版本的CSS，icon全面使用font-face做的icon

##2014/01/06 18:35##

### 其他 ###

1.  整合  伟榕重构的**验证码控件**的HTML以及CSS

##2014/01/06 16:51##

### Button ###

1.  新增  实现按钮的disable功能

### Form ###

1.  修复  submit方法在没有传递data属性的时候，默认不会提交任何数据的问题
2.  新增  value属性，这个属性返回表单真正会提交给服务端的数据

### Dialog ###

1.  修复  dialog 的“确认”按钮会消失的问题

##2013/12/31 16:00##

### Dialog ###

1.  新增  alert以及confirm默认添加title，alert的title是 "提示" confirm默认的title是 "确认"
2.  新增  alert以及confirm窗口的默认颜色改成蓝色

##2013/12/25 10:00##

1   整合  伟榕新版本的icon以及icon样式

##2013/12/25 11:30##

### Tab ###

1.  修复  当关闭非激活状态的tab选项卡的时候，默认也会自动激活其他选项卡的问题

##2013/12/06 16:00##

###Control###

1.  新增  isEmpty方法，这个方法用来判断一个值是否为真

以下情况返回true

null
undefined
[]
''
false
0

>NOTE: 
>   其实这个方法是参考php的empty编写的，可以去看php的文档的定义：  http://php.net/empty


###ComboList###

1.  修复  样式重构之前，旧的JS代码会引起实际宽度比指定宽度要宽的问题
2.  修复  在ie8下，combolist不会显示placeholder的问题
3.  修复  默认情况下，combolist是固定表头的问题
4.  修复  IE8浏览器中，如果有选中的项，placeholder不会被正确移除的问题
5.  新增  点击旁边的地方，收起下拉菜单
6.  新增  可以给下拉菜单指定width以及height

###ComboBox###

1.  重构  _setupEvents方法，stopPropagation以阻止事件继续冒泡；同时优化了  “点击旁边的地方，收起下拉菜单”  这一功能的代码

##2013/12/03 17:58##

###FormElement###

1.  新增  验证的时候显示菊花转这个等待状态

##2013/12/03 17:03##

###Spinner###

1.  新增  stepUp stepDown两个方法
2.  重构  点击 stepUp 以及 stepDown箭头，以及按下键盘 up down键的时候，直接调用这两个方法，移除了原来的写法

##2013/12/03 16:34##

###Controls###

1.  新增  height width 增加css相对长度单位的支持，默认长度单位是px

###Tabs###

1.  新增  如果指定的contentRegion里面没有ul，初始化的时候，append一个新的ul进去

##2013/12/02 17:31##

###Tabs###

1.  完成  tabs的基本功能，但目前暂时没有支持任何事件

##2013/11/28 11:53##

###TreeView###

1.  新增  treeview，整合了ztree

###其他##

1.  修复  自动构建脚本没有靠背CSS图片的问题（把所有HTML页面都转移到uiwork目录之后，这边的路径溜改）

##2013/11/27 09:11##

###uilayout###

1.  新增  sizePane方法，对于north 和 south 这两个pane更新其outerHeight，对于east 和 west 则更新outerWidth

2.  新增  state属性，获取当前uilayout的状态，包含uilayout容器的innerWidth，paddingLeft，以及所有panes的top， bottom， left， right，outerWidth， outerHeight， innerWidth， innerHeight，参数可选的值有container north east south west center，默认返回uilayout所有的状态

3.  新增  getPane方法，该方法返回一个pane object

##2013/11/22 17:38##

###FormElement###

1.  完成  addValidator方法
2.  完成  removeValidator方法
2.  新增  _indexOfValidator方法

###Captcha###

1.  新增  validateOnServer属性，默认为false
2.  新增  初始化的时候会自动判断是否启用服务端验证

###Spinner###

1.  新增  decimalPlaces属性，用来设置spinner保留的小数点位数

##2013/11/20 17:39##

###RemoteValidator###

2.  修复  在pass参数都正常传递一个函数的时候，进行验证时，永远都返回false的问题

##2013/11/20 16:42##

###Password###

1.	修复	password控件在有值的情况下，reset以后，没有正确出现placeholder问题

##2013/11/20 16:13##

###LengthValidator###

1.	修复	当max == min的时候，validator不能正确验证输入文本长度的问题
1.	新增	当min > max的时候，validator直接抛出异常

###其他###

3.	修改	casLoginView.html的143行样式
	
	<pre>
	/* 修改 */
	#captcha .eba-code-img{
	    width: 70px;
	    height: 28px;
	}

	/* 新增 */
	#captcha span.eba-code-img{ display:block;font-size:18px;text-align:center;border:1px solid black; }
	</pre>

4.	修改	casLoginView.html的241行代码
	<pre>
	&lt;input data-role="captcha" id="captcha" placeholder="请输入验证码" data-options="{ width:300,height:30,top:140,left:70,validators:['required','remote[\'url$http://192.168.102.159:8080/cas/captcha\',\'token$verify\',\'pass$captchaPass\']'],dataSource : { url : 'http://192.168.102.159:8080/cas/captcha' } }"  / $gt;
	</pre>


5.	新增	javascript代码
	<pre>
	function captchaPass( value,serverData ){ 
	    if( !serverData || serverData['result'] == null || serverData['result'] == undefined ){ return false; }
	    return parseInt( serverData['result'] ) == 1;
	};
	</pre>

##2013/11/20 09:18##

1.  重构  表单控件默认的position固定为absolute
1.  重构  panel控件默认的position固定为relative

>NOTE:  button默认的position保持不变，本次发布没做任何变动

##2013/11/18 15:44##

###dialog###

1.  新增  按钮文本本地化
1.  新增  兑换按钮位置
1.  重构  去掉dialog确认按钮的动画效果

##2013/11/18 10:42##

###dialog###

1.  新增  alert对话框
1.  新增  confirm对话框
1.  新增  prompt对话框

##2013/11/15 11:39##

###TextBoxList###

1.  修复  重构之后，点击下拉菜单，没有正确更新控件data属性值的问题
2.  优化  第一次按下退格键，首先高亮最后一个选项；再次按下退格键，删除最后一个选中的项

###CheckBox###

1.  修复  移除 checked="checked" 属性后，控件没有执行默认不勾选的问题

##2013/11/14 15:28## 

###ListBox###

1. 优化 使用max-wdith 以及 max-height设置高度，现在listbox能支持根据内部项目的数量，自动伸缩高度
2. 优化 移除HTML模板中，html标签内写死的样式

##2013/11/14 10:30##

###Checkbox###

1.  修复  Checkbox调用data属性不能正确获取值的问题

###Form###

1.  新增  elements属性，获取form表单内的控件集合
2.  新增  value属性，获取或者设置表单的各个控件的值（TODO）
3.  修复  reset抛出异常的问题

###FormElement###

1.  修复  clearTips方法没有正确清除所有的验证状态样式的问题

###Captcha###

1.  修复  reset方法中，编码错误导致调用reset方法的时候，控件抛出异常的问题

##2013/11/13 17:57##

###Control###

1.	修复	不能正确设置top left的值的问题

###其他###

1.	修复	验证码填写错误没有任何提示的问题
2.	修复	验证码永远都提示填写错误的问题（实际问题是JAVA服务端，返回的JSON格式不正确！！！！！）
3.	新增	整合伟榕新办本的icon（现在是彩色的了）

##2013/11/13 15:16##

###ComboList###

1.	重构	移除ebaui.web.Combo，ComboList以及ComboBox直接从ButtonEdit继承（主要是我不想有很复杂的继承树）

###ComboBox###

1.	重构	移除ebaui.web.Combo，ComboList以及ComboBox直接从ButtonEdit继承（主要是我不想有很复杂的继承树）
2.	修复	在更新完text，value,或者是data属性之后，IE8浏览器placeholder没有被清楚的问题

###TextBoxList###

1.	修复	当下拉菜单有全部或者有一部分被浏览器遮住的情况下，不会自动飘到控件上方的问题

###Panel###

1.	新增	Panel控件

##2013/11/12 15:14##

###Captcha###

1.	修复	调用form.data()方法不能获取到验证码控件的值的问题

##2013/11/12 11:44##
 
###FormElement###
 
1.	新增 控件显示验证结果的时候，控件宽度不会收缩
2.	新增 控件宽度以及高度定义不变，但是宽度包含了控件验证的icon的宽度
 
[CAS]
 
1.	调整	了首页的样式，调整内容

<pre>
#username {
    width: 300px;
    height: 30px;
    margin: 30px 50px 0 70px;
}
.eba-textbox-border {
    height: 28px;
}
.eba-textbox-border .eba-label-icon{
    padding: 5px;
}
.eba-textbox-border .eba-textbox-input{
    height: 26px;
    line-height: 26px;
}
#password {
    width: 300px;
    height: 30px;
    margin: 30px 50px 0 70px;
}
#captcha {
    width: 300px;
    height: 30px;
    margin: 30px 50px 0 70px;
}
#captcha .eba-textbox{
    width: 300px;
    height: 30px;
}
#captcha .eba-code-img{
    width: 70px;
    height: 30px;
}
 
#submit {
   color: #fff;
    background: url(theme/hiap/images/blue-btn.gif) repeat-x ;
    border-top: 1px solid #003181 !important;
    width: 140px;
    height: 30px;
    border-radius: 5px;
    line-height: 30px;
    font-size: 14px;
    margin: 10px 25px 0 70px;
    border: 1px solid #999;
}
 
#reset{ 
    width: 100px;
    height: 30px;
    border-radius: 5px;
    line-height: 30px;
    font-size: 14px;
    margin: 10px 25px 0 7px;
    border: 1px solid #999;
}
</pre>