<h4>javascript代码</h4>
<pre>
    function onSpinUp(){
        console.log( 'onSpinUp' );
    };
    function onSpinDown(){
        console.log( 'onSpinDown' );
    };
    function onChange(){
        console.log( 'onChange' );
    };
</pre>

<h4>html代码</h4>
<pre>
    &lt;input data-role="timespinner" id="timespinner_1" name="timespinner_1" data-options="{ onspinup : onSpinUp,onspindown : onSpinDown,onchange : onChange }" /&gt;
</pre>

<input data-role="timespinner" id="timespinner_1" name="timespinner_1" data-options="{ onspinup : onSpinUp,onspindown : onSpinDown,onchange : onChange }" />

<script type="text/javascript">

    function onSpinUp(){
        console.log( 'onSpinUp' );
    };
    function onSpinDown(){
        console.log( 'onSpinDown' );
    };
    function onChange(){
        console.log( 'onChange' );
    };

</script>