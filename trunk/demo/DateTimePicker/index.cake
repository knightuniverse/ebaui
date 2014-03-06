<h4>示例-显示TimeSpinner-html代码</h4>
<pre>
    &lt;input id="datetimepicker1" data-role="datetimepicker" value="2013-09-12 14:55" data-options="{ showTimeSpinner : true,onchange:onch }" /&gt;
</pre>

<h4>示例-显示TimeSpinner</h4>
<input id="datetimepicker1" data-role="datetimepicker" value="2013-09-12 14:55" data-options="{ showTimeSpinner : true,onchange:onch }" />
<br /><br />

<h4>示例-隐藏TimeSpinner-html代码</h4>
<pre>
    &lt;input id="datetimepicker2" data-role="datetimepicker" value="2013-09-12 14:55" /&gt;
</pre>

<h4>示例</h4>
<input id="datetimepicker2" data-role="datetimepicker" value="2013-09-12 14:55" />
<br /><br />

<h4>示例-显示clear按钮-html代码</h4>
<pre>
    &lt;input id="datetimepicker2" data-role="datetimepicker" value="2013-09-12 14:55" /&gt;
</pre>

<h4>示例</h4>
<input id="datetimepicker2" data-role="datetimepicker" value="2013-09-12 14:55" data-options="{ showClearButton : true,showTodayButton : false }"/>
<br /><br />

<script>
function onch(){
  console.log( 'DatePicker change' )
}
</script>