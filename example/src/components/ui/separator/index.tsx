import * as SeparatorPrimitive from "@radix-ui/react-separator";

export interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {}

export function Separator({ orientation = "horizontal", decorative = true, ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      decorative={decorative}
      style={{
        flexShrink: 0,
        backgroundColor: "var(--ui-border)",
        ...(orientation === "horizontal" ? { height: 1, width: "100%" } : { width: 1, height: "100%" }),
      }}
      {...props}
    />
  );
}

export default Separator;
