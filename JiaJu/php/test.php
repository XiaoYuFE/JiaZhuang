<?php
	
header("Access-Control-Allow-Origin: http://www.wnworld.com");
	for($i=0;$i<25000000;$i++){
		$a=10;
	}
	$rt=rand(0,1);
	$flag=$rt ? true :false;
	echo $flag;
?>