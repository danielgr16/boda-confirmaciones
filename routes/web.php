<?php

use App\Http\Controllers\InvitedController;
use Illuminate\Support\Facades\Route;

// Route::get('/', [InvitedController::class, 'index'])->name('invitado.index');
Route::get('/{uuid?}', [InvitedController::class, 'index'])->name('invitado.index');
Route::get('/{uuid?}/view/confirm', [InvitedController::class, 'viewConfirm'])->name('invitado.view.confirm');
Route::post('/confirm', [InvitedController::class, 'confirm'])->name('invitado.confirm');