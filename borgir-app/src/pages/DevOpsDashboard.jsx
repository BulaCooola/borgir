import React from "react";

export default function DevOpsDashboard() {
  const dashboardData = {
    lastDeployment: "✅ Success (April 27, 2025 by @you)",
    testsPassing: "✅ 14/14 tests passing",
    apiHealth: "⚡ Avg 230ms response",
    openIssues: "🛠 3 open issues",
    securityStatus: "🛡 0 vulnerabilities",
    burgerCount: 45,
    reviewCount: 122,
    uptimeStatus: "🟢 99.99% uptime",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">🍔 DevOps Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Last Deployment" value={dashboardData.lastDeployment} />
          <Card title="Tests Status" value={dashboardData.testsPassing} />
          <Card title="API Health" value={dashboardData.apiHealth} />
          <Card title="Uptime" value={dashboardData.uptimeStatus} />
          <Card title="Security" value={dashboardData.securityStatus} />
          <Card title="Open Issues" value={dashboardData.openIssues} />
          <Card title="Burger Count" value={`${dashboardData.burgerCount} 🍔`} />
          <Card title="Review Count" value={`${dashboardData.reviewCount} 📝`} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
