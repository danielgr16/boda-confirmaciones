import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
        <h1 className="font-serif text-3xl text-[#2C3E2D] italic mb-3">
          Invitaciones de Boda
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Por favor accede utilizando el enlace personalizado que recibiste para ver tu invitación.
        </p>

        <div className="space-y-3">
          <Link
            href="/silva-arce/novios-gz"
            className="block w-full py-3 px-6 rounded-full bg-[#3F5241] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#6E836F] transition"
          >
            Ver Invitación (Daniela & Erik)
          </Link>
          <Link
            href="/garcia-zentella/novios-gz"
            className="block w-full py-3 px-6 rounded-full bg-[#3A4F31] text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition"
          >
            Ver Invitación (Perla & Daniel)
          </Link>
        </div>
      </div>
    </main>
  );
}
