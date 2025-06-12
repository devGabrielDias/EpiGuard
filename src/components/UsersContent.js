import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  User,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Key
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { useSystem } from '../services/SystemContext';

const UsersContent = () => {
  const { user: currentUser } = useAuth();
  const { users, addUser, updateUser, removeUser, toggleUserStatus } = useSystem();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'tecnico',
    password: '',
    confirmPassword: '',
    department: '',
    isActive: true
  });

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (users.some(u => u.email === newUser.email)) {
      alert('Já existe um usuário com este email');
      return;
    }

    const userData = {
      ...newUser,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0
    };

    delete userData.confirmPassword;
    addUser(userData);
    
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'tecnico',
      password: '',
      confirmPassword: '',
      department: '',
      isActive: true
    });
    setShowAddModal(false);
    alert('Usuário adicionado com sucesso!');
  };

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      password: '',
      confirmPassword: ''
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingUser.password && editingUser.password !== editingUser.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    const userData = { ...editingUser };
    if (!userData.password) {
      delete userData.password;
    }
    delete userData.confirmPassword;

    updateUser(userData);
    setEditingUser(null);
    alert('Usuário atualizado com sucesso!');
  };

  const handleRemoveUser = (userId) => {
    if (userId === currentUser.id) {
      alert('Você não pode remover seu próprio usuário');
      return;
    }

    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      removeUser(userId);
      alert('Usuário removido com sucesso!');
    }
  };

  const handleToggleStatus = (userId) => {
    if (userId === currentUser.id) {
      alert('Você não pode desativar seu próprio usuário');
      return;
    }

    toggleUserStatus(userId);
  };

  const getFilteredUsers = () => {
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'tecnico': return 'Técnico';
      case 'supervisor': return 'Supervisor';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'tecnico': return 'bg-blue-100 text-blue-800';
      case 'supervisor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-light rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-green" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">{user.name}</h3>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
            {getRoleLabel(user.role)}
          </span>
          <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green' : 'bg-red-500'}`}></div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {user.phone && (
          <div className="flex items-center space-x-2 text-sm text-muted">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
        )}
        {user.department && (
          <div className="flex items-center space-x-2 text-sm text-muted">
            <Shield className="w-4 h-4" />
            <span>{user.department}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm text-muted">
          <Calendar className="w-4 h-4" />
          <span>Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
        {user.lastLogin && (
          <div className="flex items-center space-x-2 text-sm text-muted">
            <UserCheck className="w-4 h-4" />
            <span>Último login: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleEditUser(user)}
          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Editar</span>
        </button>
        
        <button
          onClick={() => handleToggleStatus(user.id)}
          disabled={user.id === currentUser.id}
          className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            user.isActive
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-green text-white hover:bg-green-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          <span>{user.isActive ? 'Desativar' : 'Ativar'}</span>
        </button>
        
        <button
          onClick={() => handleRemoveUser(user.id)}
          disabled={user.id === currentUser.id}
          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const UserModal = ({ user, isEdit = false, onClose, onSave }) => {
    const [formData, setFormData] = useState(user);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-primary mb-4">
            {isEdit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="Nome completo"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="email@empresa.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Telefone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Departamento</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="Ex: Segurança do Trabalho"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Perfil</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
              >
                <option value="tecnico">Técnico</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {isEdit ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="Senha"
                required={!isEdit}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {isEdit ? 'Confirmar Nova Senha' : 'Confirmar Senha *'}
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="Confirmar senha"
                required={!isEdit || formData.password}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="w-4 h-4 text-green border-gray-300 rounded focus:ring-green"
              />
              <label className="text-sm font-medium text-primary">Usuário ativo</label>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                {isEdit ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Verificar se o usuário atual é admin
  if (currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Acesso Restrito</h3>
          <p className="text-muted">
            Apenas administradores podem gerenciar usuários.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Gerenciamento de Usuários</h2>
          <p className="text-muted">Gerencie usuários e permissões do sistema</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Usuário</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, email ou departamento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          >
            <option value="all">Todos os Perfis</option>
            <option value="admin">Administradores</option>
            <option value="supervisor">Supervisores</option>
            <option value="tecnico">Técnicos</option>
          </select>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{users.length}</p>
              <p className="text-sm text-muted">Total de Usuários</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                {users.filter(u => u.isActive).length}
              </p>
              <p className="text-sm text-muted">Ativos</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                {users.filter(u => u.role === 'admin').length}
              </p>
              <p className="text-sm text-muted">Administradores</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                {users.filter(u => u.role === 'tecnico').length}
              </p>
              <p className="text-sm text-muted">Técnicos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de usuários */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Users className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">
            {searchTerm || roleFilter !== 'all' ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
          </h3>
          <p className="text-muted mb-6">
            {searchTerm || roleFilter !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Adicione usuários para começar a gerenciar o acesso ao sistema'
            }
          </p>
          {!searchTerm && roleFilter === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Adicionar Primeiro Usuário
            </button>
          )}
        </div>
      )}

      {/* Modal de adicionar usuário */}
      {showAddModal && (
        <UserModal
          user={newUser}
          onClose={() => setShowAddModal(false)}
          onSave={(userData) => {
            setNewUser(userData);
            handleAddUser();
          }}
        />
      )}

      {/* Modal de editar usuário */}
      {editingUser && (
        <UserModal
          user={editingUser}
          isEdit={true}
          onClose={() => setEditingUser(null)}
          onSave={(userData) => {
            setEditingUser(userData);
            handleUpdateUser();
          }}
        />
      )}
    </div>
  );
};

export default UsersContent;

