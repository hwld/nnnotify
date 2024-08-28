import { PropsWithChildren } from "react";
import { TooltipTrigger } from "react-aria-components";
import { Tooltip as RaTooltip } from "react-aria-components";

type Props = { label: string } & PropsWithChildren;

export const Tooltip: React.FC<Props> = ({ label, children }) => {
  return (
    <TooltipTrigger delay={1000}>
      {children}
      <RaTooltip
        offset={4}
        className="bg-neutral-700 rounded py-1 px-[6px] text-neutral-100 text-xs"
      >
        {label}
      </RaTooltip>
    </TooltipTrigger>
  );
};
