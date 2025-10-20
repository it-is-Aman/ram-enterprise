// import React, { useState, useEffect, useCallback } from 'react';
// import { StarIcon as StarSolidIcon, UserCircleIcon } from '@heroicons/react/24/solid';
// import { StarIcon as StarOutlineIcon, EyeIcon } from '@heroicons/react/24/outline';
// import { motion, AnimatePresence } from 'framer-motion';
// import { reviewsAPI } from '../../services';

// const RatingsReviewsSection = () => {
//   const [reviews, setReviews] = useState([]);
//   const [stats, setStats] = useState({
//     averageRating: 4.6,
//     totalReviews: 87,
//     ratingDistribution: { 5: 64, 4: 19, 3: 3, 2: 2, 1: 12 },
//   });
//   const [loading, setLoading] = useState(true);
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [visibleReviews, setVisibleReviews] = useState(3);

//   const fetchReviewsData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await reviewsAPI.getAll({ limit: 20, sortBy: 'createdAt', order: 'desc' });
//       const reviewsData = response.data || [];

//       if (reviewsData.length > 0) {
//         const totalReviews = reviewsData.length;
//         const totalRating = reviewsData.reduce((sum, r) => sum + r.rating, 0);
//         const averageRating = (totalRating / totalReviews).toFixed(1);

//         const distribution = reviewsData.reduce((acc, r) => {
//           acc[r.rating] = (acc[r.rating] || 0) + 1;
//           return acc;
//         }, {});

//         setStats({
//           averageRating: parseFloat(averageRating),
//           totalReviews,
//           ratingDistribution: {
//             5: distribution[5] || 0,
//             4: distribution[4] || 0,
//             3: distribution[3] || 0,
//             2: distribution[2] || 0,
//             1: distribution[1] || 0,
//           },
//         });
//       }

//       setReviews(reviewsData.length ? reviewsData : getSampleData());
//     } catch (err) {
//       console.error('Error fetching reviews:', err);
//       setReviews(getSampleData());
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchReviewsData(); }, [fetchReviewsData]);

//   const getSampleData = () => [
//     { id: 1, rating: 5, comment: "Excellent product quality! Highly recommend!", user: { name: "Neha" }, product: { name: "Copper Vessels" }, createdAt: "2025-08-16", isVerified: true, location: "Jalandhar, Punjab" },
//     { id: 2, rating: 4, comment: "Great product! Good quality and fast delivery.", user: { name: "Faisal" }, product: { name: "Copper Bottle Gift Set" }, createdAt: "2025-08-17", isVerified: true, location: "Moradabad, Uttar Pradesh" },
//     { id: 3, rating: 5, comment: "Outstanding bar accessories! Perfect for home bar setup.", user: { name: "Pratyuni Mali" }, product: { name: "Bar Accessories" }, createdAt: "2025-02-14", isVerified: true, location: "Mumbai, Maharashtra" }
//   ];

//   const renderAverageStars = (rating) => {
//     return [...Array(5)].map((_, i) => {
//       if (rating >= i + 1) return <StarSolidIcon key={i} className="w-5 h-5 text-[#e43d12]" />;
//       if (rating > i && rating < i + 1) return (
//         <div key={i} className="relative w-5 h-5">
//           <StarOutlineIcon className="absolute top-0 left-0 w-5 h-5 text-[#ebe9e1]" />
//           <StarSolidIcon className="absolute top-0 left-0 w-5 h-5 text-[#e43d12]" style={{ clipPath: `inset(0 ${100 - (rating - i) * 100}% 0 0)` }} />
//         </div>
//       );
//       return <StarOutlineIcon key={i} className="w-5 h-5 text-[#ebe9e1]" />;
//     });
//   };

//   const renderStars = (rating, size = 'w-4 h-4') => {
//     return [...Array(5)].map((_, i) =>
//       i < rating ? <StarSolidIcon key={i} className={`${size} text-[#e43d12]`} /> :
//       <StarOutlineIcon key={i} className={`${size} text-[#ebe9e1]`} />
//     );
//   };

//   const getPercentage = (count, total) => total > 0 ? Math.round((count / total) * 100) : 0;

//   const filteredReviews = selectedFilter === 'all' ? reviews : reviews.filter(r => r.rating === parseInt(selectedFilter));

