'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import {
  HorizontalCarousel,
  CarouselItem,
} from '@/components/ui/horizontal-carousel';
import {
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  Clock,
} from 'lucide-react';

interface ValueProp {
  icon: React.ElementType;
  title: string;
  name: string;
  description: string;
}

const valueProps: ValueProp[] = [
  {
    icon: Shield,
    title: 'Professional Grade Equipment',
    name: 'Quality Assurance',
    description:
      'Certified salon equipment trusted by professionals worldwide. Every product meets industry standards.',
  },
  {
    icon: Truck,
    title: 'Free Shipping Nationwide',
    name: 'Delivery Promise',
    description:
      'Free delivery on orders over $200 with fast and secure shipping nationwide.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns Policy',
    name: 'Risk-Free Shopping',
    description:
      'Easy returns and exchanges with no questions asked. Return any item within 30 days.',
  },
  {
    icon: Headphones,
    title: 'Expert Customer Support',
    name: '24/7 Professional Help',
    description:
      'Round-the-clock customer service from industry professionals who understand your salon needs.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    name: '2-Year Warranty',
    description:
      'Comprehensive 2-year warranty on all professional equipment with full repair and replacement coverage.',
  },
  {
    icon: Clock,
    title: 'Fast Order Processing',
    name: 'Quick Fulfillment',
    description:
      'Orders processed within 24 hours on business days. Get your equipment when you need it.',
  },
];

interface MobileValueCardProps {
  valueProp: ValueProp;
  index: number;
}

const MobileValueCard = ({ valueProp, index }: MobileValueCardProps) => {
  const { icon: Icon, title, name, description } = valueProp;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`min-w-[280px] sm:min-w-[320px] p-6 rounded-xl shadow-sm border border-gray-100 ${
        isEven ? 'bg-white text-gray-900' : 'bg-green-800 text-white'
      }`}
    >
      <div className="flex justify-center mb-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isEven ? 'bg-green-50' : 'bg-white/20'
          }`}
        >
          <Icon
            className={`w-8 h-8 ${isEven ? 'text-green-600' : 'text-white'}`}
          />
        </div>
      </div>

      <div className="text-center">
        <h4 className="font-bold text-lg mb-1">{title}</h4>
        <p
          className={`text-sm font-medium mb-3 ${
            isEven ? 'text-green-600' : 'text-green-200'
          }`}
        >
          {name}
        </p>
        <p
          className={`text-sm leading-relaxed ${
            isEven ? 'text-gray-600' : 'text-white/90'
          }`}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const TabletValueCard = ({ valueProp, index }: MobileValueCardProps) => {
  const { icon: Icon, title, name, description } = valueProp;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`p-8 rounded-xl shadow-lg border border-gray-100 ${
        isEven ? 'bg-white text-gray-900' : 'bg-green-800 text-white'
      }`}
    >
      <div className="flex justify-center mb-6">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isEven ? 'bg-green-50' : 'bg-white/20'
          }`}
        >
          <Icon
            className={`w-10 h-10 ${isEven ? 'text-green-600' : 'text-white'}`}
          />
        </div>
      </div>

      <div className="text-center">
        <h4 className="font-bold text-xl mb-2">{title}</h4>
        <p
          className={`text-sm font-medium mb-4 ${
            isEven ? 'text-green-600' : 'text-green-200'
          }`}
        >
          {name}
        </p>
        <p
          className={`text-base leading-relaxed ${
            isEven ? 'text-gray-600' : 'text-white/90'
          }`}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Desktop components (from original)
