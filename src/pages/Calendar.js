// src/pages/Calendar.js
import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import cogoToast from 'cogo-toast';

const locales = {
  'ru-RU': require('date-fns/locale/ru'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const initialEvents = [
  {
    title: 'Встреча с ментором',
    start: new Date(),
    end: new Date(),
    allDay: false,
    description: 'Обсуждение проекта',
  },
];

const Calendar = () => {
  const [myEvents, setMyEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
    allDay: false,
    recurrence: { type: 'none', daysOfWeek: [], until: new Date() },
  });

  const handleSelectSlot = (slotInfo) => {
    setNewEvent({
      ...newEvent,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      description: '',
      allDay: false,
      recurrence: { type: 'none', daysOfWeek: [], until: new Date() },
    });
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setMyEvents(myEvents.map(event => 
        event === selectedEvent ? { ...selectedEvent, ...newEvent } : event
      ));
      cogoToast.success('Событие обновлено');
    } else {
      // Add new or recurring events
      if (newEvent.recurrence.type === 'none') {
        setMyEvents([...myEvents, newEvent]);
        cogoToast.success('Событие добавлено');
      } else {
        const recEvents = generateRecurringEvents(newEvent);
        setMyEvents([...myEvents, ...recEvents]);
        cogoToast.success(`Добавлено ${recEvents.length} повторений`);
      }
    }
    handleCloseModal();
  };

  // Delete existing event
  const handleDeleteEvent = () => {
    setMyEvents(myEvents.filter(event => event !== selectedEvent));
    cogoToast.warn('Событие удалено');
    handleCloseModal();
  };

  // Generate recurring events between start and until
  const generateRecurringEvents = (event) => {
    const { title, description, allDay, recurrence, start, end } = event;
    const occurrences = [];
    const untilDate = new Date(recurrence.until);
    let currentStart = new Date(start);
    let currentEnd = new Date(end);
    while (currentStart <= untilDate) {
      if (
        recurrence.type === 'daily' ||
        (recurrence.type === 'weekly' && recurrence.daysOfWeek.includes(currentStart.getDay()))
      ) {
        occurrences.push({
          title,
          start: new Date(currentStart),
          end: new Date(currentEnd),
          description,
          allDay,
        });
      }
      currentStart.setDate(currentStart.getDate() + 1);
      currentEnd.setDate(currentEnd.getDate() + 1);
    }
    return occurrences;
  };

  return (
    <div className="calendar-page">
      <h1>Календарь</h1>
      <div className="calendar-container">
        <BigCalendar
          localizer={localizer}
          events={myEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          messages={{
            next: 'Следующий',
            previous: 'Предыдущий',
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День',
            agenda: 'Повестка',
            date: 'Дата',
            time: 'Время',
            event: 'Событие',
          }}
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedEvent ? 'Редактировать событие' : 'Добавить событие'}</h2>
            <div className="form-group">
              <label>Название:</label>
              <input
                type="text"
                value={selectedEvent ? selectedEvent.title : newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Описание:</label>
              <textarea
                value={selectedEvent ? selectedEvent.description : newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>На весь день:</label>
              <input
                type="checkbox"
                checked={selectedEvent ? selectedEvent.allDay : newEvent.allDay}
                onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
              />
            </div>
            <div className="form-group">
              <label>Повтор:</label>
              <select
                value={newEvent.recurrence.type}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    recurrence: { ...newEvent.recurrence, type: e.target.value },
                  })
                }
              >
                <option value="none">Нет</option>
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
              </select>
            </div>
            {newEvent.recurrence.type === 'weekly' && (
              <div className="form-group">
                <label>Дни недели:</label>
                {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, idx) => (
                  <label key={idx} style={{ marginRight: '10px' }}>
                    <input
                      type="checkbox"
                      checked={newEvent.recurrence.daysOfWeek.includes(idx)}
                      onChange={(e) => {
                        const days = newEvent.recurrence.daysOfWeek;
                        setNewEvent({
                          ...newEvent,
                          recurrence: {
                            ...newEvent.recurrence,
                            daysOfWeek: e.target.checked
                              ? [...days, idx]
                              : days.filter(d => d !== idx),
                          },
                        });
                      }}
                    />
                    {day}
                  </label>
                ))}
              </div>
            )}
            {newEvent.recurrence.type !== 'none' && (
              <div className="form-group">
                <label>Повторять до:</label>
                <input
                  type="date"
                  value={format(newEvent.recurrence.until, 'yyyy-MM-dd')}
                  onChange={e =>
                    setNewEvent({
                      ...newEvent,
                      recurrence: {
                        ...newEvent.recurrence,
                        until: new Date(e.target.value),
                      },
                    })
                  }
                />
              </div>
            )}
            <div className="modal-buttons">
              <button onClick={handleSaveEvent}>Сохранить</button>
              <button onClick={handleCloseModal}>Отмена</button>
              {selectedEvent && <button onClick={handleDeleteEvent}>Удалить</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
