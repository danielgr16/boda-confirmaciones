<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Llegada - Perla & Daniel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="{{ asset('css/master.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        .spinner {
            display: none;
            width: 1.2rem;
            height: 1.2rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading .spinner { display: inline-block; }
        .loading .btn-text { display: none; }
        .hidden { display: none; }
    </style>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center p-4">

    {{-- Sección de Autenticación --}}
    <div id="auth-section" class="main-card max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center mt-0">
        <div class="mb-8">
            <span class="text-secondary font-serif mb-2 block uppercase tracking-widest text-xs">Seguridad</span>
            <h1 class="text-2xl font-serif text-gray-800 italic">Acceso al Evento</h1>
        </div>
        
        <div class="space-y-4">
            <input type="password" id="admin_password" 
                   class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-stone-500 outline-none text-center" 
                   placeholder="Introduce la contraseña">
            <button onclick="checkAuth()" 
                    class="w-full bg-stone-800 text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-stone-700 transition shadow-lg">
                Entrar
            </button>
        </div>
    </div>

    {{-- Sección de Registro de Llegada (Oculta por defecto) --}}
    <div id="arrival-section" class="main-card max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border mt-0 border-gray-100 hidden">
        <div class="text-center mb-10">
            <span class="text-secondary font-serif mb-4 block">CONTROL DE ACCESO</span>
            <h1 class="text-3xl font-serif text-gray-800 italic">{{ $grupo['group'] }}</h1>
            <p class="text-gray-500 mt-2 font-light text-sm italic">Marca la entrada de los invitados</p>
        </div>

        <div id="app" class="space-y-8">
            {{-- Lógica para mostrar invitados (Familia o Principal/Acompañantes) --}}
            @php
                $invitadosList = [];
                if(!empty($grupo['invitado'])) {
                    $invitadosList[] = ['nombre' => $grupo['invitado'], 'tipo' => 'principal', 'llegada' => $grupo['llegada'] ?? null, 'asistencia' => $grupo['asistencia'] ?? null];
                }
                if(!empty($grupo['acompanantes'])) {
                    foreach($grupo['acompanantes'] as $a) {
                        $invitadosList[] = ['nombre' => $a['invitado'], 'tipo' => 'acompanante', 'llegada' => $a['llegada'] ?? null, 'asistencia' => $a['asistencia'] ?? null];
                    }
                }
                if(!empty($grupo['familia'])) {
                    $invitadosList = []; // Reset para usar solo familia si existe
                    foreach($grupo['familia'] as $f) {
                        $invitadosList[] = ['nombre' => $f['invitado'], 'tipo' => 'familiar', 'llegada' => $f['llegada'] ?? null, 'asistencia' => $f['asistencia'] ?? null];
                    }
                }
            @endphp

            @foreach($invitadosList as $inv)
            <div class="guest-row p-4 bg-gray-50 rounded-2xl border border-gray-100 @if($inv['asistencia'] == false) opacity-50 @endif">
                <p class="text-gray-700 mb-3 font-medium text-center">{{ $inv['nombre'] }}</p>
                @if($inv['asistencia'] === false)
                <p class="text-red-700 mb-3 font-medium text-center">Invitacion declinada</p>
                @elseif($inv['asistencia'] === null)
                <p class="text-yellow-700 mb-3 font-medium text-center">Invitación no confirmada</p>
                @endif
                <div class="flex gap-2">
                    <button onclick="registerArrival('{{ $inv['tipo'] }}', '{{ $inv['nombre'] }}', true, this)" 
                            class="flex-1 py-3 px-4 rounded-lg border flex justify-center items-center transition-all arrival-btn-in {{ $inv['llegada'] === true ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-200' }}">
                        <span class="btn-text text-xs font-bold uppercase tracking-wider">Llegó</span>
                        <div class="spinner"></div>
                    </button>
                    <button onclick="registerArrival('{{ $inv['tipo'] }}', '{{ $inv['nombre'] }}', false, this)" 
                            class="flex-1 py-3 px-4 rounded-lg border flex justify-center items-center transition-all arrival-btn-out {{ $inv['llegada'] === false ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-rose-600 border-rose-200' }}">
                        <span class="btn-text text-xs font-bold uppercase tracking-wider">No llegó</span>
                        <div class="spinner"></div>
                    </button>
                </div>
            </div>
            @endforeach
        </div>

        <div class="text-center mt-12 pt-6 border-t border-gray-100">
            <button onclick="logout()" class="text-gray-400 text-[10px] uppercase tracking-[0.2em] hover:text-rose-500 transition-colors font-bold">
                Cerrar Sesión Seguridad
            </button>
        </div>
    </div>

    <script>
        const UUID = "{{ $uuid }}";

        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('arrival_auth') === 'true') {
                showArrival();
            }
        });

        async function checkAuth() {
            const password = document.getElementById('admin_password').value;
            
            try {
                const response = await fetch("{{ route('invitado.check_password') }}", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({ password })
                });

                if (response.ok) {
                    localStorage.setItem('arrival_auth', 'true');
                    showArrival();
                } else {
                    alert('Contraseña incorrecta');
                }
            } catch (error) {
                console.error(error);
                alert('Error de conexión');
            }
        }

        function showArrival() {
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('arrival-section').classList.remove('hidden');
        }

        function logout() {
            localStorage.removeItem('arrival_auth');
            location.reload();
        }

        async function registerArrival(tipo, nombre, llegada, btnElement) {
            const container = btnElement.parentElement;
            const buttons = container.querySelectorAll('button');

            // Estado de carga
            btnElement.classList.add('loading');
            buttons.forEach(b => {
                b.disabled = true;
                b.classList.add('opacity-60', 'cursor-not-allowed');
            });

            try {
                const response = await fetch("{{ route('invitado.register_arrival') }}", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({ 
                        uuid: UUID, 
                        tipo: tipo, 
                        nombre: nombre, 
                        llegada: llegada 
                    })
                });

                if (response.ok) {
                    // Resetear estilos de los dos botones de este invitado
                    const btnIn = container.querySelector('.arrival-btn-in');
                    const btnOut = container.querySelector('.arrival-btn-out');

                    // Reset In
                    btnIn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
                    btnIn.classList.add('bg-white', 'text-emerald-600', 'border-emerald-200');
                    
                    // Reset Out
                    btnOut.classList.remove('bg-rose-600', 'text-white', 'border-rose-600');
                    btnOut.classList.add('bg-white', 'text-rose-600', 'border-rose-200');

                    // Aplicar estilo activo
                    if (llegada) {
                        btnIn.classList.remove('bg-white', 'text-emerald-600', 'border-emerald-200');
                        btnIn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
                    } else {
                        btnOut.classList.remove('bg-white', 'text-rose-600', 'border-rose-200');
                        btnOut.classList.add('bg-rose-600', 'text-white', 'border-rose-600');
                    }
                }
            } catch (error) {
                console.error(error);
                alert('Hubo un problema al registrar la llegada.');
            } finally {
                btnElement.classList.remove('loading');
                buttons.forEach(b => {
                    b.disabled = false;
                    b.classList.remove('opacity-60', 'cursor-not-allowed');
                });
            }
        }
    </script>
</body>
</html>