import { SendOutlined } from "@ant-design/icons";
import { ProChat, useProChat } from "@ant-design/pro-chat";
import { Button, Spin } from "antd";
import { useTheme } from "antd-style";
import { useEffect, useState } from "react";
import { axiosApiInstance } from "../libs/axios-api-Instance";

const AskPage: React.FC = () => {
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
      } catch (error) {
        console.error("Error creating thread:", error);
      } finally {
        setIsLoading(false);
      }
    };

    createThread();
  }, []);

  const handleRequest = async (messages: any[]) => {
    try {
      const response = await axiosApiInstance.post("/ai/ask-assistant", {
        assistantId,
        threadId,
        message: messages[messages.length - 1].content,
      });

      const assistantResponse = response.data.response;
      const lastAssistantMessage = assistantResponse
        .filter((msg: any) => msg.role === "assistant")
        .pop();

      if (
        lastAssistantMessage &&
        lastAssistantMessage.content[0].type === "text"
      ) {
        const content = lastAssistantMessage.content[0].text.value;
        return content.replace(/【[^】]*】/g, "");
      } else {
        return "No response from assistant.";
      }
    } catch (error) {
      console.error("Error in chat request:", error);
      return "Uh Oh! Try again later";
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: theme.colorBgLayout,
      }}
    >
      <div
        style={{
          height: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ height: "90%", width: "100%" }}>
          <ProChat
            actions={{
              render: (defaultDoms) => {
                return [];
              },
            }}
            locale="en-US"
            helloMessage={"Hi there! I'm Liv. How can I help you?"}
            request={handleRequest}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AskPage;
