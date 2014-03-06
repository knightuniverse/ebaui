<h4>html代码</h4>
<pre>
    &lt;form id='form_1' class="xxxx" method="POST" name="form_1" action="http://www.baidu.com/" enctype="application/x-www-form-urlencoded" /&gt;

    &lt;input data-role="label" for="name" data-options="{ text:'username:' }" /&gt;
    &lt;input data-role="textbox" id="name" name="name" placeholder="请输入用户名" data-options="{ validators:['required'] }" /&gt;

    &lt;br /&gt;

    &lt;input data-role="label" for="pwd" data-options="{ text:'password:' }" /&gt;
    &lt;input id="pwd" name="pwd" placeholder="xxxx" data-role="password" data-options="{ onenter : onEnter,validators:['required'] }" /&gt;

    &lt;/form&gt;
</pre>

<!-- application/x-www-form-urlencoded -->
<!-- multipart/form-data -->
<!-- text/plain -->
<form id='form_1' data-role="form" class="xxxx" name="form_1" data-options="{
    method:'POST',
    action:'form_index.php' 
}" >

    <div data-role="panel" data-options="{ top:0,left:10 }" >
        <input data-role="textbox" id="name" name="name" data-options="{
            width       : 300,
            height      : 50,
            placeHolder : '请输入',
            validators  : ['required'] 
        }" />
    </div>

    <div data-role="panel" data-options="{ top:100,left:10 }" >
        <input id="pwd" name="pwd" data-role="password" data-options="{ onenter : onEnter,validators:['required'] }" />
    </div>

    <div data-role="panel" data-options="{ top:150,left:10 }" >
        <input id="combolist1" 
            name="operator" 
            data-role="combolist"
            data-options="{
                width       : 300,
                textField   : 'cname',
                valueField  : 'cid',
                placeHolder : '请输入',
                grid:{ 
                    data     : dataSource,
                    colModel : 
                        [
                            {name:'cid',  label:'cid',  width : 150},
                            {name:'cname',label:'name', width : 150}
                        ]
                    } 
        }" />
    </div>

    <div data-role="panel" data-options="{ top:250,left:10 }" >

        <input id="txt" name="pwd" data-role="textarea" data-options="{
            width      : 400,
            height     : 100,
            placeHolder: '请输入',
            onenter    : onEnter,
            validators :['required'] 
        }" />
        
    </div>

    <br />

</form>

<br /><br />

<script type="text/javascript">

var dataSource = [

    {"data":null,"opno":null,"cid":40,"cname":"值班人员","pername":"管理员,小刘","optime":1386125525000,"oplimit":null,"remark":null,"perstr":"1,2","perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":61,"cname":"普杰测试","pername":"郑明枝","optime":1386056335000,"oplimit":null,"remark":null,"perstr":"21","perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":85,"cname":"测试组1 ","pername":null,"optime":1386145413000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":86,"cname":"测试组2","pername":null,"optime":1386145420000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":87,"cname":"测试组3","pername":null,"optime":1386145424000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null},

    {"data":null,"opno":"admin","cid":88,"cname":"测试组14超长超长超长超长超长超长超长超长超长超长","pername":null,"optime":1386145434000,"oplimit":null,"remark":null,"perstr":null,"perphone":null,"sort":null,"account":null,"edit":null,"dynamicSql":null}
];

function setFormData (argument) {
    var user = {
        name: 'houzi ',
        pwd : 'abc123'
    };

    var form = ebaui.web.getForm( '.xxxx' );
    form.data( user );
};

function getFormValue(){
    var form = ebaui.web.getForm( '.xxxx' );
    console.log( form.value() );
};

function onEnter (sender,evt) {

    var form = ebaui.web.getForm( '.xxxx' );
    var returnDataType = 'json';
    var onSubmitSucc = function( serverData ){
        console.log( serverData );
    };
    var isValid = form.validate();
    //  
    console.log( 'validating... and validation result is ' );
    console.log( isValid );

    //  form data
    console.log( 'and the form data is... ' );
    console.log( form.data() );

    //  form submition
    console.log( 'form action is ' );
    console.log( form.action() );
    console.log( 'form method is ' );
    console.log( form.method() );
    console.log( 'form name is ' );
    console.log( form.name() );

    console.log( 'submiting' );

    if( isValid ){
        alert( 'this form is valid' );
    }else{
        alert( 'this form is invalid' );
    }
};

function validateForm (argument) {
    var form = ebaui.web.getForm( '.xxxx' );
    var isValid = form.validate();
    if( isValid ){
        alert( 'this form is valid' );
    }else{
        alert( 'this form is invalid' );
    }
};

function resetForm (argument) {
    var form = ebaui.web.getForm( '.xxxx' );
    var isValid = form.reset();
};

</script>