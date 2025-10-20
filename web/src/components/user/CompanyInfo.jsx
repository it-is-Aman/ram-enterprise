import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    id: 1,
    title: "1 THE STUDIO",
    content: (
      <>
        <p>
          Loket Design was founded by Bart Ruijpers in 2019. Fifteen years of consultancy and
          in-house experience, and numerous award-winning designs realized, led to this and we’re
          excited to work on any project that comes our way.
        </p>
        <p>
          A frequent judge for international design competitions like the Clio Awards, the European
          Design Awards, and the TISDC Taiwan, Bart previously was the Director of Industrial Design
          at Karim Rashid's studio in New York and Vice President of Design at eos.
        </p>
      </>
    ),
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: 2,
    title: "2 INDUSTRIAL",
    content: (
      <>
        <p>
          Our industrial design services focus on merging creativity and functionality. From early
          sketches to prototype development, we ensure innovative yet practical solutions.
        </p>
        <p>
          Collaborating with engineers and manufacturers worldwide, we bring your vision to life
          with precision and quality.
        </p>
      </>
    ),
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    id: 3,
    title: "3 PACKAGING",
    content: (
      <>
        <p>
          We craft packaging that tells your brand story. Our award-winning packaging designs blend
          aesthetics and sustainability to create memorable experiences for your customers.
        </p>
        <p>
          From concept to shelf-ready product, we handle the entire creative and technical process.
        </p>
      </>
    ),
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba6?w=800&q=80",
  },
  {
    id: 4,
    title: "4 VISUALIZATION",
    content: (
      <>
        <p>
          High-quality 3D renders, animations, and product visualizations help you communicate your
          design vision before production begins.
        </p>
        <p>
          Our visualization team uses cutting-edge tools to deliver realistic, emotionally engaging
          imagery.
        </p>
      </>
    ),
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  },
];

const CompanyInfo = () => {
  const [active, setActive] = useState(null);

  const toggleSection = (id) => {
    setActive(active === id ? null : id);
  };

  return (
    <div className="bg-[#f9f5ed] text-[#e43d12] min-h-screen flex flex-col items-center overflow-hidden">
      {/* ABOUT US — Flip Animation */}
      <motion.div
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full text-center pt-24 pb-16 [transform-style:preserve-3d]"
      >
        <h1 className="text-[12vw] sm:text-[10vw] md:text-[16vw] font-extrabold leading-none tracking-tight">
          ABOUT US
        </h1>
      </motion.div>

      {/* Accordion Section */}
      <div className="w-full max-w-6xl space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border-t border-[#e43d12] overflow-hidden">
            {/* Accordion Header */}
            <div
              onClick={() => toggleSection(section.id)}
              className="flex justify-between items-center px-4 sm:px-8 py-6 cursor-pointer select-none bg-[#f9f5ed]"
            >
              <h2 className="text-5xl sm:text-7xl font-extrabold">{section.title}</h2>
              <motion.span
                initial={false}
                animate={{ rotate: active === section.id ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold border border-[#e43d12] rounded-full w-10 h-10 flex items-center justify-center"
              >
                {active === section.id ? "−" : "+"}
              </motion.span>
            </div>

            {/* Accordion Content */}
            <AnimatePresence>
              {active === section.id && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="bg-[#e43d12] text-white px-6 sm:px-12 py-10 grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 text-lg leading-relaxed"
                  >
                    {section.content}
                  </motion.div>

                  <motion.img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Company Info Section — Fade & Scale In */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mt-20 mb-24 space-y-6 px-6 sm:px-0"
      >
        <h3 className="text-xl sm:text-4xl font-bold text-[#e43d12]">
          About Company
        </h3>

        <p className="text-sm sm:text-base leading-relaxed max-w-md mx-auto text-[#2b2b2b]">
          Renowned as a foremost exporter, supplier, and trader of a wide range of bar accessories,
          <br />
          <span className="font-semibold text-[#e43d12]">Rudra Exports</span> is run under the supervision of{" "}
          <span className="font-semibold text-[#e43d12]">Mrs. Akansha Rawal</span>.
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm max-w-lg mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-[#ebe9e1] bg-opacity-70 backdrop-blur-sm rounded-lg p-3 text-center shadow-md"
          >
            <div className="font-semibold text-[#e43d12]">Nature of Business</div>
            <div className="text-[#2b2b2b]">Trader, Retailer</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-[#ebe9e1] bg-opacity-70 backdrop-blur-sm rounded-lg p-3 text-center shadow-md"
          >
            <div className="font-semibold text-[#e43d12]">GST Registration</div>
            <div className="text-[#2b2b2b]">24-06-2018</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyInfo;
