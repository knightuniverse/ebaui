<h4>html代码</h4>
<pre>
    &lt;input id="hidden1" data-role="hidden" value="adsfadsf" /&gt;
</pre>

<h4>javascript代码</h4>
<pre>
$( function(){

    var hi = ebaui.getById( 'hidden1' );
    console.log( hi.value() );
    hi.value( { name : 'monkey' } );
    console.log( hi.value() );

} );
</pre>

<input id="hidden1" data-role="hidden" value="adsfadsf" />

<script type="text/javascript">

$( function(){

    var hi = ebaui.getById( 'hidden1' );
    console.log( hi.value() );
    hi.value( { name : 'monkey' } );
    console.log( hi.value() );

} );

</script>