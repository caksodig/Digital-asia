import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#2563EBDB] text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center md:gap-4 gap-1.5 md:flex-row">
          <Image width={140} height={24} alt="Logo" src="/Logo.png" />
          <p className="text-sm">© 2025 Blog genzel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
