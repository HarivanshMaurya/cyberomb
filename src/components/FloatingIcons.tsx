import { LucideIcon } from 'lucide-react';

interface FloatingIconConfig {
  icon: LucideIcon;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  rotate?: number;
}

interface FloatingIconsProps {
  icons: FloatingIconConfig[];
}

/**
 * Floating translucent icons for hero sections.
 * Each page passes its own set of themed icons.
 */
const FloatingIcons = ({ icons }: FloatingIconsProps) => {
  return (
    <>
      {icons.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top: item.top,
              left: item.left,
              animation: `heroIconFloat ${item.duration} ease-in-out ${item.delay} infinite`,
              transform: item.rotate ? `rotate(${item.rotate}deg)` : undefined,
            }}
          >
            <div className="relative">
              {/* Glow behind icon */}
              <div
                className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
                style={{ width: item.size * 2, height: item.size * 2, top: -item.size / 2, left: -item.size / 2 }}
              />
              <Icon
                size={item.size}
                className="text-primary/[0.12] dark:text-primary/[0.18] drop-shadow-sm"
                strokeWidth={1.5}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FloatingIcons;
