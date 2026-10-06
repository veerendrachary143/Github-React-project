import { useEffect, useRef } from 'react'
import Highcharts from '../utils/highcharts'
import { escapeHtml } from '../utils/chartUtils'
import { formatDate } from '../utils/dateUtils'

function createChartOptions(data, metric) {
  return {
    chart: { type: 'line', height: 300, spacing: [16, 12, 12, 8], style: { fontFamily: 'DM Sans, sans-serif' } },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      type: 'datetime',
      lineColor: '#e3e9e5',
      tickColor: '#e3e9e5',
      labels: { format: '{value:%b %e}', style: { color: '#63716c', fontSize: '11px' } },
      title: { text: null },
    },
    yAxis: {
      title: { text: null },
      gridLineColor: '#edf1ee',
      labels: { style: { color: '#63716c' } },
      min: 0,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter() {
        const point = this.points?.[0] || this
        return `<b>${formatDate(this.x)}</b><br/><span style="color:${point.color}">●</span> ${escapeHtml(metric)}: <b>${Highcharts.numberFormat(point.y, 0)}</b>`
      },
    },
    plotOptions: { series: { marker: { enabled: false }, lineWidth: 2.5, animation: false } },
    series: [{ name: metric[0].toUpperCase() + metric.slice(1), data, color: '#176b5b' }],
    responsive: { rules: [{ condition: { maxWidth: 520 }, chartOptions: { chart: { height: 270 } } }] },
  }
}

function TotalChangesChart({ data, metric }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const chart = Highcharts.chart(containerRef.current, createChartOptions(data, metric))
    return () => chart.destroy()
  }, [data, metric])

  return <div ref={containerRef} />
}

export default TotalChangesChart
