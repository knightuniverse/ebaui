

<script type="text/javascript">

function onEnter (sender,evt) {
    // body...
    alert( 'textbox on enter' );
};

function onKeyup(){
    console.log( 'textbox onKeyup' )
};

function onChange ( sender,event ) {
    console.log( 'value is' )
    console.log( sender.value() );
};

</script>

<h4>javascript代码</h4>
<pre>

    function onEnter (sender,evt) {
        // body...
        alert( 'textbox on enter' );
    };

    function onKeyup(){
        console.log( 'textbox onKeyup' )
    };

    function onChange ( sender,event ) {
        console.log( 'value is' )
        console.log( sender.value() );
    };

</pre>

<h4>html代码</h4>
<pre>

    &lt;input data-role="textbox" maxlength="100" name="textbox" placeholder="monkey..."  data-options="{
        onchange : onChange,
        validation:['required'],
        messages : { 'required':'this field is required' }}" /&gt;

</pre>

<input data-role="textbox" maxlength="100" name="textbox" placeholder="monkey..."  data-options="{
        onchange : onChange,
        validation:['required'],
        messages : { 'required':'this field is required' }}" />