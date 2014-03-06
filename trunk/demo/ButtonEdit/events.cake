<!-- readonly="readonly"  -->
<h3>按钮点击事件</h3>

<h4>javascript代码</h4>
<pre>
    function onButtonClick (argument) {
        alert( 'button click' );
    }
</pre>

<h4>html代码</h4>
<pre>
    &lt;input id="btnedit1" name="buttonEdit" 
        data-role="buttonedit" placeholder="请输入..." 
        data-options="{ text: '' , value : '', 
        onbtnclick : onButtonClick}" /&gt;
</pre>

<h4>示例</h4>
<input id="btnedit1" data-role="buttonedit" id="" name="buttonEdit" placeholder="请输入..."
    data-options="{
        text: '' ,value : '', 
        onbtnclick : onButtonClick}">
</input>

<script type="text/javascript">

function onButtonClick (argument) {
    alert( 'button click' );
}

function onCloseClick (argument) {
    alert( 'close click' );
}

function onSetValue(){
    var m = ebaui.getById( 'btnedit1' );
    m.text( 'America' );
    m.value( 'usa' );
};

function onGetValue(){
    var m = ebaui.getById( 'btnedit1' );
    var t = m.text();
    var v = m.value();
    alert( t + ' : ' + v );
};

function onEnable(){
    var m = ebaui.getById( 'btnedit1' );
    m.enabled( true );
};

function onDisable(){
    var m = ebaui.getById( 'btnedit1' );
    m.enabled( false );
};

function onReadOnly(){
    var m = ebaui.getById( 'btnedit1' );
    m.readonly( true )  ;
};

function onEditable(){
    var m = ebaui.getById( 'btnedit1' );
    m.readonly( false ) ;   
};

</script>