import Image from "next/image";

interface RarityCrownProps {
  rank: number;
  className?: string;
}

const CROWN_MAP: Record<number, { src: string; alt: string }> = {
  1: { src: "/Golden_Crown.png", alt: "Gold crown for 1st place" },
  2: { src: "/Silver_Crown.png", alt: "Silver crown for 2nd place" },
  3: { src: "/Bronze_Crown.png", alt: "Bronze crown for 3rd place" },
};

export function RarityCrown({ rank, className = "" }: RarityCrownProps) {
  const crown = CROWN_MAP[rank];
  if (!crown) return null;

  return (
    <div
      className={`absolute z-10 top-[-50px] left-[-6px] sm:top-[-60px] sm:left-[-7px] lg:top-[-40px] lg:left-[-35px] ${className}`}
      style={{
        filter: "drop-shadow(0 5px 8px rgba(0,0,0,.28))",
      }}
    >
      <div className="animate-crown-float">
        <div className="transition-transform duration-250 ease-out group-hover:scale-104">
          <div
            style={{
              transformOrigin: "bottom left",
              transform:
                "rotate(-23deg) perspective(900px) rotateY(-5deg) rotateX(2deg)",
            }}
          >
            <Image
              src={crown.src}
              alt={crown.alt}
              width={110}
              height={110}
              className="w-[80px] sm:w-[95px] lg:w-[110px] h-auto pointer-events-none select-none"
              draggable={false}
              priority={rank === 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
