import React from 'react';
import {
    StatusIndicator,
    Modal
} from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import HeatmapChart from './HeatMapChart';
import LoadingData from './LoadingData';

export default function OutputHeatmap ({parameters}) {
    const API_BASE_URL = "https://quant-lab.onrender.com";
    const [heatMap, setHeatMap] = useState(null);
    const [apiCall, setApiCall] = useState(null);
    const [error, setError] = useState({
        error: null,
        message: null
    })
    const [errorModal, setErrorModal] = useState(false);
    useEffect(() => {
        if(parameters !== null && parameters.model && parameters.modelTask){
            const model = parameters.model;
            const task = parameters.modelTask;
            setHeatMap(null);
            const reqBody = JSON.stringify(parameters);
            const getHeatmap = async () => {
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
                    if(response.status === 200) {
                        setHeatMap(result);
                        setApiCall(true);
                    }
                    else{
                        setApiCall(false);
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
            getHeatmap();
        }
    }, [parameters]);
    return(
        <>
        {(heatMap !== null) ? <HeatmapChart heatMap={heatMap}/> : ((apiCall !== null && apiCall === false) ? 
            <StatusIndicator type="error">Failed to get Heatmap for options</StatusIndicator> : 
            <LoadingData message={"Fetching Heatmap for options (Call & Put) : Could take 30 - 50 sec if instance is asleep"}/>
        )}
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