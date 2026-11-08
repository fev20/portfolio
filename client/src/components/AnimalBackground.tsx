import type { CSSProperties } from "react";

const animals = {
  cat: { sheet: "a", x: 550, y: 0, width: 500, height: 510 },
  capybara: { sheet: "a", x: 695, y: 535, width: 640, height: 489 },
  squirrel: { sheet: "b", x: 525, y: 15, width: 500, height: 495 },
  hamster: { sheet: "b", x: 60, y: 40, width: 440, height: 480 },
} as const;

interface AnimalBackgroundProps {
  animal: keyof typeof animals;
  placement: "hero" | "skills" | "experience" | "contact";
}

export default function AnimalBackground({
  animal,
  placement,
}: AnimalBackgroundProps) {
  const sprite = animals[animal];
  const style = {
    "--animal-aspect": `${sprite.width} / ${sprite.height}`,
    "--animal-sheet-width": 1536 / sprite.width,
    "--animal-offset-x": -sprite.x / sprite.width,
    "--animal-offset-y": -sprite.y / sprite.width,
  } as CSSProperties;

  return (
    <div
      className={`animal-background animal-background--${placement}`}
      style={style}
      aria-hidden="true"
      data-animal-background={animal}
    >
      <img
        src={`${import.meta.env.BASE_URL}images/stickers/animal-sheet-${sprite.sheet}.png`}
        alt=""
        width={1536}
        height={1024}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
