import React from "react";
import { Button, message } from "antd";
import axios from "axios";

const Hold = () => {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Subscription Expired</h2>
        <p className="mb-6 text-gray-700">Your access is currently on hold. Please renew your subscription to continue using the system.</p>
        <p className="text-gray-900">Plz contact our support</p>
      </div>
    </div>
  );
};

export default Hold;
