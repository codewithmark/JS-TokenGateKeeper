# TokenGatekeeper 🔐

A lightweight JavaScript utility class to securely validate user tokens via API and handle automatic redirects or session termination — **no localStorage, no cookies, no nonsense**.

---

## 🚀 Features

- ✅ Pass token manually (no dependency on localStorage/SecureLS)
- ✅ Auto-executes once all required values are set
- ✅ Validates token via JSON `POST` request
- ✅ Redirects to dashboard if valid
- ✅ Calls logout API if invalid

---

## 📦 Installation

Just copy the class into your JS project:

```js
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
```

---

## 🧠 Usage

```js
new TokenGatekeeper()
  .Token('your_token_here')
  .TokenUrl('/api/validate-token.php')
  .LogoutUrl('/api/logout.php')
  .RedirectUrl('/dashboard'); // auto-executes when all set
```

---

## 📡 Server-Side Expectations

### `/api/validate-token.php` should return:

```json
{
  "status": "success",
  "url": "/dashboard"
}
```

Or for invalid tokens:

```json
{
  "status": "fail"
}
```

### `/api/logout.php` should destroy sessions and cleanup. No specific response expected.

---

## ✅ Behavior Summary

| Condition             | Action                          |
|----------------------|----------------------------------|
| No token             | Logout API is called            |
| Token is valid       | Redirect to returned URL        |
| Token is invalid     | Logout API is called            |
| API throws error     | Logout API is called            |

---

## 📄 License

MIT – Use it, modify it, ship it.
