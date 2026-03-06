import React, { useState, useRef } from 'react';
import styles from './styles.module.css';

interface PageFeedbackProps {
  className?: string;
}

export default function PageFeedback({ className }: PageFeedbackProps) {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState<'yes' | 'improve' | null>(null);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attachment, setAttachment] = useState<{ name: string; base64: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleYes = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        type: 'page_feedback',
        title: 'Page Helpful - Yes',
        helpful: true,
        context: {
          url: window.location.href,
          pageTitle: document.title,
          browser: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          timestamp: new Date().toISOString(),
        },
      };

      const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const apiUrl = isDev ? 'http://localhost:3001/api/page-feedback' : '/functions/page-feedback';

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSubmitted('yes');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment({
          name: file.name,
          base64: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitImprovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('Please provide some feedback on how we can improve.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type: 'page_feedback',
        title: 'Page Improvement Suggestion',
        helpful: false,
        comment: comment.trim(),
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        attachment: attachment?.base64 || undefined,
        attachmentName: attachment?.name || undefined,
        context: {
          url: window.location.href,
          pageTitle: document.title,
          browser: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          timestamp: new Date().toISOString(),
        },
      };

      const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const apiUrl = isDev ? 'http://localhost:3001/api/page-feedback' : '/functions/page-feedback';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted('improve');
        setShowModal(false);
        // Reset form
        setComment('');
        setName('');
        setEmail('');
        setAttachment(null);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className={`${styles.feedbackSection} ${className || ''}`}>
        <div className={styles.thankYou}>
          <span className={styles.checkIcon}>✓</span>
          <span>Thank you for your feedback!</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.feedbackSection} ${className || ''}`}>
        <span className={styles.feedbackQuestion}>Was this page helpful?</span>
        <div className={styles.feedbackButtons}>
          <button
            className={styles.feedbackButtonYes}
            onClick={handleYes}
            disabled={isSubmitting}
            aria-label="Yes, this page was helpful"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Yes!</span>
          </button>
          <button
            className={styles.feedbackButtonImprove}
            onClick={() => setShowModal(true)}
            aria-label="What can we improve?"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>What can we improve?</span>
          </button>
        </div>
      </div>

      {/* Improvement Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Help us become better!</h3>
              <button className={styles.closeButton} onClick={closeModal} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitImprovement} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Leave a comment</label>
                <textarea
                  className={styles.textarea}
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                  placeholder="Tell us what you'd like to see improved..."
                  rows={4}
                />
                <div className={styles.charCount}>{comment.length}/1000</div>
              </div>

              <button
                type="button"
                className={styles.addFileButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                <span>{attachment ? attachment.name : 'Add a file'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className={styles.hiddenInput}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />

              <div className={styles.contactSection}>
                <p className={styles.contactLabel}>Share your contact if you want us to get back to you</p>
                <div className={styles.contactFields}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              {error && <div className={styles.errorBanner}>{error}</div>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

