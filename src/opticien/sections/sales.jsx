import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker, Select, Card, Divider } from 'antd';
import moment from 'moment';
import './sales.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Sales = () => {
  // Données de démonstration
  const initialData = [
    { date: '2023-01-01', ventes: 1200 },
    { date: '2023-01-02', ventes: 1900 },
    { date: '2023-01-03', ventes: 1500 },
    { date: '2023-01-04', ventes: 2100 },
    { date: '2023-01-05', ventes: 1800 },
    { date: '2023-02-01', ventes: 2200 },
    { date: '2023-02-02', ventes: 1950 },
    { date: '2023-03-01', ventes: 2400 },
    { date: '2023-04-01', ventes: 2600 },
    { date: '2023-05-01', ventes: 2800 },
    { date: '2023-06-01', ventes: 3000 },
    { date: '2023-07-01', ventes: 3200 },
    { date: '2023-08-01', ventes: 2900 },
    { date: '2023-09-01', ventes: 3100 },
    { date: '2023-10-01', ventes: 3300 },
    { date: '2023-11-01', ventes: 3500 },
    { date: '2023-12-01', ventes: 4000 },
  ];

  const [filterType, setFilterType] = useState('jour');
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
  const [chartData, setChartData] = useState(initialData);

  const filterData = (type, range) => {
    let filteredData = [...initialData];
    
    if (range && range[0] && range[1]) {
      filteredData = filteredData.filter(item => {
        const date = moment(item.date);
        return date.isBetween(range[0], range[1], null, '[]');
      });
    }

    const groupedData = {};
    filteredData.forEach(item => {
      const date = moment(item.date);
      let key;
      
      if (type === 'jour') {
        key = date.format('YYYY-MM-DD');
      } else if (type === 'mois') {
        key = date.format('YYYY-MM');
      } else if (type === 'année') {
        key = date.format('YYYY');
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += item.ventes;
    });

    const result = Object.keys(groupedData).map(key => ({
      date: key,
      ventes: groupedData[key]
    }));

    setChartData(result);
  };

  const handleFilterChange = value => {
    setFilterType(value);
    filterData(value, dateRange);
  };

  const handleDateChange = dates => {
    setDateRange(dates);
    filterData(filterType, dates);
  };

  return (
    <div className="sales-container">
      <Card title="Analyse des Ventes" bordered={false}>
        <div className="filters">
          <div className="filter-group">
            <span className="filter-label">Période:</span>
            <RangePicker
              defaultValue={dateRange}
              onChange={handleDateChange}
              className="date-picker"
            />
          </div>
          
          <div className="filter-group">
            <span className="filter-label">Vue par:</span>
            <Select 
              defaultValue="jour" 
              className="type-selector"
              onChange={handleFilterChange}
            >
              <Option value="jour">Jour</Option>
              <Option value="mois">Mois</Option>
              <Option value="année">Année</Option>
            </Select>
          </div>
        </div>

        <Divider className="divider" />

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#666' }}
                tickFormatter={(value) => {
                  if (filterType === 'jour') return moment(value).format('DD MMM');
                  if (filterType === 'mois') return moment(value).format('MMM YYYY');
                  return value;
                }}
              />
              <YAxis tick={{ fill: '#666' }} />
              <Tooltip 
                formatter={(value) => [`${value} DT`, 'Ventes']}
                labelFormatter={(label) => {
                  if (filterType === 'jour') return moment(label).format('DD MMM YYYY');
                  if (filterType === 'mois') return moment(label).format('MMM YYYY');
                  return label;
                }}
              />
              <Legend />
              <Bar dataKey="ventes" fill="#4a6baf" name="Ventes" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Sales;