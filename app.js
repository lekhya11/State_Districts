const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "covid19India.db");
const app = express();
app.use(express.json());

let database = null;

const initializeDBandServe = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running .......");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBandServe();

const convertStateTableToResponseObject = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};

const convertDistrictTableToResponseObject = (dbObject) => {
  return {
    districtId: dbObject.district_id,
    districtName: dbObject.district_name,
    stateId: dbObject.state_id,
    cases: dbObject.cases,
    cured: dbObject.cured,
    active: dbObject.active,
    deaths: dbObject.deaths,
  };
};

///API 1 get all state details

app.get("/states/", async (request, response) => {
  const getStateQuery = `
  SELECT
    * 
  FROM 
     state;`;
  const stateArray = await database.all(getStateQuery);
  response.send(
    stateArray.map((eachValue) => convertStateTableToResponseObject(eachValue))
  );
});

////API 2
