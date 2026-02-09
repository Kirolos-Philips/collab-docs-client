import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import s from './DocumentCard.module.css';

const DocumentCard = ({ document, onClick, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document);
    };

    return (
        <div className={s.documentCard} onClick={() => onClick(document.id)}>
            <div className={s.cardTop}>
                <div className={s.cardIcon}>
                    <FileText size={24} />
                </div>
                <div className={s.cardTitleGroup}>
                    <h3 className={s.cardTitle}>{document.title || 'Untitled Document'}</h3>
                    <p className={s.cardSnippet}>
                        {document.content?.substring(0, 60) || 'No content yet.'}
                        {document.content?.length > 60 ? '...' : ''}
                    </p>
                </div>
                <button className={s.cardDeleteBtn} onClick={handleDelete} title="Delete document">
                    <Trash2 size={18} />
                </button>
            </div>

            <div className={s.cardDivider}></div>

            <div className={s.cardFooter}>
                <div className={s.metaItem}>
                    <span>Updated {formatDate(document.updated_at || document.created_at)}</span>
                </div>
                <div className={s.memberBadge}>
                    {document.collaborators?.length + 1 || 1} Member(s)
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
