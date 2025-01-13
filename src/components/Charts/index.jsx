import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";

export const BarChart = ({ data, options }) => {
  return <Bar data={data} options={options} />;
};

export const LineChart = ({ data, options }) => {
  return <Line data={data} options={options} />;
};

export const PieChart = ({ data, options }) => {
  return <Pie data={data} options={options} />;
};
