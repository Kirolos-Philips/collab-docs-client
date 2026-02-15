import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Trash2, MoreVertical, UserPlus } from 'lucide-react';
import s from './DocumentCard.module.css';
import Button from '../Button/Button';
import Dropdown from '../Dropdown/Dropdown';

const DocumentCard = ({ document, onClick, onDelete, onAddCollaborator }) => {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return t('common.never', { defaultValue: 'Never' });
    return new Date(dateString).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = (e) => {
    if (e) e.stopPropagation();
    onDelete(document);
  };

  const handleAddCollaborator = (e) => {
    if (e) e.stopPropagation();
    onAddCollaborator(document);
  };

  return (
    <div className={s.documentCard} onClick={() => onClick(document.id)}>
      <div className={s.cardTop}>
        <div className={s.cardTitleGroup}>
          <h3 className={s.cardTitle}>{document.title || t('document.untitled')}</h3>
          <p className={s.cardSnippet}>
            {document.content?.substring(0, 60) || t('document.noContent')}
            {document.content?.length > 60 ? '...' : ''}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm" square className={s.moreBtn} icon={MoreVertical} />
            }
          >
            <Dropdown.Item icon={UserPlus} onClick={handleAddCollaborator}>
              {t('collaborator.addCollaborator')}
            </Dropdown.Item>
            <Dropdown.Item variant="danger" icon={Trash2} onClick={handleDelete}>
              {t('common.delete')}
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <div className={s.cardDivider}></div>

      <div className={s.cardFooter}>
        <div className={s.metaItem}>
          <span>
            {t('document.updatedAt', {
              date: formatDate(document.updated_at || document.created_at),
            })}
          </span>
        </div>
        <div className={s.memberBadge}>
          {t('document.membersCount', { count: (document.collaborators?.length || 0) + 1 })}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
