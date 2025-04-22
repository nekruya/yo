import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ScheduleManager = () => {
    const [classes, setClasses] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [formData, setFormData] = useState({
        day_of_week: 'Понедельник',
        start_time: '',
        end_time: '',
        subject: '',
        teacher: '',
        classroom: '',
        group_name: ''
    });

    const API_URL = 'http://localhost:8000/classes/';

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Error loading schedule:', error);
            alert('Ошибка при загрузке расписания');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({
                    day_of_week: 'Понедельник',
                    start_time: '',
                    end_time: '',
                    subject: '',
                    teacher: '',
                    classroom: '',
                    group_name: ''
                });
                loadSchedule();
            } else {
                alert('Ошибка при добавлении занятия');
            }
        } catch (error) {
            console.error('Error adding class:', error);
            alert('Произошла ошибка при добавлении занятия');
        }
    };

    const handleEdit = (classData) => {
        setEditingClass(classData);
        setShowEditModal(true);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`${API_URL}${editingClass.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingClass)
            });

            if (response.ok) {
                setShowEditModal(false);
                loadSchedule();
            } else {
                alert('Ошибка при сохранении изменений');
            }
        } catch (error) {
            console.error('Error updating class:', error);
            alert('Произошла ошибка при сохранении изменений');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить это занятие?')) {
            try {
                const response = await fetch(`${API_URL}${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    loadSchedule();
                } else {
                    alert('Ошибка при удалении занятия');
                }
            } catch (error) {
                console.error('Error deleting class:', error);
                alert('Произошла ошибка при удалении занятия');
            }
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Управление расписанием</h1>

            <Card className="mb-4">
                <Card.Header>
                    <h5>Добавить новое занятие</h5>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <Form.Label>День недели</Form.Label>
                                <Form.Select
                                    name="day_of_week"
                                    value={formData.day_of_week}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Понедельник">Понедельник</option>
                                    <option value="Вторник">Вторник</option>
                                    <option value="Среда">Среда</option>
                                    <option value="Четверг">Четверг</option>
                                    <option value="Пятница">Пятница</option>
                                    <option value="Суббота">Суббота</option>
                                </Form.Select>
                            </div>
                            <div className="col-md-2 mb-3">
                                <Form.Label>Время начала</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-2 mb-3">
                                <Form.Label>Время окончания</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <Form.Label>Предмет</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-2 mb-3">
                                <Form.Label>Преподаватель</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="teacher"
                                    value={formData.teacher}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <Form.Label>Аудитория</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="classroom"
                                    value={formData.classroom}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <Form.Label>Группа</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="group_name"
                                    value={formData.group_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3 d-flex align-items-end">
                                <Button type="submit" variant="primary">
                                    Добавить занятие
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>
                    <h5>Расписание занятий</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive striped>
                        <thead>
                            <tr>
                                <th>День недели</th>
                                <th>Время</th>
                                <th>Предмет</th>
                                <th>Преподаватель</th>
                                <th>Аудитория</th>
                                <th>Группа</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map(cls => (
                                <tr key={cls.id}>
                                    <td>{cls.day_of_week}</td>
                                    <td>{cls.start_time} - {cls.end_time}</td>
                                    <td>{cls.subject}</td>
                                    <td>{cls.teacher}</td>
                                    <td>{cls.classroom}</td>
                                    <td>{cls.group_name}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEdit(cls)}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(cls.id)}
                                        >
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать занятие</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>День недели</Form.Label>
                            <Form.Select
                                value={editingClass?.day_of_week}
                                onChange={(e) => setEditingClass({...editingClass, day_of_week: e.target.value})}
                            >
                                <option value="Понедельник">Понедельник</option>
                                <option value="Вторник">Вторник</option>
                                <option value="Среда">Среда</option>
                                <option value="Четверг">Четверг</option>
                                <option value="Пятница">Пятница</option>
                                <option value="Суббота">Суббота</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Время начала</Form.Label>
                            <Form.Control
                                type="time"
                                value={editingClass?.start_time}
                                onChange={(e) => setEditingClass({...editingClass, start_time: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Время окончания</Form.Label>
                            <Form.Control
                                type="time"
                                value={editingClass?.end_time}
                                onChange={(e) => setEditingClass({...editingClass, end_time: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Предмет</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingClass?.subject}
                                onChange={(e) => setEditingClass({...editingClass, subject: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Преподаватель</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingClass?.teacher}
                                onChange={(e) => setEditingClass({...editingClass, teacher: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Аудитория</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingClass?.classroom}
                                onChange={(e) => setEditingClass({...editingClass, classroom: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Группа</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingClass?.group_name}
                                onChange={(e) => setEditingClass({...editingClass, group_name: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ScheduleManager; 