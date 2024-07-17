import { Outlet } from "react-router-dom";
import { useUser } from "../hooks/use-user";
import { Loader } from "./loader";

export function AuthenticatedRoute() {
  const { user, isLoading, isError, error } = useUser();

  if (isError) {
    return <div>{error?.message}</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (user && user.mobile) {
    return <Outlet />;
  }

  return null;
}
