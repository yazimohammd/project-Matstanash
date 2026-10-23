<?php
header('Content-Type: application/json; charset=utf-8');

$conn = mysqli_connect('localhost','matstanash2','12AA@@test','matstanash1');

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$conn->set_charset('utf8mb4');

$query = 'SELECT `id`, `foundation1name`
          FROM `services1foundation`';
$result = mysqli_query($conn, $query);

if (!$result) { 
    echo json_encode(['success' => false, 'message' => 'Database query failed']);
    mysqli_close($conn);
    exit;
}

$foundations = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode([
    'success' => true,
    'data' => $foundations
], JSON_UNESCAPED_UNICODE);

mysqli_free_result($result);
mysqli_close($conn);

