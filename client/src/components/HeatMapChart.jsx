import React from "react";
import { Heatmap } from "@ant-design/plots";
import {
    Container,
    ExpandableSection,
    StatusIndicator,
    Header
} from "@cloudscape-design/components";

const HeatmapChart = ({ heatMap }) => {
    const [callHeatmap, putHeatmap]  = heatmapData(heatMap);

    const callHeatmapConfig = {
        data: callHeatmap,
        xField: "x",
        yField: "y",
        colorField: "value",
        color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
        legend: {
            position: "top",
        },
        height: 600,
        tooltip: {
            formatter: (data) => {
            return { name: "Price ($)", value: data.value };
            },
        },
        xAxis: {
            title: {
                text: "Strike Price",
                style: {
                    fontSize: 14,
                    fontWeight: "bold",
                },
            },
        },
        yAxis: {
            title: {
                text: "Volatility",
                style: {
                    fontSize: 14,
                    fontWeight: "bold",
                },
            },
        },
        label: {
            formatter: (data) => `${(data.value)}.`,
            style: {
                fill: "#000",
                fontSize: 10,
                fontWeight: "bold"
            },
        }
    };

    const putHeatmapConfig = {
        data: putHeatmap,
        xField: "x",
        yField: "y",
        colorField: "value",
        color: ["#ebedf0", "#fff1f0", "#ff7875", "#ff4d4f", "#820014"],
        legend: {
            position: "top",
        },
        height: 600,
        tooltip: {
            formatter: (data) => {
            return { name: "Price ($)", value: data.value };
            },
        },
        xAxis: {
            title: {
                text: "Strike Price",
                style: {
                    fontSize: 14,
                    fontWeight: "bold",
                },
            },
        },
        yAxis: {
            title: {
                text: "Volatility",
                style: {
                    fontSize: 14,
                    fontWeight: "bold",
                },
            },
        },
        label: {
            formatter: (data) => `${(data.value)}.`,
            style: {
                fill: "#000",
                fontSize: 10,
                fontWeight: "bold"
            },
        }
    };

    return (
        <>
            <ExpandableSection headerText="Heatmap for Call option" defaultExpanded={true}>
                <Container header={<Header>Strike Price vs Volatility</Header>}>
                    {(callHeatmap && callHeatmap.length > 0) ? <Heatmap {...callHeatmapConfig}/> : 
                        <StatusIndicator type="error">Failed to get Heatmap for Call Option</StatusIndicator>
                    }
                </Container>
            </ExpandableSection>
            <ExpandableSection headerText="Heatmap for Put option" defaultExpanded={true}>
                <Container header={<Header>Strike Price vs Volatility</Header>}>
                    {(putHeatmap && putHeatmap.length > 0) ? <Heatmap {...putHeatmapConfig}/> : 
                        <StatusIndicator type="error">Failed to get Heatmap for Put Option</StatusIndicator>
                    }
                </Container>
            </ExpandableSection>
        </>
    );
};

const heatmapData = (heatMap) => {
    const callData = [];
    const putData = [];

    for (const volatility in heatMap) {
        if (heatMap.hasOwnProperty(volatility)) {
        heatMap[volatility].forEach((member) => {
            callData.push({
                y: volatility.toString(),
                x: (member.strike_price).toString(),
                value: member.call
            });
            putData.push({
                y: volatility.toString(),
                x: (member.strike_price).toString(),
                value: member.put
            });
        });
        }
    }

    return [callData, putData];
}

export default HeatmapChart;
