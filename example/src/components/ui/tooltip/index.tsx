import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const Root = TooltipPrimitive.Root;
const Trigger = TooltipPrimitive.Trigger;
const Portal = TooltipPrimitive.Portal;

function Content({
  className = "",
  children,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <Portal>
      <TooltipPrimitive.Content
        className={`ui-tooltip-content ${className}`.trim()}
        sideOffset={sideOffset}
        style={{
          padding: "6px 10px",
          fontSize: 12,
          color: "var(--ui-bg)",
          backgroundColor: "var(--ui-text)",
          borderRadius: "var(--ui-radius)",
          maxWidth: 280,
          zIndex: 1000,
        }}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </Portal>
  );
}

export const Tooltip = {
  Root,
  Trigger,
  Content,
  Provider: TooltipPrimitive.Provider,
};

export default Tooltip;
