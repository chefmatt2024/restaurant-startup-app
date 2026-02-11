import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import DocumentUploader from './DocumentUploader';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Folder,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Building2,
  Utensils,
  Calendar,
  Tag,
  Archive,
  Plus,
  X
} from 'lucide-react';

const DocumentVault = () => {
  const { state, actions } = useApp();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('permit');
  const [uploadDocumentType, setUploadDocumentType] = useState('application');
  const [filterDocumentType, setFilterDocumentType] = useState('all');

  // Load documents from localStorage or state
  useEffect(() => {
    const savedDocs = localStorage.getItem(`documentVault_${state.userId}_${state.currentDraftId}`);
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) {
        console.error('Error loading documents:', e);
      }
    }
  }, [state.userId, state.currentDraftId]);

  // Save documents to localStorage
  const saveDocuments = (newDocuments) => {
    setDocuments(newDocuments);
    if (state.userId && state.currentDraftId) {
      localStorage.setItem(
        `documentVault_${state.userId}_${state.currentDraftId}`,
        JSON.stringify(newDocuments)
      );
    }
  };

  // Document categories
  const categories = {
    permit: { label: 'Permits', icon: Shield, color: 'blue' },
    license: { label: 'Licenses', icon: FileText, color: 'green' },
    certification: { label: 'Certifications', icon: CheckCircle, color: 'purple' },
    inspection: { label: 'Inspections', icon: AlertCircle, color: 'orange' },
    other: { label: 'Other', icon: Folder, color: 'gray' }
  };

  // Document types (submitted application vs official copy)
  const documentTypes = {
    application: { label: 'Submitted Application', icon: Upload, color: 'blue', description: 'The form you filled out and submitted' },
    official: { label: 'Official Copy', icon: CheckCircle, color: 'green', description: 'The approved permit/license you received' },
    draft: { label: 'Draft', icon: FileText, color: 'gray', description: 'Working draft before submission' },
    other: { label: 'Other', icon: Folder, color: 'gray', description: 'Other related documents' }
  };

  // Government levels
  const levels = {
    federal: { label: 'Federal', color: 'blue' },
    state: { label: 'State', color: 'green' },
    city: { label: 'City', color: 'purple' }
  };

  // Handle document upload
  const handleDocumentUpload = (requirementId, fileData, category, level, requirementName, documentType = 'other', linkedToId = null) => {
    const newDocument = {
      id: fileData.id || Date.now() + Math.random(),
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
      uploadedAt: fileData.uploadedAt || new Date().toISOString(),
      url: fileData.url,
      requirementId: requirementId || 'custom',
      requirementName: requirementName || 'Custom Document',
      category: category || uploadCategory,
      level: level || 'city',
      documentType: documentType || 'other', // 'application', 'official', 'draft', 'other'
      linkedToId: linkedToId || null, // Link to related document (e.g., official copy linked to application)
      tags: [],
      notes: '',
      submittedDate: documentType === 'application' ? new Date().toISOString() : null,
      receivedDate: documentType === 'official' ? new Date().toISOString() : null,
      expirationDate: null,
      permitNumber: null
    };

    const newDocuments = [...documents, newDocument];
    saveDocuments(newDocuments);
    actions.showMessage('Success', `Document "${fileData.name}" uploaded successfully!`, 'success');
    setShowUploadModal(false);
  };

  // Handle document delete
  const handleDeleteDocument = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const newDocuments = documents.filter(doc => doc.id !== documentId);
      saveDocuments(newDocuments);
      actions.showMessage('Success', 'Document deleted successfully', 'success');
      if (selectedDocument?.id === documentId) {
        setSelectedDocument(null);
      }
    }
  };

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = !searchTerm || 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.requirementName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
      const matchesLevel = filterLevel === 'all' || doc.level === filterLevel;
      const matchesDocumentType = filterDocumentType === 'all' || doc.documentType === filterDocumentType;

      return matchesSearch && matchesCategory && matchesLevel && matchesDocumentType;
    });
  }, [documents, searchTerm, filterCategory, filterLevel, filterDocumentType]);

  // Get linked documents (e.g., official copy linked to application)
  const getLinkedDocuments = (documentId) => {
    return documents.filter(doc => doc.linkedToId === documentId);
  };

  // Get parent document (e.g., application that official copy is linked to)
  const getParentDocument = (documentId) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc && doc.linkedToId) {
      return documents.find(d => d.id === doc.linkedToId);
    }
    return null;
  };

  // Group documents by category
  const documentsByCategory = useMemo(() => {
    const grouped = {};
    filteredDocuments.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });
    return grouped;
  }, [filteredDocuments]);

  // Statistics
  const stats = useMemo(() => {
    const total = documents.length;
    const byCategory = {};
    const byLevel = {};
    
    documents.forEach(doc => {
      byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;
      byLevel[doc.level] = (byLevel[doc.level] || 0) + 1;
    });

    return { total, byCategory, byLevel };
  }, [documents]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return FileText;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return Eye;
    if (['doc', 'docx'].includes(ext)) return FileText;
    if (['xls', 'xlsx'].includes(ext)) return FileText;
    return FileText;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Archive className="w-8 h-8 mr-3 text-blue-600" />
              Document Vault
            </h1>
            <p className="text-gray-600 mt-2">
              Centralized storage for all permits, licenses, and certifications
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Archive className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <p className="text-blue-100 text-sm">Total Documents</p>
        </div>

        {Object.entries(categories).slice(0, 3).map(([key, cat]) => {
          const Icon = cat.icon;
          const count = stats.byCategory[key] || 0;
          const colorClasses = {
            blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-blue-100',
            green: 'bg-gradient-to-br from-green-500 to-green-600 text-green-100',
            purple: 'bg-gradient-to-br from-purple-500 to-purple-600 text-purple-100',
            orange: 'bg-gradient-to-br from-orange-500 to-orange-600 text-orange-100',
            gray: 'bg-gradient-to-br from-gray-500 to-gray-600 text-gray-100'
          };
          return (
            <div key={key} className={`${colorClasses[cat.color] || colorClasses.blue} rounded-lg p-6 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-8 h-8" />
                <span className="text-3xl font-bold">{count}</span>
              </div>
              <p className="text-sm opacity-90">{cat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              {Object.entries(levels).map(([key, level]) => (
                <option key={key} value={key}>{level.label}</option>
              ))}
            </select>
            <select
              value={filterDocumentType}
              onChange={(e) => setFilterDocumentType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {Object.entries(documentTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents by Category */}
      {Object.keys(categories).map(categoryKey => {
        const categoryDocs = documentsByCategory[categoryKey] || [];
        if (categoryDocs.length === 0 && filterCategory !== 'all' && filterCategory !== categoryKey) return null;

        const category = categories[categoryKey];
        const Icon = category.icon;

        return (
          <SectionCard 
            key={categoryKey} 
            title={`${category.label} (${categoryDocs.length})`}
            color={category.color}
          >
            {categoryDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryDocs.map(doc => {
                  const FileIcon = getFileIcon(doc.name);
                  const levelInfo = levels[doc.level] || levels.city;
                  const iconColorClasses = {
                    blue: 'text-blue-600',
                    green: 'text-green-600',
                    purple: 'text-purple-600',
                    orange: 'text-orange-600',
                    gray: 'text-gray-600'
                  };
                  
                  const docType = documentTypes[doc.documentType] || documentTypes.other;
                  const DocTypeIcon = docType.icon;
                  const linkedDocs = getLinkedDocuments(doc.id);
                  const parentDoc = getParentDocument(doc.id);
                  
                  return (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      {/* Document Type Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 ${
                          doc.documentType === 'official' ? 'bg-green-100 text-green-700' :
                          doc.documentType === 'application' ? 'bg-blue-100 text-blue-700' :
                          doc.documentType === 'draft' ? 'bg-gray-100 text-gray-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          <DocTypeIcon className="w-3 h-3" />
                          <span>{docType.label}</span>
                        </span>
                      </div>

                      <div className="flex items-start justify-between mb-3 pr-20">
                        <div className="flex items-center space-x-2">
                          <FileIcon className={`w-5 h-5 ${iconColorClasses[category.color] || iconColorClasses.blue}`} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{doc.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{doc.requirementName}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className={`px-2 py-1 rounded ${
                          levelInfo.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          levelInfo.color === 'green' ? 'bg-green-100 text-green-700' :
                          levelInfo.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {levelInfo.label}
                        </span>
                        <span>{formatFileSize(doc.size)}</span>
                      </div>

                      {/* Link indicators */}
                      {linkedDocs.length > 0 && (
                        <div className="mt-2 text-xs text-green-600 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{linkedDocs.length} related document{linkedDocs.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {parentDoc && (
                        <div className="mt-2 text-xs text-blue-600 flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>Linked to: {parentDoc.name}</span>
                        </div>
                      )}
                      
                      <div className="mt-2 text-xs text-gray-400">
                        {doc.documentType === 'application' && doc.submittedDate && (
                          <span>Submitted: {new Date(doc.submittedDate).toLocaleDateString()}</span>
                        )}
                        {doc.documentType === 'official' && doc.receivedDate && (
                          <span>Received: {new Date(doc.receivedDate).toLocaleDateString()}</span>
                        )}
                        {!doc.submittedDate && !doc.receivedDate && (
                          <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Folder className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No {category.label.toLowerCase()} documents yet</p>
                <button
                  onClick={() => {
                    setUploadCategory(categoryKey);
                    setShowUploadModal(true);
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Upload your first {category.label.toLowerCase()}
                </button>
              </div>
            )}
          </SectionCard>
        );
      })}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  id="uploadDocumentType"
                  value={uploadDocumentType}
                  onChange={(e) => setUploadDocumentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {Object.entries(documentTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.label} - {type.description}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {documentTypes[uploadDocumentType]?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government Level
                </label>
                <select
                  id="uploadLevel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  defaultValue="city"
                >
                  {Object.entries(levels).map(([key, level]) => (
                    <option key={key} value={key}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Requirement (Optional)
                </label>
                <input
                  type="text"
                  id="uploadRequirementName"
                  placeholder="e.g., Food Establishment Permit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {uploadDocumentType === 'official' && documents.filter(d => d.documentType === 'application').length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link to Submitted Application (Optional)
                  </label>
                  <select
                    id="linkToApplication"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    defaultValue=""
                  >
                    <option value="">None - Standalone document</option>
                    {documents
                      .filter(d => d.documentType === 'application')
                      .map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} - {doc.requirementName}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Link this official copy to the application you submitted
                  </p>
                </div>
              )}

              {(uploadDocumentType === 'official' || uploadDocumentType === 'application') && (
                <div className="grid grid-cols-2 gap-4">
                  {uploadDocumentType === 'application' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Submitted
                      </label>
                      <input
                        type="date"
                        id="submittedDate"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}
                  {uploadDocumentType === 'official' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Received
                        </label>
                        <input
                          type="date"
                          id="receivedDate"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Permit/License Number (Optional)
                        </label>
                        <input
                          type="text"
                          id="permitNumber"
                          placeholder="e.g., PER-2024-12345"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration Date (Optional)
                        </label>
                        <input
                          type="date"
                          id="expirationDate"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <DocumentUploader
                documentId="vault-upload"
                onUpload={(docId, fileData) => {
                  const level = document.getElementById('uploadLevel')?.value || 'city';
                  const requirementName = document.getElementById('uploadRequirementName')?.value || 'Custom Document';
                  const docType = uploadDocumentType || 'other';
                  const linkedToId = document.getElementById('linkToApplication')?.value || null;
                  const submittedDate = document.getElementById('submittedDate')?.value || null;
                  const receivedDate = document.getElementById('receivedDate')?.value || null;
                  const permitNumber = document.getElementById('permitNumber')?.value || null;
                  const expirationDate = document.getElementById('expirationDate')?.value || null;
                  
                  const doc = {
                    ...fileData,
                    submittedDate: submittedDate ? new Date(submittedDate).toISOString() : null,
                    receivedDate: receivedDate ? new Date(receivedDate).toISOString() : null,
                    permitNumber,
                    expirationDate: expirationDate ? new Date(expirationDate).toISOString() : null
                  };
                  
                  handleDocumentUpload(null, doc, uploadCategory, level, requirementName, docType, linkedToId);
                }}
                documentType="general"
              />
            </div>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.name}</h2>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900 capitalize">{selectedDocument.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                  <p className="text-gray-900">
                    {documentTypes[selectedDocument.documentType]?.label || 'Other'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <p className="text-gray-900 capitalize">{selectedDocument.level}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                  <p className="text-gray-900">{formatFileSize(selectedDocument.size)}</p>
                </div>
                {selectedDocument.submittedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Submitted</label>
                    <p className="text-gray-900">{new Date(selectedDocument.submittedDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedDocument.receivedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Received</label>
                    <p className="text-gray-900">{new Date(selectedDocument.receivedDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedDocument.permitNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permit/License Number</label>
                    <p className="text-gray-900 font-mono">{selectedDocument.permitNumber}</p>
                  </div>
                )}
                {selectedDocument.expirationDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <p className="text-gray-900">{new Date(selectedDocument.expirationDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Related Requirement</label>
                  <p className="text-gray-900">{selectedDocument.requirementName}</p>
                </div>
              </div>

              {/* Linked Documents */}
              {(() => {
                const linkedDocs = getLinkedDocuments(selectedDocument.id);
                const parentDoc = getParentDocument(selectedDocument.id);
                return (linkedDocs.length > 0 || parentDoc) && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Related Documents</h3>
                    {parentDoc && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Linked to Application:</p>
                        <button
                          onClick={() => setSelectedDocument(parentDoc)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {parentDoc.name}
                        </button>
                      </div>
                    )}
                    {linkedDocs.length > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">Official Copies:</p>
                        <div className="space-y-2">
                          {linkedDocs.map(doc => (
                            <button
                              key={doc.id}
                              onClick={() => setSelectedDocument(doc)}
                              className="block w-full text-left text-green-600 hover:text-green-800 font-medium text-sm"
                            >
                              {doc.name}
                              {doc.permitNumber && ` (${doc.permitNumber})`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {selectedDocument.url && (
                  <>
                    <a
                      href={selectedDocument.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </a>
                    <a
                      href={selectedDocument.url}
                      download={selectedDocument.name}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  </>
                )}
                <button
                  onClick={() => {
                    handleDeleteDocument(selectedDocument.id);
                    setSelectedDocument(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVault;

