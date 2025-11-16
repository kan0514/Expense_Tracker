// file: src/components/SpendChart.tsx
"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type Transaction = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  createdAt: string;
};

type Props = {
  data: Transaction[];
  width?: number;
  height?: number;
};

const SpendChart: React.FC<Props> = ({ data, width = 600, height = 300 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filter only expenses
    const expenses = data.filter((t) => t.type === "EXPENSE");

    // Aggregate spend per day
    const parseDate = d3.timeParse("%Y-%m-%d");
    const formatDate = d3.timeFormat("%Y-%m-%d");

    const spendByDay = d3.rollup(
      expenses,
      (v) => d3.sum(v, (d) => d.amount),
      (d) => formatDate(new Date(d.createdAt))
    );

    const chartData = Array.from(spendByDay, ([date, total]) => ({
      date: parseDate(date)!,
      total,
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleTime()
      .domain(d3.extent(chartData, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.total)! * 1.1])
      .range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%d %b")));

    // Y Axis
    g.append("g").call(d3.axisLeft(y));

    // Line
    const line = d3
      .line<{ date: Date; total: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.total))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Points
    g.selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.total))
      .attr("r", 4)
      .attr("fill", "#3b82f6")
      .append("title")
      .text((d) => `${d3.timeFormat("%d %b")(d.date)}: ₹${d.total}`);
  }, [data, width, height]);

  return <svg ref={svgRef} className="w-full h-auto" />;
};

export default SpendChart;
