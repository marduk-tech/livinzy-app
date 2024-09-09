// WIP

import { ProChat } from "@ant-design/pro-chat";
import { Spin } from "antd";
import { useTheme } from "antd-style";
import { useEffect, useState } from "react";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { baseApiUrl } from "../libs/constants";

const AskStreamPage: React.FC = () => {
  const theme = useTheme();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createThread = async () => {
      try {
        const response = await axiosApiInstance.post(
          "/ai/new-thread-assistant"
        );
        setThreadId(response.data.threadId);
        setAssistantId(response.data.assistantId);

        console.log({
          threadId: response.data.threadId,
          assistantId: response.data.assistantId,
        });
      } catch (error) {
        console.error("Error creating thread:", error);
      } finally {
        setIsLoading(false);
      }
    };

    createThread();
  }, []);

  const handleRequest = async (messages: any[]) => {
    if (!threadId || !assistantId) {
      console.error("Thread or Assistant ID not available");
      return { text: "Error: Unable to process request" };
    }

    const userMessage = messages[messages.length - 1].content;

    try {
      const response = await fetch(`${baseApiUrl}ai/ask-assistant-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId,
          threadId,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Return a streaming response
      return {
        text: "",
        streaming: true,
        getStream: async () => {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("ReadableStreamReader is not available");
          }

          return {
            async next() {
              const { done, value } = await reader.read();
              if (done) {
                return { done: true, value: undefined };
              }
              return { done: false, value: new TextDecoder().decode(value) };
            },
          };
        },
      };
    } catch (error) {
      console.error("Error in handleRequest:", error);
      return { text: "Error: Unable to process request" };
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Initializing chat..." />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ height: "90%", width: "100%" }}>
        <ProChat
          locale="en-US"
          helloMessage={"Hi there! I'm Liv. How can I help you?"}
          request={handleRequest}
        />
      </div>
    </div>
  );
};

export default AskStreamPage;
