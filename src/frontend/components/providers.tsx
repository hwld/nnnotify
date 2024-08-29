"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import { RouterProvider } from "react-aria-components";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        mutations: {
          onSuccess: () => {
            client.invalidateQueries();
          },
        },
      },
    })
  );

  return (
    <RouterProvider navigate={router.push}>
      <QueryClientProvider client={client}>
        <MotionConfig transition={{ duration: 0.1 }}>{children}</MotionConfig>
      </QueryClientProvider>
    </RouterProvider>
  );
};
