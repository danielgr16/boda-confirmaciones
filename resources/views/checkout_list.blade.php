<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check-out List - Perla & Daniel</title>
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
        .loading .btn-icon { display: none; }
        .hidden { display: none; }
    </style>
</head>
<body class="bg-slate-50 min-h-screen">

    {{-- Sección de Autenticación (Misma lógica que arrival) --}}
    <div id="auth-section" class="min-h-screen flex items-center justify-center p-4">
        <div class="main-card max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
            <div class="mb-8">
                <span class="text-secondary font-serif mb-2 block uppercase tracking-widest text-xs">Seguridad</span>
                <h1 class="text-2xl font-serif text-gray-800 italic">Acceso de Guardias</h1>
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
    </div>

    {{-- Sección de Checkout List --}}
    <div id="checkout-section" class="hidden">
        {{-- Topbar Sticky con Buscador --}}
        <div class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 shadow-sm">
            <div class="max-w-md mx-auto">
                <input type="text" id="guest-search" onkeyup="filterInvitations()" 
                       placeholder="Buscar invitado por nombre..." 
                       class="w-full px-5 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-stone-400 outline-none shadow-inner bg-gray-50/50">
            </div>
        </div>

        <div class="max-w-md mx-auto p-4 space-y-6 pb-20" id="invitations-container">
            @foreach($invitados as $grupo)
            @php
                $invitadosList = [];
                if(!empty($grupo['invitado'])) $invitadosList[] = ['nombre' => $grupo['invitado'], 'tipo' => 'principal', 'llegada' => $grupo['llegada'] ?? null];
                if(!empty($grupo['acompanantes'])) foreach($grupo['acompanantes'] as $a) $invitadosList[] = ['nombre' => $a['invitado'], 'tipo' => 'acompanante', 'llegada' => $a['llegada'] ?? null];
                if(!empty($grupo['familia'])) {
                    $invitadosList = [];
                    foreach($grupo['familia'] as $f) $invitadosList[] = ['nombre' => $f['invitado'], 'tipo' => 'familiar', 'llegada' => $f['llegada'] ?? null];
                }
                $allNames = implode(' ', array_column($invitadosList, 'nombre')) . ' ' . ($grupo['group'] ?? '');
            @endphp

            <div class="invitation-card bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" data-search-terms="{{ strtolower($allNames) }}">
                <div class="bg-stone-50 p-4 border-b border-gray-100">
                    <h2 class="text-stone-800 font-serif italic text-lg">{{ $grupo['group'] }}</h2>
                    <p class="text-[10px] text-stone-400 uppercase tracking-widest font-bold">UUID: {{ $grupo['uuid'] }}</p>
                </div>
                <div class="p-4 space-y-4">
                    @foreach($invitadosList as $inv)
                    <div class="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                        <span class="text-gray-700 text-sm font-medium">{{ $inv['nombre'] }}</span>
                        <div class="flex gap-2 shrink-0">
                            {{-- Botón Llegó (Verde) --}}
                            <button onclick="registerArrival('{{ $grupo['uuid'] }}', '{{ $inv['tipo'] }}', '{{ $inv['nombre'] }}', true, this)" 
                                    class="w-10 h-10 rounded-lg border flex justify-center items-center transition-all arrival-btn-in {{ ($inv['llegada'] === true) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-200' }}">
                                <span class="btn-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                </span>
                                <div class="spinner"></div>
                            </button>
                            {{-- Botón No Llegó (Rojo) --}}
                            <button onclick="registerArrival('{{ $grupo['uuid'] }}', '{{ $inv['tipo'] }}', '{{ $inv['nombre'] }}', false, this)" 
                                    class="w-10 h-10 rounded-lg border flex justify-center items-center transition-all arrival-btn-out {{ ($inv['llegada'] === false) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-rose-600 border-rose-200' }}">
                                <span class="btn-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                                </span>
                                <div class="spinner"></div>
                            </button>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('arrival_auth') === 'true') {
                showCheckout();
            }
        });

        async function checkAuth() {
            const password = document.getElementById('admin_password').value;
            try {
                const response = await fetch("{{ route('invitado.check_password') }}", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
                    body: JSON.stringify({ password })
                });
                if (response.ok) {
                    localStorage.setItem('arrival_auth', 'true');
                    showCheckout();
                } else { alert('Contraseña incorrecta'); }
            } catch (error) { alert('Error de conexión'); }
        }

        function showCheckout() {
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('checkout-section').classList.remove('hidden');
        }

        function filterInvitations() {
            const query = document.getElementById('guest-search').value.toLowerCase();
            const cards = document.querySelectorAll('.invitation-card');
            cards.forEach(card => {
                const terms = card.getAttribute('data-search-terms');
                card.style.display = terms.includes(query) ? 'block' : 'none';
            });
        }

        async function registerArrival(uuid, tipo, nombre, llegada, btnElement) {
            const container = btnElement.parentElement;
            const buttons = container.querySelectorAll('button');

            btnElement.classList.add('loading');
            buttons.forEach(b => { b.disabled = true; b.classList.add('opacity-60'); });

            try {
                const response = await fetch("{{ route('invitado.register_arrival') }}", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
                    body: JSON.stringify({ uuid, tipo, nombre, llegada })
                });

                if (response.ok) {
                    const btnIn = container.querySelector('.arrival-btn-in');
                    const btnOut = container.querySelector('.arrival-btn-out');

                    // Reset styles
                    btnIn.className = 'w-10 h-10 rounded-lg border flex justify-center items-center transition-all arrival-btn-in bg-white text-emerald-600 border-emerald-200';
                    btnOut.className = 'w-10 h-10 rounded-lg border flex justify-center items-center transition-all arrival-btn-out bg-white text-rose-600 border-rose-200';

                    if (llegada) {
                        btnIn.classList.replace('bg-white', 'bg-emerald-600');
                        btnIn.classList.replace('text-emerald-600', 'text-white');
                        btnIn.classList.replace('border-emerald-200', 'border-emerald-600');
                    } else {
                        btnOut.classList.replace('bg-white', 'bg-rose-600');
                        btnOut.classList.replace('text-rose-600', 'text-white');
                        btnOut.classList.replace('border-rose-200', 'border-rose-600');
                    }
                }
            } catch (error) {
                alert('Error al registrar.');
            } finally {
                btnElement.classList.remove('loading');
                buttons.forEach(b => { b.disabled = false; b.classList.remove('opacity-60'); });
            }
        }
    </script>
</body>
</html>