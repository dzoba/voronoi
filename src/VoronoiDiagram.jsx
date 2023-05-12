import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';

function generateRandomPoints(numPoints, width, height) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push([Math.random() * width, Math.random() * height]);
  }
  return points;
}

const VoronoiDiagram = ({ width, height, numPoints, duration }) => {
  const svgRef = useRef();
  const [points, setPoints] = useState(() => generateRandomPoints(numPoints, width, height));

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const updateVoronoi = () => {
      svg.selectAll('*').remove();

      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, width, height]);

      const polygons = svg
        .append('g')
        .selectAll('path')
        .data(voronoi.cellPolygons())
        .enter()
        .append('path')
        .attr('d', (d) => `M${d.join('L')}Z`)
        .attr('stroke', 'black')
        .attr('fill', 'none');

      const pointCircles = svg
        .append('g')
        .selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', (d) => d[0])
        .attr('cy', (d) => d[1])
        .attr('r', 3)
        .attr('fill', 'red');
    };

    const timer = d3.timer((elapsed) => {
      setPoints((prevPoints) =>
        prevPoints.map(([x, y]) => [
          (x + (Math.random() * 20 - 10) + width) % width,
          (y + (Math.random() * 20 - 10) + height) % height,
        ]),
      );

      updateVoronoi();

      if (elapsed > duration * numPoints) {
        timer.stop();
      }
    }, duration);

    updateVoronoi();

    return () => {
      timer.stop();
    };
  }, [width, height, numPoints, duration]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default VoronoiDiagram;
