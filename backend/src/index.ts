import express from "express";
import http from "http";
import "dotenv/config";
import cors from "cors";

import connectDB from "./config/db.config.js";
import vendorRoutes from "./features/vendor/vendor.routes.js";
import companyRoutes from "./features/company/company.routes.js";
import managerRoutes from "./features/manager/manager.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/manager", managerRoutes);

server.listen(PORT, () => {
  console.log(`🟢 Server is listening at ${PORT}`);
  connectDB();
});
