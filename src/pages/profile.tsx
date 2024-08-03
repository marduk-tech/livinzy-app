import { Button, Form, Input, message } from "antd";

import { useUser } from "../hooks/use-user";

export function ProfilePage() {
  const [form] = Form.useForm();

  const { user, useUpdateUser, refetch } = useUser();

  const updateUserMutation = useUpdateUser();

  const handleSaveChanges = async () => {
    const values = await form.validateFields();

    await updateUserMutation
      .mutateAsync({
        data: values,
        id: user?._id as string,
      })
      .then((data) => {
        message.success("Profile updated");
        refetch();
      })
      .catch((err) => message.error("Failed to update profile"));
  };

  if (user) {
    return (
      <div style={{ maxWidth: 300, margin: "auto", padding: "50px 0" }}>
        <h2>Profile </h2>
        <Form
          form={form}
          layout="vertical"
          initialValues={user}
          onFinish={handleSaveChanges}
        >
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue, resetFields }) => {
              return (
                <>
                  <Form.Item
                    label="Name"
                    name="name"
                    validateTrigger="onSubmit"
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Enter your name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    validateTrigger="onSubmit"
                    rules={[
                      {
                        message: "Invalid email",
                        type: "email",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Enter your name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Phone Number"
                    name="mobile"
                    rules={[
                      {
                        required: true,
                        message: "Please input the phone number",
                      },
                    ]}
                    validateTrigger="onSubmit"
                  >
                    <Input
                      disabled={getFieldValue("mobile")}
                      placeholder="Enter your phone number"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginTop: 20 }}>
                    <Button
                      disabled={
                        getFieldValue("name") !== user.name ||
                        getFieldValue("email") !== user.email
                          ? false
                          : true
                      }
                      type="primary"
                      htmlType="submit"
                      loading={updateUserMutation.isPending}
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>
        </Form>
      </div>
    );
  }
}