//   const userSatisfactionMetrics = [
//     { label: 'Response', percentage: 85, color: '#e43d12' },
//     { label: 'Quality', percentage: 83, color: '#e43d12' },
//     { label: 'Delivery', percentage: 91, color: '#e43d12' }
//   ];

//   if (loading) {
//     return (
//       <section className="bg-[#ebe9e1] py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="animate-pulse">
//             <div className="h-8 bg-[#e43d12] rounded w-64 mx-auto mb-8"></div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {[1,2,3].map(i => <div key={i} className="bg-[#ebe9e1] rounded-lg h-48"></div>)}
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="bg-[#ebe9e1] py-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-[#e43d12] mb-4">Ratings & Reviews</h2>
//           <p className="text-lg text-gray-700">See what our customers are saying about our products</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Rating Overview */}
//           <div className="lg:col-span-1">
//             <motion.div
//               className="bg-white rounded-2xl shadow-lg p-6 h-fit"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <div className="text-center mb-6">
//                 <div className="text-5xl font-bold text-[#e43d12] mb-2">
//                   {stats.averageRating}<span className="text-lg text-gray-500">/5</span>
//                 </div>
//                 <div className="flex justify-center mb-2">{renderAverageStars(stats.averageRating)}</div>
//                 <p className="text-gray-600">Reviewed by {stats.totalReviews} Users</p>
//               </div>

//               <div className="space-y-3 mb-6">
//                 {[5,4,3,2,1].map(star => {
//                   const count = stats.ratingDistribution[star] || 0;
//                   const percentage = getPercentage(count, stats.totalReviews);
//                   return (
//                     <div key={star} className="flex items-center space-x-3">
//                       <span className="text-sm font-medium text-gray-700 w-3">{star}★</span>
//                       <div className="flex-1 bg-[#ebe9e1] rounded-full h-2">
//                         <motion.div
//                           className="h-2 rounded-full"
//                           style={{ backgroundColor: '#e43d12' }}
//                           initial={{ width: 0 }}
//                           animate={{ width: `${percentage}%` }}
//                           transition={{ duration: 0.8 }}
//                         />
//                       </div>
//                       <span className="text-sm text-gray-600 w-10">{percentage}%</span>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="border-t pt-6">
//                 <div className="flex items-center mb-4">
//                   <UserCircleIcon className="h-5 w-5 text-[#e43d12] mr-2" />
//                   <span className="font-medium text-gray-900">User Satisfaction</span>
//                 </div>
//                 <div className="space-y-3">
//                   {userSatisfactionMetrics.map((m,i) => (
//                     <div key={i}>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="text-gray-700">{m.label}</span>
//                         <span className="font-medium">{m.percentage}%</span>
//                       </div>
//                       <div className="bg-[#ebe9e1] rounded-full h-2">
//                         <motion.div
//                           className="h-2 rounded-full"
//                           style={{ backgroundColor: m.color }}
//                           initial={{ width: 0 }}
//                           animate={{ width: `${m.percentage}%` }}
//                           transition={{ duration: 0.8 }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Reviews List */}
//           <div className="lg:col-span-2">
//             <motion.div
//               className="bg-white rounded-2xl shadow-lg p-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               {/* Filter Buttons */}
//               <div className="flex flex-wrap gap-2 mb-6">
//                 <button
//                   onClick={() => setSelectedFilter('all')}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     selectedFilter === 'all' ? 'bg-[#e43d12] text-white' : 'bg-[#ebe9e1] text-gray-700 hover:bg-[#f2ded9]'
//                   }`}
//                 >All Reviews ({stats.totalReviews})</button>
//                 {[5,4,3,2,1].map(star => (
//                   <button
//                     key={star}
//                     onClick={() => setSelectedFilter(star.toString())}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                       selectedFilter === star.toString() ? 'bg-[#e43d12] text-white' : 'bg-[#ebe9e1] text-gray-700 hover:bg-[#f2ded9]'
//                     }`}
//                   >{star}★ ({stats.ratingDistribution[star] || 0})</button>
//                 ))}
//               </div>

//               <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Relevant Reviews</h3>

//               <div className="space-y-6">
//                 <AnimatePresence>
//                   {filteredReviews.slice(0, visibleReviews).map(review => (
//                     <motion.div
//                       key={review.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.4 }}
//                       className="border-b border-[#ebe9e1] pb-6 last:border-b-0 last:pb-0"
//                     >
//                       <div className="flex items-start space-x-4">
//                         <div className="w-12 h-12 bg-[#ebe9e1] rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-[#e43d12] font-semibold text-lg">{review.user?.name?.[0]?.toUpperCase() || 'U'}</span>
//                         </div>

