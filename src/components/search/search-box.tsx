import { SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, InputRef, Spin, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from "react-instantsearch";
import { useDevice } from "../../libs/device";

export function SearchBox(props: UseSearchBoxProps) {
  const { isMobile } = useDevice();
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<InputRef>(null);
  const [loading, setLoading] = useState(false);

  const isSearchStalled = status === "stalled";

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
    refine(newQuery);
  }

  useEffect(() => {
    if (inputValue) {
      setLoading(true);
    }
    const handler = setTimeout(() => {
      setQuery(inputValue);
      setLoading(false);
    }, 1500);

    // Clear the timeout if inputValue changes
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const handleChange = (event: any) => {
    if (event.currentTarget.value.length === 0) {
      setQuery(event.currentTarget.value);
    } else {
      setInputValue(event.currentTarget.value);
    }
  };

  return (
    <Flex
      justify="center"
      style={{
        marginTop: 16,
        padding: `0px ${isMobile ? "20px" : "40px"}`,
        maxWidth: "1200px",
        margin: "auto",
      }}
      vertical
    >
      <Typography.Title level={isMobile ? 3 : 2}>Search</Typography.Title>
      <Form
        action=""
        role="search"
        noValidate
        onFinish={(event) => {
          event.preventDefault();
          event.stopPropagation();

          if (inputRef.current) {
            inputRef.current.blur();
          }
        }}
        onReset={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setQuery("");

          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <Input
          size="small"
          ref={inputRef}
          placeholder="Globe Lights"
          type="search"
          value={inputValue}
          onChange={handleChange}
          autoFocus
          suffix={
            loading ? (
              <Button type="link" htmlType="submit" size="small">
                <Spin size="small" />
              </Button>
            ) : (
              <Button type="link" htmlType="submit" size="small">
                <SearchOutlined />
              </Button>
            )
          }
        />

        {/* <Button
          type="link"
          htmlType="reset"
          hidden={inputValue.length === 0 || isSearchStalled}
        >
          Reset
        </Button> */}
        {isSearchStalled && <Spin tip="Searching…" />}
      </Form>
    </Flex>
  );
}