const SelectBtns = ({
  numTracks,
  setSelected,
  selected,
}: {
  numTracks: number;
  setSelected: Dispatch<SetStateAction<number>>;
  selected: number;
}) => {
  return (
    <div className="flex gap-1 mt-8">
      {Array.from(Array(numTracks).keys()).map((n) => {
        return (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className="h-2 w-full bg-gray-200 relative rounded-full overflow-hidden"
          >
            {selected === n ? (
              <motion.span
                className="absolute top-0 left-0 bottom-0 bg-green-600 rounded-full"
                initial={{
                  width: '0%',
                }}
                animate={{
                  width: '100%',
                }}
                transition={{
                  duration: 5,
                }}
                onAnimationComplete={() => {
                  setSelected(selected === numTracks - 1 ? 0 : selected + 1);
                }}
              />
            ) : (
              <span
                className="absolute top-0 left-0 bottom-0 bg-green-600 rounded-full"
                style={{
                  width: selected > n ? '100%' : '0%',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

const Cards = ({
  valueProps,
  selected,
  setSelected,
}: {
  valueProps: ValueProp[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="p-4 relative h-[450px] lg:h-[500px] shadow-xl rounded-2xl">
      {valueProps.map((prop, i) => {
        return (
          <Card
            {...prop}
            key={i}
            position={i}
            selected={selected}
            setSelected={setSelected}
          />
        );
      })}
    </div>
  );
};

const Card = ({
  icon: Icon,
  description,
  name,
  title,
  position,
  selected,
  setSelected,
}: ValueProp & {
  position: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) => {
  const scale = position <= selected ? 1 : 1 + 0.015 * (position - selected);
  const offset = position <= selected ? 0 : 95 + (position - selected) * 3;
  const background = position % 2 ? '#065f46' : 'white';
  const color = position % 2 ? 'white' : '#1f2937';

  return (
    <motion.div
      initial={false}
      style={{
        zIndex: position,
        transformOrigin: 'left bottom',
        background,
        color,
      }}
      animate={{
        x: `${offset}%`,
        scale,
      }}
      whileHover={{
        translateX: position === selected ? 0 : -3,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeOut',
      }}
      onClick={() => setSelected(position)}
      className="absolute top-0 left-0 w-full min-h-full p-8 lg:p-12 cursor-pointer flex flex-col justify-between rounded-2xl border border-gray-100"
    >
      <div className="flex justify-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            position % 2 ? 'bg-white/20' : 'bg-green-50'
          }`}
        >
          <Icon
            className={`w-10 h-10 ${
              position % 2 ? 'text-white' : 'text-green-600'
            }`}
          />
        </div>
      </div>

      <p className="text-lg lg:text-xl font-light italic my-8 leading-relaxed text-center">
        &ldquo;{description}&rdquo;
      </p>

      <div className="text-center">
        <span className="block font-bold text-xl mb-1">{title}</span>
        <span
          className={`block text-sm font-medium ${
            position % 2 ? 'text-green-200' : 'text-green-600'
          }`}
        >
          {name}
        </span>
      </div>
    </motion.div>
  );
};

export function ResponsiveValuePropositions() {
  const { isMobile, isTablet } = useResponsive();
  const [selected, setSelected] = useState(0);

  if (isMobile) {
    return (
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Smart Salons?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Committed to providing salon professionals with the highest
              quality equipment and support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HorizontalCarousel
              options={{
                align: 'start',
                containScroll: 'trimSnaps',
                dragFree: true,
              }}
            >
              {valueProps.map((valueProp, index) => (
                <CarouselItem key={index} className="pr-4">
                  <MobileValueCard valueProp={valueProp} index={index} />
                </CarouselItem>
              ))}
            </HorizontalCarousel>
          </motion.div>
        </div>
      </section>
    );
  }

  if (isTablet) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Smart Salons?
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              We&apos;re committed to providing salon professionals with the
              highest quality equipment, unmatched service, and the support you
              need to grow your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {valueProps.map((valueProp, index) => (
              <TabletValueCard
                key={index}
                valueProp={valueProp}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop layout (original)
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24 px-4 lg:px-8 grid items-center grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 overflow-hidden">
      <div className="p-4">
        <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Why Choose Smart Salons?
        </h3>
        <p className="text-gray-600 text-lg my-4 leading-relaxed">
          We&apos;re committed to providing salon professionals with the highest
          quality equipment, unmatched service, and the support you need to grow
          your business.
        </p>
        <SelectBtns
          numTracks={valueProps.length}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
      <Cards
        valueProps={valueProps}
        setSelected={setSelected}
        selected={selected}
      />
    </section>
  );
}
