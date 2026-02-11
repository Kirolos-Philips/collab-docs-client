import React from 'react';
import { FileText, Trash2, MoreVertical } from 'lucide-react';
import s from './DocumentCard.module.css';
import Button from '../Button/Button';
import Dropdown from '../Dropdown/Dropdown';

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
        if (e) e.stopPropagation();
        console.log('CARD: handleDelete triggered for:', document.id);
        onDelete(document);
    };

    return (
        <div className={s.documentCard} onClick={() => onClick(document.id)}>
            <div className={s.cardTop}>
                <div className={s.cardTitleGroup}>
                    <h3 className={s.cardTitle}>{document.title || 'Untitled Document'}</h3>
                    <p className={s.cardSnippet}>
                        {document.content?.substring(0, 60) || 'No content yet.'}
                        {document.content?.length > 60 ? '...' : ''}
                    </p>
                </div>

                <Dropdown
                    trigger={
                        <Button
                            variant="ghost"
                            size="sm"
                            square
                            className={s.moreBtn}
                            icon={MoreVertical}
                        />
                    }
                >
                    <Dropdown.Item
                        variant="danger"
                        icon={Trash2}
                        onClick={handleDelete}
                    >
                        Delete
                    </Dropdown.Item>
                </Dropdown>
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
