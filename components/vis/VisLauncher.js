// VisualizationLauncher.js
import React from "react";
import ReactDOM from "react-dom";
import TransformationVisualization from "./TransformationVisualization";

export default function VisualizationLauncher({ snapshots }) {
    const openVisualization = () => {
        // Open a new window
        const visWindow = window.open("", "Visualization", "width=1000,height=700");
        visWindow.document.write(`
      <html>
        <head>
          <title>Decision Machine Visualization</title>
          <style>
            body { margin: 0; font-family: sans-serif; }
          </style>
        </head>
        <body>
          <div id="vis-root"></div>
        </body>
      </html>
    `);
        visWindow.document.close();

        // Render the visualization after a short delay
        setTimeout(() => {
            ReactDOM.render(
                <TransformationVisualization snapshots={snapshots} />,
                visWindow.document.getElementById("vis-root")
            );
        }, 100);
    };

    return (
        <button onClick={openVisualization}>
            Open Decision Machine Visualization
        </button>
    );
}