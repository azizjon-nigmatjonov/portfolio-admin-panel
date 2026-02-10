import * as TabsPrimitive from "@radix-ui/react-tabs";

const Root = TabsPrimitive.Root;
const List = TabsPrimitive.List;
const Trigger = TabsPrimitive.Trigger;
const Content = TabsPrimitive.Content;

const tabsListStyles: React.CSSProperties = {
  display: "flex",
  gap: 4,
  borderBottom: "1px solid var(--ui-border)",
  marginBottom: 16,
};

const tabsTriggerStyles: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--ui-text-muted)",
  background: "none",
  border: "none",
  borderBottom: "2px solid transparent",
  marginBottom: -1,
  cursor: "pointer",
};

const tabsContentStyles: React.CSSProperties = {
  color: "var(--ui-text)",
  outline: "none",
};

function TabsList({ className = "", style, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <List className={`ui-tabs-list ${className}`.trim()} style={{ ...tabsListStyles, ...style }} {...props} />;
}

function TabsTrigger({ className = "", style, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <Trigger
      className={`ui-tabs-trigger ${className}`.trim()}
      style={tabsTriggerStyles}
      {...props}
    />
  );
}

function TabsContent({ className = "", style, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <Content className={`ui-tabs-content ${className}`.trim()} style={{ ...tabsContentStyles, ...style }} {...props} />;
}

export const Tabs = {
  Root,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};

export default Tabs;
