const express = require("express");
const app = express();
const port = 3000;

const postsRouter = require("./routers/posts");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.static("public"));
app.use(express.json());

app.use("/posts", postsRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server avviato sulla porta ${port}`);
});
