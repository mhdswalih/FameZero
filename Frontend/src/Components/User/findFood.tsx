import { motion, useScroll } from "framer-motion";
import {  ArrowBigRight } from "lucide-react";

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

function ServicesSection() {
  return (
    <div className="relative p-8">
      {/* Scroll Indicator */}
      <CircleIndicator />

      <h1 className="flex items-start text-white font-bold font-mono italic text-4xl max-w-7xl mx-auto">
        ABOUT
      </h1>
      <hr className="text-white font-bold mb-6 max-w-7xl mx-auto" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto items-center">
        {/* Left Side - Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/img/deliveryBoy.png"
            alt="Service Image"
            className="w-full h-auto rounded-lg"
          />
        </motion.div>

        {/* Right Side - Services Explanation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 font-mono text-white">
            OUR SERVICE
          </h2>
          <p className="text-white">
            We provide fast and reliable delivery and takeaway services to make
            your food experience easy and enjoyable. Whether you prefer dining
            at home or picking up your order, we’ve got you covered with
            multiple payment options.
          </p>
          <ul className="mt-4 space-y-2 text-white">
            <motion.li
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <ArrowBigRight/> <span className="ml-2">Quick Delivery Service</span>
            </motion.li>
            <motion.li
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
               <ArrowBigRight/> <span className="ml-2">Takeaway Option Available</span>
            </motion.li>
            <motion.li
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
            >
               <ArrowBigRight/> <span className="ml-2">Online & Offline Payments</span>
            </motion.li>
            <motion.li
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0 }}
            >
               <ArrowBigRight/> <span className="ml-2">Wallet Payments Accepted</span>
            </motion.li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default ServicesSection;
