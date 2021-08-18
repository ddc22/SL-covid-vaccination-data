import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart, Bar, Tooltip, Legend } from "recharts";
import { Card, Button, Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { css } from "@emotion/css";

const Row = styled.div`
  display: flex;
  border: 1px solid #eee;
`;

const FirstRow = styled.div`
  display: flex;
  border: 1px solid #eee;
`;
const Cell = styled.div`
  display: block;
  border: 1px solid #eee;
  min-width: 100px;
`;

function transformData(data) {
  const headers = data[0];
  //Drop ut column
  const chartData = data
    .slice(1)
    .slice(-20)
    .map((row) => {
      //Date column
      const rowObject = { name: row[1] };
      row.forEach((cell, i) => {
        if (i > 1) {
          rowObject[headers[i]] = cell;
        }
      });
      return rowObject;
    });
  console.log({ data, headers, chartData });

  return chartData;
}

const Table = ({ tableData }) => (
  <>
    <h1>SL Vaccination Table</h1>
    {tableData?.map((line, i) => {
      return i === 0 ? (
        <FirstRow className="rows">
          {line.map((cell, i) => (
            <Cell className="cells">
              {cell.split("_").map((cell, i) => (
                <div className="cells">{cell}</div>
              ))}
            </Cell>
          ))}
        </FirstRow>
      ) : (
        <Row className="rows">
          {line.map((cell, i) => (
            <Cell className="cells">{cell}</Cell>
          ))}
        </Row>
      );
    })}
  </>
);

const Chart2 = ({ chartData }) => {
  return (
    <>
      <h1>SL Vaccination Chart</h1>

      <BarChart
        width={1200}
        height={600}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          name="new covishield dose1"
          dataKey="new_covishield_dose1"
          stackId="a"
          fill="#003f5c"
        />
        <Bar
          name="new covishield dose2"
          dataKey="new_covishield_dose2"
          stackId="a"
          fill="#2f4b7c"
        />
        <Bar
          name="new sinopharm dose1"
          dataKey="new_sinopharm_dose1"
          stackId="a"
          fill="#665191"
        />
        <Bar
          name="new sinopharm dose2"
          dataKey="new_sinopharm_dose2"
          stackId="a"
          fill="#a05195"
        />
        <Bar
          name="new moderna dose1"
          dataKey="new_moderna_dose1"
          stackId="a"
          fill="#d45087"
        />
        <Bar
          name="new moderna dose2"
          dataKey="new_moderna_dose2"
          stackId="a"
          fill="#f95d6a"
        />
        <Bar
          name="new pfizer dose1"
          dataKey="new_pfizer_dose1"
          stackId="a"
          fill="#ff7c43"
        />
        <Bar
          name="new pfizer dose2"
          dataKey="new_pfizer_dose2"
          stackId="a"
          fill="#ffa600"
        />
      </BarChart>
    </>
  );
};
const Chart = ({ chartData }) => (
  <>
    <h1>SL Vaccination Table</h1>
    <LineChart width={1200} height={600} data={chartData}>
      <Line type="monotone" dataKey="new_covishield_dose1" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
    </LineChart>
  </>
);
export default function Vaccinations() {
  const [tableData, setTableData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartVisible, setChartVisible] = useState(true);

  useEffect(() => {
    async function getVacData() {
      const response = await axios.get(
        "https://raw.githubusercontent.com/nuuuwan/covid19/data/covid19.epid.vaxs.latest.tsv"
      );
      let splitData = response.data
        ?.split(/\n/)
        .map((line, i) => line.split(/\t/).map((cell, i) => cell));
      const tdata = transformData(splitData);
      setTableData(splitData);
      setChartData(tdata);
    }
    getVacData();
  }, []);
  return (
    <Container>
      <Button onClick={() => setChartVisible(!chartVisible)}>
        {chartVisible ? "Show Table" : "Show Chart"}
      </Button>
      <Card
        className={css`
          min-width: 1260px !important;
          padding: 25px !important;
          max-height: 700px;
          overflow: hidden;
          overflow: scroll;
        `}
      >
        {chartVisible ? (
          <Chart2 chartData={chartData} />
        ) : (
          <Table tableData={tableData} />
        )}
      </Card>
    </Container>
  );
}
