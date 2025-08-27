export function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
          <span className="font-semibold">Logoipsum</span>
        </div>
        <p className="text-blue-100">
          © 2025 Blog genzel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
