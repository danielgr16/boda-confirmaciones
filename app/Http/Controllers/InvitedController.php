<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvitedController extends Controller
{
    private $path;

    public function __construct()
    {
        $this->path = storage_path('app/invitados.json');
    }

    private function getData()
    {
        if (!file_exists($this->path)) return [];
        $content = file_get_contents($this->path);
        return json_decode($content, true) ?? [];
    }

    private function saveData($data)
    {
        file_put_contents($this->path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    public function index($uuid = null)
    {
        if (!$uuid) {
            return view('invitation'); // Tu vista por defecto
        }

        $invitados = $this->getData();
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            return abort(404, 'Invitación no encontrada');
        }

        return view('invitacion', compact('grupo'));
    }

    public function viewConfirm($uuid = null)
    {
        if (!$uuid) {
            return view('welcome'); // Tu vista por defecto
        }

        $invitados = $this->getData();
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            return abort(404, 'Invitación no encontrada');
        }

        return view('invitacion-confirm', compact('grupo'));
    }

    public function confirmar(Request $request)
    {
        $uuid = $request->uuid;
        $tipo = $request->tipo; // 'principal' o 'acompanante'
        $nombre = $request->nombre; // Para identificar al acompañante
        $asistencia = $request->asistencia; // true, false o null
        $mensaje = $request->mensaje;

        $invitados = $this->getData();
        
        foreach ($invitados as &$item) {
            if ($item['uuid'] === $uuid) {
                if ($tipo === 'principal') {
                    $item['asistencia'] = $asistencia;
                } else {
                    foreach ($item['acompanantes'] as &$acomp) {
                        if ($acomp['invitado'] === $nombre) {
                            $acomp['asistencia'] = $asistencia;
                        }
                    }
                }
                
                if (isset($mensaje)) {
                    $item['mensaje'] = $mensaje;
                }
                break;
            }
        }

        $this->saveData($invitados);

        return response()->json(['success' => true]);
    }
}