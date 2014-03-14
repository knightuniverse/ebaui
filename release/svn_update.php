<?php

$cmd = 'svn update 2>&1';
//echo $cmd;
echo 'updating start....<br />';
echo '<pre>';
$out = shell_exec($cmd);
echo $out;
echo '</pre>';
echo '<br />updating end....';
