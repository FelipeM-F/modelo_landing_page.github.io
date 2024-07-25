

function register(event) {
  event.preventDefault();
  const form = document.getElementById("register-form");
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const userData = JSON.parse(localStorage.getItem("users")) || [];
  userData.push({ nickname, email, password, favorites: [] });
  localStorage.setItem("users", JSON.stringify(userData));

  console.log("Registro de usuário:", { nickname, email, password });
  openModalWithAutoClose("Registro realizado com sucesso!");
  form.reset();
}

function login(event) {
  event.preventDefault();
  const form = document.getElementById("login-form");
  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
      (u) => u.email === loginEmail && u.password === loginPassword
  );

  if (user) {
      openModalWithAutoClose("Login realizado com sucesso!");
      const loggedUser = { nickname: user.nickname, email: user.email };
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      window.location.reload();
      
  } else {
      openModalWithAutoClose("Usuário ou senha inválido!");
  }

  console.log("Login do usuário:", { loginEmail, loginPassword });
  closeModal("modal-login");
  form.reset();
}


function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
      modal.style.display = 'block'; // Certifique-se de que o elemento existe
  } else {
      console.error('Modal with ID "' + modalId + '" not found.');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}


function enviarFormulario(event) {
  event.preventDefault();
  openModalWithAutoClose('Obrigado pela sua mensagem, em breve retornaremos!');
}

function openModalWithAutoClose(message) {
  const modal = document.getElementById("modal-message");
  const modalMessage = document.getElementById("message-text");

  modalMessage.textContent = message;
  modal.style.display = "block";

  setTimeout(() => {
    modal.style.display = "none";
  }, 2000);
}

function excluirUsuário() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (!loggedUser) {
    console.error("Nenhum usuário logado.");
    return;
  }

  const userIndex = users.findIndex((user) => user.email === loggedUser.email);

  if (userIndex === -1) {
    console.error("Usuário logado não encontrado na lista de usuários.");
    return;
  }
  
  users.splice(userIndex, 1);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem("loggedUser");
  openModalWithAutoClose('Usuário excluído!');
  window.location.reload();
}

function sair() {
  localStorage.removeItem("loggedUser");
  window.location.reload();
}
