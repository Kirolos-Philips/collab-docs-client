import React from 'react';
import { FileText, Calendar, User, ChevronRight } from 'lucide-react';

const DocumentCard = ({ document, onClick }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    return (
        <div className="document-card" onClick={() => onClick(document.id)}>
            <div className="card-top">
                <div className="card-icon">
                    <FileText size={24} />
                </div>
                <div className="card-title-group">
                    <h3 className="card-title">{document.title || 'Untitled Document'}</h3>
                    <p className="card-snippet">
                        {document.content?.substring(0, 60) || 'No content yet.'}
                        {document.content?.length > 60 ? '...' : ''}
                    </p>
                </div>
            </div>

            <div className="card-divider"></div>

            <div className="card-footer">
                <div className="meta-item">
                    <span>Updated {formatDate(document.updated_at || document.created_at)}</span>
                </div>
                <div className="member-badge">
                    {document.collaborators?.length + 1 || 1} Member(s)
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
