import { Package, ShoppingCart, Users, BadgeDollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  interface Stat {
    title: string;
    value: number;
    color: string;
    icon: React.ElementType;
  }

  // const data = [
  //   { name: "Jan", users: 25 },
  //   { name: "Feb", users: 18 },
  //   { name: "Mar", users: 22 },
  //   { name: "Apr", users: 15 },
  //   { name: "May", users: 20 },
  //   { name: "Jun", users: 12 },
  //   { name: "Jul", users: 18 },
  //   { name: "Aug", users: 14 },
  //   { name: "Sep", users: 21 },
  //   { name: "Oct", users: 19 },
  //   { name: "Nov", users: 28 },
  //   { name: "Dec", users: 25 },
  // ];

  const [stats, setStats] = useState<Stat[]>([]);
  const [graphData, setGraphData] = useState([]);

  const fetchGraph = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/activity/users-graph",
    );
    setGraphData(res.data.graph);
  };
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/dashboard-stats",
          { withCredentials: true },
        );

        const data = res.data;

        setStats([
          {
            title: "Orders",
            value: 400,
            icon: ShoppingCart,
            color: "border-blue-500",
          },
          {
            title: "Products",
            value: data.products,
            color: "border-green-500",
            icon: Package,
          },
          {
            title: "Users",
            value: data.users,
            color: "border-blue-500",
            icon: Users,
          },
          {
            title: "Sales",
            value: 1200,
            icon: BadgeDollarSign,
            color: "border-red-500",
          },
        ]);
      } catch (error: any) {
        // ❌ DO NOTHING
        // This prevents red overlay
        console.log("Unauthorized access");
      }
    };

    fetchStats();
    fetchGraph();
  }, []);
  return (
    <div className="mt-20">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className={` p-4 sm:p-5 rounded-xl  shadow-sm bg-white dark:bg-neutral-900 dark:${item.color} border-b-4 ${item.color} transition-all duration-300
    hover:shadow-md
    hover:-translate-y-1`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </h2>

                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    As per current records
                  </p>
                </div>

                <Icon className="text-gray-400 dark:text-gray-500 text-2xl sm:text-3xl" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div
          className="
        lg:col-span-2
        bg-white dark:bg-neutral-900
        p-4 sm:p-6
        rounded-xl shadow-sm
        border border-gray-200 dark:border-neutral-700
      "
        >
          <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Daily Users
          </h3>

          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <XAxis dataKey="_id" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      document.documentElement.classList.contains("dark")
                        ? "#171717"
                        : "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  labelStyle={{
                    color: document.documentElement.classList.contains("dark")
                      ? "#e5e7eb"
                      : "#111827",
                  }}
                  itemStyle={{
                    color: "#E6C200",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#E6C200"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="
        bg-white dark:bg-neutral-900
        p-4 sm:p-6
        rounded-xl shadow-sm
        border border-gray-200 dark:border-neutral-700
      "
        >
          <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Last Update
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Total Products</span>
              <span>{stats.find((s) => s.title === "Products")?.value}</span>
            </div>

            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Total Sales</span>
              <span>10.6k</span>
            </div>

            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Total Revenue</span>
              <span>10.6k</span>
            </div>

            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Total Users</span>
              <span>{stats.find((s) => s.title === "Users")?.value}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
