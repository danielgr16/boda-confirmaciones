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
<body class="bg-slate-700 min-h-screen flex items-center justify-center p-4 text-gray-800">
    <div class="max-w-6xl mx-auto mt-10 px-4">
        <div class="overflow-x-auto overflow-y-auto max-h-[70vh] bg-white shadow-lg rounded-xl">

            <table class="min-w-full text-sm text-left text-gray-700">

                <thead class="bg-gray-100 text-xs uppercase tracking-wider text-gray-600 sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3">Nº</th>
                        <th class="px-4 py-3">UUID</th>
                        <th class="px-4 py-3">Invitado</th>
                        <th class="px-4 py-3">Compañía de</th>
                        <th class="px-4 py-3">Grupo</th>
                        <th class="px-4 py-3">
                            <div class="flex flex-col gap-1">
                                <select id="filterAssist"
                                    class="text-xs border border-gray-300 rounded px-2 py-1">
                                    <option value="">Todos</option>
                                    <option value="true">Confirmados</option>
                                    <option value="false">No asistirán</option>
                                    <option value="null">Pendientes</option>
                                </select>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200">

                    @foreach($rows as $row)

                    <tr
                        class="hover:bg-gray-50 transition"
                        data-name="{{ strtolower($row['invitado']) }}"
                        data-group="{{ strtolower($row['group']) }}"
                        data-assist="{{ $row['asistencia'] === true ? 'true' : ($row['asistencia'] === false ? 'false' : '') }}"
                    >

                        <td class="px-4 py-3 font-medium text-gray-500">
                            {{ $row['row'] }}
                        </td>

                        <td class="px-4 py-3 font-mono text-xs text-gray-600">
                            {{ $row['uuid'] }}
                        </td>

                        <td class="px-4 py-3 font-semibold text-gray-800">
                            {{ $row['invitado'] }}
                        </td>

                        <td class="px-4 py-3 text-gray-600">
                            {{ $row['companias'] }}
                        </td>

                        <td class="px-4 py-3">
                            <span class="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                                {{ $row['group'] }}
                            </span>
                        </td>

                        <td class="px-4 py-3">
                            @if($row['asistencia'] === true)
                                <span class="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                                    Confirmado
                                </span>
                            @elseif($row['asistencia'] === false)
                                <span class="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                                    No asistirá
                                </span>
                            @else
                                <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                                    Sin responder
                                </span>
                            @endif
                        </td>

                    </tr>

                    @endforeach

                </tbody>
            </table>

        </div>
    </div>
    <div class="max-w-6xl mx-auto px-4 mb-6">
    
    @php
    $confirmados = collect($rows)->where('asistencia', true)->count();
    $rechazados = collect($rows)->where('asistencia', false)->count();
    $pendientes = collect($rows)->whereNull('asistencia')->count();
    @endphp
    <div class="bg-white shadow-lg rounded-xl p-6 align-sub">

        <h2 class="text-lg font-semibold mb-4 text-gray-800">
            Resumen de Confirmaciones
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p class="text-sm text-green-700">Confirmados</p>
                <p class="text-3xl font-bold text-green-800">
                    {{ $confirmados }}
                </p>
            </div>

            <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p class="text-sm text-red-700">No asistirán</p>
                <p class="text-3xl font-bold text-red-800">
                    {{ $rechazados }}
                </p>
            </div>

            <div class="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                <p class="text-sm text-gray-600">Pendientes</p>
                <p class="text-3xl font-bold text-gray-800">
                    {{ $pendientes }}
                </p>
            </div>

        </div>

    </div>

</div>
</body>

<script>
        const filterAssist = document.getElementById("filterAssist");
        const rows = document.querySelectorAll("tbody tr");

        filterAssist.addEventListener("change", () => {
            const value = filterAssist.value;

            rows.forEach(row => {

                const assist = row.dataset.assist;

                let show = true;

                if (value === "true") {
                    show = assist === "true";
                } 
                else if (value === "false") {
                    show = assist === "false";
                } 
                else if (value === "null") {
                    show = assist === "";
                }

                row.style.display = show ? "" : "none";

            });
        });
</script>
</html>