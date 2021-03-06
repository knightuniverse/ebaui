<table id="test_datagrid" data-role="datagrid" data-options="{ 

    jqgrid:{
        data : mydata,
        datatype: 'clientSide',
        height: 250,
        colModel:[
            {name:'id',     index:'id',         width:60,   sorttype:'int',         label : 'Inv No'},
            {name:'invdate',index:'invdate',    width:90,   sorttype:'date',        label : 'date'},
            {name:'name',   index:'name',       width:100,  label: 'Editable Cell', editable:true},
            {name:'amount', index:'amount',     width:80,   align:'right',          sorttype:'float',   label : 'Inv No'},
            {name:'tax',    index:'tax',        width:80,   align:'right',          sorttype:'float',   label : 'Inv No'},
            {name:'total',  index:'total',      width:80,   align:'right',          sorttype:'float',   label : 'Inv No'},
            {name:'note',   index:'note',       width:150,  sortable:false,         label : 'Inv No'}
        ],
        rowNum:10,
        rowList:[10,20,30],
        viewrecords: true,
        multiselect: true,
        forceFit : true,
        cellEdit: true,
        caption: 'MutiSelect&Editable Grid Data'
    },

    pager: {
        navGrid:true,
        controls:[ { role: 'CheckBox',options:{text:'test',position:''} } ]
    }

}" ></table>

<script type="text/javascript">

var mydata = [
    {id:"1",invdate:"2007-10-01",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
    {id:"2",invdate:"2007-10-02",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
    {id:"3",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
    {id:"4",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
    {id:"5",invdate:"2007-10-05",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
    {id:"6",invdate:"2007-09-06",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
    {id:"7",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
    {id:"8",invdate:"2007-10-03",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
    {id:"9",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"}
];

</script>