import {
  type MetaFunction,
} from "@remix-run/node";
import { DEFAULT_SYMBOL } from "@/utils/storage";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Orderly SDK template" },
    { name: "description", content: "Orderly SDK template" },
  ];
};

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/perp/${DEFAULT_SYMBOL}`);
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-20 w-20 animate-spin rounded-full border-8 border-neutral-200 border-t-blue-500" />
    </div>
  );
}

