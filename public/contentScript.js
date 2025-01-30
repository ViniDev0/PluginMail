// Model - Define os dados e palavras-chave suspeitas
class PhishingModel {
  constructor() {
      this.suspiciousWords = ["urgente", "confirme seus dados", "senha", "prêmio", "clique aqui", "banco", "pagamento", "acesso bloqueado", "finalizar", "grátis"];
  }

  containsSuspiciousWords(text) {
      return this.suspiciousWords.some(word => text.toLowerCase().includes(word));
  }
}

// Service - Lida com a lógica de análise de phishing
class PhishingService {
  constructor(model) {
      this.model = model;
  }

  highlightSuspiciousEmails() {
      const emailElements = document.querySelectorAll(".bog"); // Títulos dos e-mails no Gmail
      emailElements.forEach(email => {
          let emailText = email.innerText;
          if (this.model.containsSuspiciousWords(emailText)) {
              let parentEmailRow = email.closest("tr");
              if (parentEmailRow) {
                  parentEmailRow.style.border = "2px solid red";
                  parentEmailRow.style.borderRadius = "5px";
              }
          }
      });
  }

  checkLinksForPhishing() {
      const links = document.querySelectorAll("a");
      links.forEach(link => {
          fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=YOUR_GOOGLE_API_KEY`, {
              method: "POST",
              body: JSON.stringify({
                  client: { clientId: "email-checker", clientVersion: "1.0" },
                  threatInfo: {
                      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                      platformTypes: ["ANY_PLATFORM"],
                      threatEntryTypes: ["URL"],
                      threatEntries: [{ url: link.href }]
                  }
              })
          })
          .then(response => response.json())
          .then(data => {
              if (data.matches) {
                  link.style.color = "red";
                  link.style.fontWeight = "bold";
                  link.title = "Link suspeito detectado!";
              }
          })
          .catch(error => console.error("Erro ao verificar link suspeito:", error));
      });
  }
}

// Controller - Gerencia a execução do serviço
class PhishingController {
  constructor(service) {
      this.service = service;
  }

  run() {
      this.service.highlightSuspiciousEmails();
      this.service.checkLinksForPhishing();
  }
}

const model = new PhishingModel();
const service = new PhishingService(model);
const controller = new PhishingController(service);

setInterval(() => controller.run(), 5000);