import * as SwitchPrimitive from "@radix-ui/react-switch";

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {}

export function Switch({ ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className="ui-switch"
      style={{
        width: 40,
        height: 22,
        backgroundColor: "var(--ui-border)",
        borderRadius: 11,
        position: "relative",
        cursor: "pointer",
        border: "none",
        padding: 0,
      }}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="ui-switch-thumb"
        style={{
          display: "block",
          width: 18,
          height: 18,
          backgroundColor: "var(--ui-bg)",
          borderRadius: "50%",
          transition: "transform 0.2s",
          transform: "translateX(2px)",
          willChange: "transform",
        }}
      />
    </SwitchPrimitive.Root>
  );
}

export default Switch;
