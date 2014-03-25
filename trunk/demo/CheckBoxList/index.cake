<h4>html代码</h4>
<pre>
&lt;input data-role="checkboxlist" data-options="{ dataSource : cbxItems }"  / &gt;
</pre>

<h4>javascript代码</h4>
<pre>
var cbxItems = [

    {
        text : 'houzi 1',
        value : '1'
    },

    {
        text : 'houzi 2',
        value : '2'
    },

    {
        text : 'houzi 3',
        value : '3'
    },

    {
        text : 'houzi 4',
        value : '4'
    },

    {
        text : 'houzi 5',
        value : '5'
    }

];

function showValue (argument) {
    
    var m = ebaui.get( $( '#checkboxlist1' ) );
    console.log( m.value() );

};
</pre>
<div data-role="panel" data-options="{ top:0 }">
    <input id="checkboxlist1" data-role="checkboxlist" data-options="{
        dataSource : cbxItems,enabled:false,onchange:onch }" />
</div>

<div data-role="panel" data-options="{ top:100 }">
    <button type="button" onclick="showValue()">show value</button>
    <button type="button" onclick="setValue()">set value</button>
</div>

<script type="text/javascript">
var cbxItems = [

    {
        text : 'houzi 1',
        value : '1'
    },

    {
        text : 'houzi 2',
        value : '2'
    },

    {
        text : 'houzi 3',
        value : '3'
    },

    {
        text : 'houzi 4',
        value : '4'
    },

    {
        text : 'houzi 5',
        value : '5'
    }

];

function onch(){
    console.log( 'checkboxlist onchange' )
};

function showValue (argument) {
    
    var m = ebaui.get( $( '#checkboxlist1' ) );
    console.log( m.value() );

};

function setValue(){
    var m = ebaui.get( $( '#checkboxlist1' ) );
    m.value( [2,3,4] );
};

</script>