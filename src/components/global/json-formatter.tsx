"use client";

import { useState, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Prism } from "prism-react-renderer";
(typeof global !== "undefined" ? global : window).Prism = Prism;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JsonFormatterProps {
  jsonString: string;
}

export default function JsonFormatter({
  jsonString = '{\n "diwaliTheme":"true"\n}',
}: JsonFormatterProps) {
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonString);
      setFormattedJson(JSON.stringify(parsedJson, null, 2));
      setError(null);
    } catch (err) {
      setError("Invalid JSON string");
      setFormattedJson("");
    }
  }, [jsonString]);

  if (error) {
    return <p>No Rules found</p>;
  }

  return (
    <Highlight theme={themes.duotoneDark} code={formattedJson} language="json">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} overflow-auto rounded p-4`} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
