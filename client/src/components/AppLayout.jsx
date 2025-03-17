import React from 'react';
import {useState} from "react";
import {
  AppLayout,
  SideNavigation,
  Header,
  SpaceBetween,
  ContentLayout,
} from '@cloudscape-design/components';
import Inputs from './Inputs';
import About from './About';
import Output from './Output';
import OutputHeatmap from './OutputHeatmap';

export default function AppLayoutPreview() {
    const [navigationOpen, setNavigationOpen] = useState(true);
    const [parameters, setParameters] = useState(null);

  return (
      <AppLayout
        navigationOpen={navigationOpen}
        onNavigationChange={({detail}) => setNavigationOpen(detail.open)}
        navigation={
          <>
            <SideNavigation
            header={{text: <Header>Input Panel</Header>}}
            />
            <Inputs setParameters={setParameters} setNavigationOpen={setNavigationOpen}/>
          </>
        }
        content={
          <ContentLayout
              header={
                  <SpaceBetween size="m">
                  <Header
                      variant="h1"
                      description=
                      "This app allows users to calculate option premiums for different strike prices using various pricing models and generate heatmaps to visualize price fluctuations based on volatility."
                  >
                      Quant Lab
                  </Header>
                  </SpaceBetween>
              }
          >
              {(parameters) ? displayOutput(parameters) : <About/> }
          </ContentLayout>
        }
        toolsHide={true} 
      />
  );
}

const displayOutput = (parameters) => {
  const task = parameters.modelTask;
    switch(task){
      case "OP":
        return <Output parameters={parameters}/>
      case "VPH":
        return <OutputHeatmap parameters={parameters}/>
      default:
        return null
    }
}