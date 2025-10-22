import { motion, useScroll } from 'framer-motion';
import { FooterWithLogo } from '../UserNav&Footer/Footer';
import Navbar from '../UserNav&Footer/Navbar';

function NewspaperPage() {
    const { scrollYProgress } = useScroll();
  return (
    <>
    <div className='w-screen min-h-screen pt-10 bg-white'>
     <div className="fixed top-5 w-full flex justify-center z-20 px-4">
      <div className="w-full max-w-screen-xl">
        <Navbar />
      </div>
    </div>

    <div className="font-serif b text-black m-20 mt-40">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <header className="text-5xl font-bold uppercase mb-4">
          THE CHAOS NEWS
        </header>
        <div className="text-lg italic text-gray-600">
          IST EDITION | EVERYDAY IS CHAOS NEWS | SUSD
        </div>
      </motion.div>

      {/* Subhead Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="border-t-2 border-b-2 border-gray-900 py-3 text-center uppercase text-sm mb-8"
      >
        York, MA - Thursday August 30, 1978 - Seven Pages
      </motion.div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Column 1 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold italic mb-2">The Value of Food in Our Lives</h2>
            <p className="text-sm italic">by FOOD & CULTURE</p>
          </div>
          <p>
            Food is more than just a basic necessity; it is a cornerstone of culture, tradition, and human connection. Every meal tells a story, reflecting the history and values of the people who prepare and share it. From family dinners to community feasts, food brings people together and fosters a sense of belonging.
          </p>
          <p>
            Beyond its cultural significance, food plays a vital role in our health and well-being. A balanced diet provides the nutrients our bodies need to function, grow, and thrive. It is essential for maintaining energy, supporting mental health, and preventing diseases. Eating a variety of foods ensures that we get the vitamins, minerals, and antioxidants necessary for a healthy life.
          </p>
        </motion.div>

        {/* Column 2 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold italic mb-2">Food and Emotions</h2>
            <p className="text-sm italic">by FOOD & CULTURE</p>
          </div>
          <p>
            Food also has the power to evoke memories and emotions. The smell of freshly baked bread, the taste of a childhood favorite, or the sight of a beautifully plated dish can transport us back in time and connect us to our roots. This emotional connection to food is what makes it such an integral part of our lives.
          </p>
          <motion.figure
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-4"
          >
            <img
              className="w-full h-auto rounded-lg shadow-lg"
              src="/img/eggs-benedict-with-bacon-twist-asparagus.jpg"
              alt="Delicious food"
            />
            <figcaption className="text-sm italic text-center mt-2">
              A beautifully plated dish.
            </figcaption>
          </motion.figure>
        </motion.div>

        {/* Column 3 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold italic mb-2">Food Insecurity</h2>
            <p className="text-sm italic">by FOOD & CULTURE</p>
          </div>
          <p>
            However, not everyone has access to sufficient and nutritious food. Food insecurity remains a pressing global issue, affecting millions of people. This is where food donation comes in. By donating food, we can help alleviate hunger, reduce food waste, and promote sustainability. Food donation programs not only provide immediate relief to those in need but also strengthen communities and encourage social responsibility.
          </p>
          <p>
            Food waste is another critical issue that needs attention. Globally, about one-third of all food produced is wasted. This waste not only exacerbates hunger but also contributes to environmental problems such as greenhouse gas emissions. By reducing food waste and donating surplus food, we can make a significant impact on both hunger and the environment.
          </p>
        </motion.div>

        {/* Column 4 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold italic mb-2">Food Donation</h2>
            <p className="text-sm italic">by FOOD & CULTURE</p>
          </div>
          <p>
            Food donation programs also play a crucial role in educating communities about nutrition and healthy eating. Many organizations provide not only food but also resources and workshops to help people make informed choices about their diets. This holistic approach ensures that individuals and families can lead healthier, more fulfilling lives.
          </p>
          <p>
            In addition to its practical benefits, food donation fosters a sense of community and compassion. When we donate food, we are not just giving sustenance; we are showing care and solidarity with those in need. This act of kindness can inspire others to contribute, creating a ripple effect of generosity and goodwill.
          </p>
        </motion.div>
      </div>

      {/* Full-Screen Section */}
      <div className="font-serif w-full bg-white text-black p-6 ms-2 min-h-screen flex flex-col justify-center items-center">
        {/* Big Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full h-96 flex items-center justify-center mb-8"
        >
          <img
            className="w-full h-full object-cover rounded-lg shadow-lg"
            src="/img/elderly-man-was-sitting-asking-rain-dry-season-global-warming.jpg"
            alt="Poverty and Food Availability"
          />
        </motion.div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold italic mb-4">
            Poverty and Food Scarcity
          </h2>
          <p className="text-lg leading-relaxed">
            In many parts of the world, poverty and food scarcity remain pressing issues. Millions of people struggle to access sufficient and nutritious food, leading to malnutrition and hunger. Food availability is often limited by economic inequality, climate change, and inadequate infrastructure. Addressing these challenges requires global cooperation, sustainable practices, and community-driven solutions.
          </p>
        </motion.div>
      </div>
      <motion.div>
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
          stroke="orange"
          strokeWidth="4"
          fill="transparent"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      </motion.div>
    </div>
      <FooterWithLogo />
    </div>
    </>
  );
}

export default NewspaperPage;