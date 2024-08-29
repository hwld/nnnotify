import { Icon } from "@tabler/icons-react";
import {
  Button as RaButton,
  ButtonProps as RaButtonProps,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";

type ButtonProps = Omit<RaButtonProps, "className">;

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <RaButton
      {...props}
      className="text-sm h-8 bg-teal-500 rounded px-3 text-neutral-100 data-[focus-visible]:ring-2 ring-offset-1 ring-teal-500 outline-none text-nowrap data-[hovered]:bg-teal-600 data-[pressed]:bg-teal-700 transition-colors min-w-[70px]"
    />
  );
};

const iconButton = tv({
  slots: {
    base: "data-[focus-visible]:ring-2 ring-offset-1 ring-teal-500 outline-none rounded grid place-items-center transition-colors",
    icon: "",
  },
  variants: {
    size: {
      md: { base: "size-8", icon: "size-5" },
      sm: { base: "size-6", icon: "size-4" },
    },
    variant: {
      outline: {
        base: "border border-teal-500 text-teal-500 data-[hovered]:bg-teal-500/10",
      },
      subtle: {
        base: "rounded-full data-[hovered]:bg-black/5 data-[hovered]:text-neutral-700 text-neutral-500",
      },
    },
  },
  defaultVariants: { size: "md", variant: "outline" },
});

type ButtonVariants = VariantProps<typeof iconButton>;
type IconButtonProps = ButtonProps & ButtonVariants & { icon: Icon };

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  size,
  variant,
  ...props
}) => {
  const classes = iconButton();

  return (
    <RaButton {...props} className={classes.base({ size, variant })}>
      <Icon className={classes.icon({ size, variant })} />
    </RaButton>
  );
};
