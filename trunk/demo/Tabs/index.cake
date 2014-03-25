<h3>Tabs</h3>
<h4>html代码</h4>
<pre>
    &lt;input data-role="tabs" title="tabs" 
      data-options="{ 
        home : { 
          url:'http://www.baidu.com',
          title:'baidu',
          closable:false,
          onload:ontabload 
      } 
    }" /&gt;
</pre>

<input id="modify" data-role="button" title="button" data-options="{ text : '添加tab',width:100,onclick : addTab }" />

<input id="tab1" data-role="tabs" title="tabs" 
  data-options="{

    home : { 
      url:'http://www.baidu.com',
      title:'baidu',
      closable:false,
      onload:ontabload 
    }

}" />

<div class="eba-tabs-body"><ul></ul></div>

<script type="text/javascript">
function addTab(){
  var tabs = ebaui.get('#tab1');
  tabs.addTab( { url : 'http://www.qq.com/',title:'qq' } );
  tabs.addTab( { url : 'tab_iframe.html',title:'tab_iframe' } );
};

function eachTab(){

    var tabs = ebaui.get('#tab1');
    tabs.eachTab( function( tab ){
        var win = tab.contentWindow();
        if( win ){ win.someMethod(); }
    });
    
};

function ontabload(){
  console.log( ' home ontabload' )
};
</script>