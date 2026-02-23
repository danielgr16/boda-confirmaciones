<?php

use App\Http\Controllers\InvitedController;
use Illuminate\Support\Facades\Route;

Route::get('/invitation/{uuid?}', [InvitedController::class, 'index'])->name('invitado.index');
Route::get('/invitation/{uuid?}/confirm', [InvitedController::class, 'confirm'])->name('invitado.index');
Route::post('/confirmar', [InvitedController::class, 'confirmar'])->name('invitado.confirmar');