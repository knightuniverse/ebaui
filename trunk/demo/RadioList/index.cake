<h4>html代码</h4>
<pre>
&lt;input id="radiolist1" value="3" data-role="radiobuttonlist" data-options="{ dataSource : cbxItems }" / &gt;
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
    
    var m = ebaui.get( $( '#radiolist1' ) );
    console.log( m.value() );

};
</pre>
    
<input id="radiolist1" name="rad" data-role="radiolist" data-options="{ dataSource : cbxItems, onchange:onch, value:3 }" />

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

function showValue (argument) {
    
    var m = ebaui.get( $( '#radiolist1' ) );
    console.log( m.value() );

};

function onch(){
    console.log( 'radiolist onchange' )
};

</script>