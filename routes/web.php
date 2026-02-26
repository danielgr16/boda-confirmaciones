<?php

use App\Http\Controllers\InvitedController;
use Illuminate\Support\Facades\Route;

// Route::get('/', [InvitedController::class, 'index'])->name('invitado.index');
Route::get('/{uuid?}', [InvitedController::class, 'index'])->name('invitado.index');
Route::get('/{uuid?}/confirm', [InvitedController::class, 'confirm'])->name('invitado.confirm');
Route::post('/confirmar', [InvitedController::class, 'confirmar'])->name('invitado.confirmar');