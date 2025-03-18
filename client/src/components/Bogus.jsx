import React from 'react';
import { Heatmap } from '@ant-design/plots';

const HeatmapChart = () => {
    // Sample data
    const callHeatmap = [
        { x: "A", y: "X", value: 10 },
        { x: "B", y: "Y", value: 20 },
        { x: "C", y: "Z", value: 30 },
        { x: "D", y: "X", value: 15 },
        { x: "E", y: "Y", value: 25 },
        { x: "F", y: "Z", value: 35 },
    ];

    // Heatmap configuration
    const callHeatmapConfig = {
        data: callHeatmap,
        xField: "x", // Field for the x-axis
        yField: "y", // Field for the y-axis
        colorField: "value", // Field for the color intensity
        color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"], // Color gradient
        legend: {
            position: "top", // Legend position
        },
        height: 400, // Chart height
        tooltip: {
            formatter: (data) => {
                return { name: "Price ($)", value: data.value }; // Tooltip content
            },
        },
        xAxis: {
            title: {
                text: "Strike Price", // X-axis title
                style: {
                    fontSize: 14,
                    fontWeight: "bold",
                },
            },
        },
        yAxis: {
            title: {
                text: "Volatility", // Y-axis title
                style: {
                    fontSize: 14,
                    fontWeight: "bold",
                },
            },
        },
        label: {
            formatter: (data) => `${data.value}.`, // Label format (e.g., "10.")
            style: {
                fill: "#000", // Label text color
                fontSize: 10, // Label font size
                fontWeight: "bold", // Label font weight
            },
        },
    };

    return <Heatmap {...callHeatmapConfig} />;
};

export default HeatmapChart;