import Image from "next/image";

interface BrandIconProps {
    className?: string;
}

/** Drop-in replacement for GraduationCap — renders the brand image. */
export default function BrandIcon({ className }: BrandIconProps) {
    // Parse size from className (e.g. "w-6 h-6") to set width/height
    const sizeMatch = className?.match(/w-(\d+)/);
    const size = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 24;
    return (
        <span className={`inline-flex items-center justify-center ${className ?? ""}`} style={{ width: size, height: size }}>
            <Image
                src="/icon.png"
                alt="رفيق"
                width={size}
                height={size}
                className="w-full h-full object-cover rounded-sm"
            />
        </span>
    );
}
