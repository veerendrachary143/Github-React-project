import { useEffect, useRef } from 'react'
import Highcharts from '../utils/highcharts'
import { escapeHtml } from '../utils/chartUtils'
import { formatDate } from '../utils/dateUtils'

function createChartOptions(series, metric) {
  return {
    chart: { type: 'line', height: 320, spacing: [16, 12, 12, 8], style: { fontFamily: 'DM Sans, sans-serif' } },
    title: { text: undefined },
    credits: { enabled: false },
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
    legend: { enabled: series.length > 0, align: 'left', itemStyle: { color: '#43514b', fontWeight: '500' } },
    tooltip: {
      shared: false,
      useHTML: true,
      formatter() {
        return `<b>${escapeHtml(this.series.name)}</b><br/>${formatDate(this.x)}<br/><span style="color:${this.color}">●</span> ${escapeHtml(metric)}: <b>${Highcharts.numberFormat(this.y, 0)}</b>`
      },
    },
    plotOptions: { series: { marker: { enabled: false }, lineWidth: 2, animation: false } },
    series,
    responsive: { rules: [{ condition: { maxWidth: 520 }, chartOptions: { chart: { height: 290 }, legend: { itemStyle: { fontSize: '10px' } } } }] },
  }
}

function ContributorChangesChart({ series, metric }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const chart = Highcharts.chart(containerRef.current, createChartOptions(series, metric))
    return () => chart.destroy()
  }, [metric, series])

  return <div ref={containerRef} />
}

export default ContributorChangesChart
