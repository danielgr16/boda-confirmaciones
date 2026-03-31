<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmaciones - Perla & Daniel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="{{ asset('css/master.css') }}">
    <style>
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-slate-50 min-h-screen">

    {{-- Topbar Sticky con Contadores, Buscador y Filtro --}}
    <div class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div class="max-w-md mx-auto p-4">
            <div class="mb-5">
                <h1 class="text-xl font-serif text-stone-800 italic text-center mb-4">Confirmaciones</h1>
                
                {{-- Contadores Globales --}}
                <div class="grid grid-cols-4 gap-2">
                    <div class="bg-stone-100 p-2 rounded-2xl text-center">
                        <span class="block text-[10px] uppercase text-stone-500 font-bold tracking-tighter">Total</span>
                        <span class="text-lg font-bold text-stone-800">{{ $stats['total'] }}</span>
                    </div>
                    <div class="bg-emerald-50 p-2 rounded-2xl text-center border border-emerald-100">
                        <span class="block text-[10px] uppercase text-emerald-600 font-bold tracking-tighter">Sí</span>
                        <span class="text-lg font-bold text-emerald-700">{{ $stats['confirmados'] }}</span>
                    </div>
                    <div class="bg-rose-50 p-2 rounded-2xl text-center border border-rose-100">
                        <span class="block text-[10px] uppercase text-rose-600 font-bold tracking-tighter">No</span>
                        <span class="text-lg font-bold text-rose-700">{{ $stats['rechazados'] }}</span>
                    </div>
                    <div class="bg-amber-50 p-2 rounded-2xl text-center border border-amber-100">
                        <span class="block text-[10px] uppercase text-amber-600 font-bold tracking-tighter">Pend.</span>
                        <span class="text-lg font-bold text-amber-700">{{ $stats['pendientes'] }}</span>
                    </div>
                </div>
            </div>

            {{-- Buscador y Filtros Rápidos --}}
            <div class="space-y-3">
                <input type="text" id="guest-search" onkeyup="applyFilters()" 
                       placeholder="Buscar invitado..." 
                       class="w-full px-5 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-stone-400 outline-none shadow-inner bg-gray-50/50">
                
                <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <button onclick="setStatusFilter('all', this)" class="filter-btn px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-white transition-all">Todos</button>
                    <button onclick="setStatusFilter('confirmado', this)" class="filter-btn px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-emerald-600 border border-emerald-200 transition-all">Confirmados</button>
                    <button onclick="setStatusFilter('rechazado', this)" class="filter-btn px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-rose-600 border border-rose-200 transition-all">Rechazados</button>
                    <button onclick="setStatusFilter('pendiente', this)" class="filter-btn px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-amber-600 border border-amber-200 transition-all">Pendientes</button>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-md mx-auto p-4 space-y-6 pb-20" id="invitations-container">
        @foreach($invitados as $grupo)
            @php
                $personas = [];
                if(!empty($grupo['invitado'])) $personas[] = ['nombre' => $grupo['invitado'], 'asistencia' => $grupo['asistencia'] ?? null];
                if(!empty($grupo['acompanantes'])) foreach($grupo['acompanantes'] as $a) $personas[] = ['nombre' => $a['invitado'], 'asistencia' => $a['asistencia'] ?? null];
                if(!empty($grupo['familia'])) {
                    $personas = [];
                    foreach($grupo['familia'] as $f) $personas[] = ['nombre' => $f['invitado'], 'asistencia' => $f['asistencia'] ?? null];
                }
                
                $cardStatuses = [];
                foreach($personas as $p) {
                    if($p['asistencia'] === true) $cardStatuses[] = 'confirmado';
                    elseif($p['asistencia'] === false) $cardStatuses[] = 'rechazado';
                    else $cardStatuses[] = 'pendiente';
                }
                $cardStatuses = array_unique($cardStatuses);
                $allNames = implode(' ', array_column($personas, 'nombre')) . ' ' . ($grupo['group'] ?? '');
            @endphp

            <div class="invitation-card bg-white rounded-3xl shadow-xl border border-gray-300 overflow-hidden" 
                 data-search-terms="{{ strtolower($allNames) }}"
                 data-statuses="{{ implode(' ', $cardStatuses) }}">
                <div class="bg-stone-50 p-4 border-b border-gray-100">
                    <h2 class="text-stone-800 font-serif italic text-lg">{{ $grupo['group'] }}</h2>
                    <a href="{{ route('invitado.view.confirm', ['uuid' => $grupo['uuid']]) }}">
                        <p class="text-[10px] text-stone-400 uppercase tracking-widest font-bold">UUID: {{ $grupo['uuid'] }}</p>
                    </a>
                </div>
                <div class="p-4 space-y-3">
                    @foreach($personas as $p)
                        <div class="flex items-center justify-between gap-4 py-1 border-b border-gray-50 last:border-0">
                            <span class="text-gray-700 text-sm font-medium">{{ $p['nombre'] }}</span>
                            
                            @if($p['asistencia'] === true)
                                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-md tracking-wider">Confirmado</span>
                            @elseif($p['asistencia'] === false)
                                <span class="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded-md tracking-wider">Rechazado</span>
                            @else
                                <span class="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-md tracking-wider">Sin respuesta</span>
                            @endif
                        </div>
                    @endforeach

                    @if(!empty($grupo['mensaje']))
                        <div class="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-100 italic text-stone-500 text-xs leading-relaxed">
                            "{{ $grupo['mensaje'] }}"
                        </div>
                    @endif
                </div>
            </div>
        @endforeach
    </div>

    <script>
        let currentStatusFilter = 'all';

        function setStatusFilter(status, btn) {
            currentStatusFilter = status;
            
            // Actualizar apariencia de botones
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-stone-800', 'text-white');
                b.classList.add('bg-white');
            });
            
            btn.classList.remove('bg-white');
            btn.classList.add('bg-stone-800', 'text-white');
            
            applyFilters();
        }

        function applyFilters() {
            const searchQuery = document.getElementById('guest-search').value.toLowerCase();
            const cards = document.querySelectorAll('.invitation-card');

            cards.forEach(card => {
                const searchTerms = card.getAttribute('data-search-terms');
                const cardStatuses = card.getAttribute('data-statuses').split(' ');
                
                const matchesSearch = searchTerms.includes(searchQuery);
                const matchesStatus = currentStatusFilter === 'all' || cardStatuses.includes(currentStatusFilter);

                if (matchesSearch && matchesStatus) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        window.onload = () => { applyFilters(); };
    </script>
</body>
</html>