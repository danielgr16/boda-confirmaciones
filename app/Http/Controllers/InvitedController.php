<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvitedController extends Controller
{
    private function getPath($novios = null)
    {
        $candidates = [];
        if ($novios) {
            $candidates[] = "app/public/{$novios}/invitados.json";
            $candidates[] = "app/{$novios}/invitados.json";
            $candidates[] = "app/{$novios}.json";
            $candidates[] = "app/invitados_{$novios}.json";
        }
        $candidates[] = "app/invitados.json";

        // 1. Check if already exists in active storage_path()
        foreach ($candidates as $relative) {
            $target = storage_path($relative);
            if (file_exists($target)) {
                return $target;
            }
        }

        // 2. If not found in storage_path (e.g. running in serverless /tmp), check base_path('storage/...')
        foreach ($candidates as $relative) {
            $source = base_path("storage/{$relative}");
            if (file_exists($source)) {
                $dest = storage_path($relative);
                $dir = dirname($dest);
                if (!is_dir($dir)) {
                    @mkdir($dir, 0755, true);
                }
                @copy($source, $dest);
                return file_exists($dest) ? $dest : $source;
            }
        }

        return storage_path('app/invitados.json');
    }

    private function getData($novios = null)
    {
        $path = $this->getPath($novios);
        if (!file_exists($path)) return [];
        $content = file_get_contents($path);
        return json_decode($content, true) ?? [];
    }

    private function saveData($data, $novios = null)
    {
        $path = $this->getPath($novios);
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        @file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    public function index($novios, $uuid = null)
    {
        if (!view()->exists("{$novios}.invitation")) {
            return $this->invalid($novios);
        }

        $invitados = $this->getData($novios);
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            return $this->invalid($novios);
        }

        Log::info('Vista invitación abierta', ['novios' => $novios, 'grupo' => $grupo]);
        return view("{$novios}.invitation", compact('grupo', 'uuid', 'novios'));
    }

    public function viewConfirm($novios, $uuid = null)
    {
        if (!$uuid || !view()->exists("{$novios}.confirmation")) {
            return $this->invalid($novios); 
        }

        $invitados = $this->getData($novios);
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            Log::error('Invitación no encontrada', ['novios' => $novios, 'uuid' => $uuid]);
            return $this->invalid($novios); 
        }

        Log::info('Vista confirmación abierta', ['novios' => $novios, 'grupo' => $grupo]);
        return view("{$novios}.confirmation", compact('grupo', 'uuid', 'novios'));
    }

    public function confirm(Request $request, $novios)
    {
        $uuid = $request->uuid;
        $tipo = $request->tipo; // 'principal', 'acompanante' o 'familiar'
        $nombre = $request->nombre; // Para identificar al acompañante/familiar
        $asistencia = $request->asistencia; // true, false o null
        $mensaje = $request->mensaje;

        $invitados = $this->getData($novios);
        
        foreach ($invitados as &$item) {
            if ($item['uuid'] === $uuid) {
                if ($tipo === 'familiar' && !empty($item['familia'])) {
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
                else if ($tipo === 'acompanante' && !empty($item['acompanantes'])) {
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
        $this->saveData($invitados, $novios);
        
        return response()->json(['success' => true]);
    }

    public function viewArrival($novios, $uuid)
    {
        if (!view()->exists("{$novios}.arrival")) {
            return $this->invalid($novios);
        }

        $invitados = $this->getData($novios);
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            return $this->invalid($novios);
        }

        return view("{$novios}.arrival", compact('grupo', 'uuid', 'novios'));
    }

    public function checkoutList($novios)
    {
        if (!view()->exists("{$novios}.checkout_list")) {
            return $this->invalid($novios);
        }

        Log::info('Vista lista de acceso', ['novios' => $novios]);
        $invitados = $this->getData($novios);

        $stats = [
            'llegaron' => 0,
            'no_llegaron' => 0,
            'pendientes' => 0,
            'total' => 0
        ];

        foreach ($invitados as $grupo) {
            $personas = [];
            if (!empty($grupo['familia'])) {
                foreach ($grupo['familia'] as $f) {
                    $personas[] = ['llegada' => $f['llegada'] ?? null];
                }
            } else {
                if (!empty($grupo['invitado'])) {
                    $personas[] = ['llegada' => $grupo['llegada'] ?? null];
                }
                if (!empty($grupo['acompanantes'])) {
                    foreach ($grupo['acompanantes'] as $a) {
                        $personas[] = ['llegada' => $a['llegada'] ?? null];
                    }
                }
            }

            foreach ($personas as $p) {
                $stats['total']++;
                if (($p['llegada'] ?? null) === true) $stats['llegaron']++;
                elseif (($p['llegada'] ?? null) === false) $stats['no_llegaron']++;
                else $stats['pendientes']++;
            }
        }

        return view("{$novios}.checkout_list", compact('invitados', 'stats', 'novios'));
    }

    public function checkPassword(Request $request, $novios)
    {
        $password = 'boda2026'; // Contraseña hardcodeada
        if ($request->password === $password) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Contraseña incorrecta'], 401);
    }

    public function registerArrival(Request $request, $novios)
    {
        $uuid = $request->uuid;
        $tipo = $request->tipo;
        $nombre = $request->nombre;
        $llegada = $request->llegada; // boolean

        $invitados = $this->getData($novios);
        
        foreach ($invitados as &$item) {
            if ($item['uuid'] === $uuid) {
                if ($tipo === 'familiar' && !empty($item['familia'])) {
                    foreach ($item['familia'] as &$familiar) {
                        if ($familiar['invitado'] === $nombre) {
                            $familiar['llegada'] = $llegada;
                        }
                    }
                } 
                else if ($tipo === 'principal') {
                    $item['llegada'] = $llegada;
                } 
                else if ($tipo === 'acompanante' && !empty($item['acompanantes'])) {
                    foreach ($item['acompanantes'] as &$acomp) {
                        if ($acomp['invitado'] === $nombre) {
                            $acomp['llegada'] = $llegada;
                        }
                    }
                }
                break;
            }
        }
        $this->saveData($invitados, $novios);
        
        return response()->json(['success' => true]);
    }

    public function viewPass($novios, $uuid)
    {
        if (!view()->exists("{$novios}.pass")) {
            return $this->invalid($novios);
        }

        $invitados = $this->getData($novios);
        $grupo = collect($invitados)->firstWhere('uuid', $uuid);

        if (!$grupo) {
            Log::error('Intento de ver pase con UUID inválido', ['novios' => $novios, 'uuid' => $uuid]);
            return $this->invalid($novios);
        }

        return view("{$novios}.pass", compact('grupo', 'novios'));
    }

    public function invalid($novios = null)
    {
        if ($novios && view()->exists("{$novios}.invalid")) {
            return response()->view("{$novios}.invalid", compact('novios'), 404);
        }
        if (view()->exists('garcia-zentella.invalid')) {
            return response()->view('garcia-zentella.invalid', ['novios' => 'garcia-zentella'], 404);
        }
        return abort(404, 'Invitación no encontrada');
    }

    public function invitados($novios)
    {
        if (!view()->exists("{$novios}.confirmations_table")) {
            return $this->invalid($novios);
        }

        Log::info('Vista tabla de invitados', ['novios' => $novios]);

        $invitados = $this->getData($novios);
        
        $stats = [
            'confirmados' => 0,
            'rechazados' => 0,
            'pendientes' => 0,
            'total' => 0
        ];

        foreach ($invitados as $grupo) {
            $personas = [];
            if (!empty($grupo['invitado'])) $personas[] = ['asistencia' => $grupo['asistencia'] ?? null];
            if (!empty($grupo['acompanantes'])) {
                foreach ($grupo['acompanantes'] as $a) $personas[] = ['asistencia' => $a['asistencia'] ?? null];
            }
            if (!empty($grupo['familia'])) {
                foreach ($grupo['familia'] as $f) $personas[] = ['asistencia' => $f['asistencia'] ?? null];
            }

            foreach ($personas as $p) {
                $stats['total']++;
                if (($p['asistencia'] ?? null) === true) $stats['confirmados']++;
                elseif (($p['asistencia'] ?? null) === false) $stats['rechazados']++;
                else $stats['pendientes']++;
            }
        }

        return view("{$novios}.confirmations_table", compact('invitados', 'stats', 'novios'));
    }
}
