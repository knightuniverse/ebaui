<h3>基本使用</h3>
<h4>javascript代码</h4>
<pre>
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
</pre>

<h4>html代码</h4>
<pre>
    &lt;input id="btnedit1" name="buttonEdit" 
        data-role="buttonedit" placeholder="请输入..." 
        data-options="{ text: '' ,  value : '' }" /&gt;
</pre>

<h4>示例</h4>
<input id="btnedit1" data-role="buttonedit" id="" name="buttonEdit"
    data-options="{ 
        text       : '' ,
        value      : '',
        showClose  : true,
        placeHolder:'asdfad'
    }" />

<br /><br />

<button onclick="onSetValue()">setValue</button>
<button onclick="onGetValue()">getValue</button>
<button onclick="onEnable()">enable</button>
<button onclick="onDisable()">disable</button>

<button onclick="onReadOnly()">readonly</button>
<button onclick="onEditable()">editable</button>

<script>

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