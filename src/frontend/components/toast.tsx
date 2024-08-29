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
  useEffect,
  useRef,
} from "react";
import { IconButton } from "./button";
import clsx from "clsx";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
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
  const state = useToastState<ReactNode>({
    maxVisibleToasts: 5,
    hasExitAnimation: true,
  });

  const addToast = useCallback(
    (text: ReactNode) => {
      state.add(text, { timeout: 5000 });
    },
    [state]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <AnimatePresence>
        {state.visibleToasts.length > 0 && (
          <ToastRegion {...props} state={state} />
        )}
      </AnimatePresence>
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
      {state.visibleToasts.map((toast) => {
        return <Toast key={toast.key} toast={toast} state={state} />;
      })}
    </div>
  );
};

type TostProps<T> = AriaToastProps<T> & { state: ToastState<T> };

const Toast = <T extends ReactNode>({ state, ...props }: TostProps<T>) => {
  const [scope, animate] = useAnimate();
  const { toastProps, contentProps, titleProps, closeButtonProps } = _useToast(
    props,
    state,
    scope
  );

  useEffect(() => {
    const exit = async () => {
      await animate(scope.current, { opacity: 0, y: 5 }, { duration: 0.1 });
      state.remove(props.toast.key);
    };

    if (props.toast.animation === "exiting") {
      exit();
    }
  }, [animate, props.toast.animation, props.toast.key, scope, state]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        {...toastProps}
        ref={scope}
        className="bg-neutral-50 rounded-lg border border-neutral-300 w-[250px] grid grid-cols-[1fr_auto] p-2 outline-none focus:ring-1 shadow-lg ring-teal-500 items-center"
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
    </motion.div>
  );
};
