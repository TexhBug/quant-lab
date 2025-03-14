import React from 'react';
import {
    ExpandableSection,
} from '@cloudscape-design/components';
import { useEffect, useState } from "react";
import ExtendedPremiumTable from './ExtendedPremiumTable';
import ExtendedPremiumChart from './ExtendedPremiumChart';
import LoadingData from './LoadingData';
import Premiums from './Premiums';

export default function ({ parameters }) {
    const API_BASE_URL = "https://quant-lab.onrender.com";
    const [premium, setPremium] = useState(null);
    const [extendedPremiums, setExtendedPremiums] = useState(null);
    const [displayPremiumChart, setDisplayPremiumChart] = useState(false);

    useEffect(() => {
        if(parameters !== null && parameters.model && parameters.modelTask){
            const model = parameters.model;
            const task = parameters.modelTask;
            setPremium(null);
            setExtendedPremiums(null);
            const reqBody = JSON.stringify(parameters);
            const getPremium = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/volatility/${model}/${task}`, {
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
                    const response = await fetch(`${API_BASE_URL}/api/volatility/${model}/${task}/extended`, {
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
                <Premiums premium={premium} parameters={parameters}/>
            </ExpandableSection>
            <ExpandableSection headerText="View for extended Strike prices" defaultExpanded={true}>
                {(extendedPremiums && extendedPremiums) ? (
                    (displayPremiumChart) ? 
                    <ExtendedPremiumChart extendedPremiums={extendedPremiums} displayPremiumChart={displayPremiumChart} setDisplayPremiumChart={setDisplayPremiumChart}/>
                    : <ExtendedPremiumTable extendedPremiums={extendedPremiums} displayPremiumChart={displayPremiumChart} setDisplayPremiumChart={setDisplayPremiumChart}/>
                )
                : 
                    <LoadingData message={"Fetching premium chart"}/>
                }
            </ExpandableSection>
        </>
        )
    )
}
