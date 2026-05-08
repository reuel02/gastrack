import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const navigate = useNavigate()

    async function fazerCadastro(e) {
        try {
            e.preventDefault()

            const {data, error} = await supabase.auth.signUp({
                email,
                password: senha,
                options: {
                    data: {
                        nome
                    }
                }
            })

            if (error) {
                throw new Error("Erro ao fazer cadastro: " + error.message)
            }

            alert("Cadastro realizado com sucesso, você será redirecionado pro login")
            navigate("/login")
        } catch (error) {
            alert(error.message)
        }
    }

  return (
    <main className="min-h-screen bg-fundo flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
      <section className="w-full max-w-md bg-card/50 border border-borda rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[inset_0_1px_0_rgba(57,255,20,0.15)]">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-titulo-primario text-2xl sm:text-3xl font-bold">GasTrack</h1>
          <p className="text-descricao text-sm mt-1">Crie sua conta para comecar a registrar abastecimentos</p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={(e) => fazerCadastro(e)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="nome" className="text-titulo-secundario text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              placeholder="Seu nome"
              className="w-full bg-card-secundario border border-borda rounded-xl px-4 py-3 text-base text-titulo-primario outline-none focus:ring-2 focus:ring-destaque/40"
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-titulo-secundario text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="voce@email.com"
              className="w-full bg-card-secundario border border-borda rounded-xl px-4 py-3 text-base text-titulo-primario outline-none focus:ring-2 focus:ring-destaque/40"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="senha" className="text-titulo-secundario text-sm font-medium">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Crie uma senha"
              className="w-full bg-card-secundario border border-borda rounded-xl px-4 py-3 text-base text-titulo-primario outline-none focus:ring-2 focus:ring-destaque/40"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-destaque text-fundo font-bold rounded-xl py-3 hover:scale-[1.01] transition-transform active:scale-95"
          >
            Criar conta
          </button>
        </form>

        <footer className="mt-6 text-center">
          <p className="text-descricao text-sm">
            Ja possui conta?{" "}
            <button 
            type="button" 
            className="text-destaque font-semibold"
            onClick={() => navigate('/login')}
            > 
              Entrar
            </button>
          </p>
        </footer>
      </section>
    </main>
  );
}