import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchUsers, deleteUser, updateUser, fetchUserActivities } from '../services/users';
import { fetchRoles } from '../services/roles';
import { fetchMetricsSummary } from '../services/dashboard';
import './Administration.css';

const Administration = () => {
  const history = useHistory();
  const { data: usersRes, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const { data: metricsRes, isLoading: metricsLoading, error: metricsError } = useQuery({ queryKey: ['metrics'], queryFn: fetchMetricsSummary });
  const { data: rolesRes, isLoading: rolesLoading, error: rolesError } = useQuery({ queryKey: ['roles'], queryFn: fetchRoles });

  if (usersLoading || rolesLoading || metricsLoading) return <div>Загрузка данных...</div>;
  if (usersError) return <div>Ошибка загрузки пользователей: {usersError.message}</div>;
  if (rolesError) return <div>Ошибка загрузки ролей: {rolesError.message}</div>;
  if (metricsError) return <div>Ошибка загрузки метрик: {metricsError.message}</div>;

  const users = usersRes.data;
  const roles = rolesRes.data;
  const metrics = metricsRes.data;

  const handleAddUser = () => history.push('/register');

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить пользователя?')) return;
    try {
      await deleteUser(id);
      refetchUsers();
    } catch (err) {
      console.error('Ошибка удаления пользователя', err);
    }
  };

  const handleEdit = async (user) => {
    const newName = window.prompt('Новое полное имя', user.full_name || '');
    if (newName === null) return;
    const roleNames = roles.map(r => r.name).join(', ');
    const newRolesInput = window.prompt(`Роли (через запятую из: ${roleNames})`, user.roles.map(r => r.id).join(','));
    if (newRolesInput === null) return;
    const newRoles = newRolesInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    try {
      await updateUser(user.id, { full_name: newName, roles: newRoles });
      refetchUsers();
    } catch (err) {
      console.error('Ошибка обновления пользователя', err);
    }
  };

  const handleActivity = (user) => {
    history.push(`/users/${user.id}/activities`);
  };

  return (
    <div className="administration-page">
      <h1>Администрирование</h1>
      <div className="dashboard-widgets">
        <div className="widget-card">
          <h3>Пользователи</h3>
          <p>Всего: {metrics.total_users}</p>
          <p>Студентов: {metrics.num_students}</p>
          <p>Преподавателей: {metrics.num_teachers}</p>
        </div>
        <div className="widget-card">
          <h3>Курсы</h3>
          <p>Всего курсов: {metrics.total_courses}</p>
          <p>Файлов: {metrics.total_files}</p>
        </div>
      </div>
      <section className="users-management">
        <h2>Управление пользователями</h2>
        <button className="btn btn-primary" onClick={handleAddUser}>Добавить пользователя</button>
        <ul className="user-list">
          {users.map(user => (
            <li key={user.id} className="user-card">
              <div className="user-info">
                <strong>{user.full_name || user.username}</strong> ({user.username})<br />
                Email: {user.email}<br />
                Активен: {user.is_active ? 'Да' : 'Нет'}<br />
                Роли: {user.roles.map(r => r.name).join(', ')}
              </div>
              <div className="user-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(user)}>Редактировать</button>
                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Удалить</button>
                <button className="btn btn-secondary" onClick={() => handleActivity(user)}>Активность</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Administration;