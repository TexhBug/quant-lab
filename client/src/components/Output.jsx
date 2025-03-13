import React from 'react';
import {
    ExpandableSection,
    Badge,
    KeyValuePairs,
    Container,
    Header,
    Table,
    LiveRegion,
    Box
} from '@cloudscape-design/components';
import LoadingBar from "@cloudscape-design/chat-components/loading-bar"
import { useEffect, useState } from "react";

export default function ({ parameters }) {
    
    const [premium, setPremium] = useState(null);
    const [extendedPremiums, setExtendedPremiums] = useState(null);

    useEffect(() => {
        if(parameters !== null && parameters.model && parameters.modelTask){
            const model = parameters.model;
            const task = parameters.modelTask;
            setExtendedPremiums(null);
            const reqBody = JSON.stringify(parameters);
            const getPremium = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/volatility/${model}/${task}`, {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: reqBody,
                        mode: "cors"
                    });
                    const result = await response.json();
                    setPremium(result);
                    console.log("Success:", result);
                } catch (error) {
                    console.error("Error:", error);
                }
            };
            getPremium();

            const getExtendedPremiums = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/volatility/${model}/${task}/extended`, {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: reqBody,
                        mode: "cors"
                    });
                    const result = await response.json();
                    setExtendedPremiums(result);
                    console.log("Success:", result);
                } catch (error) {
                    console.error("Error:", error);
                }
            };
            getExtendedPremiums();
        }
    }, [parameters]);

    return (
        premium && (
            <>
            <ExpandableSection headerText="Option Premium & Configurations (in $)" defaultExpanded={true}>
                <Container
                    variant="stacked"
                    header={
                        <Header headingTagOverride="h4">
                            Premiums
                        </Header>
                    }
                >
                    <KeyValuePairs
                        columns={3}
                        items={[
                            {
                                label: "Call Option Premium",
                                value: <Badge color="green">{premium["call"]}</Badge>
                            },
                            {
                                label: "Strike Price",
                                value: <Badge color="grey">{premium["strike_price"]}</Badge>
                            },
                            {
                                label: "Put Option Premium",
                                value: <Badge color="red">{premium["put"]}</Badge>
                            }
                        ]}
                    />
                </Container>
                <Table
                    variant="stacked"
                    header={
                        <Header variant="h4">Configurations</Header>
                    }
                    columnDefinitions={[
                        {
                        id: "parameter",
                        header: "Parameter",
                        cell: item => item.name,
                        isRowHeader: true
                        },
                        {
                        id: "value",
                        header: "Current value",
                        cell: item => item.value
                        }
                    ]}
                    items={Object.entries(parameters).map(([key, value]) => ({
                        name: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
                        value: value
                    }))}
                />
            </ExpandableSection>
            <ExpandableSection headerText="View for extended Strike prices">
                {(extendedPremiums && extendedPremiums) ? 
                    <Table
                        variant="stacked"
                        header={
                            <Header variant="h4">Option Premium</Header>
                        }
                        columnDefinitions={[
                            {
                                id: "call",
                                header: "Call Option Premium",
                                cell: item => item.call,
                            },
                            {
                                id: "strike_price",
                                header: "Strike Price",
                                cell: item => item.strike_price
                            },
                            {
                                id: "put",
                                header: "Put Option Premium",
                                cell: item => item.put
                            }
                        ]}
                        items={extendedPremiums}
                    />
                : 
                    <LiveRegion>
                        <Box
                            margin={{ bottom: "xs", left: "l" }}
                            color="text-body-secondary"
                        >
                            Fetching premium chart
                        </Box>
                        <LoadingBar variant="gen-ai" />
                    </LiveRegion>
                }
            </ExpandableSection>
        </>
        )
    )
}