import React from 'react';
import {
    Badge,
    KeyValuePairs,
    Container,
    Header,
    Table,
} from '@cloudscape-design/components';

export default function Premiums({premium, parameters}) {
    return (
        <>
            <Container
                variant="stacked"
                header={
                    <Header headingTagOverride="h4">
                        Premium for Call and Put Option
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
        </>
    )
}