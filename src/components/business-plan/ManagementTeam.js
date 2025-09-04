import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  User, 
  Crown, 
  Briefcase, 
  GraduationCap, 
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Award,
  Target,
  Calendar,
  Building,
  UserCheck,
  Star,
  ChefHat
} from 'lucide-react';

const ManagementTeam = () => {
  const { state, actions } = useApp();
  const data = state.businessPlan.managementTeam;
  const [activeTab, setActiveTab] = useState('roles');
  const [showAddRole, setShowAddRole] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Initialize team members if not exists
  const teamMembers = data.teamMembers || [];
  const advisors = data.advisors || [];
  const orgStructure = data.organizationalStructure || '';

  const handleFieldChange = (field, value) => {
    actions.updateBusinessPlan('managementTeam', { [field]: value });
  };

  const handleAddTeamMember = (memberData) => {
    const newMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...memberData,
      addedAt: new Date().toISOString()
    };
    
    const updatedMembers = [...teamMembers, newMember];
    actions.updateBusinessPlan('managementTeam', { 
      ...data, 
      teamMembers: updatedMembers 
    });
    setShowAddRole(false);
  };

  const handleUpdateTeamMember = (memberId, updates) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    );
    actions.updateBusinessPlan('managementTeam', { 
      ...data, 
      teamMembers: updatedMembers 
    });
    setEditingRole(null);
  };

  const handleDeleteTeamMember = (memberId) => {
    const updatedMembers = teamMembers.filter(member => member.id !== memberId);
    actions.updateBusinessPlan('managementTeam', { 
      ...data, 
      teamMembers: updatedMembers 
    });
  };

  const handleAddAdvisor = (advisorData) => {
    const newAdvisor = {
      id: `advisor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...advisorData,
      addedAt: new Date().toISOString()
    };
    
    const updatedAdvisors = [...advisors, newAdvisor];
    actions.updateBusinessPlan('managementTeam', { 
      ...data, 
      advisors: updatedAdvisors 
    });
  };

  const handleDeleteAdvisor = (advisorId) => {
    const updatedAdvisors = advisors.filter(advisor => advisor.id !== advisorId);
    actions.updateBusinessPlan('managementTeam', { 
      ...data, 
      advisors: updatedAdvisors 
    });
  };

  // Common restaurant roles with templates
  const roleTemplates = {
    'General Manager': {
      responsibilities: [
        'Overall restaurant operations management',
        'Staff scheduling and supervision',
        'Customer service excellence',
        'Financial performance monitoring',
        'Vendor relationship management'
      ],
      qualifications: [
        '3+ years restaurant management experience',
        'Strong leadership and communication skills',
        'Food safety certification',
        'Budget and P&L management experience'
      ],
      salaryRange: '$45,000 - $65,000'
    },
    'Head Chef': {
      responsibilities: [
        'Menu development and food quality control',
        'Kitchen staff training and supervision',
        'Inventory management and cost control',
        'Food safety and sanitation standards',
        'Vendor relationships for food procurement'
      ],
      qualifications: [
        'Culinary degree or equivalent experience',
        '5+ years kitchen management experience',
        'ServSafe certification',
        'Creative menu development skills'
      ],
      salaryRange: '$50,000 - $75,000'
    },
    'Assistant Manager': {
      responsibilities: [
        'Support general manager in daily operations',
        'Staff training and development',
        'Customer complaint resolution',
        'Opening/closing procedures',
        'Inventory management'
      ],
      qualifications: [
        '2+ years restaurant experience',
        'Leadership potential',
        'Customer service excellence',
        'Basic computer skills'
      ],
      salaryRange: '$35,000 - $45,000'
    },
    'Sous Chef': {
      responsibilities: [
        'Assist head chef in kitchen operations',
        'Food preparation and cooking',
        'Staff training and supervision',
        'Inventory and ordering',
        'Maintain kitchen cleanliness'
      ],
      qualifications: [
        'Culinary training or experience',
        '2+ years kitchen experience',
        'Food safety knowledge',
        'Ability to work under pressure'
      ],
      salaryRange: '$40,000 - $55,000'
    },
    'Front of House Manager': {
      responsibilities: [
        'Dining room operations management',
        'Server training and scheduling',
        'Customer experience optimization',
        'Reservation management',
        'Staff performance evaluation'
      ],
      qualifications: [
        '3+ years FOH experience',
        'Strong customer service skills',
        'Staff management experience',
        'Knowledge of POS systems'
      ],
      salaryRange: '$38,000 - $50,000'
    }
  };

  const getRoleIcon = (role) => {
    if (role.toLowerCase().includes('chef')) return <ChefHat className="w-5 h-5" />;
    if (role.toLowerCase().includes('manager')) return <Crown className="w-5 h-5" />;
    if (role.toLowerCase().includes('owner')) return <Star className="w-5 h-5" />;
    return <Briefcase className="w-5 h-5" />;
  };

  return (
    <div className="animate-fade-in">
      <SectionCard 
        title="Management Team & Organization" 
        description="Build your restaurant's management structure with key roles and personnel."
        color="orange"
      >
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'roles' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Key Roles
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'structure' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="w-4 h-4 inline mr-2" />
            Organization
          </button>
          <button
            onClick={() => setActiveTab('advisors')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'advisors' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Advisors
          </button>
          <button
            onClick={() => setActiveTab('compensation')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'compensation' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign className="w-4 h-4 inline mr-2" />
            Compensation
          </button>
        </div>

        {/* Key Roles Tab */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            {/* Role Templates */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Common Restaurant Roles
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Click on a role template to quickly add it to your team structure.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(roleTemplates).map(([role, template]) => (
                  <button
                    key={role}
                    onClick={() => {
                      setEditingRole({
                        name: '',
                        role: role,
                        responsibilities: template.responsibilities,
                        qualifications: template.qualifications,
                        salaryRange: template.salaryRange,
                        experience: '',
                        email: '',
                        phone: '',
                        notes: ''
                      });
                      setShowAddRole(true);
                    }}
                    className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center mb-2">
                      {getRoleIcon(role)}
                      <span className="font-medium text-gray-900 ml-2">{role}</span>
                    </div>
                    <p className="text-xs text-gray-600">{template.salaryRange}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Role Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
              <button
                onClick={() => {
                  setEditingRole({
                    name: '',
                    role: '',
                    responsibilities: [],
                    qualifications: [],
                    salaryRange: '',
                    experience: '',
                    email: '',
                    phone: '',
                    notes: ''
                  });
                  setShowAddRole(true);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            {/* Team Members List */}
            <div className="space-y-4">
              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No team members added yet.</p>
                  <p className="text-sm">Click "Add Team Member" or use a role template above to get started.</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {getRoleIcon(member.role)}
                          <h4 className="text-lg font-semibold text-gray-900 ml-2">{member.name}</h4>
                          <span className="ml-3 px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                            {member.role}
                          </span>
                        </div>
                        
                        {member.experience && (
                          <p className="text-sm text-gray-600 mb-2">
                            <GraduationCap className="w-4 h-4 inline mr-1" />
                            {member.experience}
                          </p>
                        )}
                        
                        {member.salaryRange && (
                          <p className="text-sm text-gray-600 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            {member.salaryRange}
                          </p>
                        )}
                        
                        {member.email && (
                          <p className="text-sm text-gray-600 mb-1">
                            <Mail className="w-4 h-4 inline mr-1" />
                            {member.email}
                          </p>
                        )}
                        
                        {member.phone && (
                          <p className="text-sm text-gray-600 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            {member.phone}
                          </p>
                        )}
                        
                        {member.responsibilities && member.responsibilities.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Key Responsibilities:</h5>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                              {member.responsibilities.map((resp, idx) => (
                                <li key={idx}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {member.qualifications && member.qualifications.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Qualifications:</h5>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                              {member.qualifications.map((qual, idx) => (
                                <li key={idx}>{qual}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {member.notes && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Notes:</h5>
                            <p className="text-sm text-gray-600">{member.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingRole(member)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Organization Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            <FormField
              label="Organizational Structure"
              type="textarea"
              value={orgStructure}
              onChange={(value) => handleFieldChange('organizationalStructure', value)}
              placeholder="Describe your restaurant's organizational hierarchy, reporting relationships, and decision-making structure. Include information about departments, management levels, and communication flow."
              rows={6}
            />
            
            {/* Organizational Chart Placeholder */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Building className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Organizational Chart</h3>
              <p className="text-gray-500 text-sm mb-4">
                Visual organizational chart will be generated based on your team structure
              </p>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Generate Chart
              </button>
            </div>
          </div>
        )}

        {/* Advisors Tab */}
        {activeTab === 'advisors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Advisors & Board Members</h3>
              <button
                onClick={() => {
                  const newAdvisor = {
                    name: '',
                    title: '',
                    company: '',
                    expertise: '',
                    email: '',
                    phone: '',
                    relationship: '',
                    notes: ''
                  };
                  handleAddAdvisor(newAdvisor);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Advisor</span>
              </button>
            </div>

            <div className="space-y-4">
              {advisors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No advisors added yet.</p>
                  <p className="text-sm">Add mentors, consultants, and board members who can provide guidance.</p>
                </div>
              ) : (
                advisors.map((advisor) => (
                  <div key={advisor.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{advisor.name}</h4>
                        <p className="text-orange-600 font-medium">{advisor.title}</p>
                        {advisor.company && <p className="text-gray-600">{advisor.company}</p>}
                        {advisor.expertise && <p className="text-sm text-gray-600 mt-1">Expertise: {advisor.expertise}</p>}
                        {advisor.relationship && <p className="text-sm text-gray-600">Relationship: {advisor.relationship}</p>}
                        {advisor.email && <p className="text-sm text-gray-600"><Mail className="w-4 h-4 inline mr-1" />{advisor.email}</p>}
                        {advisor.phone && <p className="text-sm text-gray-600"><Phone className="w-4 h-4 inline mr-1" />{advisor.phone}</p>}
                        {advisor.notes && <p className="text-sm text-gray-600 mt-2">{advisor.notes}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteAdvisor(advisor.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Compensation Tab */}
        {activeTab === 'compensation' && (
          <div className="space-y-6">
            <FormField
              label="Compensation Philosophy"
              type="textarea"
              value={data.compensationPlan || ''}
              onChange={(value) => handleFieldChange('compensationPlan', value)}
              placeholder="Describe your compensation philosophy, salary structures, equity participation, incentive programs, and benefits package. Include information about performance reviews, bonuses, and career development opportunities."
              rows={6}
            />
            
            {/* Compensation Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Compensation Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white border border-green-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    {member.salaryRange && (
                      <p className="text-green-600 font-medium">{member.salaryRange}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Role Modal */}
        {showAddRole && (
          <RoleForm
            role={editingRole}
            onSave={editingRole?.id ? handleUpdateTeamMember : handleAddTeamMember}
            onCancel={() => {
              setShowAddRole(false);
              setEditingRole(null);
            }}
            isEditing={!!editingRole?.id}
          />
        )}
      </SectionCard>
    </div>
  );
};

// Role Form Component
const RoleForm = ({ role, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(role || {
    name: '',
    role: '',
    responsibilities: [],
    qualifications: [],
    salaryRange: '',
    experience: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [newResponsibility, setNewResponsibility] = useState('');
  const [newQualification, setNewQualification] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  const removeQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.role) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter full name"
                required
              />
              
              <FormField
                label="Role/Position"
                type="text"
                value={formData.role}
                onChange={(value) => handleInputChange('role', value)}
                placeholder="e.g., General Manager, Head Chef"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Experience"
                type="text"
                value={formData.experience}
                onChange={(value) => handleInputChange('experience', value)}
                placeholder="e.g., 5 years restaurant management"
              />
              
              <FormField
                label="Salary Range"
                type="text"
                value={formData.salaryRange}
                onChange={(value) => handleInputChange('salaryRange', value)}
                placeholder="e.g., $45,000 - $65,000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="email@example.com"
              />
              
              <FormField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Responsibilities
              </label>
              <div className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-1 text-sm text-gray-600">{resp}</span>
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add a responsibility..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications
              </label>
              <div className="space-y-2">
                {formData.qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-1 text-sm text-gray-600">{qual}</span>
                    <button
                      type="button"
                      onClick={() => removeQualification(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    placeholder="Add a qualification..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={addQualification}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <FormField
              label="Additional Notes"
              type="textarea"
              value={formData.notes}
              onChange={(value) => handleInputChange('notes', value)}
              placeholder="Any additional information about this team member..."
              rows={3}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                {isEditing ? 'Update' : 'Add'} Team Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagementTeam; 