import React from "react";
import WalletPage from "./Wallet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ví của tôi | EduSmart",
};

const page = () => {
  return <WalletPage />;
};

export default page;
