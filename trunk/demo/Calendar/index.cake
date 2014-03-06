<h4>javascript代码</h4>
<pre>
function  onCalendarClick (argument) {
    if( console && console.log ){
        console.log( 'onCalendarClick' )
    }
}
</pre>

<h4>html代码</h4>
<pre>
    &lt;div data-role="calendar" title="calendar" data-options="{ value : '2013-09-12', onclick : onCalendarClick }" &gt;&lt;/div&gt;
</pre>

<h4>示例</h4>
<div data-role="calendar" title="calendar" data-options="{ value : '2013-09-12',onclick:onCalendarClick }" ></div>

<br /><br />

<script type="text/javascript">
function  onCalendarClick (argument) {
    if( console && console.log ){
        console.log( 'onCalendarClick' )
    }
}
</script>