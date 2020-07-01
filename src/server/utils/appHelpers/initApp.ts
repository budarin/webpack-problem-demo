import Application from "koa";

import { IAppState, IAppContext } from "../../../types/koa";

import logger from "../../services/logger";
import getEnvironments from "./getEnvironments";

const env = getEnvironments();

const initApp = (
  app: Application<IAppState, IAppContext>
): Application<IAppState, IAppContext> => {
  logger.info({ environments: env });

  app.proxy = true;

  return app;
};

export default initApp;
