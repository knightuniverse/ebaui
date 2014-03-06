<h3>基本使用</h3>
<h4>javascript代码</h4>
<pre>
    var people = [
        {
            id : 0,
            name : 'houzi',
            sex : 'man'
        },

        {
            id : 1,
            name : 'houzi_2',
            sex : 'man'
        },

        {
            id : 2,
            name : 'houzi_3',
            sex : 'man'
        },

        {
            id : 3,
            name : 'houzi_4',
            sex : 'man'
        }
    ];
</pre>

<h4>html代码</h4>
<pre>
    &lt;input id="combobox1" placeholder="请输入..." data-role="combobox" data-options="{ dataSource : people,idField : 'id', valueField : 'id',textField:'name' }" /&gt;
</pre>

<h4>示例</h4>
<input id="combobox1" placeholder="请输入..." data-role="combobox" data-options="{ 
    dataSource  :   people,
    idField     :   'id', 
    valueField  :   'id',
    textField   :   'name',
    width       :   300,
    onchange    :   onch
}" />

<br /><br />

<script type="text/javascript">

    var people = [
        {
            id : 0,
            name : 'houzi',
            sex : 'man'
        },

        {
            id : 1,
            name : 'houzi_2',
            sex : 'man'
        },

        {
            id : 2,
            name : 'houzi_3',
            sex : 'man'
        },

        {
            id : 3,
            name : 'houzi_4',
            sex : 'man'
        }
    ];

    function onch(){
        console.log( 'combobox changed' );
    }

</script>