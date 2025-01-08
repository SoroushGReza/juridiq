import React, { useEffect, useState } from "react";
import axios from "axios";

const TXTViewer = ({ fileUrl }) => {
  const [content, setContent] = useState("Laddar...");

  useEffect(() => {
    const fetchTxt = async () => {
      try {
        const { data } = await axios.get(fileUrl, { responseType: "text" });
        setContent(data);
      } catch (err) {
        setContent("Kunde inte läsa textfilen.");
      }
    };
    fetchTxt();
  }, [fileUrl]);

  return (
    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
      {content}
    </pre>
  );
};

export default TXTViewer;
