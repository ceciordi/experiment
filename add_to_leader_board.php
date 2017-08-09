<?php

// Same as 'use strict' in javascript
declare(strict_types=1);

$tag = $_POST['tag'] ?? '';
$difficulty = $_POST['difficulty'] ?? 'easy';
$duration = (int) $_POST['duration'] ?? 0;
$score = (int) $_POST['score'] ?? 0;
$date = (int) $_POST['date'] ?? 0;

if (empty($_POST)) {
        $json = ['error' => "No data received."];
} else {
    $db = include('db_conn.php');

    $stmt = $db->prepare('INSERT INTO `card_game`.`tags_and_scores` ' .
        '(tag, difficulty, duration, score, date) VALUES (?, ?, ?, ?, ?);'
        );

    $json = ['error' => "No data received."];

    if ($stmt) {

        // Tell the statement what data to give to mysql
        $stmt->bind_param(
            'ssiii',
            $tag,
            $difficulty,
            $duration,
            $score,
            $date
        );

        // Execute (run) our sql code so the data goes into
        //  mysql and if an error occurred tell the user about it
        if (!$stmt->execute()) {
            $json = ['error' => "Execute failed: (" . $stmt->errno . ") " . $stmt->error];
        } else {
            $json = ['success' => true];
        }
    }



    // Close database connection
    $db->close();
}


// Tell browser we are sending JSON
header('Content-Type: application/json');

// Send JSON
echo json_encode($json);

