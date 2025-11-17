const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
    
    async register(req, res) {
        const { nome, email, senha, cargo } = req.body;

        try {
            const senhaHash = await bcrypt.hash(senha, 10);

            const [result] = await pool.query(
                "INSERT INTO colaboradores (nome, email, senha, cargo) VALUES (?, ?, ?, ?)",
                [nome, email, senhaHash, cargo]
            );

            res.json({ message: "Colaborador cadastrado com sucesso!" });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Erro ao cadastrar." });
        }
    },

    async login(req, res) {
        const { email, senha, cargo } = req.body;

        try {
            const [user] = await pool.query(
                "SELECT * FROM colaboradores WHERE email = ? AND cargo = ?",
                [email, cargo]
            );

            if (user.length === 0) {
                return res.status(400).json({ error: "Usuário não encontrado." });
            }

            const valido = await bcrypt.compare(senha, user[0].senha);
            if (!valido) {
                return res.status(400).json({ error: "Senha incorreta." });
            }

            const token = jwt.sign(
                { id: user[0].id, cargo: user[0].cargo },
                "segredo123",
                { expiresIn: "1d" }
            );

            res.json({ message: "Login OK!", token, cargo: user[0].cargo });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Erro no login." });
        }
    }
};
