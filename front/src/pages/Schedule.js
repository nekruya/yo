import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../services/schedules';
import './Schedule.css';

const daysOfWeek = [
  'Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'
];

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [formData, setFormData] = useState({
    id: null,
    date: new Date().toISOString().split('T')[0],
    day_of_week: daysOfWeek[0],
    start_time: '',
    end_time: '',
    subject: '',
    teacher: '',
    classroom: '',
    group_name: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['schedules'], queryFn: fetchSchedules });
  const schedules = data?.data || [];

  const createMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules']);
      toast.success('Занятие добавлено');
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules']);
      toast.success('Изменения сохранены');
      setShowModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules']);
      toast.warn('Занятие удалено');
      setShowModal(false);
    },
  });

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      id: null,
      date: new Date().toISOString().split('T')[0],
      day_of_week: selectedDay,
      start_time: '',
      end_time: '',
      subject: '',
      teacher: '',
      classroom: '',
      group_name: ''
    });
    setShowModal(true);
  };

  const openViewModal = (item) => {
    setModalMode('view');
    setFormData(item);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      createMutation.mutate({ ...formData, id: Date.now() });
    } else {
      updateMutation.mutate(formData);
    }
  };

  const handleDeleteAndClose = (id) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Loading schedules...</div>;
  if (error) return <div>Error loading schedules: {error.message}</div>;

  return (
    <div className="schedule-page">
      <h1>Расписание занятий</h1>
      <div className="schedule-controls">
        <div className="days-nav">
          {daysOfWeek.map(day => (
            <button
              key={day}
              className={`day-button ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >{day}</button>
          ))}
        </div>
        <button className="add-btn" onClick={openAddModal}>+ Добавить занятие</button>
      </div>
      <div className="schedule-cards">
        {schedules
          .filter(it => it.day_of_week === selectedDay)
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .map(item => (
            <div key={item.id} className="schedule-card" onClick={() => openViewModal(item)}>
              <div className="schedule-time">{item.start_time} - {item.end_time}</div>
              <h4>{item.subject}</h4>
              <p className="schedule-group">{item.group_name}</p>
            </div>
          ))}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {modalMode === 'view' ? (
              <>
                <h2>Детали занятия</h2>
                <p><strong>Дата:</strong> {formData.date}</p>
                <p><strong>День:</strong> {formData.day_of_week}</p>
                <p><strong>Время:</strong> {formData.start_time} - {formData.end_time}</p>
                <p><strong>Предмет:</strong> {formData.subject}</p>
                <p><strong>Преподаватель:</strong> {formData.teacher}</p>
                <p><strong>Аудитория:</strong> {formData.classroom}</p>
                <p><strong>Группа:</strong> {formData.group_name}</p>
                <div className="modal-buttons">
                  <button onClick={() => setModalMode('edit')}>Редактировать</button>
                  <button onClick={() => handleDeleteAndClose(formData.id)}>Удалить</button>
                  <button onClick={() => setShowModal(false)}>Закрыть</button>
                </div>
              </>
            ) : (
              <>
                <h2>{modalMode === 'add' ? 'Добавить занятие' : 'Редактировать занятие'}</h2>
                <form onSubmit={handleModalSubmit} className="schedule-modal-form">
                  <div className="form-group">
                    <label>Дата:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>День недели:</label>
                    <select name="day_of_week" value={formData.day_of_week} onChange={handleInputChange}>
                      {daysOfWeek.map(day => <option key={day}>{day}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Время начала:</label>
                    <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Время окончания:</label>
                    <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Предмет:</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Преподаватель:</label>
                    <input type="text" name="teacher" value={formData.teacher} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Аудитория:</label>
                    <input type="text" name="classroom" value={formData.classroom} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Группа:</label>
                    <input type="text" name="group_name" value={formData.group_name} onChange={handleInputChange} required />
                  </div>
                  <div className="modal-buttons">
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setShowModal(false)}>Отмена</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;