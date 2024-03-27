import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

import AuthProvider, { useAuth } from "@/providers/AuthProvider";

const RouteProtectionLayout = () => {
  // In a useEfffect:
  // Compare:
  //  1) if user is login(with token) or not
  //  2) if user is in protected route or not
  //  login user should be in protected routers; unlogin user should be in public routes.
  //    -> redirect users if they are in the wrong route.
  //  * if initalized is false, meaning the whole app hadn't been mouted alredy, we do nothing
  //     because we don't want to redirect before mounted. Lead to error.
  const { token, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (!initialized) return;
    const isInAuthRoute = segments[0] === "(auth)";
    if (isInAuthRoute && !token) {
      router.replace(`/(public)/login`);
    } else if (!isInAuthRoute && token) {
      router.replace(`/(auth)/todo`);
    }
  }, [segments, initialized, token]);
  return <Slot />;
};

// * create queryclient outside the component.
const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouteProtectionLayout />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default RootLayout;
