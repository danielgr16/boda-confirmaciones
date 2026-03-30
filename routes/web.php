<?php

use App\Http\Controllers\InvitedController;
use Illuminate\Support\Facades\Route;

Route::get('/', [InvitedController::class, 'invalid'])->name('invitado.invalid');
Route::get('/table', [InvitedController::class, 'invitados'])->name('invitado.table');
Route::get('/{uuid?}', [InvitedController::class, 'index'])->name('invitado.index');
Route::get('/{uuid?}/view/confirm', [InvitedController::class, 'viewConfirm'])->name('invitado.view.confirm');
Route::post('/confirm', [InvitedController::class, 'confirm'])->name('invitado.confirm');
Route::get('/view_pass/{uuid}', [InvitedController::class, 'viewPass'])->name('invitado.view.pass');
Route::get('/arrival/{uuid}', [InvitedController::class, 'viewArrival'])->name('invitado.arrival');
Route::post('/arrival/check-password', [InvitedController::class, 'checkPassword'])->name('invitado.check_password');
Route::post('/arrival/register', [InvitedController::class, 'registerArrival'])->name('invitado.register_arrival');