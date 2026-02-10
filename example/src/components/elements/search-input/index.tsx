import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  containerClassName?: string;
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="search" className={cn("pl-9", className)} {...props} />
    </div>
  );
}
