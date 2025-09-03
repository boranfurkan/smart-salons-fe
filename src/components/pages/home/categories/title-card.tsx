import Link from 'next/link';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';

export const TitleCard = () => {
  return (
    <Link href="/products" aria-label="Browse all products">
      <div className="group relative flex h-56 sm:h-64 md:h-80 flex-col justify-between bg-neutral-800 p-4 sm:p-6 md:p-9">
        <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase leading-snug sm:leading-tight tracking-tight">
          <span className="text-neutral-400 transition-colors duration-500 group-hover:text-blue-400">
            Explore our
          </span>
          <br />
          <span className="text-white">Product Range</span>
        </h2>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs md:text-sm uppercase text-neutral-400 transition-colors duration-500 group-hover:text-neutral-50">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Professional Equipment</span>
        </div>

        <ArrowUpRight className="absolute right-3 top-3 sm:top-4 w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 transition-colors duration-500 group-hover:text-blue-400" />
      </div>
    </Link>
  );
};
