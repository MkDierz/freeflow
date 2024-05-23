import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function Credit() {
  return (
    <Link
      href={"https://github.com/MkDierz"}
      className="text-muted-foreground text-xs w-full flex gap-1 flex-wrap bg-white p-1 rounded-xl text-center items-center justify-center"
    >
      Created by Syibbran Mulaesyi
      <span className="flex flex-nowrap gap-1 text-center">
        ( MkDierz <GitHubLogoIcon />)
      </span>
    </Link>
  );
}
