import React from 'react';
import {
    LineChart,
    Box,
    Container,
    Header,
    Toggle
} from '@cloudscape-design/components';

export default function ExtendedPremiumChart({ extendedPremiums, displayPremiumChart, setDisplayPremiumChart }) {
    const callPremiums = extendedPremiums.map(obj => ({
        x: obj.strike_price, y: obj.call
    }));
    const putPremiums = extendedPremiums.map(obj => ({
        x: obj.strike_price, y: obj.put
    }));

    const chartBoundary = extendedPremiums.reduce(
        (acc, obj) => {
          const { call, strike_price, put } = obj;
      
          const price = Math.max(call, put); // Max price in each object
          acc.maxPrice = Math.max(acc.maxPrice, price);
          acc.minPrice = Math.min(acc.minPrice, call, put);
      
          acc.maxStrikePrice = Math.max(acc.maxStrikePrice, strike_price);
          acc.minStrikePrice = Math.min(acc.minStrikePrice, strike_price);
      
          return acc;
        },
        {
          maxPrice: -Infinity,
          minPrice: Infinity,
          maxStrikePrice: -Infinity,
          minStrikePrice: Infinity
        }
    );

    return (
        <Container
            header={
                <Header variant="h2" actions={
                    <Toggle
                        onChange={({ detail }) =>
                            setDisplayPremiumChart(detail.checked)
                        }
                        checked={displayPremiumChart}
                    >
                        Enable chart view
                    </Toggle>
                }>
                    Extended Option Premiums
                </Header>
            }
            >
            <LineChart
                series={[
                    {
                        title: "Call Premium",
                        type: "line",
                        data: callPremiums
                    },
                    {
                        title: "Put Premium",
                        type: "line",
                        data: putPremiums
                    }
                ]}
                xDomain={[
                    chartBoundary.minStrikePrice,
                    chartBoundary.maxStrikePrice
                ]}
                yDomain={[
                    chartBoundary.minPrice,
                    chartBoundary.maxPrice
                ]}
                ariaLabel="Multiple data series line chart"
                height={300}
                hideFilter
                xScaleType="linear"
                yScaleType="string"
                xTitle="Strike Price ($)"
                yTitle="Premium ($)"
                empty={
                    <Box textAlign="center" color="inherit">
                        <b>No data available</b>
                        <Box variant="p" color="inherit">
                            There is no data available
                        </Box>
                    </Box>
                }
            />
        </Container>
    )
}