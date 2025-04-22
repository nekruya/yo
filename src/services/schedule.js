// src/services/schedule.js

// получить сохраненные записи расписания или инициализировать пустой массив
export const getSchedules = () => {
  const schedules = localStorage.getItem('schedules');
  return schedules ? JSON.parse(schedules) : [];
};

// сохранить записи расписания в localStorage
export const saveSchedules = (newSchedules) => {
  localStorage.setItem('schedules', JSON.stringify(newSchedules));
}; 