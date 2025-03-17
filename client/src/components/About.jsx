import React from 'react';
import { 
    ExpandableSection
} from '@cloudscape-design/components';

export default function About() {
    return (
       <>
        <ExpandableSection headerText="Black-Scholes Model" defaultExpanded>
            <p>
                The Black-Scholes model is a closed-form solution designed to calculate
                the theoretical price of European call and put options. It assumes 
                that the price of the underlying asset follows a lognormal distribution, 
                meaning it moves in a continuous and smooth manner. The model requires 
                inputs such as the current stock price, strike price, risk-free interest rate, 
                time to expiration, and the volatility of the asset. It provides a formula t
                hat computes the option price in one step, making it efficient and quick. 
                However, the Black-Scholes model has several limitations: it assumes constant 
                volatility and a constant risk-free rate, which are unrealistic in the real 
                world. Additionally, it doesn't work well for American options (which can be 
                exercised before expiration) because it assumes European-style options that 
                can only be exercised at expiration.
            </p>
        </ExpandableSection>
        <ExpandableSection headerText="Bionomial Option Pricing Model" defaultExpanded>
            <p>
                The Binomial option pricing model is a discrete-time model that uses a step-by-step 
                approach to model the price movements of the underlying asset. It divides the life 
                of the option into small intervals and assumes that at each interval, the price can 
                either move up or down by a certain factor. This model is particularly useful for 
                American options because it can accommodate the possibility of early exercise at 
                each step. The Binomial model is more flexible than Black-Scholes, as it can handle 
                changing volatility over time and different types of options. However, it can become 
                computationally expensive and time-consuming, especially when the number of time 
                steps increases. Despite this, it is more versatile and can be used to price both 
                American and European options.
            </p> 
        </ExpandableSection>
       </>
    )
}