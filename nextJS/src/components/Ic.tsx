import { ICONS } from "@/data/icons";

/** Renders an inline SVG icon by name. Wrapper uses display:contents so existing
 *  descendant CSS selectors (e.g. `.btn svg`) keep working unchanged. */
export default function Ic({ name, className }: { name: keyof typeof ICONS | string; className?: string }) {
  const svg = ICONS[name as string];
  if (!svg) return null;
  return (
    <span
      className={className}
      style={{ display: "contents" }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
