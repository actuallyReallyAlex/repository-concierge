import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

import config from "../webpack.config";

const compileInstance = webpack(config);

const compiler = webpackDevMiddleware(compileInstance, {
  serverSideRender: true,
});

export default compiler;
