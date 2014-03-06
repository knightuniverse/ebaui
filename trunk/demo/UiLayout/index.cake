<div data-role="layout-west">
        <div class="header">West</div>
        <div data-role="content">

            <h3><b>Outer Layout</b></h3>
    <ul>
        <li><a href="#" onClick="outerLayout.toggle('north')">Toggle North</a></li>
        <li><a href="#" onClick="outerLayout.toggle('south')">Toggle South</a></li>
        <li><a href="#" onClick="outerLayout.toggle('west')"> Toggle West</a></li>
        <li><a href="#" onClick="outerLayout.toggle('east')"> Toggle East</a></li>
        <li><a href="#" onClick="outerLayout.hide('north')">Hide North</a></li>
        <li><a href="#" onClick="outerLayout.hide('south')">Hide South</a></li>
        <li><a href="#" onClick="outerLayout.show('south', false)">Unhide South</a></li>
        <li><a href="#" onClick="outerLayout.hide('east')"> Hide East</a></li>
        <li><a href="#" onClick="outerLayout.show('east', false)">Unhide East</a></li>
        <li><a href="#" onClick="outerLayout.open('east')"> Open East</a></li>
        <li><a href="#" onClick="outerLayout.open('north'); outerLayout.sizePane('north', 'auto')">  Resize North="auto"</a></li>
        <li><a href="#" onClick="outerLayout.sizePane('north', 100); outerLayout.open('north')">  Resize North=100</a></li>
        <li><a href="#" onClick="outerLayout.sizePane('north', 300); outerLayout.open('north')">  Resize North=300</a></li>
        <li><a href="#" onClick="outerLayout.sizePane('north', 10000); outerLayout.open('north')">Resize North=10000</a></li>
        <li><a href="#" onClick="outerLayout.open('south'); outerLayout.sizePane('south', 'auto')">  Resize South="auto"</a></li>
        <li><a href="#" onClick="outerLayout.sizePane('south', 100); outerLayout.open('south')">  Resize South=100</a></li>
        <li><a href="#" onClick="outerLayout.sizePane('south', 300); outerLayout.open('south')">  Resize South=300</a></li>
        <li><a href="#" onClick="outerLayout.sizePane('south', 10000); outerLayout.open('south')">Resize South=10000</a></li>
        <li><a href="#" onClick="outerLayout.panes.north.css('backgroundColor','#FCC')">North Color = Red</a></li>
        <li><a href="#" onClick="outerLayout.panes.north.css('backgroundColor','#CFC')">North Color = Green</a></li>
        <li><a href="#" onClick="outerLayout.panes.north.css('backgroundColor','')">    North Color = Default</a></li>
        <li><a href="#" onClick="alert('outerLayout.name = \''+outerLayout.options.name+'\'')">Show Layout Name</a></li>
        <li><a href="#" onClick="showOptions(outerLayout,'defaults')">Show Options.Defaults</a></li>
        <li><a href="#" onClick="showOptions(outerLayout,'north')">   Show Options.North</a></li>
        <li><a href="#" onClick="showOptions(outerLayout,'south')">   Show Options.South</a></li>
        <li><a href="#" onClick="showOptions(outerLayout,'west')">    Show Options.West</a></li>
        <li><a href="#" onClick="showOptions(outerLayout,'east')">    Show Options.East</a></li>
        <li><a href="#" onClick="showOptions(outerLayout,'center')">  Show Options.Center</a></li>
        <li><a href="#" onClick="showState(outerLayout,'container')"> Show State.Container</a></li>
        <li><a href="#" onClick="showState(outerLayout,'north')">     Show State.North</a></li>
        <li><a href="#" onClick="showState(outerLayout,'south')">     Show State.South</a></li>
        <li><a href="#" onClick="showState(outerLayout,'west')">      Show State.West</a></li>
        <li><a href="#" onClick="showState(outerLayout,'east')">      Show State.East</a></li>
        <li><a href="#" onClick="showState(outerLayout,'center')">    Show State.Center</a></li>
    </ul>

        </div>
</div>

<div data-role="layout-east">
    <div class="header">East</div>
    <div data-role="content">

        <h3><b>Inner Layout</b></h3>
<ul id="createInner">
    <li><a href="#" onClick="createInnerLayout(); return false;">CREATE Inner Layout</a></li>
