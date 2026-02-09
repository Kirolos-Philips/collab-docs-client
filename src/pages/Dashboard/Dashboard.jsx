import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileX, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api/client';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import Navbar from '../../components/Navbar/Navbar';
import Toast from '../../components/Toast/Toast';
import Modal from '../../components/Modal/Modal';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    // Deletion states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [notification, setNotification] = useState(null);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchDocuments = async () => {
        try {
            const data = await API.get('/documents');
            setDocuments(data);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setCreating(true);
        try {
            const newDoc = await API.post('/documents', { title: newTitle.trim() });
            navigate(`/editor/${newDoc.id}`);
        } catch (error) {
            console.error('Failed to create document:', error);
            setNotification({ type: 'error', message: error.message || 'Failed to create document.' });
            setTimeout(() => setNotification(null), 4000);
        } finally {
            setCreating(false);
            setShowModal(false);
            setNewTitle('');
        }
    };

    const handleDeleteRequest = (doc) => {
        setDocToDelete(doc);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!docToDelete) return;

        setDeleting(true);
        try {
            await API.delete(`/documents/${docToDelete.id}`);
            setDocuments(prev => prev.filter(d => d.id !== docToDelete.id));
            setShowDeleteModal(false);
            setDocToDelete(null);
            setNotification({ type: 'success', message: 'Document deleted successfully!' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Failed to delete document:', error);
            setNotification({ type: 'error', message: error.message || 'Failed to delete document.' });
            setTimeout(() => setNotification(null), 4000);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader2 className="spinner" size={48} />
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Toast notification={notification} />
            <Navbar user={user} logout={logout} />

            <div className="dashboard-container">
                <header className="page-header">
                    <div className="header-text">
                        <h1>My Documents</h1>
                        <p>Manage your projects and collaborations.</p>
                    </div>
                    <button className="create-btn" onClick={() => setShowModal(true)}>
                        <Plus size={20} />
                        New Document
                    </button>
                </header>

                {documents.length > 0 ? (
                    <div className="documents-grid">
                        {documents.map(doc => (
                            <DocumentCard
                                key={doc.id}
                                document={doc}
                                onClick={(id) => navigate(`/editor/${id}`)}
                                onDelete={handleDeleteRequest}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FileX size={64} color="#94a3b8" />
                        <h3>No documents yet</h3>
                        <p>Create your first collaborative document to get started!</p>
                        <button className="create-btn" onClick={() => setShowModal(true)}>
                            <Plus size={20} />
                            New Document
                        </button>
                    </div>
                )}
            </div>

            {/* Create Document Modal */}
            <Modal
                show={showModal}
                title="Create New Document"
                onClose={() => setShowModal(false)}
            >
                <p>Enter a name for your new collaborative document.</p>
                <form onSubmit={handleCreateSubmit}>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Project Specs"
                        autoFocus
                        required
                    />
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="confirm-btn" disabled={creating}>
                            {creating ? <Loader2 className="spinner" size={18} /> : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                title="Delete Document"
                onClose={() => setShowDeleteModal(false)}
            >
                <p>Are you sure you want to delete <strong>"{docToDelete?.title}"</strong>? This action cannot be undone.</p>
                <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    <button
                        type="button"
                        className="confirm-btn danger"
                        onClick={confirmDelete}
                        disabled={deleting}
                    >
                        {deleting ? <Loader2 className="spinner" size={18} /> : 'Delete Document'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
