import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { issues, SPLASH_DURATION, WHATSAPP_NUMBER } from './utils';
import './ComplaintForm.css';

const Splash = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className="splash-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          ברוכים הבאים לטופס התלונות
        </motion.h1>
      </motion.div>
    )}
  </AnimatePresence>
);

const Alert = ({ children, type = 'success', onClose }) => (
  <motion.div
    className={`alert alert-${type}`}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
  >
    {children}
    <button className="alert-close" onClick={onClose}>&times;</button>
  </motion.div>
);

const AlertDialog = ({ isOpen, onClose, onConfirm, title, description }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="alert-dialog-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="alert-dialog-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2 className="alert-dialog-title">{title}</h2>
          <p className="alert-dialog-description">{description}</p>
          <div className="alert-dialog-buttons">
            <button onClick={onClose} className="alert-dialog-cancel">ביטול</button>
            <button onClick={onConfirm} className="alert-dialog-confirm">שליחה</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ComplaintForm = () => {
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (includeLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIncludeLocation(false);
        }
      );
    } else {
      setLocation(null);
    }
  }, [includeLocation]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    const rtl = '\u200F';
    let message = `${rtl}סיבה: ${issue}${rtl}\n${rtl}תיאור הבעיה: ${description}${rtl}\n`;
    if (includeLocation && location) {
      message += `${rtl}מיקום: https://www.google.com/maps?q=${location.latitude},${location.longitude}${rtl}\n`;
    } else {
      message += `${rtl}מיקום: לא סופק${rtl}\n`;
    }
    message += `\n${rtl}"sent via ofir"${rtl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsSubmitting(false);
    setShowSuccessAlert(true);
    setIsAlertDialogOpen(false);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  return (
    <>
      <Splash isVisible={showSplash} />
      <motion.div
        className="complaint-form-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.div
          className="complaint-form"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h1 className="form-title">הגשת תלונה</h1>
          <p className="form-description">אנחנו כאן לעזור. ספרו לנו על הבעיה שלכם.</p>
          
          <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
            <label htmlFor="issue">בחרו נושא:</label>
            <select
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="form-select"
            >
              <option value="">בחרו נושא</option>
              {issues.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </motion.div>
          
          <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
            <label htmlFor="description">תיאור קצר:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="תארו בקצרה את התלונה שלכם"
              className="form-textarea"
            />
          </motion.div>
          
          <motion.div className="form-group checkbox-group" whileHover={{ scale: 1.02 }}>
            <input
              id="includeLocation"
              type="checkbox"
              checked={includeLocation}
              onChange={(e) => setIncludeLocation(e.target.checked)}
              className="form-checkbox"
            />
            <label htmlFor="includeLocation">
              כלול את המיקום הנוכחי שלי
            </label>
          </motion.div>
          
          <motion.button
            className="submit-button"
            disabled={!issue || !description || isSubmitting}
            onClick={() => setIsAlertDialogOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            שליחה באמצעות וואטסאפ
          </motion.button>

          <AlertDialog
            isOpen={isAlertDialogOpen}
            onClose={() => setIsAlertDialogOpen(false)}
            onConfirm={handleSubmit}
            title="האם אתה בטוח שברצונך לשלוח את התלונה?"
            description="פעולה זו תפתח את WhatsApp עם הודעה מוכנה מראש המכילה את פרטי התלונה שלך."
          />

          <AnimatePresence>
            {showSuccessAlert && (
              <Alert onClose={() => setShowSuccessAlert(false)}>
                <span className="icon">✓</span>
                <span className="alert-message">התלונה שלך נשלחה בהצלחה.</span>
              </Alert>
            )}
          </AnimatePresence>

          <div className="form-footer">
            <span className="icon">📷</span>
            <span>ניתן לצרף תמונות בהודעת WhatsApp</span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ComplaintForm;