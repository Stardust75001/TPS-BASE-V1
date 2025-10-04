/**
 * Sentry Error Handler pour TPS BASE V1
 * Gestion centralisée des erreurs avec contexte Shopify
 */

// Gestionnaire d'erreurs global pour le thème
window.TPSErrorHandler = {
  /**
   * Capturer une erreur avec contexte
   */
  captureError: function (error, context = {}) {
    if (!window.Sentry) {
      console.error('Erreur capturée (Sentry indisponible):', error);
      return;
    }

    // Ajouter le contexte du thème
    const themeContext = {
      theme: 'tps-base-v1',
      page: window.location.pathname,
      ...context
    };

    Sentry.withScope(scope => {
      scope.setContext('theme_error', themeContext);
      Sentry.captureException(error);
    });
  },

  /**
   * Capturer un message avec niveau de gravité
   */
  captureMessage: function (message, level = 'info', context = {}) {
    if (!window.Sentry) {
      console.log(`Message capturé (Sentry indisponible) [${level}]:`, message);
      return;
    }

    Sentry.withScope(scope => {
      scope.setContext('theme_message', context);
      Sentry.captureMessage(message, level);
    });
  },

  /**
   * Wrapper pour les fonctions asynchrones avec gestion d'erreur
   */
  wrapAsync: function (asyncFn, context = {}) {
    return async function (...args) {
      try {
        return await asyncFn.apply(this, args);
      } catch (error) {
        TPSErrorHandler.captureError(error, {
          function: asyncFn.name || 'anonymous',
          ...context
        });
        throw error;
      }
    };
  },

  /**
   * Wrapper pour les événements avec gestion d'erreur
   */
  wrapEventHandler: function (handler, context = {}) {
    return function (event) {
      try {
        return handler.call(this, event);
      } catch (error) {
        TPSErrorHandler.captureError(error, {
          event: event.type,
          target: event.target?.tagName || 'unknown',
          ...context
        });
        throw error;
      }
    };
  },

  /**
   * Logger pour les erreurs de checkout
   */
  logCheckoutError: function (step, error, data = {}) {
    this.captureError(error, {
      checkout_step: step,
      checkout_data: data,
      category: 'checkout'
    });
  },

  /**
   * Logger pour les erreurs de panier
   */
  logCartError: function (action, error, productId = null) {
    this.captureError(error, {
      cart_action: action,
      product_id: productId,
      category: 'cart'
    });
  },

  /**
   * Logger pour les erreurs de formulaires
   */
  logFormError: function (formType, error, formData = {}) {
    this.captureError(error, {
      form_type: formType,
      form_data: formData,
      category: 'form'
    });
  },

  /**
   * Test de l'intégration Sentry
   */
  test: function () {
    console.log("🧪 Test du gestionnaire d'erreurs TPS...");

    // Test message
    this.captureMessage('Test message depuis TPS BASE V1', 'info', {
      test: true,
      timestamp: new Date().toISOString()
    });

    // Test erreur
    try {
      throw new Error('Test error depuis TPS BASE V1');
    } catch (error) {
      this.captureError(error, {
        test: true,
        type: 'test_error'
      });
    }

    console.log('✅ Tests envoyés à Sentry');
  }
};

// Gestionnaire global d'erreurs JavaScript non capturées
window.addEventListener('error', function (event) {
  TPSErrorHandler.captureError(new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    category: 'uncaught_error'
  });
});

// Gestionnaire pour les promesses rejetées non capturées
window.addEventListener('unhandledrejection', function (event) {
  TPSErrorHandler.captureError(new Error(event.reason), {
    category: 'unhandled_promise_rejection'
  });
});

console.log('✅ TPS Error Handler initialisé');
