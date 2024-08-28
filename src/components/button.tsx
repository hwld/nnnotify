import { Icon } from "@tabler/icons-react";
import {
  Link,
  LinkProps,
  Button as RaButton,
  ButtonProps as RaButtonProps,
} from "react-aria-components";

type ButtonProps = Omit<RaButtonProps, "className">;

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <RaButton
      {...props}
      className="text-sm h-8 bg-teal-500 rounded px-3 text-neutral-100 data-[focus-visible]:ring-2 ring-offset-1 ring-teal-500 outline-none text-nowrap data-[hovered]:bg-teal-600 data-[pressed]:bg-teal-700 transition-colors min-w-[70px]"
    />
  );
};

const iconButtonClass =
  "size-7 data-[focus-visible]:ring-2 ring-offset-1 ring-teal-500 outline-none rounded grid place-items-center border border-teal-500 text-teal-500 data-[hovered]:bg-teal-500/10 transition-colors";
const iconButtonIconClass = "size-5";

export const IconButton: React.FC<ButtonProps & { icon: Icon }> = ({
  icon: Icon,
  ...props
}) => {
  return (
    <RaButton {...props} className={iconButtonClass}>
      <Icon className={iconButtonIconClass} />
    </RaButton>
  );
};

export const IconButtonLink: React.FC<LinkProps & { icon: Icon }> = ({
  icon: Icon,
  ...props
}) => {
  return (
    <Link {...props} className={iconButtonClass}>
      <Icon className={iconButtonIconClass} />
    </Link>
  );
};
