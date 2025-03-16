import React from 'react';
import Select from "@cloudscape-design/components/select";
import { useState } from "react";
import {
    Box,
    FormField,
    Input,
    ExpandableSection,
    Button,
    SpaceBetween,
    Alert,
    Slider,
    Checkbox,
    Popover,
    Icon,
    Flashbar
} from "@cloudscape-design/components";

export default function Inputs( {setParameters, setNavigationOpen} ) {
    const [model, setModel] = useState(null);
    const [modelTask, setModelTask] = useState(null);
    const [parametersOpen, setParametersOpen] = useState(false);
    const [upFactor, setUpFactor] = useState(7);
    const [downFactor, setDownFactor] = useState(3);
    const [stockPrice, setStockPrice] = useState(100);
    const [strikePrice, setStrikePrice] = useState(105);
    const [step, setStep] = useState(5)
    const [rate, setRate] = useState(4.4);
    const [arbitrageallowed, setArbitrageAllowed] = useState(false);
    const [maturityTime, setMaturityTime] = useState(2);
    const [evaluationPeriod, setEvaluationPeriod] = useState(10);
    const [warning, setWarning] = useState([{
        type: "warning",
        content:
          "Extreme parameters may lead to numerical instability and produce unrealistic results",
        dismissible: true,
        dismissLabel: "Dismiss message",
        onDismiss: () => setWarning([]),
        id: "message_1"
    }]);

    return (
        <>  
            <Box margin="xs">
                <ExpandableSection
                    headerText="Configurations"
                    defaultExpanded={true}
                >
                    <Box margin="xs">
                        <FormField label="Model">
                            <Select
                                selectedOption={model}
                                onChange={({ detail }) =>
                                    setModel(detail.selectedOption)
                                }
                                options={[
                                    { label: "Bionomial Option Pricing Model", value: "BOPM" },
                                    { label: "Black-Scholes Model", value: "BSM", disabled: true, disabledReason: "This Model is not yet Prepared" }
                                ]}
                                placeholder="Choose a pricing model"
                                autoFocus
                            />
                        </FormField>
                    </Box>
                    <Box margin="xs">
                        <FormField label="Operation">
                            <Select
                                selectedOption={modelTask}
                                onChange={({ detail }) =>
                                    setModelTask(detail.selectedOption)
                                }
                                options={[
                                    { label: "Option Pricing", value: "OP" },
                                    { label: "Volatility-Price HeatMap", value: "VPH", disabled: true, disabledReason: "This operation is not yet supported" }
                                ]}
                                placeholder="Choose Operation"
                                autoFocus
                            />
                        </FormField>
                    </Box>

                    <Box margin="xs" float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button 
                                variant="normal"
                                onClick={() => {
                                    setModel('');
                                    setModelTask('');
                                    setParametersOpen(false);
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="primary" 
                                disabled={(model && modelTask) ? false : true}
                                onClick={() => {
                                    setParametersOpen(true);
                                }}
                            >
                                Apply
                            </Button>
                        </SpaceBetween>
                    </Box>
                </ExpandableSection>
            </Box>

            <Box margin="xs" padding={{ top: "xxl" }}> 
                <ExpandableSection 
                    headerText="Parameters"
                    variant="footer"
                    defaultExpanded={parametersOpen}>
                    {(!parametersOpen) ? <Alert
                        statusIconAriaLabel="Error"
                        type="error"
                        header="Please select Model and Operation"
                        />: 
                        <>  
                            <Flashbar items={warning} />
                            <Box margin="xs">
                                <FormField label={
                                    <>
                                        Stock Price : ${stockPrice}
                                    </>
                                }>
                                    <Input
                                        onChange={({ detail }) => setStockPrice(detail.value)}
                                        value={stockPrice}
                                        inputMode="decimal"
                                        type="number"
                                        placeholder="Enter current price"
                                        autoFocus
                                    />
                                </FormField>
                            </Box>
                            <Box margin="xs" padding={{ top: "s" }}>
                                <FormField label={
                                    <>
                                        Strike Price : {strikePrice}
                                    </>
                                }>
                                    <Input
                                        onChange={({ detail }) => setStrikePrice(detail.value)}
                                        value={strikePrice}
                                        inputMode="numeric"
                                        type="number"
                                        placeholder="Enter strike price"
                                        autoFocus
                                    />
                                </FormField>
                            </Box>
                            <Box margin="xs" padding={{ top: "s" }}>
                                <FormField label={
                                    <>
                                        Step for Strike Price : {step}
                                    </>
                                }>
                                    <Slider
                                        onChange={({ detail }) => setStep(detail.value)}
                                        value={step}
                                        valueFormatter={step => step}
                                        max={10}
                                        min={1}
                                        step={1}
                                    />
                                </FormField>
                            </Box>
                            <Box margin="xs" padding={{ top: "s" }}>
                                <FormField label={<>Appreciation factor (u) : {(1 + upFactor/100).toFixed(2)}x</>}>
                                    <Slider
                                        onChange={({ detail }) => setUpFactor(detail.value)}
                                        value={upFactor}
                                        valueFormatter={upFactor => upFactor + "%"}
                                        max={100}
                                        min={1}
                                    />
                                </FormField>
                            </Box>
                            <Box margin="xs" padding={{ top: "s" }}>
                                <FormField label={<>Depreciation factor (d) : {(1 - downFactor/100).toFixed(2)}x</>}>
                                    <Slider
                                        onChange={({ detail }) => setDownFactor(detail.value)}
                                        value={downFactor}
                                        valueFormatter={downFactor => downFactor + "%"}
                                        max={100}
                                        min={1}
                                    />
                                </FormField>
                            </Box>
                            <Box margin="xs" padding={{ top: "s" }}>
                                <SpaceBetween direction="horizontal" size='xs'>
                                    <Checkbox
                                        onChange={({ detail }) =>
                                            setArbitrageAllowed(detail.checked)
                                        }
                                        checked={arbitrageallowed}
                                        />
                                        Enable Risk Free Arbitrage <Popover header="WARNING" content={<p>
                                        {"The risk-free interest rate is capped acoording to 0 < d < 1 + r < u to prevent risk-free arbitrage opportunities"}
                                    </p>}><Icon name="security"/></Popover>
                                </SpaceBetween>
                                <FormField label={<>Risk free interest rate (r) : {rate}%</>}>
                                    <Slider
                                        onChange={({ detail }) => setRate(detail.value)}
                                        value={rate}
                                        valueFormatter={rate => rate + "%"}
                                        max={(arbitrageallowed) ? 100 : upFactor-1}
                                        min={0}
                                        step={.1}
                                    />
                                </FormField>
                            </Box>
                            <Box margin="xs" padding={{ top: "s" }}>
                                <FormField label={
                                    <>
                                        Time for maturity (in Years) : {maturityTime}
                                    </>
                                }>
                                    <Input
                                        onChange={({ detail }) => setMaturityTime(detail.value)}
                                        value={maturityTime}
                                        type="number"
                                        inputMode="decimal"
                                        placeholder="Enter maturity time for option"
                                        autoFocus
                                    />
                                </FormField>
                            </Box>
                            <Box margin="xs" padding={{ top: "s" }}>
                                <FormField label={
                                    <>
                                        Number of Evaluation periods : {evaluationPeriod}
                                    </>
                                }>
                                    <Slider
                                        onChange={({ detail }) => setEvaluationPeriod(detail.value)}
                                        value={evaluationPeriod}
                                        valueFormatter={evaluationPeriod => evaluationPeriod}
                                        max={500}
                                        min={0}
                                        step={1}
                                    />
                                </FormField>
                            </Box>
                            <Box margin="xs" float="right">
                                <SpaceBetween direction="horizontal" size="xs">
                                    <Button 
                                        variant="normal"
                                        onClick={() => {
                                            setUpFactor(7);
                                            setDownFactor(3);
                                            setStockPrice(100);
                                            setStrikePrice(105);
                                            setStep(5);
                                            setRate(4.4);
                                            setArbitrageAllowed(false);
                                            setMaturityTime(2);
                                            setEvaluationPeriod(10);
                                            setParameters(null);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="primary" 
                                        disabled={false}
                                        onClick={() => {
                                            setNavigationOpen(false);
                                            setParameters({
                                                model: model["value"],
                                                modelTask: modelTask["value"],
                                                upFactor: (1+upFactor/100).toFixed(2),
                                                downFactor: (1-downFactor/100).toFixed(2),
                                                stockPrice: stockPrice,
                                                strikePrice: strikePrice,
                                                step: step,
                                                riskFreeInterestRate: (rate/100).toFixed(2),
                                                maturityTime: maturityTime,
                                                evaluationPeriod: evaluationPeriod
                                            });
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </SpaceBetween>
                            </Box>
                        </>
                    }
                </ExpandableSection>
            </Box>
        </>
    )
} 