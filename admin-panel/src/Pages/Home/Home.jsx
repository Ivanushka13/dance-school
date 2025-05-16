import React, {useState, useCallback, useEffect} from "react";
import "./Home.css";
import SideBar from "../../Components/SideBar/SideBar";
import NavBar from "../../Components/NavBar/NavBar";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Snackbar
} from "@mui/material";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { apiRequest } from "../../util/apiService";

const Home = () => {

  const [chartType, setChartType] = useState('line');
  const [dataType, setDataType] = useState('subscriptionProfit');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [interval, setInterval] = useState(30);


  const [showChart, setShowChart] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filteredData, setFilteredData] = useState([]);


  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];


  const formatValue = (value) => {
    return `${value.toLocaleString()} ₽`;
  };

  const handleChartConstruct = async () => {
    try {
      if (!startDate || !endDate) {
        setError("Необходимо выбрать начальную и конечную даты");
        setOpenSnackbar(true);
        return;
      }
      
      const startDateFormatted = startDate.$d.toISOString().split('T')[0];
      const endDateFormatted = endDate.$d.toISOString().split('T')[0];

      const request = {
        date_from: startDateFormatted,
        date_to: endDateFormatted,
        interval_in_days: interval
      };

      const response = await apiRequest({
        method: 'POST',
        url: '/statistics/subscriptions',
        data: request
      });

      if (response && Array.isArray(response)) {
        const chartData = response.map(item => ({
          name: `${item.date_from.substring(5)} - ${item.date_to.substring(5)}`,
          value: item.sum
        }));
        
        setFilteredData(chartData);
        setShowChart(true);
        setError("");
      } else {
        setError("Некорректный формат данных");
        setOpenSnackbar(true);
      }

    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError("Не удалось получить данные для графика");
      setOpenSnackbar(true);
    }
  };

  const getChartTitle = () => {
    switch (dataType) {
      case 'newUsers':
        return 'Новые пользователи';
      case 'totalLessons':
        return 'Количество проведенных занятий';
      case 'teacherLessons':
        return 'Количество занятий преподавателя';
      case 'subscriptionProfit':
        return 'Прибыль по абонементам';
      case 'individualProfit':
        return 'Прибыль по индивидуальным занятиям';
      default:
        return 'Значение';
    }
  };


  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{top: 5, right: 10, left: 10, bottom: 5}}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="name" tick={{fill: '#666'}}/>
              <YAxis tick={{fill: '#666'}} tickFormatter={formatValue}/>
              <Tooltip
                formatter={(value) => [formatValue(value), 'Значение']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Legend wrapperStyle={{fontSize: '12px'}}/>
              <Line
                type="monotone"
                dataKey="value"
                name={getChartTitle()}
                stroke={COLORS[0]}
                strokeWidth={2}
                activeDot={{r: 5}}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{top: 5, right: 10, left: 10, bottom: 5}}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="name" tick={{fill: '#666'}}/>
              <YAxis tick={{fill: '#666'}} tickFormatter={formatValue}/>
              <Tooltip
                formatter={(value) => [formatValue(value), 'Значение']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Legend wrapperStyle={{fontSize: '12px'}}/>
              <Bar
                dataKey="value"
                name={getChartTitle()}
                fill={COLORS[1]}
                animationDuration={1000}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{top: 5, right: 10, left: 10, bottom: 5}}>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                animationDuration={1000}
                dataKey="value"
                nameKey="name"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatValue(value), 'Значение']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Legend wrapperStyle={{fontSize: '12px'}}/>
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };


  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleDataTypeChange = (event) => {
    setDataType(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };


  const getChartIcon = () => {
    switch (chartType) {
      case 'line':
        return <TimelineIcon/>;
      case 'bar':
        return <BarChartIcon/>;
      case 'pie':
        return <PieChartIcon/>;
      default:
        return <BarChartIcon/>;
    }
  };


  const applyFilters = useCallback(() => {

    if (!chartType) {
      setError("Выберите тип графика");
      setOpenSnackbar(true);
      return;
    }

    if (!dataType) {
      setError("Выберите параметр для анализа");
      setOpenSnackbar(true);
      return;
    }

    if (!startDate) {
      setError("Выберите начальную дату");
      setOpenSnackbar(true);
      return;
    }

    if (!endDate) {
      setError("Выберите конечную дату");
      setOpenSnackbar(true);
      return;
    }


    if (startDate && endDate && startDate.isAfter(endDate)) {
      setError("Начальная дата не может быть позже конечной даты");
      setOpenSnackbar(true);
      return;
    }

    handleChartConstruct();
  }, [chartType, dataType, startDate, endDate, interval]);


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="home-list">
      <SideBar/>
      <div className="home-list-container">
        <NavBar/>
        <div className="home-page-content">
          <div className="home-page-main-content">
            <div className="home-page-header">
              <div className="home-header-content">
                <div className="home-header-icon">
                  <DashboardIcon/>
                </div>
                <div className="home-header-text">
                  <h1>Аналитика</h1>
                </div>
              </div>
            </div>

            <Paper elevation={0} className="home-data-grid-wrapper home-chart-wrapper">
              <div className="home-filters-row">
                <div className="home-filter-item">
                  <FormControl fullWidth size="small" sx={{
                    '.MuiOutlinedInput-root': {height: '40px !important'}
                  }}>
                    <InputLabel>Тип графика</InputLabel>
                    <Select
                      value={chartType}
                      onChange={handleChartTypeChange}
                      label="Тип графика"
                    >
                      <MenuItem value="line">Линейный график</MenuItem>
                      <MenuItem value="bar">Гистограмма</MenuItem>
                      {/* <MenuItem value="pie">Круговая диаграмма</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>

                <div className="home-filter-item">
                  <FormControl fullWidth size="small" sx={{
                    '.MuiOutlinedInput-root': {height: '40px !important'}
                  }}>
                    <InputLabel>Параметр</InputLabel>
                    <Select
                      value={dataType}
                      onChange={handleDataTypeChange}
                      label="Параметр"
                    >
                      <MenuItem value="subscriptionProfit">Прибыль по абонементам</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="home-filter-item">
                  <FormControl fullWidth size="small" sx={{
                    '.MuiOutlinedInput-root': {height: '40px !important'}
                  }}>
                    <InputLabel>Интервал</InputLabel>
                    <Select
                      value={interval}
                      onChange={handleIntervalChange}
                      label="Интервал"
                      startAdornment={<DateRangeIcon sx={{ mr: 1, ml: -0.5 }} />}
                    >
                      <MenuItem value={1}>День</MenuItem>
                      <MenuItem value={7}>Неделя</MenuItem>
                      <MenuItem value={30}>Месяц</MenuItem>
                      <MenuItem value={365}>Год</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="home-filter-item">
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                    <DatePicker
                      label="Начальная дата"
                      value={startDate}
                      onChange={handleStartDateChange}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          sx: {
                            '.MuiOutlinedInput-root': {height: '40px !important'}
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <div className="home-filters-row">
                <div className="home-filter-item">
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                    <DatePicker
                      label="Конечная дата"
                      value={endDate}
                      onChange={handleEndDateChange}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          sx: {
                            '.MuiOutlinedInput-root': {height: '40px !important'}
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="home-filter-item"></div>
                <div className="home-filter-item"></div>
                <div className="home-filter-item"></div>
              </div>

              <div className="home-button-container">
                <button
                  onClick={applyFilters}
                  className="home-chart-button"
                >
                  Построить график
                </button>
              </div>

              <div className="home-chart-container" style={{display: showChart ? 'flex' : 'none'}}>
                {showChart && renderChart()}
              </div>

              {!showChart && (
                <div className="home-empty-chart">
                  <Typography variant="body1">
                    Заполните все поля и нажмите "Построить график"
                  </Typography>
                </div>
              )}

              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
              >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{width: '100%'}}>
                  {error}
                </Alert>
              </Snackbar>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;