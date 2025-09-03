import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import BASE_URL from "../../api/baseURL";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FacilityEarningsBarGraph = ({ facilityOwnerEmail }) => {
  const [monthlyEarnings, setMonthlyEarnings] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }
    if (!facilityOwnerEmail) {
      setError("No facility owner email provided");
      setLoading(false);
      return;
    }
    fetch(`${BASE_URL}/api/earnings/${facilityOwnerEmail}/monthly`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          let errorText = await res.text();
          throw new Error(
            `Failed to fetch earnings: ${res.status} ${res.statusText} - ${errorText}`
          );
        }
        return res.json();
      })
      .then((data) => {
        setMonthlyEarnings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [facilityOwnerEmail]);

  const chartData = months.map((month, idx) => ({
    month,
    earnings: monthlyEarnings[idx] || 0,
  }));

  if (loading) return <div>Loading earnings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Monthly Earnings</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            label={{ value: "Earnings", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Bar dataKey="earnings" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(FacilityEarningsBarGraph);
