import React from 'react';
import {
    Header,
    Table,
    Toggle
} from '@cloudscape-design/components';

export default function ExtendedPremiumTable({ extendedPremiums, displayPremiumChart, setDisplayPremiumChart }) {
    return (
        <Table
            variant="stacked"
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
    )
}