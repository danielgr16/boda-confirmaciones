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
    <link rel="stylesheet" href="{{ asset('css/master.css') }}">
    <style>
        
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

            <div class="text-center">
                <span class="block font-serif font-bold text-secondary text-xl mt-6">CONFÍRMANOS TU ASISTENCIA</span>
                <p class="mt-6 mb-10 font-serif text-sm px-8 text-primary">
                    Estamos muy emocionados por compartir contigo un dia tan especial. 
                    Por favor, confirma tu asistencia <span class="font-bold">antes del 31 de marzo</span>.
                </p>
    
                <a class="btn btn-primary" href="{{ route('invitado.confirm') }}">CONFIRMA AQUÍ</a>
                <div class="text-primary w-100 flex  mt-7 mx-7">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A4F31" viewBox="0 0 256 256"><path d="M142,176a6,6,0,0,1-6,6,14,14,0,0,1-14-14V128a2,2,0,0,0-2-2,6,6,0,0,1,0-12,14,14,0,0,1,14,14v40a2,2,0,0,0,2,2A6,6,0,0,1,142,176ZM124,94a10,10,0,1,0-10-10A10,10,0,0,0,124,94Zm106,34A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"></path></svg>
                    <span class="font-sans text-sm text-left ml-3">Puedes cambiar tu decisión en cualquier momento antes de la fecha limite</span>
                </div>
            </div>

            <div class="block info mt-7">
                <span class="block font-serif font-bold text-secondary text-xl text-center mt-20 mb-10">INFORMACIÓN IMPORTANTE</span>

                <div class="lugar text-center mx-7 flex flex-col items-center">
                    <div class="flex justify-center items-center opacity-50 p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M227.09,146.86,190,124.6V104a6,6,0,0,0-3-5.21L134,68.52V46h18a6,6,0,0,0,0-12H134V16a6,6,0,0,0-12,0V34H104a6,6,0,0,0,0,12h18V68.52L69,98.79A6,6,0,0,0,66,104v20.6L28.91,146.86A6,6,0,0,0,26,152v64a6,6,0,0,0,6,6h80a6,6,0,0,0,6-6V168a10,10,0,0,1,20,0v48a6,6,0,0,0,6,6h80a6,6,0,0,0,6-6V152A6,6,0,0,0,227.09,146.86ZM38,155.4l28-16.8V210H38Zm90-9.4a22,22,0,0,0-22,22v42H78V107.48l50-28.57,50,28.57V210H150V168A22,22,0,0,0,128,146Zm90,64H190V138.6l28,16.8Z"></path></svg>
                    </div>
                    <span class="block font-serif text-secondary font-bold mb-5">LUGAR</span>
                    <span class="block text-xl text-center font-serif text-primary mb-2">Salón Jardín Grand Oasis</span>
                    <p class="text-primary text-xs mx-9">
                        Los juzgados, Ignacio López Rayón Supermanzana Por, Independencia, 22710 <br>
                        <span class="font-bold">
                            Playas de Rosarito, B.C.
                        </span> 
                    </p> 
                    <a class="btn btn-secondary block w-fit mt-5" href="https://maps.app.goo.gl/DafNRfBwB2AV1gVV6">VER UBICACIÓN</a>
                </div>

                <div class="vestimenta">
                    <h3>CÓDIGO DE VESTIMENTA</h3>
                    <span>Vestimenta formal</span>
                    <!-- imagen -->
                    <span>Favor de evitar estos colores</span>
                    <div class="colors">
                        <div class="color-1"></div>
                        <div class="color-2"></div>
                        <div class="color-3"></div>
                    </div>
                </div>

                <div class="ninos">
                    <h3>NO NIÑOS</h3>
                    <p>Amamos a los pequeños, pero por razones de seguridad y para que todos puedan relajarse y disfrutar, en esta ocasión el evento será solo para adultos. Agradecemos su comprensión.</p>
                </div>

                <div class="gifts">
                    <h3>REGALOS</h3>
                    <p>Su presencia en nuestra boda será el mejor regalo que podriamos decibir. Si deseas tener algun otro detalle con nosotros, dejamos a tu disposicion algunas opciones.</p>
                    <a class="btn-secondary">Mesa de regalos</a>
                    <div class="border">
                        <span>Depósito en cuenta</span>
                        <div class="">
                            <div class="">
                                Banco: <br>
                                Cuenta: <br>
                                Clabe: <br>
                                Plástico: <br>
                                A nombre de: <br>
                            </div>
                            <div class="">
                                Banco: <br>
                                Cuenta: <br>
                                Clabe: <br>
                                Plástico: <br>
                                A nombre de: <br>
                            </div>
                        </div>
                        <span>Favor de escribir en concepto: <br>Boda Perla y Daniel</span>
                    </div>
                    <div class="border">
                        <span>Tendremos una caja para sobres el día del evento.</span>
                        <!-- icono -->
                    </div>
                    <span>De antemano agradecemos que su intención de apoyarnos en el inicio de nuestra vida como familia.</span>
                </div>

                <div class="contacts">
                    <!-- icono -->
                    <h3>CONTACTOS</h3>
                    <div class="">
                        <span>Novia</span>
                        <span>664 765 6976</span>
                    </div>
                    <div class="">
                        <span>Novio</span>
                        <span>664 308 1523</span>
                    </div>
                    <span>Para comunicarse el dia del evento, favor de usar el siguiente contacto</span>
                    <div class="">
                        <span>Novio</span>
                        <span>664 724 7825</span>
                    </div>
                </div>

                <div class="gallery">
                    <!-- icono -->
                    <h3>UNETE A LA GALERÍA DIGITAL</h3>
                    <p>
                        Queremos que cada momento de nuestra boda sea compartido y recordado, 
                        asi que te invitamos a escanear este codigo o entrar por el enlace, 
                        subir tus fotos y videos y ver los que tomen otros invitados. 
                        Cada recuerdo que capturemos juntos hara que este día sea más memorable.
                    </p>
                    <!-- QR -->
                    <button class="button-secondary">UNIRME AL ALBÚM</button>
                </div>
            </div>    

            <div class="">
                <h2>ESPERAMOS CONTAR CON SU PRESENCIA</h2>
                <p>
                    Por favor, confirma tu asistencia antes de la fecha liminte: 
                    <span class="text-bold">31 de marzo</span>.
                </p>
    
                <button class="button-primary">CONFIRMA AQUI</button>
                <div class="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M142,176a6,6,0,0,1-6,6,14,14,0,0,1-14-14V128a2,2,0,0,0-2-2,6,6,0,0,1,0-12,14,14,0,0,1,14,14v40a2,2,0,0,0,2,2A6,6,0,0,1,142,176ZM124,94a10,10,0,1,0-10-10A10,10,0,0,0,124,94Zm106,34A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"></path></svg>
                    <span>Puedes cambiar tu decisión en cualquier momento antes de la fecha limite</span>
                </div>
            </div>

            <div class="">
                <h2>¡Nos vemos pronto!</h2>
                <p>
                    “Las muchas aguas no podrán apagar el amor, Ni lo ahogarán los ríos” -Cantares 8:7
                </p>
            </div>

        </div>

    </div>

    <script>

    </script>
</body>
</html>