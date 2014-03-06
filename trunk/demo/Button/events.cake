<h3>onclick</h3>
<h4>html代码</h4>
<pre>
    &lt;script type="text/javascript"&gt;
    function onClick (argument) {
        alert( 'this is button click' );
    }
    &lt;/script&gt;

    &lt;input data-role="button" target="_blank" href="http://www.google.com/" data-options="{ iconCls : 'icon-plus',iconPosition:'top',onclick : onClick }"/&gt;
</pre>
<h4>示例</h4>
<a data-role="button" target="_blank" href="http://www.google.com/" data-options="{ iconCls : 'icon-plus',iconPosition:'top',onclick : onClick }">onclick</a>

<script type="text/javascript">
function onClick (argument) {
    alert( 'this is button click' );
}
</script>