<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Boda</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="{{ asset('css/master.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
    </style>
</head>
<body class="confirm-container bg-slate-50 min-h-screen flex items-center justify-center p-4">

    <div class="main-card max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        
        <div class="text-center text-sans font-bold text-2xl text-gray-400 mt-2">
            NO SE ENCONTRÓ LA INVITACIÓN :(
        </div>
        
        <div class="opacity-50 text-center px-16 py-5">
            <img src="{{ asset('img/heart_break_grey.webp') }}" alt="">
        </div>

        <p class="text-center">Comunícate con nosotros para resolver el problema.</p>

        <div class="text-center mt-10 text-gray-700 mb-3 text-sm">
            <!-- <p>
                Cualquier duda, comentario o sugerencia, no dudes en comunicarte con nosotros.
            </p> -->
            <span class="block text-sm uppercase tracking-widest text-gray-400 my-5 font-semibold">CONTACTOS</span>
            <div class="">
                <span class="font-bold text-gray-400">Novia</span>
                <span>664 765 6976</span>
            </div>
            <div class="">
                <span class="font-bold text-gray-400">Novio</span>
                <span>664 308 1523</span>
            </div>
        </div>
    </div>

    <script>
       
    </script>
</body>
</html>