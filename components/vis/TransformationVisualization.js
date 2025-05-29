// TransformationVisualization.js
import React, { useEffect, useState, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import ReactJson from "react-json-view";

// Register dagre layout for directed graphs
cytoscape.use(dagre);

export default function TransformationVisualization({ snapshots }) {
    const [elements, setElements] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const cyRef = useRef(null);

    useEffect(() => {
        // Create nodes from the snapshots
        const nodes = snapshots.map((snap, idx) => ({
            data: { id: snap.id, label: snap.label, details: snap.data },
        }));

        // Create edges connecting the snapshots in order
        const edges = [];
        for (let i = 0; i < snapshots.length - 1; i++) {
            edges.push({
                data: { source: snapshots[i].id, target: snapshots[i + 1].id },
            });
        }

        setElements([...nodes, ...edges]);
    }, [snapshots]);

    // Set up click listener on nodes
    useEffect(() => {
        if (!cyRef.current) return;
        const cy = cyRef.current;
        cy.on("tap", "node", (evt) => {
            const nodeData = evt.target.data();
            setSelectedDetails(nodeData.details);
        });
    }, [elements]);

    return (
        <div style={{ display: "flex", height: "600px" }}>
            <div style={{ width: "65%" }}>
                <CytoscapeComponent
                    elements={elements}
                    layout={{ name: "dagre", rankDir: "LR", padding: 50 }}
                    style={{ width: "100%", height: "600px" }}
                    cy={(cyInstance) => {
                        cyRef.current = cyInstance;
                    }}
                    stylesheet={[
                        {
                            selector: "node",
                            style: {
                                "background-color": "#0074D9",
                                label: "data(label)",
                                "text-valign": "center",
                                "text-halign": "center",
                                color: "#fff",
                                "text-outline-width": 2,
                                "text-outline-color": "#0074D9",
                                padding: "10px",
                            },
                        },
                        {
                            selector: "edge",
                            style: {
                                width: 2,
                                "line-color": "#ccc",
                                "target-arrow-color": "#ccc",
                                "target-arrow-shape": "triangle",
                                "curve-style": "bezier",
                            },
                        },
                    ]}
                />
            </div>
            <div
                style={{
                    width: "35%",
                    padding: "10px",
                    overflow: "auto",
                    background: "#f8f8f8",
                }}
            >
                <h4>Details</h4>
                {selectedDetails ? (
                    <ReactJson src={selectedDetails} collapsed={2} />
                ) : (
                    <p>Click on a node to view its details.</p>
                )}
            </div>
        </div>
    );
}