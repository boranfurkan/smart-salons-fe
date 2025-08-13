'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { motion } from 'framer-motion';
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
      'Certified salon equipment trusted by professionals worldwide. Every product meets industry standards and comes with comprehensive quality guarantees.',
  },
  {
    icon: Truck,
    title: 'Free Shipping Nationwide',
    name: 'Delivery Promise',
    description:
      'Free delivery on orders over $200 with fast and secure shipping. Track your order every step of the way to your salon door.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns Policy',
    name: 'Risk-Free Shopping',
    description:
      'Easy returns and exchanges with no questions asked. Not satisfied? Return any item within 30 days for a full refund.',
  },
  {
    icon: Headphones,
    title: 'Expert Customer Support',
    name: '24/7 Professional Help',
    description:
      'Round-the-clock customer service from industry professionals who understand your salon needs and equipment requirements.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    name: '2-Year Warranty',
    description:
      'Comprehensive 2-year warranty on all professional equipment. We stand behind every product with full repair and replacement coverage.',
  },
  {
    icon: Clock,
    title: 'Fast Order Processing',
    name: 'Quick Fulfillment',
    description:
      'Orders processed within 24 hours on business days. Get your salon equipment when you need it with our efficient processing system.',
  },
];

export function ValuePropositions() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24 px-4 lg:px-8 grid items-center grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 overflow-hidden">
      <div className="p-4">
        <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Why Choose Smart Salons?
        </h3>
        <p className="text-gray-600 text-lg my-4 leading-relaxed">
          We're committed to providing salon professionals with the highest
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
  const background = position % 2 ? '#065f46' : 'white'; // Green-800 for dark cards
  const color = position % 2 ? 'white' : '#1f2937'; // Gray-800 for light cards

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
        "{description}"
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
