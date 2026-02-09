import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/client';
import DocumentCard from '../components/DocumentCard';
import { Plus, Loader2, FileX, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');

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
            alert('Failed to create document. Please try again.');
        } finally {
            setCreating(false);
            setShowModal(false);
            setNewTitle('');
        }
    };

    const handleOpenDocument = (id) => {
        navigate(`/editor/${id}`);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader2 className="spinner" size={48} />
            </div>
        );
    }

    return (
        <div className="app-layout">
            <nav className="navbar">
                <div className="brand">Sync</div>
                <div className="user-nav">
                    <div className="user-info-stack">
                        <div className="avatar">
                            <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`} alt="avatar" />
                        </div>
                        <div className="user-text">
                            <span className="name">{user?.username}</span>
                            <span className="email">{user?.email || `${user?.username}@sync.com`}</span>
                        </div>
                    </div>
                    <button onClick={logout} className="nav-logout-btn">Logout</button>
                </div>
            </nav>

            <div className="dashboard-container">
                <header className="page-header">
                    <div className="header-text">
                        <h1>My Documents</h1>
                        <p>Manage your projects and collaborations.</p>
                    </div>
                    <button
                        className="create-btn"
                        onClick={() => setShowModal(true)}
                    >
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
                                onClick={handleOpenDocument}
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
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>Create New Document</h3>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
