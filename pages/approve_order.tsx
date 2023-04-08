import React from "react";
import { Card } from "antd";
import Order_Table_approve from "./table_approve";
const Approve_order: React.FC = () => {
  return (
    <Card
      style={{
        minHeight: "100vh",
      }}
    >
      <Order_Table_approve />
    </Card>
  );
};
export default Approve_order;
