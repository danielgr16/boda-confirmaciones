<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuestra Boda - Daniela & Erik</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --dusty-sage: #6E836F;
            --dusty-sage-dark: #3F5241;
            --dusty-sage-light: #8FA290;
            --pistachio: #9FB99E;
            --pistachio-subtle: #E8F0E7;
            --champagne: #EFE4D2;
            --champagne-gold: #BCA074;
            --champagne-light: #FAF5ED;
            --alabaster: #FBF9F5;
            --alabaster-card: #FFFFFF;
            --text-main: #2C3E2D;
            --text-secondary: #586959;
            --text-muted: #7E8E7F;
        }

        body {
            background-color: #ECE7E1;
            color: var(--text-main);
            font-family: 'Montserrat', sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        .font-script {
            font-family: 'Alex Brush', cursive;
        }

        .font-cormorant {
            font-family: 'Cormorant Garamond', serif;
        }

        .font-serif {
            font-family: 'Playfair Display', serif;
        }

        .bg-alabaster {
            background-color: var(--alabaster);
        }

        .bg-sage-wash {
            background: linear-gradient(180deg, rgba(232, 240, 231, 0.85) 0%, rgba(220, 232, 219, 0.95) 50%, rgba(232, 240, 231, 0.85) 100%);
        }

        .text-sage-dark {
            color: var(--dusty-sage-dark);
        }

        .text-sage {
            color: var(--dusty-sage);
        }

        .text-gold {
            color: var(--champagne-gold);
        }

        .btn-primary-sage {
            background-color: var(--dusty-sage-dark);
            color: #FFFFFF;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.75rem 1.75rem;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            box-shadow: 0 4px 14px rgba(63, 82, 65, 0.25);
            transition: all 0.3s ease;
        }

        .btn-primary-sage:hover {
            background-color: var(--dusty-sage);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(63, 82, 65, 0.35);
        }

        .btn-outline-sage {
            border: 1px solid var(--dusty-sage);
            color: var(--dusty-sage-dark);
            background-color: rgba(255, 255, 255, 0.7);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-size: 0.72rem;
            font-weight: 600;
            padding: 0.65rem 1.4rem;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            backdrop-filter: blur(4px);
            transition: all 0.3s ease;
        }

        .btn-outline-sage:hover {
            background-color: var(--dusty-sage-dark);
            color: #FFFFFF;
            border-color: var(--dusty-sage-dark);
            transform: translateY(-1px);
        }

        .watercolor-divider {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 1.5rem 0;
        }

        .watercolor-divider::before,
        .watercolor-divider::after {
            content: "";
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(110, 131, 111, 0.4), transparent);
        }

        .card-elegant {
            background: #FFFFFF;
            border-radius: 1.25rem;
            border: 1px solid rgba(159, 185, 158, 0.25);
            box-shadow: 0 8px 24px -6px rgba(63, 82, 65, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-elegant:hover {
            box-shadow: 0 12px 30px -6px rgba(63, 82, 65, 0.12);
        }

        /* Subtle linen texture */
        .linen-texture {
            background-image: radial-gradient(rgba(110, 131, 111, 0.04) 1px, transparent 1px);
            background-size: 16px 16px;
        }

        /* Timeline styling */
        .timeline-line {
            position: absolute;
            left: 2rem;
            top: 1rem;
            bottom: 1rem;
            width: 1px;
            border-left: 2px dashed rgba(110, 131, 111, 0.45);
        }

        /* Floating music player button */
        .music-float-btn {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 50;
            width: 3.25rem;
            height: 3.25rem;
            border-radius: 9999px;
            background: rgba(63, 82, 65, 0.9);
            backdrop-filter: blur(8px);
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .music-float-btn:hover {
            transform: scale(1.08);
            background: var(--dusty-sage-dark);
        }

        .music-pulse {
            animation: pulse-border 2s infinite;
        }

        @keyframes pulse-border {
            0% { box-shadow: 0 0 0 0 rgba(110, 131, 111, 0.6); }
            70% { box-shadow: 0 0 0 12px rgba(110, 131, 111, 0); }
            100% { box-shadow: 0 0 0 0 rgba(110, 131, 111, 0); }
        }

        /* Custom subtle scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #FBF9F5;
        }
        ::-webkit-scrollbar-thumb {
            background: #BACFB8;
            border-radius: 3px;
        }
    </style>
</head>
<body class="min-h-screen flex justify-center py-0 sm:py-8">

    <!-- Container Principal de la Invitación -->
    <main class="w-full max-w-md bg-alabaster min-h-screen shadow-2xl overflow-hidden relative linen-texture pb-16">

        <!-- Decoraciones Botánicas Superiores -->
        <div class="absolute top-0 left-0 w-36 pointer-events-none opacity-85 z-10">
            <img src="{{ asset('img/top-left.webp') }}" alt="Hojas" class="w-full h-auto object-contain">
        </div>
        <div class="absolute top-0 right-0 w-36 pointer-events-none opacity-85 z-10">
            <img src="{{ asset('img/top-right.webp') }}" alt="Hojas" class="w-full h-auto object-contain">
        </div>

        <!-- SECCIÓN 1: CABECERA & MONOGRAMA -->
        <header class="pt-14 px-6 text-center relative z-20">
            <!-- Versículo Bíblico -->
            <div class="max-w-xs mx-auto mb-8 px-3">
                <p class="font-cormorant italic text-sm sm:text-base text-sage-dark leading-relaxed">
                    “Mejores son dos que uno; porque tienen mejor paga de su trabajo. Porque si cayeren, el uno levantará a su compañero; pero ¡ay del solo! que cuando cayere, no habrá segundo que lo levante.”
                </p>
                <span class="block font-cormorant font-semibold tracking-widest text-xs uppercase text-gold mt-2">
                    — Eclesiastés 4:9-10 —
                </span>
            </div>

            <!-- Monograma D | E -->
            <div class="flex items-center justify-center gap-4 my-6">
                <span class="font-cormorant text-5xl sm:text-6xl text-sage-dark font-light tracking-tight">D</span>
                <div class="w-[1px] h-12 bg-gradient-to-b from-transparent via-sage-dark/50 to-transparent"></div>
                <span class="font-cormorant text-5xl sm:text-6xl text-sage-dark font-light tracking-tight">E</span>
            </div>

            <p class="text-[10px] tracking-[0.35em] uppercase font-semibold text-text-secondary">
                NUESTRA BODA
            </p>
            
            <div class="flex justify-center items-center my-3 opacity-60">
                <svg width="20" height="12" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 18C20 18 13 11 13 6C13 3 15.5 1 18.5 1C19.5 1 20 1.5 20 1.5C20 1.5 20.5 1 21.5 1C24.5 1 27 3 27 6C27 11 20 18 20 18Z" fill="#6E836F" stroke="#6E836F" stroke-width="0.5"/>
                    <path d="M6 12C11 12 15 15 15 15M34 12C29 12 25 15 25 15" stroke="#6E836F" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
            </div>
        </header>

        <!-- SECCIÓN 2: FOTO PRINCIPAL -->
        <section class="relative px-5 my-6">
            <div class="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                    src="{{ asset('img/cover.webp') }}" 
                    alt="Daniela & Erik" 
                    class="w-full h-[360px] sm:h-[400px] object-cover object-center"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"></div>
                
                <!-- Badge o texto sutil sobre la foto -->
                <div class="absolute bottom-3 left-0 right-0 text-center">
                    <p class="font-cormorant italic text-white/90 text-sm tracking-widest drop-shadow-md">
                        14 . Noviembre . 2026
                    </p>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 3: TEXTO DE INVITACIÓN & PADRES -->
        <section class="px-6 text-center my-8">
            <p class="font-cormorant uppercase tracking-[0.18em] text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                Con la bendición de Dios y el amor de nuestros padres, los invitamos a celebrar nuestra unión matrimonial
            </p>

            <div class="watercolor-divider max-w-xs mx-auto my-6">
                <span class="px-3 text-gold text-xs">❦</span>
            </div>

            <!-- Nombres de los Padres -->
            <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto text-center my-6">
                <div class="p-3 bg-white/70 rounded-xl border border-pistachio-subtle shadow-sm">
                    <h3 class="text-[9px] uppercase tracking-widest font-bold text-sage mb-2">
                        Padres de la Novia
                    </h3>
                    <p class="font-cormorant font-medium text-sm text-sage-dark leading-snug">
                        Rodolfo Arce Arce
                    </p>
                    <p class="font-cormorant font-medium text-sm text-sage-dark leading-snug">
                        Bertha Alicia Rocha Flores
                    </p>
                </div>

                <div class="p-3 bg-white/70 rounded-xl border border-pistachio-subtle shadow-sm">
                    <h3 class="text-[9px] uppercase tracking-widest font-bold text-sage mb-2">
                        Padres del Novio
                    </h3>
                    <p class="font-cormorant font-medium text-sm text-sage-dark leading-snug">
                        Alejandro Silva Rodelo
                    </p>
                    <p class="font-cormorant font-medium text-sm text-sage-dark leading-snug">
                        Apolonia Rueda Montes
                    </p>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 4: NOMBRES DE LOS NOVIOS EN SCRIPT ELEGANTE -->
        <section class="text-center px-4 my-8 relative">
            <div class="py-2">
                <h1 class="font-script text-6xl sm:text-7xl text-sage-dark tracking-wide leading-tight">
                    Daniela
                </h1>
                <div class="font-cormorant italic text-2xl text-gold my-1 font-light">&</div>
                <h1 class="font-script text-6xl sm:text-7xl text-sage-dark tracking-wide leading-tight">
                    Erik
                </h1>
            </div>

            <p class="text-[10px] tracking-[0.25em] uppercase font-medium text-text-muted mt-5">
                TENEMOS EL HONOR DE INVITARLE A NUESTRA BODA
            </p>
        </section>

        <!-- SECCIÓN 5: FECHA DESTACADA & CUENTA REGRESIVA -->
        <section class="px-6 my-10">
            <div class="card-elegant p-6 text-center max-w-sm mx-auto bg-gradient-to-b from-white to-[#F9F7F2]">
                <p class="text-[11px] font-semibold tracking-[0.3em] uppercase text-sage mb-3">
                    NOVIEMBRE
                </p>
                
                <div class="flex items-center justify-center gap-6 my-2">
                    <span class="text-xs uppercase tracking-widest font-semibold text-text-secondary">
                        SÁBADO
                    </span>
                    <span class="font-cormorant font-bold text-5xl sm:text-6xl text-sage-dark leading-none">
                        14
                    </span>
                    <span class="text-xs uppercase tracking-widest font-semibold text-text-secondary">
                        2026
                    </span>
                </div>

                <p class="text-xs font-cormorant italic text-sage mt-2">
                    2:30 PM • Culiacán Rosales, Sinaloa
                </p>

                <div class="watercolor-divider my-5">
                    <span class="px-3 text-gold text-xs">❖</span>
                </div>

                <!-- Contador Regresivo Interactivo -->
                <p class="text-[10px] tracking-widest uppercase font-bold text-text-muted mb-3">
                    TIEMPO RESTANTE PARA EL GRAN DÍA
                </p>
                
                <div id="countdown-timer" class="grid grid-cols-4 gap-2 text-center pt-1">
                    <div class="bg-pistachio-subtle/80 p-2.5 rounded-xl border border-pistachio/30">
                        <span id="cd-days" class="font-cormorant font-bold text-2xl text-sage-dark block">--</span>
                        <span class="text-[9px] uppercase tracking-wider text-text-secondary font-medium">Días</span>
                    </div>
                    <div class="bg-pistachio-subtle/80 p-2.5 rounded-xl border border-pistachio/30">
                        <span id="cd-hours" class="font-cormorant font-bold text-2xl text-sage-dark block">--</span>
                        <span class="text-[9px] uppercase tracking-wider text-text-secondary font-medium">Horas</span>
                    </div>
                    <div class="bg-pistachio-subtle/80 p-2.5 rounded-xl border border-pistachio/30">
                        <span id="cd-minutes" class="font-cormorant font-bold text-2xl text-sage-dark block">--</span>
                        <span class="text-[9px] uppercase tracking-wider text-text-secondary font-medium">Min</span>
                    </div>
                    <div class="bg-pistachio-subtle/80 p-2.5 rounded-xl border border-pistachio/30">
                        <span id="cd-seconds" class="font-cormorant font-bold text-2xl text-sage-dark block">--</span>
                        <span class="text-[9px] uppercase tracking-wider text-text-secondary font-medium">Seg</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 6: DETALLES DE CEREMONIA & RECEPCIÓN -->
        <section class="px-6 my-10 space-y-6">
            
            <!-- Tarjeta Ceremonia Religiosa -->
            <div class="card-elegant p-6 text-center max-w-sm mx-auto">
                <div class="w-12 h-12 rounded-full bg-pistachio-subtle flex items-center justify-center mx-auto mb-3 text-sage-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M240,192h-8V104a8,8,0,0,0-4-6.93L136,44.75V16a8,8,0,0,0-16,0V44.75L28,97.07A8,8,0,0,0,24,104v88H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,108.43l80-46.66,80,46.66V192H40ZM120,136v40a8,8,0,0,0,16,0V136a8,8,0,0,0-16,0Z"></path>
                    </svg>
                </div>

                <span class="text-[10px] tracking-[0.25em] uppercase font-bold text-gold block mb-1">
                    2:30 PM
                </span>
                <h3 class="font-cormorant text-2xl font-bold text-sage-dark mb-2">
                    Ceremonia Religiosa
                </h3>
                <p class="font-sans text-xs text-text-secondary leading-relaxed mb-4 px-2">
                    Enrique Felix Castro 2569, Humaya,<br>
                    80020 Culiacán Rosales, Sin.
                </p>

                <a 
                    href="https://www.google.com/maps/search/?api=1&query=Enrique+Felix+Castro+2569,+Humaya,+80020+Culiac%C3%A1n+Rosales,+Sin." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn-outline-sage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,37.3,7.89,7.89,0,0,0,9.1,0A254.19,254.19,0,0,0,174,202.25C201.49,170.68,216,137.4,216,104A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path></svg>
                    VER UBICACIÓN
                </a>
            </div>

            <!-- Tarjeta Recepción -->
            <div class="card-elegant p-6 text-center max-w-sm mx-auto">
                <div class="w-12 h-12 rounded-full bg-pistachio-subtle flex items-center justify-center mx-auto mb-3 text-sage-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208V72H48ZM208,208H48V88H208V208Zm-40-72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Z"></path>
                    </svg>
                </div>

                <span class="text-[10px] tracking-[0.25em] uppercase font-bold text-gold block mb-1">
                    5:00 PM
                </span>
                <h3 class="font-cormorant text-2xl font-bold text-sage-dark mb-2">
                    Recepción
                </h3>
                <p class="font-sans text-xs text-text-secondary leading-relaxed mb-4 px-2">
                    Calle Fetsu 4408, Unión de Trabajadores,<br>
                    80050 Culiacán Rosales, Sin.
                </p>

                <a 
                    href="https://www.google.com/maps/search/?api=1&query=Calle+Fetsu+4408,+Uni%C3%B3n+de+Trabajadores,+80050+Culiac%C3%A1n+Rosales,+Sin." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn-outline-sage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,37.3,7.89,7.89,0,0,0,9.1,0A254.19,254.19,0,0,0,174,202.25C201.49,170.68,216,137.4,216,104A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path></svg>
                    VER UBICACIÓN
                </a>
            </div>
        </section>

        <!-- SECCIÓN 7: ITINERARIO DE ACTIVIDADES (ESTILO WATERCOLOR SAGE) -->
        <section class="my-12 px-5">
            <div class="rounded-3xl p-6 sm:p-8 bg-sage-wash border border-pistachio/40 shadow-lg relative overflow-hidden">
                <div class="text-center mb-8">
                    <p class="text-[10px] tracking-[0.3em] uppercase font-bold text-sage-dark mb-1">
                        CRONOGRAMA
                    </p>
                    <h2 class="font-cormorant text-3xl font-bold text-sage-dark">
                        Itinerario del Evento
                    </h2>
                </div>

                <!-- Línea de tiempo con iconos -->
                <div class="relative pl-12 space-y-6">
                    <div class="timeline-line"></div>

                    <!-- Item 1 -->
                    <div class="relative flex items-center">
                        <div class="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-sage flex items-center justify-center text-sage-dark shadow-sm z-10 text-xs">
                            ⛪
                        </div>
                        <div class="pl-1">
                            <span class="text-[11px] font-bold tracking-wider text-sage-dark block">2:30 PM</span>
                            <h4 class="font-cormorant font-bold text-lg text-sage-dark leading-tight">Ceremonia Religiosa</h4>
                            <p class="text-[11px] text-text-secondary">Unión sagrada ante Dios</p>
                        </div>
                    </div>

                    <!-- Item 2 -->
                    <div class="relative flex items-center">
                        <div class="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-sage flex items-center justify-center text-sage-dark shadow-sm z-10 text-xs">
                            🍸
                        </div>
                        <div class="pl-1">
                            <span class="text-[11px] font-bold tracking-wider text-sage-dark block">5:00 PM</span>
                            <h4 class="font-cormorant font-bold text-lg text-sage-dark leading-tight">Recepción & Bienvenida</h4>
                            <p class="text-[11px] text-text-secondary">Llegada al salón y cóctel</p>
                        </div>
                    </div>

                    <!-- Item 3 -->
                    <div class="relative flex items-center">
                        <div class="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-sage flex items-center justify-center text-sage-dark shadow-sm z-10 text-xs">
                            ✨
                        </div>
                        <div class="pl-1">
                            <span class="text-[11px] font-bold tracking-wider text-sage-dark block">6:30 PM</span>
                            <h4 class="font-cormorant font-bold text-lg text-sage-dark leading-tight">Entrada de los Novios</h4>
                            <p class="text-[11px] text-text-secondary">Gran bienvenida a los recién casados</p>
                        </div>
                    </div>

                    <!-- Item 4 -->
                    <div class="relative flex items-center">
                        <div class="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-sage flex items-center justify-center text-sage-dark shadow-sm z-10 text-xs">
                            🍽️
                        </div>
                        <div class="pl-1">
                            <span class="text-[11px] font-bold tracking-wider text-sage-dark block">7:30 PM</span>
                            <h4 class="font-cormorant font-bold text-lg text-sage-dark leading-tight">Banquete & Brindis</h4>
                            <p class="text-[11px] text-text-secondary">Cena en honor a la pareja</p>
                        </div>
                    </div>

                    <!-- Item 5 -->
                    <div class="relative flex items-center">
                        <div class="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-sage flex items-center justify-center text-sage-dark shadow-sm z-10 text-xs">
                            🪩
                        </div>
                        <div class="pl-1">
                            <span class="text-[11px] font-bold tracking-wider text-sage-dark block">8:30 PM</span>
                            <h4 class="font-cormorant font-bold text-lg text-sage-dark leading-tight">Fiesta & Baile</h4>
                            <p class="text-[11px] text-text-secondary">Celebración en la pista</p>
                        </div>
                    </div>

                    <!-- Item 6 -->
                    <div class="relative flex items-center">
                        <div class="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-sage flex items-center justify-center text-sage-dark shadow-sm z-10 text-xs">
                            💫
                        </div>
                        <div class="pl-1">
                            <span class="text-[11px] font-bold tracking-wider text-sage-dark block">2:00 AM</span>
                            <h4 class="font-cormorant font-bold text-lg text-sage-dark leading-tight">Despedida</h4>
                            <p class="text-[11px] text-text-secondary">Agradecimiento y cierre</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 8: PASE PERSONALIZADO & LUGARES RESERVADOS -->
        <section class="px-6 my-10 text-center">
            <div class="card-elegant p-6 max-w-sm mx-auto border-2 border-pistachio/40 bg-white">
                <div class="w-10 h-10 mx-auto rounded-full bg-champagne flex items-center justify-center text-champagne-gold mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16,24,24,0,0,1,0,48,16,16,0,0,0-16,16v24a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V168a16,16,0,0,0-16-16,24,24,0,0,1,0-48,16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,40a40,40,0,0,0,0,80v24H32V168a40,40,0,0,0,0-80V64H224ZM144,80a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H152A8,8,0,0,1,144,80Zm0,96a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H152A8,8,0,0,1,144,176Zm0-48a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H152A8,8,0,0,1,144,128Z"></path>
                    </svg>
                </div>

                <p class="text-[10px] tracking-[0.25em] uppercase font-bold text-text-muted mb-1">
                    PASE DIGITAL
                </p>
                <h3 class="font-cormorant text-2xl font-bold text-sage-dark mb-1">
                    {{ $grupo['group'] ?? ($grupo['invitado'] ?? 'Invitado Especial') }}
                </h3>

                @php
                    $numPases = 0;
                    if (!empty($grupo['familia'])) {
                        $numPases = count($grupo['familia']);
                    } else {
                        if (!empty($grupo['invitado'])) $numPases++;
                        if (!empty($grupo['acompanantes'])) $numPases += count($grupo['acompanantes']);
                    }
                @endphp

                <div class="inline-block bg-pistachio-subtle px-4 py-1.5 rounded-full my-3 border border-pistachio/30">
                    <span class="text-xs font-semibold text-sage-dark tracking-wide">
                        {{ $numPases }} {{ $numPases == 1 ? 'Lugar Reservado' : 'Lugares Reservados' }}
                    </span>
                </div>

                <p class="text-xs text-text-secondary mb-5 px-4">
                    Para ingresar al evento, presenta tu pase virtual con código QR personalizado.
                </p>

                <a 
                    href="{{ route('invitado.view.pass', ['novios' => $novios, 'uuid' => $uuid]) }}" 
                    class="btn-primary-sage w-full max-w-xs"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M40,112a8,8,0,0,1,8-8H208a8,8,0,0,1,0,16H48A8,8,0,0,1,40,112Zm168,32H48a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16Z"></path></svg>
                    VER MI PASE VIRTUAL
                </a>

                <!-- Accesos especiales si aplica -->
                @if($grupo['guardia'] ?? false)
                    <a class="btn-outline-sage mt-3 block w-full" href="{{ route('invitado.checkout_list', ['novios' => $novios]) }}">
                        Lista de Acceso (Guardias)
                    </a>
                @endif
                @if($grupo['novios'] ?? false)
                    <a class="btn-outline-sage mt-2 block w-full" href="{{ route('invitado.table', ['novios' => $novios]) }}">
                        Panel de Confirmaciones
                    </a>
                @endif
            </div>
        </section>

        <!-- SECCIÓN 9: CÓDIGO DE VESTIMENTA -->
        <section class="px-6 my-10 text-center">
            <div class="card-elegant p-6 max-w-sm mx-auto">
                <div class="w-12 h-12 rounded-full bg-champagne-light border border-champagne-gold/30 flex items-center justify-center mx-auto mb-3">
                    <img src="{{ asset('img/dresscode.svg') }}" alt="Dress Code" class="w-6 h-6 object-contain opacity-80">
                </div>

                <p class="text-[10px] tracking-[0.25em] uppercase font-bold text-gold mb-1">
                    DRESS CODE
                </p>
                <h3 class="font-cormorant text-2xl font-bold text-sage-dark mb-2">
                    Formal
                </h3>
                <p class="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                    Agradecemos a todos nuestros invitados vestir con atuendo formal.
                </p>

                <div class="mt-4 p-3 bg-pistachio-subtle/60 rounded-xl border border-pistachio/30 text-xs text-sage-dark">
                    <span class="font-semibold block mb-0.5">Nota importante:</span>
                    El color <strong>blanco</strong> está reservado exclusivamente para la novia.
                </div>
            </div>
        </section>

        <!-- SECCIÓN 10: SUGERENCIA DE REGALOS & TRANSFERENCIAS -->
        <section class="px-6 my-10 text-center">
            <div class="card-elegant p-6 max-w-sm mx-auto">
                <div class="w-12 h-12 rounded-full bg-pistachio-subtle flex items-center justify-center mx-auto mb-3 text-sage-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,72H180.92c.39-.33.79-.65,1.17-1A29.53,29.53,0,0,0,192,49.57,32.62,32.62,0,0,0,158.58,16a29.53,29.53,0,0,0-21.45,9.91l-9.13,10.05-9.13-10.05A29.53,29.53,0,0,0,97.42,16,32.62,32.62,0,0,0,64,49.57,29.53,29.53,0,0,0,73.91,71c.38.33.78.65,1.17,1H40A16,16,0,0,0,24,88v32a16,16,0,0,0,16,16v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V136a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM149,36.51a13.69,13.69,0,0,1,10-4.51A16.55,16.55,0,0,1,176,49.57a13.69,13.69,0,0,1-4.51,10c-5.59,5.08-25,11.53-37.49,12.43C135,59.5,142.45,41.1,149,36.51Zm-65.5,13A16.55,16.55,0,0,1,97,32a13.69,13.69,0,0,1,10,4.51c6.55,4.59,14,23,15,35.49-12.45-.9-31.9-7.35-37.49-12.43A13.69,13.69,0,0,1,83.5,49.57ZM40,88H120v32H40Zm16,48h64v64H56Zm144,64H136V136h64Zm16-80H136V88h80v32Z"></path>
                    </svg>
                </div>

                <p class="text-[10px] tracking-[0.25em] uppercase font-bold text-gold mb-1">
                    SUGERENCIA DE REGALOS
                </p>
                <h3 class="font-cormorant text-2xl font-bold text-sage-dark mb-2">
                    Mesa de Regalos
                </h3>
                <p class="text-xs text-text-secondary leading-relaxed mb-6">
                    Su presencia es nuestro mejor regalo. Si desean hacernos un presente, ponemos a su disposición las siguientes opciones:
                </p>

                <!-- Botones Mesa de Regalos Liverpool y Cimaco -->
                <div class="space-y-3 mb-6">
                    <a 
                        href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/52020540" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="btn-outline-sage w-full py-3"
                    >
                        🎁 Mesa de Regalos en Liverpool
                    </a>

                    <a 
                        href="https://mdr.cimaco.com.mx/evento/46620" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="btn-outline-sage w-full py-3"
                    >
                        ✨ Mesa de Regalos en Cimaco
                    </a>
                </div>

                <div class="watercolor-divider my-5">
                    <span class="px-3 text-gold text-xs">O TRANSFERENCIA BANCARIA</span>
                </div>

                <!-- Cuentas Bancarias con Botón de Copiado -->
                <div class="space-y-3 text-left">
                    
                    <!-- Cuenta Daniela -->
                    <div class="p-3.5 bg-alabaster rounded-xl border border-pistachio/30 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-sage block">BBVA • Daniela Arce</span>
                            <span class="font-mono text-xs font-bold text-sage-dark tracking-wider select-all" id="acc-daniela">4152 3137 5760 7093</span>
                        </div>
                        <button 
                            onclick="copyToClipboard('4152313757607093', this)"
                            class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg bg-white border border-pistachio text-sage-dark hover:bg-sage-dark hover:text-white transition"
                        >
                            Copiar
                        </button>
                    </div>

                    <!-- Cuenta Erik -->
                    <div class="p-3.5 bg-alabaster rounded-xl border border-pistachio/30 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-sage block">Bancoppel • Erik Silva</span>
                            <span class="font-mono text-xs font-bold text-sage-dark tracking-wider select-all" id="acc-erik">4169 1614 1413 7538</span>
                        </div>
                        <button 
                            onclick="copyToClipboard('4169161414137538', this)"
                            class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg bg-white border border-pistachio text-sage-dark hover:bg-sage-dark hover:text-white transition"
                        >
                            Copiar
                        </button>
                    </div>
                </div>

                <!-- Lluvia de Sobres -->
                <div class="mt-6 p-4 bg-champagne-light rounded-xl border border-champagne-gold/30">
                    <div class="flex items-center justify-center gap-2 mb-1 text-gold font-semibold text-xs">
                        <span>✉️</span>
                        <span>Lluvia de Sobres</span>
                    </div>
                    <p class="text-[11px] text-text-secondary">
                        También contaremos con un buzón para sobres el día del evento.
                    </p>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 11: SOLO ADULTOS -->
        <section class="px-6 my-10 text-center">
            <div class="card-elegant p-6 max-w-sm mx-auto bg-gradient-to-b from-white to-pistachio-subtle/30">
                <div class="w-10 h-10 rounded-full bg-pistachio-subtle flex items-center justify-center mx-auto mb-3 text-sage-dark text-lg">
                    ✨
                </div>

                <p class="text-[10px] tracking-[0.25em] uppercase font-bold text-gold mb-1">
                    EVENTO EXCLUSIVO
                </p>
                <h3 class="font-cormorant text-2xl font-bold text-sage-dark mb-2">
                    Solo Adultos
                </h3>
                <p class="text-xs text-text-secondary leading-relaxed px-2">
                    Amamos a sus pequeños, pero para que todos podamos disfrutar plenamente de esta celebración, nuestra boda será un evento exclusivamente para adultos.
                </p>
            </div>
        </section>

        <!-- SECCIÓN 12: GALERÍA DE FOTOS -->
        <section class="px-6 my-12 text-center">
            <p class="text-[10px] tracking-[0.3em] uppercase font-bold text-sage mb-1">
                NUESTROS MOMENTOS
            </p>
            <h3 class="font-cormorant text-3xl font-bold text-sage-dark mb-6">
                Galería de Fotos
            </h3>

            <div class="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div class="rounded-xl overflow-hidden shadow-md border-2 border-white">
                    <img src="{{ asset('img/album-1.webp') }}" alt="Recuerdo 1" class="w-full h-36 object-cover hover:scale-105 transition duration-300">
                </div>
                <div class="rounded-xl overflow-hidden shadow-md border-2 border-white">
                    <img src="{{ asset('img/album-2.webp') }}" alt="Recuerdo 2" class="w-full h-36 object-cover hover:scale-105 transition duration-300">
                </div>
                <div class="rounded-xl overflow-hidden shadow-md border-2 border-white">
                    <img src="{{ asset('img/album-3.webp') }}" alt="Recuerdo 3" class="w-full h-36 object-cover hover:scale-105 transition duration-300">
                </div>
                <div class="rounded-xl overflow-hidden shadow-md border-2 border-white">
                    <img src="{{ asset('img/album-4.webp') }}" alt="Recuerdo 4" class="w-full h-36 object-cover hover:scale-105 transition duration-300">
                </div>
            </div>
        </section>

        <!-- SECCIÓN 13: CONFIRMACIÓN DE ASISTENCIA (RSVP) -->
        <section class="px-6 my-12 text-center">
            <div class="card-elegant p-7 max-w-sm mx-auto border-2 border-sage/40 bg-gradient-to-b from-white to-[#F7F9F6]">
                <div class="w-12 h-12 rounded-full bg-sage-dark text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM221.73,64,128,139.81,34.27,64ZM224,192H32V77.83l90.72,73.71a8,8,0,0,0,10.56,0L224,77.83V192Z"></path>
                    </svg>
                </div>

                <p class="text-[10px] tracking-[0.25em] uppercase font-bold text-gold mb-1">
                    CONFIRMACIÓN
                </p>
                <h3 class="font-cormorant text-3xl font-bold text-sage-dark mb-2">
                    ¿Nos acompañas?
                </h3>
                
                <p class="text-xs text-text-secondary leading-relaxed mb-6">
                    Agradecemos confirmar su asistencia a más tardar el:<br>
                    <strong class="font-bold text-sage-dark text-sm block mt-1">16 de Octubre de 2026</strong>
                </p>

                <a 
                    href="{{ route('invitado.view.confirm', ['novios' => $novios, 'uuid' => $uuid]) }}" 
                    class="btn-primary-sage w-full py-3.5 text-sm"
                >
                    CONFIRMAR ASISTENCIA
                </a>

                <!-- Contactos telefónicos -->
                <div class="mt-8 pt-6 border-t border-pistachio/30 text-xs text-text-secondary">
                    <span class="text-[10px] uppercase font-bold text-sage tracking-widest block mb-2">
                        CONTACTOS PARA DUDAS
                    </span>
                    <div class="flex justify-center gap-6 mt-1">
                        <div>
                            <span class="font-semibold text-sage-dark block">Erik</span>
                            <a href="tel:6673616529" class="text-text-muted hover:text-sage transition">667 361 6529</a>
                        </div>
                        <div class="w-[1px] h-8 bg-pistachio/50"></div>
                        <div>
                            <span class="font-semibold text-sage-dark block">Daniela</span>
                            <a href="tel:6674915813" class="text-text-muted hover:text-sage transition">667 491 5813</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 14: CIERRE / DESPEDIDA -->
        <footer class="text-center pt-8 px-6 pb-12 relative">
            <div class="max-w-xs mx-auto mb-6">
                <p class="font-script text-4xl sm:text-5xl text-sage-dark mb-2">
                    ¡Esperamos verte pronto!
                </p>
                <p class="font-cormorant italic text-sm text-text-secondary">
                    Daniela & Erik
                </p>
            </div>

            <div class="w-full rounded-2xl overflow-hidden shadow-lg border-2 border-white max-w-sm mx-auto mb-6">
                <img src="{{ asset('img/end.webp') }}" alt="Foto Final" class="w-full h-48 object-cover">
            </div>

            <div class="max-w-xs mx-auto text-center">
                <p class="font-cormorant italic text-xs text-text-muted">
                    “Las muchas aguas no podrán apagar el amor, ni lo ahogarán los ríos.”
                </p>
                <span class="font-cormorant text-[11px] uppercase tracking-widest text-gold font-bold block mt-1">
                    — Cantares 8:7 —
                </span>
            </div>
        </footer>

        <!-- REPRODUCTOR DE MÚSICA FLOTANTE -->
        <button id="music-toggle" class="music-float-btn music-pulse" aria-label="Reproducir música">
            <svg id="icon-play" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
            </svg>
            <svg id="icon-pause" class="hidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"></path>
            </svg>
        </button>

        <audio id="audio-bg" src="{{ asset('sound/music.ogg') }}" preload="auto" loop></audio>

        <!-- Toast de Copiado al Portapapeles -->
        <div id="copy-toast" class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-sage-dark text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-300 pointer-events-none z-50">
            ✓ Copiado al portapapeles
        </div>

    </main>

    <!-- SCRIPTS -->
    <script>
        // Cuenta Regresiva al 14 de Noviembre de 2026 a las 14:30
        const weddingDate = new Date('2026-11-14T14:30:00-06:00').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                document.getElementById('countdown-timer').innerHTML = `
                    <div class="col-span-4 p-3 bg-pistachio-subtle rounded-xl text-sage-dark font-cormorant text-lg font-bold">
                        ¡Hoy es el gran día! 💕
                    </div>`;
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('cd-days').textContent = days;
            document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);

        // Reproductor de Música
        const musicBtn = document.getElementById('music-toggle');
        const audio = document.getElementById('audio-bg');
        const iconPlay = document.getElementById('icon-play');
        const iconPause = document.getElementById('icon-pause');

        musicBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                iconPlay.classList.add('hidden');
                iconPause.classList.remove('hidden');
                musicBtn.classList.remove('music-pulse');
            } else {
                audio.pause();
                iconPlay.classList.remove('hidden');
                iconPause.classList.add('hidden');
                musicBtn.classList.add('music-pulse');
            }
        });

        // Copiar cuenta al portapapeles
        function copyToClipboard(text, btnElement) {
            navigator.clipboard.writeText(text).then(() => {
                const toast = document.getElementById('copy-toast');
                toast.classList.remove('opacity-0');
                
                const origText = btnElement.innerText;
                btnElement.innerText = '¡Copiado!';
                btnElement.classList.add('bg-sage-dark', 'text-white');

                setTimeout(() => {
                    toast.classList.add('opacity-0');
                    btnElement.innerText = origText;
                    btnElement.classList.remove('bg-sage-dark', 'text-white');
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar:', err);
            });
        }
    </script>
</body>
</html>
