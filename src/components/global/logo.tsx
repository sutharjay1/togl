import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  text?: string;
};

const Logo = ({ text }: Props) => {
  return (
    <Link href="/" className="relative flex items-center space-x-2">
      <div
        className={cn(
          "relative flex h-8 w-fit items-center justify-center rounded-md",
          // 'bg-primary/10'
        )}
      >
        <span className={cn("px-2 text-lg font-bold", text)}>Togl</span>
      </div>
    </Link>
  );
};

export default Logo;
