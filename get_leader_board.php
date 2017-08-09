<?php

// Same as 'use strict' in javascript
declare(strict_types=1);

// Choose a limit for the number of records to get from database
$limit = $_GET['limit'] ?? 10;

// Get the mysqli database connection
$db = include('db_conn.php');

// Prepare the selection statement to execute on the database for our records
$stmt = $db->prepare('SELECT * FROM `card_game`.`tags_and_scores` ORDER BY `date` DESC LIMIT ?');

// Tell the prepared statement the limit we want to use
$stmt->bind_param('i', $limit);

// Execute our sql code so the request is made to the database
//  and if an error occurred tell the user about it
if (!$stmt->execute()) {
    $json = ['error' => "Execute failed: (" . $stmt->errno . ") " . $stmt->error];
} else {
    // Get the result of our executed sql statement(s)
    $result = $stmt->get_result();

    // Set a variable to capture the selected rows from the database (below)
    $out = [];

    // Get leader board rows from mysqli statement result (result of sql from line '13')
    while ($row = $result->fetch_assoc()) { $out[] = $row; }

    // Set the rows to be returned as json
    $json = ['data' => $out];
}

// Tell browser we are sending JSON
header('Content-Type: application/json');

// Send JSON
echo json_encode($json);
