import { login, register } from "./api.js";
import { authState, setAuthState } from "./state.js";
import { saveAuth } from "./storage.js";

export const renderLoginView = () => {
  return `
    <div class="auth-view">
      <div class="auth-card">
        <div class="auth-title">Вход</div>
        <div class="auth-login-form">
          <input class="auth-input auth-login-login" placeholder="Логин" />
          <input class="auth-input auth-login-password" placeholder="Пароль" type="password" />
          <button type="button" class="auth-button auth-login-button">Войти</button>
          <button type="button" class="auth-switch-button auth-to-register-button">Зарегистрироваться</button>
        </div>
      </div>
    </div>
  `;
};

export const renderRegisterView = () => {
  return `
    <div class="register-view">
      <div class="auth-card">
        <div class="auth-title">Регистрация</div>
        <div class="auth-register-form">
          <input class="auth-input auth-register-name" placeholder="Имя" />
          <input class="auth-input auth-register-login" placeholder="Логин" />
          <input class="auth-input auth-register-password" placeholder="Пароль" type="password" />
          <button type="button" class="auth-button auth-register-button">Зарегистрироваться</button>
          <button type="button" class="auth-switch-button auth-to-login-button">Войти</button>
        </div>
      </div>
    </div>
  `;
};

export const attachLoginHandlers = (onAuthSuccess) => {
  const loginButton = document.querySelector(".auth-login-button");
  const loginLoginInput = document.querySelector(".auth-login-login");
  const loginPasswordInput = document.querySelector(".auth-login-password");

  let isLoginSubmitting = false;
  loginButton?.addEventListener("click", async () => {
    try {
      const loginValue = loginLoginInput.value.trim();
      const passwordValue = loginPasswordInput.value.trim();
      if (loginValue.length < 3 || passwordValue.length < 3) {
        alert("Логин и пароль должны быть не короче 3 символов");
        return;
      }
      if (isLoginSubmitting) return;
      isLoginSubmitting = true;
      loginButton.disabled = true;
      loginButton.textContent = "Входим...";

      const res = await login({
        login: loginValue,
        password: passwordValue,
      });

      const token = res.token || res.user?.token || "";
      const user = res.user || null;
      setAuthState({ token, user });
      saveAuth({ token, user });
      
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (e) {
      alert(`Не удалось войти. ${e?.message || "Проверьте логин и пароль."}`);
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Войти";
      isLoginSubmitting = false;
    }
  });
};

export const attachRegisterHandlers = (onAuthSuccess) => {
  const regButton = document.querySelector(".auth-register-button");
  const regNameInput = document.querySelector(".auth-register-name");
  const regLoginInput = document.querySelector(".auth-register-login");
  const regPasswordInput = document.querySelector(".auth-register-password");

  let isRegisterSubmitting = false;
  regButton?.addEventListener("click", async () => {
    try {
      const nameValue = regNameInput.value.trim();
      const loginValue = regLoginInput.value.trim();
      const passwordValue = regPasswordInput.value.trim();
      if (nameValue.length < 2 || loginValue.length < 3 || passwordValue.length < 3) {
        alert("Имя ≥ 2 символов, логин/пароль ≥ 3 символов");
        return;
      }
      if (isRegisterSubmitting) return;
      isRegisterSubmitting = true;
      regButton.disabled = true;
      regButton.textContent = "Регистрация...";

      const res = await register({
        login: loginValue,
        password: passwordValue,
        name: nameValue,
      });

      const token = res.token || res.user?.token || "";
      const user = res.user || null;
      setAuthState({ token, user });
      saveAuth({ token, user });
      
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (e) {
      alert(`Не удалось зарегистрироваться. ${e?.message || "Попробуйте другие данные."}`);
    } finally {
      regButton.disabled = false;
      regButton.textContent = "Зарегистрироваться";
      isRegisterSubmitting = false;
    }
  });
};

