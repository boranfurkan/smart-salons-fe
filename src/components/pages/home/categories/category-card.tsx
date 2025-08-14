import Link from 'next/link';
import { Package } from 'lucide-react';
import { Corners } from './corners';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    slug: string;
    imageUrl?: string | null;
    productCount: number;
  };
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const imageUrl =
    typeof category.imageUrl === 'string' && category.imageUrl
      ? category.imageUrl
      : `https://picsum.photos/600/400?random=${category.id}`;

  return (
    <Link href={`/products?categoryId=${category.id}`}>
      <div className="group relative flex h-56 flex-col justify-end overflow-hidden p-6 transition-colors md:hover:bg-neutral-800 md:h-80 md:p-9">
        <div className="absolute left-3 top-5 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs uppercase text-neutral-400 transition-colors duration-500 md:group-hover:text-neutral-50">
            <Package className="text-base" />
            <span>{category.productCount} items</span>
          </div>
        </div>

        {/* Content Container - Fixed positioning from bottom */}
        <div className="relative z-10 space-y-2">
          {/* Category Title - Fixed height container */}
          <div className="h-16 md:h-20 flex items-end">
            <h3 className="text-2xl md:text-3xl leading-tight transition-transform duration-500 md:group-hover:-translate-y-3 text-white line-clamp-2 overflow-hidden">
              {category.name}
            </h3>
          </div>

          {/* Description - Fixed height container */}
          <div className="h-10 md:h-12">
            <p className="relative z-10 text-sm text-neutral-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 overflow-hidden">
              {category.description ||
                'Professional salon equipment for your business needs. Shop now with free shipping and 2-year warranty.'}
            </p>
          </div>
        </div>

        {/* Background Image */}
        <div
          className="absolute bottom-0 left-0 right-0 top-0 opacity-100 md:opacity-0 blur-none md:blur-sm grayscale-0 md:grayscale transition-all duration-500 md:group-hover:opacity-30 md:group-hover:blur-none md:group-hover:grayscale-0 group-active:scale-105 md:group-active:opacity-50"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Black overlay for mobile */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-black/60 md:bg-transparent" />

        <Corners />
      </div>
    </Link>
  );
};
