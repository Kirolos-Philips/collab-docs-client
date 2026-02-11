import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, FileX, Loader2 } from 'lucide-react';
import API from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import s from './Dashboard.module.css';

const Dashboard = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [creating, setCreating] = useState(false);
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
            showToast(t('dashboard.failedToCreate', { defaultValue: 'Failed to create document' }), 'error');
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
            showToast(t('dashboard.deletedSuccess', { defaultValue: 'Document deleted successfully' }));
            setShowDeleteModal(false);
            setDocToDelete(null);
        } catch (error) {
            console.error('DASHBOARD: Delete fail:', error);
            showToast(error.message || t('dashboard.failedToDelete', { defaultValue: 'Failed to delete document' }), 'error');
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
            <Navbar user={user} logout={logout} />

            <div className={s.dashboardContainer}>
                <header className={s.pageHeader}>
                    <div className={s.headerText}>
                        <h1>{t('dashboard.myDocuments')}</h1>
                        <p>{t('dashboard.manageProjects')}</p>
                    </div>
                    <Button icon={Plus} onClick={() => setShowModal(true)}>
                        {t('dashboard.newDocument')}
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
                        <p>{t('dashboard.noDocuments')}</p>
                    </div>
                )}
            </div>

            {/* Create Document Modal */}
            <Modal
                show={showModal}
                title={t('dashboard.newDocument')}
                onClose={() => setShowModal(false)}
            >
                <form onSubmit={handleCreateSubmit}>
                    <InputField
                        label={t('dashboard.docTitle')}
                        placeholder={t('dashboard.enterDocTitle')}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                        required
                    />
                    <Modal.Actions>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" loading={creating}>
                            {t('common.create')}
                        </Button>
                    </Modal.Actions>
                </form>
            </Modal>

            <Modal
                show={showDeleteModal}
                title={t('dashboard.deleteDocument', { defaultValue: 'Delete Document' })}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDocToDelete(null);
                }}
            >
                <p>{t('dashboard.confirmDelete', { title: docToDelete?.title })}</p>
                <Modal.Actions>
                    <Button variant="secondary" onClick={() => {
                        setShowDeleteModal(false);
                        setDocToDelete(null);
                    }}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDelete}
                        loading={deleting}
                    >
                        {t('dashboard.deleteDocument', { defaultValue: 'Delete Document' })}
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default Dashboard;
