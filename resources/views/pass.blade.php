<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pase Virtual - Perla & Daniel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="{{ asset('css/master.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
</head>
<body class="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-6 font-sans">

    <div class="max-w-sm w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 relative">
        {{-- Círculos laterales para efecto ticket --}}
        <div class="absolute top-[22%] -left-4 w-8 h-8 bg-slate-100 rounded-full"></div>
        <div class="absolute top-[22%] -right-4 w-8 h-8 bg-slate-100 rounded-full"></div>

        {{-- Header --}}
        <div class="bg-stone-50 p-6 text-center border-b-2 border-dashed border-gray-200">
            <h1 class="font-serif text-2xl text-stone-800 italic">Perla & Daniel</h1>
            <p class="text-stone-500 uppercase tracking-widest text-[10px] mt-1 font-bold">Pase de Acceso</p>
        </div>

        {{-- Contenido --}}
        <div class="p-8 flex-grow flex flex-col items-center text-center">
            <div class="mb-8 w-full">
                <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-3 font-bold">Invitados Confirmados</p>
                <div class="space-y-2">
                    @php
                        $confirmados = [];
                        // Verificar invitado principal
                        if (!empty($grupo['invitado']) && $grupo['asistencia'] === true) {
                            $confirmados[] = $grupo['invitado'];
                        }
                        // Verificar acompañantes
                        if (!empty($grupo['acompanantes'])) {
                            foreach ($grupo['acompanantes'] as $acomp) {
                                if ($acomp['asistencia'] === true) {
                                    $confirmados[] = $acomp['invitado'];
                                }
                            }
                        }
                        // Verificar familia
                        if (!empty($grupo['familia'])) {
                            foreach ($grupo['familia'] as $fam) {
                                if ($fam['asistencia'] === true) {
                                    $confirmados[] = $fam['invitado'];
                                }
                            }
                        }
                    @endphp

                    @forelse($confirmados as $nombre)
                        <p class="text-xl font-serif text-stone-700 italic border-b border-stone-100 pb-1">{{ $nombre }}</p>
                    @empty
                        <p class="text-sm text-rose-400 italic">Sin confirmaciones registradas</p>
                    @endforelse
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8 w-full text-sm">
                <div class="text-center border-r border-gray-100">
                    <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Fecha</p>
                    <p class="text-gray-700 font-medium">18 Abril 2026</p>
                    <p class="text-gray-600">2:30 PM</p>
                </div>
                <div class="text-center">
                    <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Mesa</p>
                    <p class="text-gray-700 font-medium">Asignada</p>
                    <p class="text-gray-600">En entrada</p>
                </div>
            </div>

            {{-- QR Code --}}
            <div class="bg-white p-3 border-2 border-stone-50 rounded-2xl shadow-inner">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ urlencode(url('/view_pass/' . $grupo['uuid'])) }}" 
                     alt="QR Access" 
                     class="w-32 h-32 opacity-80">
            </div>
            <p class="text-[9px] text-gray-300 mt-3 font-mono tracking-tighter">{{ $grupo['uuid'] }}</p>
        </div>

        {{-- Footer --}}
        <div class="bg-stone-800 p-4 text-center">
            <p class="text-stone-300 text-[9px] uppercase tracking-[0.4em] font-medium">Favor de presentar este código</p>
        </div>
    </div>
    
    <a href="{{ route('invitado.index', ['uuid' => $grupo['uuid']]) }}" class="mt-8 text-stone-400 text-xs uppercase tracking-widest hover:text-stone-600 transition-colors">Volver a la invitación</a>

</body>
</html>