import * as AvatarPrimitive from "@radix-ui/react-avatar";

export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  src?: string | null;
  alt?: string;
  fallback?: React.ReactNode;
}

export function Avatar({ src, alt = "", fallback, className = "", style, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={`ui-avatar ${className}`.trim()}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: "var(--ui-bg-subtle)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 500,
        color: "var(--ui-text)",
        ...style,
      }}
      {...props}
    >
      <AvatarPrimitive.Image src={src ?? undefined} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AvatarPrimitive.Fallback style={{ lineHeight: 1 }}>
        {fallback ?? (alt ? alt.slice(0, 2).toUpperCase() : "?")}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export default Avatar;
