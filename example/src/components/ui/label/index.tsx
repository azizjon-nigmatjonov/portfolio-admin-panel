import * as LabelPrimitive from "@radix-ui/react-label";

export interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {}

export function Label({ className = "", style, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={`ui-label ${className}`.trim()}
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: "var(--ui-text)",
        ...style,
      }}
      {...props}
    />
  );
}

export default Label;
