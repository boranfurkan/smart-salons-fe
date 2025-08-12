import Link from 'next/link';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';

export const TitleCard = () => {
  return (
    <Link href="/products">
      <div className="group relative flex h-56 flex-col justify-between bg-neutral-800 p-6 md:h-80 md:p-9">
        <h2 className="text-3xl md:text-4xl uppercase leading-tight">
          <span className="text-neutral-400 transition-colors duration-500 group-hover:text-blue-400">
            Explore our
          </span>
          <br />
          <span className="text-white">Product Range</span>
        </h2>

        <div className="flex items-center gap-1.5 text-xs uppercase text-neutral-400 transition-colors duration-500 group-hover:text-neutral-50">
          <ShoppingBag className="text-base" />
          <span>Professional Equipment</span>
        </div>

        <ArrowUpRight className="absolute right-3 top-4 text-2xl text-neutral-400 transition-colors duration-500 group-hover:text-blue-400" />
      </div>
    </Link>
  );
};
