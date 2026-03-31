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

    public function viewArrival($uuid)
    {
        $invitados = $this->getData();
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        // Seleccionar solo a los invitados que tengan valor true en asistencia

        if (!$grupo) {
            return view('invalid');
        }

        return view('arrival', compact('grupo', 'uuid'));
    }

    public function checkoutList()
    {
        Log::info('Vista lista de acceso');
        $invitados = $this->getData();
        return view('checkout_list', compact('invitados'));
    }

    public function checkPassword(Request $request)
    {
        $password = 'boda2026'; // Contraseña hardcodeada
        if ($request->password === $password) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Contraseña incorrecta'], 401);
    }

    public function registerArrival(Request $request)
    {
        $uuid = $request->uuid;
        $tipo = $request->tipo;
        $nombre = $request->nombre;
        $llegada = $request->llegada; // boolean

        $invitados = $this->getData();
        
        foreach ($invitados as &$item) {
            if ($item['uuid'] === $uuid) {
                if($tipo === 'familiar') {
                    foreach ($item['familia'] as &$familiar) {
                        if ($familiar['invitado'] === $nombre) {
                            $familiar['llegada'] = $llegada;
                        }
                    }
                } 
                else if ($tipo === 'principal') {
                    $item['llegada'] = $llegada;
                } 
                else if ($tipo === 'acompanante') {
                    foreach ($item['acompanantes'] as &$acomp) {
                        if ($acomp['invitado'] === $nombre) {
                            $acomp['llegada'] = $llegada;
                        }
                    }
                }
                break;
            }
        }
        $this->saveData($invitados);
        
        return response()->json(['success' => true]);
    }

    public function viewPass($uuid)
    {
        $invitados = $this->getData();
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            Log::error('Intento de ver pase con UUID inválido', ['uuid' => $uuid]);
            return view('invalid');
        }

        return view('pass', compact('grupo'));
    }

    public function invalid()
    {
        return view('invalid');
    }

    public function invitados()
    {
        Log::info('Vista tabla de invitados');

        $data = $this->getData();

        $rows = [];
        $i = 1;

        foreach ($data as $grupo) {

            // invitado principal
            if (!empty($grupo['invitado'])) {
                $rows[] = [
                    'row' => $i++,
                    'uuid' => $grupo['uuid'],
                    'invitado' => $grupo['invitado'],
                    'companias' => '',
                    'group' => $grupo['group'] ?? '',
                    'asistencia' => $grupo['asistencia']
                ];
            }

            // acompañantes
            if (!empty($grupo['acompanantes'])) {
                foreach ($grupo['acompanantes'] as $acomp) {
                    $rows[] = [
                        'row' => $i++,
                        'uuid' => $grupo['uuid'],
                        'invitado' => $acomp['invitado'],
                        'companias' => $grupo['invitado'],
                        'group' => $grupo['group'] ?? '',
                        'asistencia' => $acomp['asistencia']
                    ];
                }
            }

            // familia
            if (!empty($grupo['familia'])) {
                foreach ($grupo['familia'] as $fam) {
                    $rows[] = [
                        'row' => $i++,
                        'uuid' => $grupo['uuid'],
                        'invitado' => $fam['invitado'],
                        'companias' => '',
                        'group' => $grupo['group'] ?? '',
                        'asistencia' => $fam['asistencia']
                    ];
                }
            }
        }

        return view('confirmations_table', [
            'rows' => $rows
        ]);
    }
}