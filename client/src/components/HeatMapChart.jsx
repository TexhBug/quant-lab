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
    console.log(callHeatmap);
    console.log(putHeatmap);
    const callHeatmapConfig = {
        data: callHeatmap,
        xField: "x",
        yField: "y",
        colorField: "value",
        legend: {
            position: "top",
        },
        color: ["#e6f7e6", "#b7eb8f", "#73d13d", "#52c41a", "#237804"],
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
        }
    };
    
    const putHeatmapConfig = {
        data: putHeatmap,
        xField: "x",
        yField: "y",
        colorField: "value",
        legend: {
            position: "top",
        },
        color: ["#fff1f0", "#ffccc7", "#ff7875", "#ff4d4f", "#820014"],
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
