class TokenGatekeeper {
  constructor() {
    this.token = null;
    this.tokenUrl = null;
    this.logoutUrl = null;
    this.redirectUrl = null;
    this.ready = {
      token: false,
      tokenUrl: false,
      logoutUrl: false,
      redirectUrl: false,
    };
  }

  Token(token) {
    this.token = token;
    this.ready.token = true;
    this.tryExecute();
    return this;
  }

  TokenUrl(url) {
    this.tokenUrl = url;
    this.ready.tokenUrl = true;
    this.tryExecute();
    return this;
  }

  LogoutUrl(url) {
    this.logoutUrl = url;
    this.ready.logoutUrl = true;
    this.tryExecute();
    return this;
  }

  RedirectUrl(url) {
    this.redirectUrl = url;
    this.ready.redirectUrl = true;
    this.tryExecute();
    return this;
  }

  tryExecute() {
    const allSet = Object.values(this.ready).every(Boolean);
    if (allSet) this.execute();
  }

  async execute() {
    if (!this.token) {
      this.logout();
      return;
    }

    try {
      const res = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token })
      });

      const data = await res.json();

      if (data.status === 'success') {
        window.location.href = data.url || this.redirectUrl;
      } else {
        this.logout();
      }

    } catch (err) {
      console.error('Token validation failed:', err);
      this.logout();
    }
  }

  logout() {
    fetch(this.logoutUrl, { method: 'POST' });
  }
}
