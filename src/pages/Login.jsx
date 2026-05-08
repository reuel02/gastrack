import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const navigate = useNavigate()

    async function fazerLogin(e) {
        try {
            e.preventDefault()

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: senha
              })

            if (error) {
                throw new Error("Erro ao fazer login: " + error.message)
            } else {
                alert("Usuário logado com sucesso!")
                navigate("/")
            }
            
        } catch (error) {
            alert(error.message)
        }
    }

  return (
    <main className="min-h-screen bg-fundo flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
      <section className="w-full max-w-md bg-card/50 border border-borda rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[inset_0_1px_0_rgba(57,255,20,0.15)]">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-titulo-primario text-2xl sm:text-3xl font-bold">GasTrack</h1>
          <p className="text-descricao text-sm mt-1">Entre para acessar seus abastecimentos</p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={(e) => fazerLogin(e)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-titulo-secundario text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="voce@email.com"
              value={email}
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
              placeholder="Sua senha"
              value={senha}
              className="w-full bg-card-secundario border border-borda rounded-xl px-4 py-3 text-base text-titulo-primario outline-none focus:ring-2 focus:ring-destaque/40"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-destaque text-fundo font-bold rounded-xl py-3 hover:scale-[1.01] transition-transform active:scale-95"
          >
            Entrar
          </button>
        </form>

        <footer className="mt-6 text-center">
          <p className="text-descricao text-sm">
            Ainda nao tem conta?{" "}
            <button type="button" 
            className="text-destaque font-semibold"
            onClick={() => navigate("/cadastro")}
            >
              Criar conta
            </button>
          </p>
        </footer>
      </section>
    </main>
  );
}