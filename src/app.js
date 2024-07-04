import express from "express";
import { viewsPath, publicPath, hbs } from "./utils.js";
import { dashboardProductsRouter } from "./routes/dashboardProductsRouter.js";
import { homeRouter } from "./routes/homeRouters.js";
import cartsRouterM from "./routes/cartsRouter.js";
import { Server } from "socket.io";
import { messagesRouter } from "./routes/messagesRouters.js";
import { socketConnection } from "./connection/handleSockets.js";
import { messagesConnection } from "./connection/messagesSockets.js";
import cartsRouterApiM from "./routes/api/cartsRouterApi.js";
import { productsRouterApi } from "./routes/api/productsRoutersApi.js";
import { mongoServer } from "./config/database.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import sessionsApiRouter from "./routes/api/sessionsRoutersApi.js";
import registerRouter from "./routes/registerRouters.js";
import sessionsRouter from "./routes/sessionsRouters.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(
  PORT,
  console.log(`Server running on port: http://localhost:${PORT}/products`)
);
const socketServer = new Server(httpServer);

app.set("views", viewsPath);
app.enable("view cache");
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongoServer,
    }),
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// APIs

app.use("/api/sessions", sessionsApiRouter);
app.use("/api/carts", cartsRouterApiM);
app.use("/api/products", productsRouterApi);

// Views
app.use("/carts", cartsRouterM);
app.use("/dashBoardProducts", dashboardProductsRouter);
app.use("/messages", messagesRouter);
app.use("/products", homeRouter);
app.use("/", registerRouter);
app.use("/sessions", sessionsRouter);




socketConnection(socketServer);
messagesConnection(socketServer);
