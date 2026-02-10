import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Portal = DropdownMenuPrimitive.Portal;
const Group = DropdownMenuPrimitive.Group;
const Item = DropdownMenuPrimitive.Item;
const Label = DropdownMenuPrimitive.Label;
const Separator = DropdownMenuPrimitive.Separator;

const contentStyle: React.CSSProperties = {
  minWidth: 160,
  backgroundColor: "var(--ui-bg)",
  border: "1px solid var(--ui-border)",
  borderRadius: "var(--ui-radius)",
  padding: 4,
  boxShadow: "0 4px 12px var(--ui-overlay)",
  zIndex: 1000,
};

const itemStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 14,
  color: "var(--ui-text)",
  cursor: "pointer",
  outline: "none",
  borderRadius: 4,
};

function Content({
  className = "",
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <Portal>
      <DropdownMenuPrimitive.Content
        className={`ui-dropdown-content ${className}`.trim()}
        style={contentStyle}
        sideOffset={4}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </Portal>
  );
}

function DropdownMenuItem({
  className = "",
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <Item
      className={`ui-dropdown-item ${className}`.trim()}
      style={{ ...itemStyle, ...style }}
      {...props}
    />
  );
}

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
  Group,
  Item: DropdownMenuItem,
  Label,
  Separator,
};

export default DropdownMenu;
