import express from "express";
import http from "http";
import "dotenv/config";

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
