
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

// ✅ ROTA POST CORRETA
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

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: `"Formulário" <domingossapanda@gmail.com>`,
    to: "domingossapanda@gmail.com",
    replyTo: Email,
    subject: "Nova mensagem do formulário",
    text: `
Nome: ${Nome}
Idade: ${Idade}
Email: ${Email}
Telefone: ${Telefone}
Visão: ${Pretende}
Resultados: ${Instituicao}
Como soube: ${Saber}
Comentário: ${Comentarios}
    `
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

// ✅ SERVIDOR PRONTO PARA O RENDER
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
})
