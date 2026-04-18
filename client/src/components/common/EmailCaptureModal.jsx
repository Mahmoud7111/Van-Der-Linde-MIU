import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiCheckCircle } from 'react-icons/fi';
import Button from './Button';
import watchImage from '@/assets/images/Photos/About.png';
import './EmailCaptureModal.css';

const EmailCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Show modal after 1 second for testing (removed localStorage check)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenEmailModal', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Logic for email capture (e.g., API call) would go here
      setIsSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="email-modal-overlay">
          <motion.div
            className="email-modal-container"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button className="email-modal-close-btn" onClick={handleClose} aria-label="Close modal">
              <FiX />
            </button>

            <div className="email-modal-layout">
              <div className="email-modal-image-side">
                <img src={watchImage} alt="Van Der Linde Luxury" />
                <div className="image-overlay-text">
                  <span>Est. 1892</span>
                </div>
              </div>

              <div className="email-modal-content-side">
                {!isSubmitted ? (
                  <div className="email-modal-form-content">
                    <span className="email-modal-badge">The Private Circle</span>
                    <h2>Unlock Exclusive <br /> Privileges</h2>
                    <p>
                      Join our inner circle for priority access to new collections,
                      limited editions, and private trunk shows.
                    </p>

                    <form className="email-modal-form" onSubmit={handleSubmit}>
                      <div className="email-field-group">
                        <FiMail className="email-field-icon" />
                        <input
                          type="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="email-capture-input"
                        />
                      </div>
                      <Button type="submit" variant="primary" className="email-submit-btn">
                        Grant Me Access
                      </Button>
                    </form>

                    <p className="email-modal-disclaimer">
                      By subscribing, you agree to our Privacy Policy and consent to receive marketing emails.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    className="email-modal-success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="success-icon-wrapper">
                      <FiCheckCircle />
                    </div>
                    <h3>Welcome to the Circle</h3>
                    <p>
                      An invitation has been sent to your inbox. Your journey with
                      Van Der Linde has officially begun.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmailCaptureModal;
