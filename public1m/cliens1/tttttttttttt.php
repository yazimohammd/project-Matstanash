<?php

$file = 'data.json';

// 1. قراءة البيانات الحالية أو إنشاء مصفوفة جديدة
if (file_exists($file)) {
    $data = json_decode(file_get_contents($file), true) ?? [];
} else {
    $data = [];
}

// 2. إضافة عنصر جديد
$data[] = [
    'id' => 1,
    'name' => 'أحمد',
    'email' => 'ahmed@example.com'
];

// 3. تحويل البيانات إلى JSON وحفظها
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));


// ========================================================================================
// ========================================================================================
// ========================================================================================

$file = 'settings.json';

// 1. قراءة البيانات الحالية
if (file_exists($file)) {
    $data = json_decode(file_get_contents($file), true) ?? [];
} else {
    $data = [];
}

// 2. إضافة أو تعديل مفتاح محدد
$data['theme'] = 'dark';
$data['language'] = 'ar';

// 3. تحويل البيانات وحفظها
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// ========================================================================================
// ========================================================================================
// ========================================================================================
// ========================================================================================

$folder = "the_accounts/uploads_".$NUsername.$NUsername; 

if (!is_dir($folder)) {
    if (!mkdir($folder, 0755, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create directory']);
        exit;
    }
}

$taberfile = $folder . '/reservations11.json';

// كتابة العناصر داخل المصفوفة
$taberJson = [
    [
        'id' => 1,
        'name' => 'أحمد',
        'email' => 'ahmed@example.com'
    ],
    [
        'id' => 2,
        'name' => 'أحمد',
        'email' => 'ahmed@example.com'
    ]
];

// تحويل المصفوفة إلى نص JSON مع إبقاء اللغة العربية كما هي
$jsonContent = json_encode($taberJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

// حفظ البيانات في الملف
if (file_put_contents($taberfile, $jsonContent) !== false) {
    echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to write file']);
}
exit;






?>