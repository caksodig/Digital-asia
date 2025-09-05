import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image width={140} height={24} alt="Logo" src="/Logo.png" />
        </div>
        <p className="text-blue-100">
          © 2025 Blog genzel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
