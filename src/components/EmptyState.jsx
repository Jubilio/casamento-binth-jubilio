import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon = '📭', 
  title = 'Nada aqui ainda', 
  description = 'Parece que não há nada para mostrar no momento.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-8xl mb-6"
      >
        {icon}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-serif text-charcoal mb-3"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 max-w-md mb-6"
      >
        {description}
      </motion.p>
      
      {(actionText && (actionLink || onAction)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-md hover:shadow-lg btn-ripple hover-lift"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-md hover:shadow-lg btn-ripple hover-lift"
            >
              {actionText}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
