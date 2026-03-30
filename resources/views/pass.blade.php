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

    <div id="ticket-card" class="max-w-sm w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col relative transition-transform duration-100 ease-out" style="will-change: transform; border: 5px solid transparent; background: linear-gradient(#fdfcfb, #fdfcfb) padding-box, linear-gradient(var(--angle, 45deg), #71706e, #e5e4e2, #ffffff, #d3d3d3, #71706e) border-box;">
        {{-- Círculos laterales para efecto ticket --}}
        <div class="absolute top-[22%] -left-4 w-8 h-8 bg-slate-100 rounded-full"></div>
        <div class="absolute top-[22%] -right-4 w-8 h-8 bg-slate-100 rounded-full"></div>

        {{-- Header --}}
        <div class="bg-stone-100/30 p-6 text-center border-b-2 border-dashed border-gray-200">
            <img src="{{ asset('img/logo.webp') }}" alt="" class="w-20 h-20 mx-auto">
            <span class="font-serif block text-stone-600 mt-2">Boda</span>
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
            <div class="qr-card p-4 border-2 border-stone-50 rounded-2xl shadow-inner">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ urlencode(url('/arrival/' . $grupo['uuid'])) }}" 
                     alt="QR Access" 
                     class="w-32 h-32 opacity-80">
            </div>
            <p class="text-[9px] text-gray-300 mt-3 font-mono tracking-tighter">{{ $grupo['uuid'] }}</p>
        </div>

        <img src="{{ asset('img/end.webp') }}" alt="" class="-mt-[193px]">
        {{-- Footer --}}
        <div class="bg-stone-800 p-4 text-center">
            <p class="text-stone-300 text-[9px] uppercase tracking-[0.4em] font-medium">Favor de presentar este código</p>
        </div>

        {{-- Textura de papel lino (Trama fina cruzada) --}}
        <div class="absolute inset-0 pointer-events-none z-40 opacity-[0.08]" 
             style="background-image: 
                repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px),
                repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px);">
        </div>

        {{-- Capa de brillo y reflejo --}}
        <div id="shine" class="absolute -inset-1 pointer-events-none opacity-0 z-50 transition-opacity duration-300" style="mix-blend-mode: overlay;"></div>
    </div>
    
    <a href="{{ route('invitado.index', ['uuid' => $grupo['uuid']]) }}" class="mt-8 text-stone-400 text-xs uppercase tracking-widest hover:text-stone-600 transition-colors">Volver a la invitación</a>

    <script>
        const card = document.getElementById('ticket-card');
        const shine = document.getElementById('shine');

        const handleMove = (e) => {
            const pos = card.getBoundingClientRect();
            // Obtener coordenadas tanto para mouse como para touch
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            const x = clientX - pos.left;
            const y = clientY - pos.top;

            // Calcular rotación (máximo 15 grados)
            const centerX = pos.width / 2;
            const centerY = pos.height / 2;
            const rotateX = (centerY - y) / 25; // Aumentado de 12 a 25 para menos inclinación
            const rotateY = (x - centerX) / 25; // Aumentado de 12 a 25 para menos inclinación

            card.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; // Aumentado de 1000px a 2000px

            // Efecto de brillo dinámico
            const shineX = (x / pos.width) * 100;
            const shineY = (y / pos.height) * 100;
            shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.5) 0%, rgba(200, 200, 200, 0.2) 50%, transparent 80%)`;
            shine.style.opacity = '1';

            // Ajustar el ángulo del brillo del borde dorado
            const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
            card.style.setProperty('--angle', `${angle}deg`);
        };

        const handleReset = () => {
            card.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg)';
            card.style.transition = 'transform 0.5s ease-out';
            shine.style.opacity = '0';
            card.style.setProperty('--angle', '45deg');
            setTimeout(() => { card.style.transition = 'transform 0.1s ease-out'; }, 500);
        };

        // Eventos de Mouse
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleReset);

        // Eventos de Touch (Móvil)
        card.addEventListener('touchstart', handleMove, { passive: true });
        card.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) handleMove(e);
        }, { passive: true });
        card.addEventListener('touchend', handleReset);
    </script>
</body>
</html>