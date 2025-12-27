export const DIAGRAM_TOOL_PROMPT = `
## Math Graph Tool (\`plot-function\`)

Use this tool to render 2D mathematical graphs, geometry, and statistical plots using the \`function-plot\` library.

### 1. Trigger Syntax
To render a graph, output a code block with the language tag \`plot-function\` containing a valid JSON object.

### 2. JSON Configuration Schema

\`\`\`plot-function
{
  "title": "Optional Chart Title",
  "xAxis": {
    "domain": [-10, 10], // [min, max] - REQUIRED: Pre-calculate values, NO "2*PI"
    "label": "x-axis label"
  },
  "yAxis": {
    "domain": [-10, 10], // [min, max]
    "label": "y-axis label"
  },
  "grid": true, // boolean
  "data": [ // Array of FunctionItems
    {
      // --- Type 1: Explicit Function y = f(x) ---
      "fn": "x^2",
      "fnType": "linear", // Optional (default)
      "graphType": "polyline",
      "color": "red",
      "label": "f(x) = x^2"
    },
    {
      // --- Type 2: Implicit Function f(x,y) = 0 ---
      "fn": "x^2 + y^2 - 9",
      "fnType": "implicit",
      "label": "Circle"
    },
    {
      // --- Type 3: Parametric x(t), y(t) ---
      "x": "cos(t)", 
      "y": "sin(t)",
      "fnType": "parametric",
      "graphType": "polyline",
      "range": [0, 6.28], // Range for 't'
      "label": "Parametric"
    },
    {
      // --- Type 4: Scatter Plot / Points ---
      "points": [[1, 1], [2, 4], [3, 9]],
      "fnType": "points",
      "graphType": "scatter",
      "color": "blue"
    },
    {
      // --- Type 5: Vector ---
      "vector": [2, 3], // [x, y] magnitude
      "offset": [1, 1], // [x, y] origin point (optional)
      "fnType": "vector",
      "graphType": "polyline",
      "color": "green"
    }
  ]
}
\`\`\`

### 3. Critical Rules
1.  **NO Arithmetic in JSON**: You must calculate all numbers before outputting JSON.
    *   ❌ \`"domain": [-2*PI, 2*PI]\`
    *   ✅ \`"domain": [-6.28, 6.28]\`
2.  **Valid JSON**: No trailing commas, use double quotes for keys.
3.  **Functions**: Use standard math syntax (e.g., \`sin(x)\`, \`exp(x)\`, \`x^2\`).

### 4. Examples

#### Example: Calculus (Area under curve)
\`\`\`plot-function
{
  "title": "Integration of sin(x)",
  "xAxis": { "domain": [-0.5, 3.5], "label": "x" },
  "yAxis": { "domain": [-0.5, 1.5], "label": "y" },
  "data": [
    {
      "fn": "sin(x)",
      "label": "sin(x)",
      "color": "#2563eb"
    },
    {
      "fn": "sin(x)",
      "range": [0, 3.14],
      "closed": true,
      "color": "rgba(37, 99, 235, 0.2)",
      "label": "Area"
    }
  ]
}
\`\`\`

#### Example: Linear Algebra (Vectors)
\`\`\`plot-function
{
  "title": "Vector Addition",
  "xAxis": { "domain": [0, 5] },
  "yAxis": { "domain": [0, 5] },
  "grid": true,
  "data": [
    { "vector": [2, 1], "label": "v1", "color": "red", "fnType": "vector", "graphType": "polyline" },
    { "vector": [1, 3], "offset": [2, 1], "label": "v2", "color": "blue", "fnType": "vector", "graphType": "polyline" },
    { "vector": [3, 4], "label": "v1+v2", "color": "purple", "fnType": "vector", "graphType": "polyline" }
  ]
}
\`\`\`
`;
