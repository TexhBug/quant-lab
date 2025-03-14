import React from 'react';
import {
    LiveRegion,
    Box
} from '@cloudscape-design/components';
import LoadingBar from "@cloudscape-design/chat-components/loading-bar"

export default function LoadingData({message}) {
    return (
        <LiveRegion>
            <Box
                margin={{ bottom: "xs", left: "l" }}
                color="text-body-secondary"
            >
                {message}
            </Box>
            <LoadingBar variant="gen-ai" />
        </LiveRegion>
    )
}