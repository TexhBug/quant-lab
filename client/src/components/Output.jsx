import React from 'react';
import {
    ExpandableSection,
    StatusIndicator,
    Modal
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
    const [apiCall, setApiCall] = useState({
        normal: true,
        extended: true
    });
    const [error, setError] = useState({
        error: null,
        message: null
    })
    const [errorModal, setErrorModal] = useState(false);

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
                    console.log(result);
                    if(response.status === 200) {
                        setPremium(result);
                        console.log("Success:", result);
                    }
                    else{
                        setApiCall((apiCall) => ({
                            ...apiCall,
                            normal: false
                        }));
                        setError((error) => ({
                            ...error,
                            error: result.error,
                            message: result.message
                        }));
                        setErrorModal(true);
                    }
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
                    if(response.status === 200) {
                        setExtendedPremiums(result);
                        console.log("Success:", result);
                    }
                    else {
                        setApiCall((apiCall) => ({
                            ...apiCall,
                            extended: false
                        }));
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            };
            getExtendedPremiums();
        }
    }, [parameters]);

    return (
        <>
            <ExpandableSection headerText="Option Premium & Configurations (in $)" defaultExpanded={true}>
                { (premium) ? <Premiums premium={premium} parameters={parameters}/> : ((!apiCall.noraml) ? 
                    <StatusIndicator type="error">Failed to get Option Premium</StatusIndicator> : 
                    <LoadingData message={"Fetching premium data"}/> 
                )}
            </ExpandableSection>
            <ExpandableSection headerText="View for extended Strike prices" defaultExpanded={true}>
                {(extendedPremiums) ? (
                    (displayPremiumChart) ? 
                    <ExtendedPremiumChart extendedPremiums={extendedPremiums} displayPremiumChart={displayPremiumChart} setDisplayPremiumChart={setDisplayPremiumChart}/>
                    : <ExtendedPremiumTable extendedPremiums={extendedPremiums} displayPremiumChart={displayPremiumChart} setDisplayPremiumChart={setDisplayPremiumChart}/>
                )
                : 
                    ((!apiCall.extended) ? <StatusIndicator type="error">Failed to get Option Premium</StatusIndicator> : <LoadingData message={"Fetching extended premium data"}/>)
                }
            </ExpandableSection>
            <Modal
                onDismiss={() => setErrorModal(false)}
                visible={errorModal}
                header={error.error}
                >
                {error.message}
            </Modal>
        </>
    )
}