//                         <div className="flex-1">
//                           <div className="flex items-center justify-between mb-2">
//                             <div>
//                               <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous User'}</h4>
//                               <p className="text-sm text-gray-500">
//                                 {review.location || 'Verified Purchase'} • {new Date(review.createdAt).toLocaleDateString('en-GB')}
//                               </p>
//                             </div>
//                             {review.isVerified && (
//                               <div className="flex items-center bg-[#ebe9e1] px-2 py-1 rounded-full">
//                                 <div className="w-2 h-2 bg-[#e43d12] rounded-full mr-1"></div>
//                                 <span className="text-xs text-[#e43d12] font-medium">Verified</span>
//                               </div>
//                             )}
//                           </div>

//                           <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Product:</span> {review.product?.name}</p>
//                           <div className="flex items-center mb-3">{renderStars(review.rating)}</div>
//                           {review.comment && <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>}
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>

//               {filteredReviews.length > visibleReviews && (
//                 <div className="text-center mt-8">
//                   <button
//                     onClick={() => setVisibleReviews(prev => prev + 3)}
//                     className="bg-[#ebe9e1] text-[#e43d12] px-6 py-3 rounded-lg font-medium hover:bg-[#f2ded9] transition-colors"
//                   >
//                     View More Reviews
//                   </button>
//                 </div>
//               )}

//               {filteredReviews.length === 0 && (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No reviews found for the selected filter.</p>
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default RatingsReviewsSection;



import React from 'react';
import { motion } from 'framer-motion';

const AwardsAndPatents = () => {
  const awards = [
    { title: 'Chompshop', desc: 'Fast Company Innovation by Design Award' },
    { title: 'Stojo', desc: 'Red Dot Award' },
    { title: 'Stojo Patents', desc: 'Design & Utility Patents' },
    { title: 'True Places', desc: "A'Design Award" },
    { title: 'True Places Patent', desc: 'Folding Mechanism Patent' },
    { title: 'Eku Collection', desc: 'Excellence in Housewares Awards' },
    { title: 'Ullo Open', desc: 'Design & Utility Patents' },
  ];

  return (
    <div className="h-screen bg-[#f9f5ed] text-[#e63900] flex flex-col justify-between items-center px-6 py-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
        AWARDS & PATENTS
      </h1>

      {/* Awards List */}
      <div className="w-full max-w-5xl space-y-3 flex-1 flex flex-col justify-center">
        {awards.map((award, i) => (
          <motion.div
            key={i}
            className="relative flex flex-col sm:flex-row justify-between items-center border-b border-[#e63900] py-3 px-4 rounded-lg overflow-hidden cursor-pointer group"
            initial={{ backgroundColor: '#f9f5ed' }}
            whileHover={{
              backgroundColor: '#e63900',
              transition: { duration: 0.25, ease: 'easeOut' },
            }}
          >
            {/* Title */}
            <motion.span
              className="text-xl sm:text-2xl font-semibold z-10 transition-colors duration-200 group-hover:text-white"
              whileHover={{ x: 8, color: '#fff', transition: { duration: 0.2 } }}
            >
              {award.title}
            </motion.span>

            {/* Description */}
            <motion.span
              className="text-base sm:text-lg mt-2 sm:mt-0 text-[#e63900]/80 z-10 transition-colors duration-200 group-hover:text-white"
              whileHover={{ x: -8, color: '#fff', transition: { duration: 0.2 } }}
            >
              {award.desc}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Email Marquee */}
      <div className="w-full overflow-hidden border-t-2 border-[#e63900] border-b-2 py-3">
        <marquee
          behavior="scroll"
          direction="left"
          scrollamount="10"
          className="text-3xl md:text-5xl font-extrabold"
        >
          RAMHARIENTERPRISES01@GMAIL.COM • RAMHARIENTERPRISES01@GMAIL.COM •
          RAMHARIENTERPRISES01@GMAIL.COM • RAMHARIENTERPRISES01@GMAIL.COM •
        </marquee>
      </div>
    </div>
  );
};

export default AwardsAndPatents;




