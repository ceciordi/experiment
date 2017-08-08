<?php

// Same as 'use strict' in javascript
declare(strict_types=1);

$db_config = include('../local_db_config.php');

$conn = new mysqli (
        $db_config['host'],
        $db_config['username'],
        $db_config['password'],
        $db_config['database'],
        $db_config['port']
    );

if ($conn->connect_errno) {
    echo "Failed to connect to MySQL: (" . $conn->connect_errno . ") " .
    $conn->connect_error;
}

return $conn;
