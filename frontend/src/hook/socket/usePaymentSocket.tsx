"use client";

import useBaseSocket from "./useBaseSocket";

const usePaymentSocket = () => {
  const socket = useBaseSocket("/payments");

  return socket;
};

export default usePaymentSocket;
