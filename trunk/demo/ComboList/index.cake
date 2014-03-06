<h3>基本使用</h3>
<h4>javascript代码</h4>
<pre>

var dataSource = [

    {"data":null,"opno":null,"cid":40,"cname":"值班人员","pername":"管理员,小刘","optime":1386125525000,"oplimit":null,"remark":null,"perstr":"1,2","perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":61,"cname":"普杰测试","pername":"郑明枝","optime":1386056335000,"oplimit":null,"remark":null,"perstr":"21","perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":85,"cname":"测试组1 ","pername":null,"optime":1386145413000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":86,"cname":"测试组2","pername":null,"optime":1386145420000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":87,"cname":"测试组3","pername":null,"optime":1386145424000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":88,"cname":"测试组14超长超长超长超长超长超长超长超长超长超长","pername":null,"optime":1386145434000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null}
];

</pre>

<h4>html代码</h4>
<pre>
    &lt;input id="combolist1" name="combolist1" 
        data-role="combolist" placeholder="请输入..." 
        data-options="{ width : 400,textField : 'name',valueField : 'id',grid:{ data : dataSource,colModel : [{name       :'name', label : 'name', width : 150},{name       :'sex', label : 'sex', width : 150}] } }" /&gt;
</pre>

<input id="combolist1" name="combolist1" 
        data-role="combolist"
        data-options="{
            width      : 300,
            textField  : 'cname',
            valueField : 'cid',
            placeHolder: '请输入...',
            onchange   : onch,
            grid:{ 
                data     : dataSource,
                colModel : 
                    [
                        {name:'cid',  label:'cid',  width : 150},
                        {name:'cname',label:'name', width : 150}
                    ] 
                } 
}" />

<script type="text/javascript">

var dataSource = [

    {"data":null,"opno":null,"cid":40,"cname":"值班人员","pername":"管理员,小刘","optime":1386125525000,"oplimit":null,"remark":null,"perstr":"1,2","perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":61,"cname":"普杰测试","pername":"郑明枝","optime":1386056335000,"oplimit":null,"remark":null,"perstr":"21","perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":85,"cname":"测试组1 ","pername":null,"optime":1386145413000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":86,"cname":"测试组2","pername":null,"optime":1386145420000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":87,"cname":"测试组3","pername":null,"optime":1386145424000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":88,"cname":"测试组14超长超长超长超长超长超长超长超长超长超长","pername":null,"optime":1386145434000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null}
];

function onch(){
    console.log( 'ComboList change' )
};

</script>