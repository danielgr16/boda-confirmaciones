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
        $invitados = $this->getData();
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            return abort(404, 'Invitación no encontrada');
        }

        Log::info('Vista invitación abierta', ['grupo' => $grupo]);
        return view('invitation', compact('grupo', 'uuid'));
    }

    public function viewConfirm($uuid = null)
    {
        if (!$uuid) {
            return view('invalid'); 
        }

        $invitados = $this->getData();
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            Log::error('Invitación no encontrada', ['uuid' => $uuid]);
            return view('invalid'); 
        }

        // if (!$grupo) {
        //     return abort(404, 'Invitación no encontrada');
        // }
        Log::info('Vista confirmación abierta', ['grupo' => $grupo]);
        return view('confirmation', compact('grupo', 'uuid'));
    }

    public function confirm(Request $request)
    {
        $uuid = $request->uuid;
        $tipo = $request->tipo; // 'principal' o 'acompanante'
        $nombre = $request->nombre; // Para identificar al acompañante
        $asistencia = $request->asistencia; // true, false o null
        $mensaje = $request->mensaje;

        $invitados = $this->getData();
        
        foreach ($invitados as &$item) {
            if ($item['uuid'] === $uuid) {
                if($tipo === 'familiar') {
                    foreach ($item['familia'] as &$familiar) {
                        if ($familiar['invitado'] === $nombre) {
                            $familiar['asistencia'] = $asistencia;
                            Log::info('confirmacion:', ['familiar' => $familiar]);
                        }
                    }
                } 
                else if ($tipo === 'principal') {
                    $item['asistencia'] = $asistencia;
                    Log::info('confirmacion:', ['asistencia' => $asistencia, 'principal' => $nombre, 'uuid' => $uuid]);
                } 
                else if ($tipo === 'acompanante') {
                    foreach ($item['acompanantes'] as &$acomp) {
                        if ($acomp['invitado'] === $nombre) {
                            $acomp['asistencia'] = $asistencia;
                            Log::info('confirmacion:', ['asistencia' => $asistencia, 'acompanante' => $nombre, 'uuid' => $uuid]);
                        }
                    }
                }
                
                if (isset($mensaje)) {
                    $item['mensaje'] = $mensaje;
                    Log::info('Se agregó mensaje', ['mensaje' => $mensaje, 'uuid' => $uuid]);
                }
                break;
            }
        }
        $this->saveData($invitados);
        
        return response()->json(['success' => true]);
    }
}