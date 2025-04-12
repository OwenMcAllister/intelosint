import { Handle, Node, NodeProps, Position } from "@xyflow/react";


export default function InformationNode({ data }: NodeProps<Node<Record<string, string>, string>>) {

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div style={{ padding: 10, border: "1px solid black", borderRadius: 5, backgroundColor: "lightblue" }}>
                <div>{data.label}</div>
                <button onClick={() => console.log(`Button clicked on ${data.label}`)}>Click Me</button>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}