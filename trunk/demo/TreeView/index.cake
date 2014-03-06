<h3>treeview</h3>
<h4>html代码</h4>
<pre>
    &lt;input id="treeview1" data-role="treeview" title="treeview" data-options="{ dataSource : zNodes }" /&gt;
</pre>
<h4>示例</h4>
<input id="treeview1" data-role="treeview" title="treeview" data-options="{ dataSource : zNodes }" />

<script type="text/javascript">

var zNodes =[
    { name:"pNode 01", open:true,
        children: [
            { name:"pNode 11",
                children: [
                    { name:"leaf node 111"},
                    { name:"leaf node 112"},
                    { name:"leaf node 113"},
                    { name:"leaf node 114"}
                ]},
            { name:"pNode 12",
                children: [
                    { name:"leaf node 121"},
                    { name:"leaf node 122"},
                    { name:"leaf node 123"},
                    { name:"leaf node 124"}
                ]},
            { name:"pNode 13 - no child", isParent:true}
        ]},
    { name:"pNode 02",
        children: [
            { name:"pNode 21", open:true,
                children: [
                    { name:"leaf node 211"},
                    { name:"leaf node 212"},
                    { name:"leaf node 213"},
                    { name:"leaf node 214"}
                ]},
            { name:"pNode 22",
                children: [
                    { name:"leaf node 221"},
                    { name:"leaf node 222"},
                    { name:"leaf node 223"},
                    { name:"leaf node 224"}
                ]},
            { name:"pNode 23",
                children: [
                    { name:"leaf node 231"},
                    { name:"leaf node 232"},
                    { name:"leaf node 233"},
                    { name:"leaf node 234"}
                ]}
        ]},
    { name:"pNode 3 - no child", isParent:true}

];

</script>