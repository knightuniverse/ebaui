
<div id="container" data-role="form" data-options="{ width:280, height:500,method:'post'}">

    <input data-role="checkbox" id="remember" name="remember"
           data-options="{
            text : 'remember',
            top:195,
            left:0  }"/>
           
    <input id="submit" data-role="button"
           data-options="{
            text : '提交',
            onclick : submitForm,
            state:'success',
            iconCls:'icon-circle-arrow-right',
            iconPosition:'right',
            position:'absolute',
            width:140,
            height:30,top:240,left:0 }"/>
            
</div>
<script language="JavaScript" type="text/javascript">
    function submitForm(sender, event) {
        var form = ebaui.getById('container');
        form.action('http://www.baidu.com');
        form.submit({
        });
    }
    </script>
