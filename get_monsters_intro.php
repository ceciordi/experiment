<?php

// Strict mode - Just like javascript's "use strict" mode but for php.
declare(strict_types=1);

// Copied from http://php.net/manual/en/function.shuffle.php
function shuffle_indexed (array $list) {
    $keys = array_keys($list);
    shuffle($keys);
    $random = [];
    foreach ($keys as $key)
        $random[$key] = $list[$key];
    return array_values($random);
}

// Width to filter images by
$incomingWidth = isset($_GET['imageWidth']) && is_numeric($_GET['imageWidth']) ? (int) $_GET['imageWidth'] : 377;

// Get monsters list json file as a string
$monsters_json_str = file_get_contents('./monsters_list.json');

// Turn the monsters json list, as a string, into a php array of associative arrays
// `??` means `||` in variables (just like `||` in javascript) example:
// $someValue = $otherValue ?? $defaultValue;
$monsters_from_json = json_decode((string) $monsters_json_str ?? '[]', true);

// Filter monsters by image size (consult fibonacci numbers up to 1597 for available sizes)
// @see http://php.net/manual/en/functions.anonymous.php
$monsters_filtered = array_filter($monsters_from_json, function ($item) use ($incomingWidth) {
    return $item['width'] == $incomingWidth;
});

header('Content-Type: application/json');
echo json_encode(shuffle_indexed($monsters_filtered));
