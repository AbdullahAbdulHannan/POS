const Hold = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 text-center px-4">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Subscription Expired
        </h1>
        <p className="text-gray-700 mb-4">
          Your access is currently on hold due to an expired subscription.
          Please contact support or renew your plan to regain access.
        </p>
        <a
          href="/pricing"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Renew Subscription
        </a>
      </div>
    </div>
  )
}

export default Hold
