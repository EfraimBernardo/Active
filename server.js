require("dotenv").config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ PERMITE RECEBER JSON DO FETCH
app.use(express.json());

// ✅ PERMITE USAR ARQUIVOS DA PASTA PUBLIC
app.use(express.static("public"));

// ✅ ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ CONFIGURA NODMAILER
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// ✅ TESTE AUTOMÁTICO AO INICIAR
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ ERRO NO SMTP:", error);
  } else {
    console.log("✅ SMTP CONECTADO COM SUCESSO");
  }
});

// ✅ ROTA POST DO FORMULÁRIO
app.post("/enviar", async (req, res) => {
  const {
    Nome,
    Idade,
    Email,
    Telefone,
    Pretende,
    Instituicao,
    Saber,
    Comentarios
  } = req.body;

  if (!Nome || !Idade || !Email || !Telefone || !Pretende || !Instituicao || !Saber) {
    return res.status(400).send("❌ Preencha todos os campos obrigatórios.");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: Email,
    subject: "Nova mensagem do formulário",
    text: `Nome: ${Nome}
Idade: ${Idade}
Email: ${Email}
Telefone: ${Telefone}
Visão: ${Pretende}
Resultados: ${Instituicao}
Como soube: ${Saber}
Comentário: ${Comentarios}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado com sucesso!");
    res.send("✅ Mensagem enviada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    res.status(500).send("❌ Erro ao enviar a mensagem.");
  }
});

// ✅ ROTA DE TESTE DO EMAIL
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Teste Render",
      text: "Se esse email chegou, então o Render está OK!"
    });
    res.send("✅ Email enviado com sucesso!");
  } catch (err) {
    console.log("❌ ERRO AO ENVIAR:", err);
    res.send("❌ Falha ao enviar email");
  }
});

// ✅ SERVIDOR PRONTO PARA O RENDER
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
