'use client';

import React, { useState } from 'react';
import Start from './start';
import Graph from './graph';

interface QueryData {
    query: string;
}

const nullNode: NodeInfo = {
    id: "",
    name: ""
}

export default function Display() {
    const [queryMade, setQueryMade] = useState<boolean>(false);
    const [initialNodeInfo, setInitialNodeInfo] = useState<NodeInfo>(nullNode);

    const handleQuery = (data: QueryData) => {
        // TODO: send req to backend

        const nodeInfo: NodeInfo = {
            id: "1",
            name: data.query
        };

        setInitialNodeInfo(nodeInfo);
        setQueryMade(true);
    };

    return (
        <div className="w-full h-full">
            {!queryMade ? (
                <Start onQuery={handleQuery} />
            ) : (
                <Graph initialNodeInfo={initialNodeInfo} />
            )}
        </div>
    );
}
