<h4>html代码</h4>
<pre>
    &lt;input value="20" data-role="spinner" id="spinner_1" name="spinner_1" /&gt;
</pre>

<input value="0" data-role="spinner" id="spinner_1" name="spinner_1" data-options="{ 
  onchange : hanlde,
  decimalPlaces:7,
  max : 100,
  step : 1,
  width:200 
}" />

<script type="text/javascript">
function hanlde( sender ){
  console.log( 'spinner onchange' );
};
</script>