"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        .tt-root {
          position: relative;
          width: 64px;
          height: 32px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          flex-shrink: 0;
          transition: background 0.6s ease;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.15);
        }
        .tt-root.light {
          background: linear-gradient(135deg, #4fc3f7 0%, #81d4fa 50%, #b3e5fc 100%);
        }
        .tt-root.dark {
          background: linear-gradient(135deg, #0d1b2a 0%, #1a2744 50%, #0f2137 100%);
        }

        /* Stars */
        .tt-stars {
          position: absolute;
          inset: 0;
          transition: opacity 0.4s ease;
        }
        .tt-root.light .tt-stars { opacity: 0; }
        .tt-root.dark  .tt-stars { opacity: 1; }
        .tt-star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: tt-twinkle 2s infinite ease-in-out;
        }
        .tt-star:nth-child(1) { width:2px;height:2px;top:6px;left:14px;animation-delay:0s; }
        .tt-star:nth-child(2) { width:3px;height:3px;top:10px;left:22px;animation-delay:0.4s; }
        .tt-star:nth-child(3) { width:2px;height:2px;top:5px;left:32px;animation-delay:0.8s; }
        .tt-star:nth-child(4) { width:2px;height:2px;top:14px;left:40px;animation-delay:1.2s; }
        .tt-star:nth-child(5) { width:3px;height:3px;top:8px;left:50px;animation-delay:0.3s; }
        @keyframes tt-twinkle {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.3; transform:scale(0.5); }
        }

        /* Clouds */
        .tt-clouds {
          position: absolute;
          inset: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .tt-root.light .tt-clouds { opacity: 1; }
        .tt-root.dark  .tt-clouds { opacity: 0; }
        .tt-cloud {
          position: absolute;
          background: rgba(255,255,255,0.7);
          border-radius: 100px;
        }
        .tt-cloud::before, .tt-cloud::after {
          content: "";
          position: absolute;
          background: inherit;
          border-radius: 50%;
        }
        .tt-cloud-1 {
          width: 18px; height: 6px;
          bottom: 9px; left: 6px;
        }
        .tt-cloud-1::before {
          width: 8px; height: 8px;
          top: -4px; left: 3px;
        }
        .tt-cloud-1::after {
          width: 6px; height: 6px;
          top: -3px; left: 9px;
        }
        .tt-cloud-2 {
          width: 14px; height: 5px;
          bottom: 7px; left: 30px;
          opacity: 0.5;
        }
        .tt-cloud-2::before {
          width: 6px; height: 6px;
          top: -3px; left: 2px;
        }

        /* Thumb */
        .tt-thumb {
          position: absolute;
          top: 3px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          transition: transform 0.5s cubic-bezier(.4,-0.2,.2,1.4),
                      box-shadow 0.4s ease,
                      background 0.5s ease;
          z-index: 10;
        }
        .tt-root.light .tt-thumb {
          transform: translateX(3px);
          background: radial-gradient(circle at 35% 35%, #ffe566, #ffa500);
          box-shadow: 0 0 8px 2px rgba(255,200,0,0.6),
                      0 2px 4px rgba(0,0,0,0.2);
        }
        .tt-root.dark .tt-thumb {
          transform: translateX(35px);
          background: radial-gradient(circle at 35% 35%, #f0f0f0, #c8d0e0);
          box-shadow: 0 0 10px 3px rgba(180,200,255,0.4),
                      0 2px 4px rgba(0,0,0,0.4);
        }

        /* Sun rays */
        .tt-rays {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .tt-root.light .tt-rays { opacity: 1; }
        .tt-root.dark  .tt-rays { opacity: 0; }
        .tt-ray {
          position: absolute;
          top: 50%; left: 50%;
          width: 3px; height: 5px;
          background: rgba(255,200,0,0.7);
          border-radius: 2px;
          transform-origin: 50% 200%;
        }

        /* Moon crater */
        .tt-crater {
          position: absolute;
          background: rgba(150,165,190,0.5);
          border-radius: 50%;
          transition: opacity 0.4s ease;
        }
        .tt-root.light .tt-crater { opacity: 0; }
        .tt-root.dark  .tt-crater { opacity: 1; }
        .tt-crater-1 { width:5px;height:5px;top:5px;left:8px; }
        .tt-crater-2 { width:4px;height:4px;top:12px;left:14px; }
        .tt-crater-3 { width:3px;height:3px;top:8px;left:16px; }
      `}</style>

      <button
        onClick={toggle}
        aria-label={isDark ? "Светлая тема" : "Тёмная тема"}
        className={`tt-root ${isDark ? "dark" : "light"}`}
      >
        {/* Stars (dark mode) */}
        <span className="tt-stars">
          <span className="tt-star" />
          <span className="tt-star" />
          <span className="tt-star" />
          <span className="tt-star" />
          <span className="tt-star" />
        </span>

        {/* Clouds (light mode) */}
        <span className="tt-clouds">
          <span className="tt-cloud tt-cloud-1" />
          <span className="tt-cloud tt-cloud-2" />
        </span>

        {/* Thumb: sun or moon */}
        <span className="tt-thumb">
          {/* Sun rays */}
          <span className="tt-rays">
            {[0,45,90,135,180,225,270,315].map((deg) => (
              <span
                key={deg}
                className="tt-ray"
                style={{ transform: `rotate(${deg}deg) translateX(-50%)` }}
              />
            ))}
          </span>
          {/* Moon craters */}
          <span className="tt-crater tt-crater-1" />
          <span className="tt-crater tt-crater-2" />
          <span className="tt-crater tt-crater-3" />
        </span>
      </button>
    </>
  );
}