</ul>
<ul id="innerCommands" style="display: none;">
    <li><a href="#" onClick="innerLayout.toggle('north')">Toggle North</a></li>
    <li><a href="#" onClick="innerLayout.toggle('south')">Toggle South</a></li>
    <li><a href="#" onClick="innerLayout.toggle('west')"> Toggle West</a></li>
    <li><a href="#" onClick="innerLayout.toggle('east')"> Toggle East</a></li>
    <li><a href="#" onClick="innerLayout.hide('north')">Hide North</a></li>
    <li><a href="#" onClick="innerLayout.hide('south')">Hide South</a></li>
    <li><a href="#" onClick="innerLayout.hide('west')"> Hide West</a></li>
    <li><a href="#" onClick="innerLayout.hide('east')"> Hide East</a></li>
    <li><a href="#" onClick="innerLayout.show('east')"> Show East</a></li>
    <li><a href="#" onClick="innerLayout.sizePane('north', 50); innerLayout.open('north')">   Resize North=50</a></li>
    <li><a href="#" onClick="innerLayout.sizePane('north', 300); innerLayout.open('north')">  Resize North=300</a></li>
    <li><a href="#" onClick="innerLayout.sizePane('north', 10000); innerLayout.open('north')">Resize North=10000</a></li>
    <li><a href="#" onClick="innerLayout.sizePane('south', 50); innerLayout.open('south')">   Resize South=50</a></li>
    <li><a href="#" onClick="innerLayout.sizePane('south', 300); innerLayout.open('south')">  Resize South=300</a></li>
    <li><a href="#" onClick="innerLayout.sizePane('south', 10000); innerLayout.open('south')">Resize South=10000</a></li>
    <li><a href="#" onClick="innerLayout.panes.north.css('backgroundColor','#FCC')">North Color = Red</a></li>
    <li><a href="#" onClick="innerLayout.panes.north.css('backgroundColor','#CFC')">North Color = Green</a></li>
    <li><a href="#" onClick="innerLayout.panes.north.css('backgroundColor','')">    North Color = Default</a></li>
    <li><a href="#" onClick="alert('innerLayout.name = \''+innerLayout.options.name+'\'')">Show Layout Name</a></li>
    <li><a href="#" onClick="showOptions(innerLayout,'defaults')">Show Options.Defaults</a></li>
    <li><a href="#" onClick="showOptions(innerLayout,'north')">   Show Options.North</a></li>
    <li><a href="#" onClick="showOptions(innerLayout,'south')">   Show Options.South</a></li>
    <li><a href="#" onClick="showOptions(innerLayout,'west')">    Show Options.West</a></li>
    <li><a href="#" onClick="showOptions(innerLayout,'east')">    Show Options.East</a></li>
    <li><a href="#" onClick="showOptions(innerLayout,'center')">  Show Options.Center</a></li>
    <li><a href="#" onClick="showState(innerLayout,'container')"> Show State.Container</a></li>
    <li><a href="#" onClick="showState(innerLayout,'north')">     Show State.North</a></li>
    <li><a href="#" onClick="showState(innerLayout,'south')">     Show State.South</a></li>
    <li><a href="#" onClick="showState(innerLayout,'west')">      Show State.West</a></li>
    <li><a href="#" onClick="showState(innerLayout,'east')">      Show State.East</a></li>
    <li><a href="#" onClick="showState(innerLayout,'center')">    Show State.Center</a></li>
</ul>

    </div>
</div>

<div data-role="layout-north" data-options="{ spacing : { open : 0,close : 0 } }">

    <div class="header">North</div>
    <div data-role="content">north</div>
    <div class="footer">I'm a footer</div>
    
</div>

<div data-role="layout-south">

    <div class="header">South</div>
    <div data-role="content">south</div>

</div>

<div data-role="layout-center">

    <div data-role="content">

        <!-- DIVs for the INNER LAYOUT -->

        <div class="ui-layout-center">
            <h3 class="header">Inner - Center</h3>
            <div class="ui-layout-content">
            
                <p id="createInner2" style="font-weight: bold;"><a href="#" onClick="createInnerLayout(); return false;"
                    >Click here to CREATE the Inner Layout</a></p><!-- outerLayout.open('east');  -->

                <p>See the <a href="#" onclick="outerLayout.open('east'); return false;">Outer-East pane</a> for commands to manipulate the Inner Layout</p>

                <p><a href="../demos.html">Go to the Demos page</a></p>

                <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
                <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
                <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
                <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
            </div>
            <div class="footer">Center panes can have headers &amp; footers too</div>
        </div>

        <div class="ui-layout-north"> Inner - North</div>
        <div class="ui-layout-south"> Inner - South</div>
        <div class="ui-layout-west">  Inner - West</div>
        <div class="ui-layout-east">  Inner - East
            <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
            <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
            <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
            <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
        </div>

        <!-- DIVs for the INNER LAYOUT -->

    </div>

</div>