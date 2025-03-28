import { type MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { DEFAULT_SYMBOL } from "@/utils/storage";

export const meta: MetaFunction = () => {
  return [
    { title: import.meta.env.VITE_APP_NAME },
    { name: "description", content: import.meta.env.VITE_APP_DESCRIPTION },
  ];
};

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/perp/${DEFAULT_SYMBOL}`);
  }, [navigate]);

  return null;
}
