import React from "react";
import { Card } from "antd";
import Table_orderall from "./table_ordermanager";

const All_order: React.FC = () => {
  return (
    <Card
      style={{
        minHeight: "100vh",
      }}
    >
      <Table_orderall />
    </Card>
  );
};
export default All_order;
