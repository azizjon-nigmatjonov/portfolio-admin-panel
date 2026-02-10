import * as DialogPrimitive from "@radix-ui/react-dialog";

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Portal = DialogPrimitive.Portal;
const Close = DialogPrimitive.Close;

function Overlay({
  className = "",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={`ui-dialog-overlay ${className}`.trim()}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--ui-overlay)",
        zIndex: 9998,
      }}
      {...props}
    />
  );
}

function Content({
  className = "",
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <Portal>
      <Overlay />
      <DialogPrimitive.Content
        className={`ui-dialog-content ${className}`.trim()}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--ui-bg)",
          border: "1px solid var(--ui-border)",
          borderRadius: "var(--ui-radius)",
          padding: 24,
          minWidth: 320,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          zIndex: 9999,
        }}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </Portal>
  );
}

function Title(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className="ui-dialog-title"
      style={{ margin: 0, marginBottom: 8, fontSize: 18, fontWeight: 600, color: "var(--ui-text)" }}
      {...props}
    />
  );
}

function Description(props: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className="ui-dialog-description"
      style={{ marginBottom: 16, fontSize: 14, color: "var(--ui-text-muted)" }}
      {...props}
    />
  );
}

export const Dialog = {
  Root,
  Trigger,
  Close,
  Content,
  Title,
  Description,
};

export default Dialog;
