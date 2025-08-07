"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartTooltip,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export const description = "An interactive area chart";

const dummyEnrollments = [
  { date: "2024-06-01", enrollments: 10 },
  { date: "2024-06-02", enrollments: 12 },
  { date: "2024-06-03", enrollments: 15 },
  { date: "2024-06-04", enrollments: 13 },
  { date: "2024-06-05", enrollments: 17 },
  { date: "2024-06-06", enrollments: 20 },
  { date: "2024-06-07", enrollments: 22 },
  { date: "2024-06-08", enrollments: 15 },
  { date: "2024-06-09", enrollments: 30 },
  { date: "2024-06-10", enrollments: 35 },
  { date: "2024-06-11", enrollments: 40 },
  { date: "2024-06-12", enrollments: 45 },
  { date: "2024-06-13", enrollments: 20 },
  { date: "2024-06-14", enrollments: 55 },
  { date: "2024-06-15", enrollments: 60 },
  { date: "2024-06-16", enrollments: 35 },
  { date: "2024-06-17", enrollments: 10 },
  { date: "2024-06-18", enrollments: 65 },
  { date: "2024-06-19", enrollments: 30 },
  { date: "2024-06-20", enrollments: 25 },
  { date: "2024-06-21", enrollments: 60 },
  { date: "2024-06-22", enrollments: 45 },
  { date: "2024-06-23", enrollments: 10 },
  { date: "2024-06-24", enrollments: 15 },
  { date: "2024-06-25", enrollments: 19 },
  { date: "2024-06-26", enrollments: 25 },
  { date: "2024-06-27", enrollments: 20 },
  { date: "2024-06-28", enrollments: 25 },
  { date: "2024-06-29", enrollments: 30 },
  { date: "2024-06-30", enrollments: 35 },
];

const chartConfig = {
  enrollments: {
    label: "Enrollements",
    color: `var(--chart-1)`,
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[450px]/card:block">
            Total Enrollments for the last 30 days: 1200
          </span>
          <span className="@[450px]/card:hidden">Last 30 days: 1200</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={dummyEnrollments} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickMargin={8}
              tickLine={false}
              axisLine={false}
              interval={"preserveStart"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={"enrollments"} fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
