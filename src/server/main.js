const express = require("express");
const ViteExpress = require("vite-express");
const path = require("path");

const app = express();

app.use(express.json({limit: "200mb"}));
app.use(express.urlencoded({limit: "200mb", extended: true, parameterLimit:50000}));
app.use(express.text({limit:'200mb'}));

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/api", require("./api"));

// backend routes
const server = ViteExpress.listen(app, process.env.PORT||3000, () =>
  console.log("Server is listening on port 3000...")
);