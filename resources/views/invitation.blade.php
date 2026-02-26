<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Boda</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Rambla:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <style>
        .font-serif {
            font-family: 'Playfair Display', serif !important;
        }

        .font-sans {
            font-family: 'Rambla', sans-serif !important;
        }

        .spinner {
            display: none;
            width: 1.2rem;
            height: 1.2rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }

        .text-primary {
            color: #3A4F31;
        }

        .header-image {
            margin-top: -110px;
            margin-bottom: -110px;
            z-index: -10;
        }

        .shadow-custom {
            /* box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px; */
box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
        }
        
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading .spinner { display: inline-block; }
        .loading .btn-text { display: none; }
    </style>
</head>
<body class=" min-h-screen flex items-center justify-center">
    <div class="min-h-screen flex justify-center">
        <div class="w-full  shadow-xl overflow-hidden">
            {{-- Header decorativo --}}
            <div class="relative py-10 text-center w-full z-10 overflow-hidden">
                <div class="absolute top-0 left-0 w-40 opacity-90 pointer-events-none">
                    <img src="{{ asset('img/top-left.webp') }}" alt="" class="object-cover">
                </div>
                
                <div class="absolute top-0 right-0 w-40 opacity-90 pointer-events-none">
                    <img src="{{ asset('img/top-right.webp') }}" alt="" class="object-cover">
                </div>
                            
                <div class="text-3xl font-serif tracking-widest text-gray-700 relative z-10">
                    <img src="{{ asset('img/logo.webp') }}" alt="logo" class="w-24 h-24 mx-auto">
                </div>

                <p class="mt-5 px-12 text-sm text-primary font-serif relative z-10">
                    <span class="italic font-medium">
                        “Ponme como un sello sobre tu corazón, como una marca sobre tu brazo; Porque fuerte es como la muerte el amor;” 
                    </span>
                    <span class="font-bold">
                        - Cantares 1:1
                    </span> 
                </p>
            </div>

            {{-- Imagen principal --}}
            <div class="header-image relative w-full h-[600px]">
                <!-- Imagen base -->
                <img 
                    src="{{ asset('img/cover.webp') }}"
                    class="w-full h-full object-cover"
                />
                <!-- Degradado arriba -->
                <div class="absolute top-0 left-0 w-full h-1/3 
                            bg-gradient-to-b from-white via-white/70 to-transparent">
                </div>
                <!-- Degradado abajo -->
                <div class="absolute bottom-0 left-0 w-full h-1/3 
                            bg-gradient-to-t from-white via-white/70 to-transparent">
                </div>
            </div>

            {{-- Nombres --}}
            <div class="text-center py-8 px-6">
                <h1 class="text-4xl font-serif text-primary">
                    Perla & Daniel
                </h1>

                <p class="mt-4 text-sm font-serif text-primary leading-relaxed">
                    Con el amor que nos une, la bendición de Dios y el apoyo de nuestros padres,
                    te invitamos a celebrar el día más especial de nuestras vidas.
                </p>

                {{-- Botón música --}}
                <div class="mt-6 flex justify-center">
                    <button class="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center shadow-md hover:bg-green-800 transition">
                        ▶
                    </button>
                </div>
            </div>

            {{-- Fecha --}}
            <div class="text-center py-6 border-t border-gray-200">
                <p class="text-xs uppercase tracking-widest text-gray-500">
                    Abril
                </p>

                <div class="flex justify-center items-end gap-2 mt-2">
                    <span class="text-sm text-gray-600">Sábado</span>
                    <span class="text-4xl font-serif text-gray-800">18</span>
                    <span class="text-sm text-gray-600">2026</span>
                </div>

                <p class="mt-2 text-sm text-gray-600">
                    2:30 pm
                </p>
            </div>

            {{-- Countdown (estático por ahora) --}}
            <div class="text-center py-6 border-t border-gray-200 z-50">
                <p class="text-xs uppercase tracking-widest text-gray-500">
                    Faltan
                </p>

                <div class="mt-2 text-2xl font-semibold text-gray-800">
                    53:22:04:52
                </div>

                <div class="flex justify-center gap-6 text-xs text-gray-500 mt-2 block z-10">
                    <span>Días</span>
                    <span>Horas</span>
                    <span>Min</span>
                    <span>Seg</span>
                </div>
            </div>

            {{-- Imagen grande intermedia --}}
            <div class="relative -mt-10 -z-50 block">
                <img 
                    src="{{ asset('img/faltan.webp') }}"
                    alt="Foto pareja"
                    class="w-full h-80 object-cover"
                >
            </div>

            {{-- Galería tipo collage --}}
            <div class="p-4 grid grid-cols-2 gap-4 -mt-10">
                <div>
                    <img 
                        src="{{ asset('img/album-1.webp') }}"
                        alt="Foto 1"
                        class="w-full object-cover rounded shadow-custom mb-4"
                    >
        
                    <img 
                        src="{{ asset('img/album-2.webp') }}"
                        alt="Foto 2"
                        class="w-full object-cover rounded shadow-custom mb-4"
                    >

                </div>

                <div class="gap-4">
                    <img 
                        src="{{ asset('img/album-3.webp') }}"
                        alt="Foto 3"
                        class="w-full object-cover rounded shadow-custom mb-4"
                    >
        
                    <img 
                        src="{{ asset('img/album-4.webp') }}"
                        alt="Foto 4"
                        class="w-full object-cover rounded shadow-custom mb-4"
                    >

                </div>
            </div>

            <div class="">
                <h2>CONFÍRMANOS TU ASISTENCIA</h2>
                <p>Estamos muy emocionados por compartir contigo un dia tan especial. Por favor, confirma tu asistencia antes del 31 de marzo.</p>
    
                <button>CONFIRMA AQUI</button>
                <div class="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M142,176a6,6,0,0,1-6,6,14,14,0,0,1-14-14V128a2,2,0,0,0-2-2,6,6,0,0,1,0-12,14,14,0,0,1,14,14v40a2,2,0,0,0,2,2A6,6,0,0,1,142,176ZM124,94a10,10,0,1,0-10-10A10,10,0,0,0,124,94Zm106,34A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"></path></svg>
                    <span>Puedes cambiar tu decisión en cualquier momento antes de la fecha limite</span>
                </div>
            </div>
        </div>

    </div>

    <script>

    </script>
</body>
</html>