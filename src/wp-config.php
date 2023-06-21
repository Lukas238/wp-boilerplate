<?php

// Load the wp-config file for the current environment
define('CONFIG_LOCAL', join(DIRECTORY_SEPARATOR, [__DIR__, 'wp-config.local.php']));

if( file_exists(CONFIG_LOCAL)){
    include( 'wp-config.local.php');
}else{
    include('wp-config.prod.php');
}
