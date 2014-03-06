<h4>html代码</h4>
<pre>
&lt;input data-role="captcha" placeholder="请输入验证码" data-options="{ dataSource : { url : 'captcha_index.php' } }"  / &gt;
</pre>

<h4>javascript代码</h4>
<pre>
function onChange( sender ){
    console.log( 'event onchange trigger' );
    console.log( 'checked: ' + sender.checked() );
    console.log( 'value: ' + sender.value() );
};
</pre>

<div data-role="panel" data-options="{ left : 0,top : 0 }">
    
<input data-role="captcha" placeholder="请输入验证码" data-options="{ dataSource : { url : 'captcha_index.php' },maxLength:4 }" />

</div>

<script type="text/javascript">
function onChange( sender ){
    console.log( 'event onchange trigger' );
    console.log( 'checked: ' + sender.checked() );
    console.log( 'value: ' + sender.value() );
};
</script>