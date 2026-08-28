<?php

// Fix Vercel Serverless routing & script path
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/../public/index.php';

// Prepare writable /tmp storage directories
$tmpStorage = '/tmp/storage';
$directories = [
    $tmpStorage,
    $tmpStorage . '/app',
    $tmpStorage . '/app/public',
    $tmpStorage . '/app/public/garcia-zentella',
    $tmpStorage . '/framework',
    $tmpStorage . '/framework/cache',
    $tmpStorage . '/framework/cache/data',
    $tmpStorage . '/framework/sessions',
    $tmpStorage . '/framework/views',
    $tmpStorage . '/logs',
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Fallback environment variables
if (!getenv('APP_KEY') && !isset($_ENV['APP_KEY'])) {
    putenv('APP_KEY=base64:pYM0b27I796JRAOutC5yv5JpLhqIjASJPrmnNTJlrrs=');
    $_ENV['APP_KEY'] = 'base64:pYM0b27I796JRAOutC5yv5JpLhqIjASJPrmnNTJlrrs=';
    $_SERVER['APP_KEY'] = 'base64:pYM0b27I796JRAOutC5yv5JpLhqIjASJPrmnNTJlrrs=';
}

if (!getenv('APP_STORAGE')) {
    putenv('APP_STORAGE=/tmp/storage');
    $_ENV['APP_STORAGE'] = '/tmp/storage';
    $_SERVER['APP_STORAGE'] = '/tmp/storage';
}

if (!getenv('SESSION_DRIVER')) {
    putenv('SESSION_DRIVER=cookie');
    $_ENV['SESSION_DRIVER'] = 'cookie';
    $_SERVER['SESSION_DRIVER'] = 'cookie';
}

if (!getenv('CACHE_STORE')) {
    putenv('CACHE_STORE=file');
    $_ENV['CACHE_STORE'] = 'file';
    $_SERVER['CACHE_STORE'] = 'file';
}

if (!getenv('QUEUE_CONNECTION')) {
    putenv('QUEUE_CONNECTION=sync');
    $_ENV['QUEUE_CONNECTION'] = 'sync';
    $_SERVER['QUEUE_CONNECTION'] = 'sync';
}

if (!getenv('LOG_CHANNEL')) {
    putenv('LOG_CHANNEL=stderr');
    $_ENV['LOG_CHANNEL'] = 'stderr';
    $_SERVER['LOG_CHANNEL'] = 'stderr';
}

if (!getenv('VIEW_COMPILED_PATH')) {
    putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
    $_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
    $_SERVER['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
}

// Forward to public/index.php
require __DIR__ . '/../public/index.php';
