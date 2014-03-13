#!/usr/bin/env coffee
<div id="panel" data-role="panel" title="hello" data-options="{ iconCls:'icon-search',width:400,height:300,state:'primary' }">

<input id="t" data-role="textbox" name="textbox" data-options="{
        maxLength : 4,
        top       : 10,
        iconCls   : 'icon-user',
        validators: ['required']
}" />

<input id="t" data-role="textbox" name="textbox" data-options="{
        maxLength : 4,
        top       : 60,
        iconCls   : 'icon-user',
        validators: ['required']
}" />

<input id="t" data-role="textbox" name="textbox" data-options="{
        maxLength : 4,
        top       : 110,
        iconCls   : 'icon-user',
        validators: ['required']
}" />

</div>