import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const generateBubbles = () => {
  const bubbles = [];
  for (let i = 0; i < 12; i++) {
    const size = Math.random() * 40 + 20; // 20px to 60px
    const left = Math.random() * 100; // percent
    const delay = Math.random() * 5; // seconds
    const duration = Math.random() * 6 + 4; // 4s to 10s
    const distance = Math.random() * 80 + 40; // 40px to 120px
    bubbles.push({ size, left, delay, duration, distance });
  }
  return bubbles;
};

const Footer = () => {
  const bubbles = generateBubbles();

  return (
    <footer className="relative overflow-hidden bg-[#e43d12] text-white py-12 mt-10">
      {/* Floating Background Glow */}
      <motion.div
        className="absolute inset-0 bg-[#ebe9e1]/20 rounded-2xl blur-3xl"
        animate={{ y: ["0%", "5%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Bubble Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {bubbles.map((bubble, idx) => (
          <motion.div
            key={idx}
            className="absolute bg-[#e43d12] rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              bottom: -bubble.size,
            }}
            animate={{ bottom: bubble.distance }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Moving Objects */}
      <motion.div
        className="absolute bottom-0 w-[330px] h-[105px] bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage:
            "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia0PYPxwT5ifToyP3SNZeQWfJEWrUENYA5IXM6sN5vLwAKvaJS1pQVu8mOFFUa_ET4JuHNTFAxKURFerJYHDUWXLXl1vDofYXuij45JZelYOjEFoCOn7E6Vxu0fwV7ACPzArcno1rYuVxGB7JY6G7__e4_KZW4lTYIaHSLVaVLzklZBLZnQw047oq5-Q/s16000/volks.gif')",
        }}
        animate={{ x: ["-100vw", "100vw"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-0 w-[88px] h-[100px] bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage:
            "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyLGwEUVwPK6Vi8xXMymsc-ZXVwLWyXhogZxbcXQYSY55REw_0D4VTQnsVzCrL7nsyjd0P7RVOI5NKJbQ75koZIalD8mqbMquP20fL3DxsWngKkOLOzoOf9sMuxlbyfkIBTsDw5WFUj-YJiI50yzgVjF8cZPHhEjkOP_PRTQXDHEq8AyWpBiJdN9SfQA/s16000/cyclist.gif')",
        }}
        animate={{ x: ["-100vw", "100vw"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto relative px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left z-20">
        {/* Company Info */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-white drop-shadow-md">Rudra Exports</h2>
          <p className="mt-2 font-semibold">Partner: Amit Kumar</p>
          <p className="mt-2 text-sm leading-6">
            Faridabad - 121004, Haryana, India <br />
            Sector 56, Faridabad <br />
            📞 9992196879, 8818049884
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h3 className="text-xl font-semibold text-white">Our Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {["Introduction", "News", "Testimonial", "Sitemap", "Contact Us"].map((link, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-[#ebe9e1] transition-colors duration-300">{link}</a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Products */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h3 className="text-xl font-semibold text-white">Products & Services</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Copper Water Bottle",
              "Decorative Diya",
              "Leatherette Bar Set",
              "Hotel & Hospitality Products",
              "Chafing Dishes",
              "Bar Measuring Jiggers",
              "Stainless Steel Water Bottle & Flasks",
              "Bar Shakers & Mixing Glasses",
              "Bar Spoon & Stirrer Straw",
              "Copper Water Jugs & Pitchers",
            ].map((item, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-[#ebe9e1] transition-colors duration-300">{item}</a>
              </li>
            ))}
            <li>
              <a href="#" className="font-semibold hover:text-[#ebe9e1] transition-colors">+ View All</a>
            </li>
          </ul>
        </motion.div>

        {/* Subscribe Form */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <h3 className="text-xl font-semibold text-white mb-4">Subscribe</h3>
          <form className="flex flex-col gap-3">
            <input type="email" placeholder="Enter your email" className="px-3 py-2 rounded text-black bg-[#ebe9e1] focus:outline-none" />
            <button type="submit" className="bg-white text-[#e43d12] font-semibold py-2 px-4 rounded hover:bg-[#ebe9e1] transition-colors">
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Social + Bottom Bar */}
      <div className="max-w-7xl mx-auto relative mt-10 px-6 z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 border-t border-[#ebe9e1]/30 pt-5">
          <div className="flex justify-center md:justify-start gap-5">
            {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
              <motion.a whileHover={{ scale: 1.2, rotate: 8 }} whileTap={{ scale: 0.9 }} key={idx} href="#" className="p-3 rounded-full bg-[#ebe9e1] text-[#e43d12] shadow-md hover:bg-white hover:text-[#e43d12] transition-all">
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-sm text-center text-white/90">
            © {new Date().getFullYear()} Rudra Exports | All Rights Reserved
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
