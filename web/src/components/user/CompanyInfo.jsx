import React from 'react';

const CompanyInfo = () => {
  return (
    <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-xl p-6 mt-6 text-white">
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">About Company</h3>
        <p className="text-red-100 text-sm mb-4">
          Renowned as a foremost exporter, supplier and trader of wide gamut of bar accessories, 
          Rudra Exports is run under the supervision of Mrs. Akansha Rawal.
        </p>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            <div className="font-medium">Nature of Business</div>
            <div className="text-red-100">Trader, Retailer</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            <div className="font-medium">GST Registration</div>
            <div className="text-red-100">24-06-2018</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
