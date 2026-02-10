import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileX, Loader2 } from 'lucide-react';
import API from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import Navbar from '../../components/Navbar/Navbar';
import Toast from '../../components/Toast/Toast';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import s from './Dashboard.module.css';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [creating, setCreating] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocuments();
    }, []);

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

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setCreating(true);
        try {
            const newDoc = await API.post('/documents', { title: newTitle.trim() });
            setShowModal(false);
            setNewTitle('');
            navigate(`/editor/${newDoc.id}`);
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to create document' });
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteClick = (doc) => {
        console.log('handleDeleteClick called with:', doc);
        setDocToDelete(doc);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        console.log('DASHBOARD: confirmDelete for:', docToDelete);
        setDeleting(true);
        try {
            await API.delete(`/documents/${docToDelete.id}`);
            setDocuments(documents.filter(d => d.id !== docToDelete.id));
            setNotification({ type: 'success', message: 'Document deleted successfully' });
            setShowDeleteModal(false);
            setDocToDelete(null);
        } catch (error) {
            console.error('DASHBOARD: Delete fail:', error);
            setNotification({ type: 'error', message: error.message || 'Failed to delete document' });
            // Keep modal open on error so user can see what failed
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Toast
                notification={notification}
                onClose={() => setNotification(null)}
            />
            <Navbar user={user} logout={logout} />

            <div className={s.dashboardContainer}>
                <header className={s.pageHeader}>
                    <div className={s.headerText}>
                        <h1>My Documents</h1>
                        <p>Manage your projects and collaborations.</p>
                    </div>
                    <Button icon={Plus} onClick={() => setShowModal(true)}>
                        New Document
                    </Button>
                </header>

                {documents.length > 0 ? (
                    <div className={s.documentsGrid}>
                        {documents.map(doc => (
                            <DocumentCard
                                key={doc.id}
                                document={doc}
                                onClick={(id) => navigate(`/editor/${id}`)}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={s.emptyState}>
                        <FileX size={64} color="#94a3b8" />
                        <h3>No documents yet</h3>
                        <p>Create your first collaborative document to get started!</p>
                        <Button icon={Plus} onClick={() => setShowModal(true)}>
                            New Document
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Document Modal */}
            <Modal
                show={showModal}
                title="Create New Document"
                onClose={() => setShowModal(false)}
            >
                <form onSubmit={handleCreateSubmit}>
                    <InputField
                        label="Document Title"
                        placeholder="Enter document title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                        required
                    />
                    <Modal.Actions>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={creating}>
                            Create
                        </Button>
                    </Modal.Actions>
                </form>
            </Modal>

            <Modal
                show={showDeleteModal}
                title="Delete Document"
                onClose={() => {
                    setShowDeleteModal(false);
                    setDocToDelete(null);
                }}
            >
                <p>Are you sure you want to delete <strong>"{docToDelete?.title}"</strong>? This action cannot be undone.</p>
                <Modal.Actions>
                    <Button variant="secondary" onClick={() => {
                        setShowDeleteModal(false);
                        setDocToDelete(null);
                    }}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDelete}
                        loading={deleting}
                    >
                        Delete Document
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default Dashboard;
