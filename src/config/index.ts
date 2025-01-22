import dotenv from "dotenv";
dotenv.config();

const config = {
  ARC_SITE: process.env["ARC_SITE"] || "",
  ENV: process.env["NODE_ENV"] || "dev",
  API_TOKEN_ELCOMERCIO: process.env["API_TOKEN_ELCOMERCIO"] || "",
  API_TOKEN_GESTION: process.env["API_TOKEN_GESTION"] || "",
  API_TOKEN_TROME: process.env["API_TOKEN_TROME"] || "",
  API_TOKEN_DEPOR: process.env["API_TOKEN_DEPOR"] || "",
  API_TOKEN_PERU21: process.env["API_TOKEN_PERU21"] || "",
  API_TOKEN_PERUQUIOSCO: process.env["API_TOKEN_PERUQUIOSCO"] || "",
};

export default config;
