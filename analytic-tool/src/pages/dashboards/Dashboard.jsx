import { Card, Paper, CardActions, Button, CardContent, Grid2 as Grid, Typography, Divider, CardMedia } from "@mui/material"
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import React, { useState } from "react"
import { Route, Routes } from "react-router";

import { ChartContainer } from '@mui/x-charts/ChartContainer';
import {
    LinePlot,
    MarkPlot,
    lineElementClasses,
    markElementClasses,
} from '@mui/x-charts/LineChart';

const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];


function MediaCard(props) {
    return (
      <Card>
        <CardMedia
          sx={{ height: props.height || 345 }}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="green iguana">{props.children}</CardMedia>
        <CardContent>
            
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    );
  }


function ChartCard(props) {
    return (
        <ChartContainer
            width={300}
            height={200}
            series={[{ type: 'line', data: pData }]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            sx={{
                [`& .${lineElementClasses.root}`]: {
                    stroke: '#8884d8',
                    strokeWidth: 7
                },
                [`& .${markElementClasses.root}`]: {
                    stroke: '#8884d8',
                    scale: '0.2',
                    fill: '#fff',
                    strokeWidth: 4,
                },
            }}
            disableAxisListener
        >
            {props.children}
        </ChartContainer>
    );
}

const SimpleDashboard = () => {
    return (
        <React.Fragment>
            <Grid container size={12} display={"flex"} justifyContent="space-around">
                <Grid spacing={3} size={3}>
                    <MediaCard height={150}>
                        <ChartCard>
                            <LinePlot />
                        </ChartCard>
                    </MediaCard>
                </Grid>
                <Grid spacing={3} size={3}>
                    <MediaCard  height={150}>
                        <ChartCard>
                            <LinePlot />
                        </ChartCard>
                    </MediaCard>
                </Grid>
                <Grid spacing={3} size={3}>
                    <MediaCard height={150}>
                        <ChartCard>
                            <LinePlot />
                        </ChartCard>
                    </MediaCard>
                </Grid>
            </Grid>

            <Grid marginTop={5} container size={12} display={"flex"} justifyContent="space-around">
                <Grid spacing={3} size={3}>
                    <Paper variant="success">
                        <MediaCard>
                            <LineChart
                                series={[
                                    { data: pData, label: 'pv' },
                                    { data: uData, label: 'uv' },
                                ]}
                                xAxis={[{ scaleType: 'point', data: xLabels }]}
                            />
                        </MediaCard>

                    </Paper>
                </Grid>
                <Grid spacing={3} size={3}>
                    <MediaCard>
                        <BarChart

                            series={[
                                { data: pData, label: 'pv', stack: 'stack1' },
                                { data: uData, label: 'uv', stack: 'stack1' },
                            ]}
                            xAxis={[{ data: xLabels, scaleType: 'band' }]}
                        />
                    </MediaCard>
                </Grid>
                <Grid spacing={3} size={3}>
                    <MediaCard>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { value: 5, label: 'A' },
                                        { value: 10, label: 'B' },
                                        { value: 15, label: 'C' },
                                        { value: 20, label: 'D' },
                                    ],
                                    innerRadius: 30,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: -7,
                                    startAngle: -90,
                                    endAngle: 180,
                                }
                            ]}
                        />
                    </MediaCard>
                </Grid>
            </Grid>
            <Grid container size={12} display={"flex"} justifyContent="space-around">
                <Grid spacing={3} size={6}>
                        <MediaCard>
                            <LineChart

                                height={300}
                                series={[
                                    { data: pData, label: 'pv' },
                                    { data: uData, label: 'uv' },
                                ]}
                                xAxis={[{ scaleType: 'point', data: xLabels }]}
                            />
                        </MediaCard>

                </Grid>
                <Grid spacing={3} size={6}>
                    <MediaCard>
                        <BarChart

                            series={[
                                { data: pData, label: 'pv', stack: 'stack1' },
                                { data: uData, label: 'uv', stack: 'stack1' },
                            ]}
                            xAxis={[{ data: xLabels, scaleType: 'band' }]}
                        />
                    </MediaCard>
                </Grid>
            </Grid>
        </React.Fragment>



    )
}

export default function DashboardTemplate() {
    return (
        <Routes>
            <Route path="dashboard" element={<SimpleDashboard />}></Route>
        </Routes>
    )
}