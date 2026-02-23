<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Boda</title>
    <script src="https://cdn.tailwindcss.com"></script>
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
    </style>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center p-4">

    <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div class="text-center mb-10">
            <span class="text-rose-400 text-4xl mb-4 block">♥</span>
            <h1 class="text-3xl font-serif text-gray-800 italic">Nuestra Boda</h1>
            <p class="text-gray-500 mt-2 font-light">Invitación para: <strong>{{ $grupo['invitado'] }}</strong></p>
        </div>

        <div id="app" class="space-y-10">
            <div class="group">
                <p class="text-sm uppercase tracking-widest text-gray-400 mb-4 font-semibold">Invitado Principal</p>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-gray-700 font-medium">{{ $grupo['invitado'] }}</span>
                </div>
                <div class="flex gap-3">
                    <button onclick="confirmar('principal', '{{ $grupo['invitado'] }}', true, this)" 
                            class="flex-1 py-3 px-4 rounded-xl border flex justify-center items-center transition-all duration-300 btn-asistencia {{ $grupo['asistencia'] === true ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-400' }}">
                        <span class="btn-text">Asistiré</span>
                        <div class="spinner"></div>
                    </button>
                    <button onclick="confirmar('principal', '{{ $grupo['invitado'] }}', false, this)" 
                            class="flex-1 py-3 px-4 rounded-xl border flex justify-center items-center transition-all duration-300 btn-asistencia {{ $grupo['asistencia'] === false ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-500 border-gray-200 hover:border-rose-400' }}">
                        <span class="btn-text">No iré</span>
                        <div class="spinner"></div>
                    </button>
                </div>
            </div>

            @if(count($grupo['acompanantes']) > 0)
            <div class="group">
                <p class="text-sm uppercase tracking-widest text-gray-400 mb-4 font-semibold">Acompañantes</p>
                <div class="space-y-6">
                    @foreach($grupo['acompanantes'] as $acomp)
                    <div>
                        <p class="text-gray-700 mb-3 text-sm">{{ $acomp['invitado'] }}</p>
                        <div class="flex gap-2">
                            <button onclick="confirmar('acompanante', '{{ $acomp['invitado'] }}', true, this)" 
                                    class="flex-1 py-2 px-4 rounded-lg border flex justify-center items-center transition-all btn-asistencia {{ $acomp['asistencia'] === true ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-200' }}">
                                <span class="btn-text text-sm">Asistirá</span>
                                <div class="spinner"></div>
                            </button>
                            <button onclick="confirmar('acompanante', '{{ $acomp['invitado'] }}', false, this)" 
                                    class="flex-1 py-2 px-4 rounded-lg border flex justify-center items-center transition-all btn-asistencia {{ $acomp['asistencia'] === false ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-500 border-gray-200' }}">
                                <span class="btn-text text-sm">No asistirá</span>
                                <div class="spinner"></div>
                            </button>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            <div class="pt-4">
                <label class="block text-sm font-medium text-gray-600 mb-2 italic">Un mensaje para nosotros...</label>
                <textarea id="mensaje" onblur="guardarMensaje(this)" rows="3" 
                          class="w-full border-gray-100 bg-gray-50 rounded-2xl shadow-inner focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all p-4 outline-none border text-gray-700" 
                          placeholder="Escribe aquí tu dedicatoria o comentario...">{{ $grupo['mensaje'] }}</textarea>
                <p id="msg-status" class="text-right text-[10px] text-gray-400 mt-1 uppercase tracking-tighter"></p>
            </div>
        </div>
    </div>

    <script>
        async function confirmar(tipo, nombre, asistencia, btnElement) {
            const container = btnElement.parentElement;
            const buttons = container.querySelectorAll('.btn-asistencia');
            const uuid = "{{ $grupo['uuid'] }}";

            // Estado de carga
            btnElement.classList.add('loading');
            buttons.forEach(b => {
                b.disabled = true;
                b.classList.add('opacity-60', 'cursor-not-allowed');
            });

            try {
                const response = await fetch("{{ route('invitado.confirmar') }}", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({ uuid, tipo, nombre, asistencia })
                });

                if (response.ok) {
                    // Resetear todos los botones del grupo actual
                    buttons.forEach(b => {
                        b.classList.remove('bg-emerald-600', 'bg-rose-600', 'text-white', 'border-emerald-600', 'border-rose-600');
                        b.classList.add('bg-white', 'text-gray-500', 'border-gray-200');
                    });

                    // Aplicar color al seleccionado
                    const colorClass = asistencia ? 'bg-emerald-600' : 'bg-rose-600';
                    const borderClass = asistencia ? 'border-emerald-600' : 'border-rose-600';
                    
                    btnElement.classList.remove('bg-white', 'text-gray-500', 'border-gray-200');
                    btnElement.classList.add(colorClass, 'text-white', borderClass);
                }
            } catch (error) {
                console.error(error);
                alert('Hubo un problema al guardar. Intenta de nuevo.');
            } finally {
                // Quitar carga y habilitar
                btnElement.classList.remove('loading');
                buttons.forEach(b => {
                    b.disabled = false;
                    b.classList.remove('opacity-60', 'cursor-not-allowed');
                });
            }
        }

        async function guardarMensaje(el) {
            const status = document.getElementById('msg-status');
            status.innerText = "Guardando...";
            
            try {
                await fetch("{{ route('invitado.confirmar') }}", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({ 
                        uuid: "{{ $grupo['uuid'] }}", 
                        mensaje: el.value 
                    })
                });
                status.innerText = "Guardado ✓";
                setTimeout(() => status.innerText = "", 2000);
            } catch (e) {
                status.innerText = "Error al guardar";
            }
        }
    </script>
</body>
</html>