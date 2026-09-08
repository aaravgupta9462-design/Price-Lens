/**
 * Google OAuth 2.0 Integration using Google Identity Services (GIS)
 */

/**
 * Wait for Google Identity Services script to load
 */
const waitForGoogleScript = (timeoutMs = 4000) => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      return resolve(window.google);
    }
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        clearInterval(interval);
        resolve(window.google);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        reject(new Error('Google Identity Services SDK failed to load. Please check your internet connection.'));
      }
    }, 100);
  });
};

/**
 * Get configured Google Client ID from env or saved storage
 */
export const getGoogleClientId = () => {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (envId && !envId.includes('placeholder') && envId.trim() !== '') {
    return envId.trim();
  }
  const savedId = localStorage.getItem('pricelens_google_client_id');
  if (savedId && savedId.trim() !== '') {
    return savedId.trim();
  }
  // Default Client ID configured from Google Cloud Console
  return '266648942433-mk1j64u25ejgh7dtkm2b2ioj60n3kqf7.apps.googleusercontent.com';
};

/**
 * Save Google Client ID dynamically
 */
export const setGoogleClientId = (clientId) => {
  if (clientId && clientId.trim()) {
    localStorage.setItem('pricelens_google_client_id', clientId.trim());
  }
};

/**
 * Triggers Google Account Selector Popup and retrieves authentic user profile
 * @returns {Promise<{ user: Object, accessToken: string }>}
 */
export const triggerGoogleLogin = async () => {
  await waitForGoogleScript();

  let clientId = getGoogleClientId();

  // If no valid Client ID is found, prompt the user to input their Google Client ID
  if (!clientId) {
    const inputId = window.prompt(
      'Google Client ID is required for real Google OAuth.\n\nPlease enter your Google Client ID (from Google Cloud Console):',
      ''
    );
    if (!inputId || !inputId.trim()) {
      throw new Error('Google Sign-In cancelled: Missing Google Client ID. Please configure VITE_GOOGLE_CLIENT_ID in frontend/.env.');
    }
    clientId = inputId.trim();
    setGoogleClientId(clientId);
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            return reject(new Error(tokenResponse.error_description || tokenResponse.error || 'Google login failed'));
          }

          try {
            // Fetch authentic Google user profile information
            const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
              }
            });

            if (!userResponse.ok) {
              throw new Error('Failed to fetch user profile from Google');
            }

            const profile = await userResponse.json();

            const user = {
              id: profile.sub,
              name: profile.name || profile.given_name || 'Google User',
              email: profile.email,
              avatar: profile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
              provider: 'google',
              googleId: profile.sub
            };

            resolve({
              user,
              accessToken: tokenResponse.access_token
            });
          } catch (profileErr) {
            reject(new Error(profileErr.message || 'Failed to retrieve Google user profile'));
          }
        },
        error_callback: (error) => {
          if (error.type === 'popup_closed') {
            reject(new Error('Google Sign-In popup was closed.'));
          } else {
            reject(new Error(error.message || 'Google Sign-In failed.'));
          }
        }
      });

      // Opens the authentic Google Account Selector popup
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
};
