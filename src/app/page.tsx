import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-6xl font-bold text-amber-900">
          Uggly
        </h1>
        <p className="text-2xl text-amber-700">
          En smart uggla som pratar med ditt barn
        </p>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Uggly ar en AI-driven rostassistent for barn 4-10 ar.
          Den svarar pa fragor, berattar sagor och hjalper med laxan
          — allt pa svenska med en vanlig uggleros.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-amber-600 text-white rounded-full text-lg font-semibold hover:bg-amber-700 transition"
          >
            Kom igang
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border-2 border-amber-600 text-amber-700 rounded-full text-lg font-semibold hover:bg-amber-100 transition"
          >
            Logga in
          </Link>
        </div>
      </div>
    </main>
  );
}
