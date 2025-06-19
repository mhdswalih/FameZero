import React from "react";
import { motion, useScroll } from "framer-motion";

const CircleIndicator = () => {
  const { scrollYProgress } = useScroll();

  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      className="fixed top-4 right-4 z-50"
    >
      <motion.circle
        cx="25"
        cy="25"
        r="20"
        stroke="white"
        strokeWidth="4"
        fill="transparent"
        style={{ pathLength: scrollYProgress }}
      />
    </svg>
  );
};

function AboutSection() {
  return (
    <div className="relative p-8">
      {/* Scroll Indicator */}
      <CircleIndicator />

      <h1 className="flex items-start text-white font-bold font-mono italic max-w-7xl mx-auto text-4xl">
        ABOUT FOOD POSITIVITY
      </h1>
      <hr className="text-white font-bold mb-6 max-w-7xl mx-auto" />

      <div className="grid grid-cols-1 md:grid-cols-2 items-center max-w-7xl mx-auto" style={{ padding: '0 10px' }}>
  {/* Left Side - Text Content */}
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-3xl font-bold mb-4 font-mono text-white">
      THE IMPORTANCE OF FOOD
    </h2>
    <p className="text-gray-600">
      Food is more than just sustenance; it’s a source of joy, culture, and connection. 
      Embracing food positivity means celebrating all foods without guilt and understanding 
      the role they play in nourishing our bodies and minds. Let’s promote a healthy 
      relationship with food and appreciate its diversity and richness.
    </p>
    <ul className="mt-4 space-y-2 text-white">
      <motion.li
        className="flex items-center"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        ✅ <span className="ml-2">Celebrate Food Diversity</span>
      </motion.li>
      <motion.li
        className="flex items-center"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        ✅ <span className="ml-2">Promote Mindful Eating</span>
      </motion.li>
      <motion.li
        className="flex items-center"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
      >
        ✅ <span className="ml-2">Encourage Balanced Diets</span>
      </motion.li>
      <motion.li
        className="flex items-center"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0 }}
      >
        ✅ <span className="ml-2">Support Sustainable Food Practices</span>
      </motion.li>
    </ul>
  </motion.div>

  {/* Right Side - Image */}
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <img
      src="/img/shef.png" 
      alt="Food Positivity"
      className="w-full h-auto rounded-lg"
    />
  </motion.div>
</div>
    </div>
  );
}

export default AboutSection;