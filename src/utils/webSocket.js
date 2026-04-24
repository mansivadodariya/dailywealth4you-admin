import { getCookie } from "@/service/cookies";
import socketIOClient from "socket.io-client";

const localdata = getCookie("auth_token");

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let socket = null;

if (localdata) {
  socket = socketIOClient(SOCKET_URL, {
    extraHeaders: {
      ["authorization"]: localdata,
      "ngrok-skip-browser-warning": "1234",
    },
  });
}

export const connectSocket = () => {
  if (localdata) {
    socket = socketIOClient(SOCKET_URL, {
      extraHeaders: {
        ["authorization"]: localdata,
        "ngrok-skip-browser-warning": "1234",
      },
    });
  }
};

export const getSocket = () => {
  return socket;
};