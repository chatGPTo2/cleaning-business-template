/**
 * TASPRO full swoosh logo — precise SVG recreation from the clean vector art.
 *
 * variant="dark"  → navy text + navy top ribbon  (use on white/light backgrounds)
 * variant="light" → white text + white top ribbon (use on dark/navy backgrounds)
 *
 * The bottom swoosh ribbon is always brand-blue (#1B6DB3).
 * The sparkle stars are always brand-blue.
 */

interface LogoFullProps {
  className?: string;
  width?: number;
  variant?: "dark" | "light";
}

export default function LogoFull({
  className = "",
  width = 260,
  variant = "light",
}: LogoFullProps) {
  const height = Math.round(width * (310 / 640));

  const textColor   = variant === "light" ? "#ffffff" : "#0B1F3A";
  const ribbonColor = variant === "light" ? "#ffffff" : "#0B1F3A";
  const blueColor   = "#1B6DB3";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 640 310"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TASPRO Cleaning Solutions"
      role="img"
      className={className}
    >
      {/* ── TASPRO wordmark ── */}
      <text
        x="16"
        y="148"
        fontFamily="'Arial Black', 'Franklin Gothic Heavy', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="118"
        letterSpacing="2"
        fill={textColor}
      >
        TASPRO
      </text>

      {/* ── Sparkle star 1 — large, beside the "O" ── */}
      {/*
        4-pointed sparkle: cubic bezier diamond crossing at 90°.
        p = 0.25 gives very sharp/pointy tips.
      */}
      <g transform="translate(553,52)">
        <path
          d="M0,-34 C0,-8.5 -8.5,0 -34,0 C-8.5,0 0,8.5 0,34 C0,8.5 8.5,0 34,0 C8.5,0 0,-8.5 0,-34 Z"
          fill={blueColor}
        />
      </g>

      {/* ── Sparkle star 2 — smaller, below-right of star 1 ── */}
      <g transform="translate(610,110)">
        <path
          d="M0,-21 C0,-5.25 -5.25,0 -21,0 C-5.25,0 0,5.25 0,21 C0,5.25 5.25,0 21,0 C5.25,0 0,-5.25 0,-21 Z"
          fill={blueColor}
        />
      </g>

      {/*
        ── TOP SWOOSH RIBBON (navy / white) ──
        A filled lens/ribbon shape with pointed ends at both left and right.
        Starts under the "A", dips down, sweeps up-right.
        Outer (top) edge is the higher bezier; inner (bottom) edge is slightly lower,
        giving the ribbon its thickness (~18px at widest centre point).
      */}
      <path
        d={
          // left tip → outer top edge → right tip
          "M 126,164" +
          " C 222,204 400,192 622,146" +
          // right tip → inner bottom edge → back to left tip
          " C 400,210 222,228 128,182" +
          " Z"
        }
        fill={ribbonColor}
      />

      {/*
        ── BOTTOM SWOOSH RIBBON (brand blue) ──
        Thicker than the top ribbon. The white gap between the two ribbons
        is simply negative space — no need to draw it.
        Outer (top) edge starts just below the bottom of the top ribbon;
        inner (bottom) edge creates the ribbon's full depth (~50px at centre).
      */}
      <path
        d={
          // left tip → outer top edge → right tip
          "M 118,196" +
          " C 212,262 398,248 622,180" +
          // right tip → inner bottom edge → back to left tip
          " C 398,284 212,302 120,240" +
          " Z"
        }
        fill={blueColor}
      />
    </svg>
  );
}
