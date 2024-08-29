import {
  AriaToastProps,
  AriaToastRegionProps,
  useToast as _useToast,
  useToastRegion,
} from "@react-aria/toast";
import { ToastState, useToastState } from "@react-stately/toast";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { IconButton } from "./button";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";

type ToastContextData = { toast: (text: ReactNode) => void };
const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("ToastProviderが存在しません");
  }

  return ctx;
};

export const ToastProvider: React.FC<PropsWithChildren> = ({
  children,
  ...props
}) => {
  const state = useToastState<ReactNode>({ maxVisibleToasts: 5 });

  const addToast = useCallback(
    (text: ReactNode) => {
      state.add(text, { timeout: 5000 });
    },
    [state]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {state.visibleToasts.length > 0 && (
        <ToastRegion {...props} state={state} />
      )}
    </ToastContext.Provider>
  );
};

type ToastRegionProps<T> = AriaToastRegionProps & {
  state: ToastState<T>;
};

const ToastRegion = <T extends ReactNode>({
  state,
  ...props
}: ToastRegionProps<T>) => {
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);

  return (
    <div
      {...regionProps}
      ref={ref}
      className={clsx("right-4 bottom-4 flex flex-col gap-2 absolute")}
    >
      <AnimatePresence>
        {state.visibleToasts.map((toast) => {
          return (
            <motion.div
              key={toast.key}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              <Toast toast={toast} state={state} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

type TostProps<T> = AriaToastProps<T> & { state: ToastState<T> };

const Toast = <T extends ReactNode>({ state, ...props }: TostProps<T>) => {
  const ref = useRef(null);
  const { toastProps, contentProps, titleProps, closeButtonProps } = _useToast(
    props,
    state,
    ref
  );

  return (
    <div
      {...toastProps}
      ref={ref}
      className="bg-neutral-50 rounded-lg border border-neutral-300 w-[250px] grid grid-cols-[1fr_auto] p-2 shadow-lg"
    >
      <div {...contentProps}>
        <div {...titleProps} className="text-xs">
          {props.toast.content}
        </div>
      </div>
      <IconButton
        {...closeButtonProps}
        icon={IconX}
        variant="subtle"
        size="sm"
      />
    </div>
  );
};
