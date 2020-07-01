import Koa from "koa";

import { IAppState, IAppContext } from "../types/koa";

import initApp from "./utils/appHelpers/initApp";
import runServer from "./utils/appHelpers/runServer";

export const app = new Koa<IAppState, IAppContext>();

const isTest = process.env.NODE_ENV === "test";

initApp(app);

// if (!__PROD__) {
if (false) {
  const serve = require("koa-static");
  app.use(serve("./dist"));
}

!isTest && runServer(app);
