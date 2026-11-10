/**
 * PlayGrid HTML5 Game SDK v1.0
 * 
 * Lightweight client bridge for games hosted in PlayGrid sandboxed iframes.
 * Provides safe postMessage communication with the parent PlayGrid player.
 */

;(function (window) {
  'use strict';

  var _callbacks = {
    onPause: null,
    onResume: null,
    onMuteToggle: null,
  };

  var _sessionToken = null;

  var PlayGrid = {
    /**
     * Initialize SDK handshake with the parent portal
     */
    init: function (options) {
      options = options || {};
      _sessionToken = options.sessionToken || ('pg_' + Math.random().toString(36).substring(2, 10));

      window.addEventListener('message', function (event) {
        if (!event.data || typeof event.data !== 'object') return;
        var type = event.data.type;
        var payload = event.data.payload;

        if (type === 'PLAYGRID_PAUSE' && typeof _callbacks.onPause === 'function') {
          _callbacks.onPause();
        } else if (type === 'PLAYGRID_RESUME' && typeof _callbacks.onResume === 'function') {
          _callbacks.onResume();
        } else if (type === 'PLAYGRID_MUTE' && typeof _callbacks.onMuteToggle === 'function') {
          _callbacks.onMuteToggle(payload && payload.muted);
        }
      });

      // Notify parent that game is ready
      this._send('PLAYGRID_GAME_READY', {
        title: document.title,
        sessionToken: _sessionToken,
        timestamp: Date.now()
      });

      return this;
    },

    /**
     * Submit verified score to parent player
     */
    submitScore: function (score, metadata) {
      this._send('PLAYGRID_SCORE_SUBMIT', {
        score: Number(score) || 0,
        metadata: metadata || {},
        timestamp: Date.now()
      });
    },

    /**
     * Request a non-intrusive interstitial ad break (e.g. between game levels)
     */
    showInterstitial: function (onComplete) {
      this._send('PLAYGRID_AD_INTERSTITIAL_REQUEST', {});
      if (typeof onComplete === 'function') {
        // Auto-resume after demonstration break
        setTimeout(onComplete, 3000);
      }
    },

    /**
     * Request voluntary rewarded ad (e.g. revive player)
     */
    showRewardedAd: function (onRewarded, onDismissed) {
      this._send('PLAYGRID_AD_REWARDED_REQUEST', {});
      // In demo mode, reward immediately after brief notification
      setTimeout(function () {
        if (typeof onRewarded === 'function') onRewarded({ rewarded: true });
      }, 2500);
    },

    /**
     * Hook pause callbacks
     */
    onPause: function (fn) { _callbacks.onPause = fn; },
    onResume: function (fn) { _callbacks.onResume = fn; },
    onMuteToggle: function (fn) { _callbacks.onMuteToggle = fn; },

    _send: function (type, payload) {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: type, payload: payload }, '*');
      }
    }
  };

  window.PlayGrid = PlayGrid;
})(window);

