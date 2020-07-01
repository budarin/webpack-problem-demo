import { TGracefullShutdown } from "../../../types/app";

import logger from "../../services/logger";
import onServerClose from "./onServerClose";
import forseServerShutdown from "./forseServerShutdown";

const gracefullShutdown = ({
  app,
  server,
}: TGracefullShutdown): NodeJS.SignalsListener => (
  signal: NodeJS.Signals
): void => {
  if (app.context.isShuttingDown) {
    return;
  }

  app.context.isShuttingDown = true;

  logger.info(`Receive ${signal}`);
  logger.info("Try to stop service...");

  server.close(onServerClose);

  setImmediate(function () {
    server.emit("close");
  }).unref();

  // @ts-ignore
  app.context.db = undefined;

  forseServerShutdown();
};

export default gracefullShutdown;
