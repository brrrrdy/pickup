require("dotenv").config({ path: ".env.local" });

const app = require("./app");

const port = Number(process.env.API_PORT || 4000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
