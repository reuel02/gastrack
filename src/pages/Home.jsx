import { BsFuelPumpFill } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";

export default function Home() {
    return (
        <div className="min-h-screen flex justify-center bg-fundo relative">
            <div className="flex flex-col gap-10 pb-32">
                <div className="flex flex-row justify-between mt-10 items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-titulo-primario text-2xl font-bold">GasTrack</h1>
                        <p className="text-descricao text-sm">Gestão de abastecimentos</p>
                    </div>
                    <div>
                        <BsFuelPumpFill className="text-destaque border rounded-xl p-3 size-12"/>
                    </div>
                </div>
                <div className="flex flex-col gap-6 border border-borda shadow-[inset_0_1px_0_rgba(57,255,20,0.15)] rounded-3xl px-7 pb-7 pt-2 bg-card/50">
                    <h2 className="text-xs font-bold text-titulo-secundario uppercase tracking-widest mt-5">Consumo médio</h2>
                    
                    {/* Tracinhos verdes de destaque */}
                    <div className="flex items-center gap-2 mb-2 mt-2">
                        <div className="h-2 w-7 bg-destaque rounded-[2px] shadow-[0_0_10px_rgba(57,255,20,0.4)]"></div>
                        <div className="h-2 w-7 bg-destaque rounded-[2px] shadow-[0_0_10px_rgba(57,255,20,0.4)]"></div>
                        <span className="text-titulo-secundario text-2xl font-medium ml-1">km/l</span>
                    </div>

                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col flex-1 bg-card-secundario justify-center items-center py-6 px-3 rounded-2xl">
                            <p className="text-titulo-secundario text-xs font-medium mb-2 text-center leading-tight">Total de abastecimentos</p>
                            <p className="text-titulo-primario text-2xl font-bold">0</p>
                        </div>
                        <div className="flex flex-col flex-1 bg-card-secundario justify-center items-center py-6 px-3 rounded-2xl">
                            <p className="text-titulo-secundario text-xs font-medium mb-2 text-center leading-tight">Total gasto</p>
                            <p className="text-titulo-primario text-2xl font-bold">R$ 0</p>
                        </div>
                    </div>

                </div>
                    <div>
                        <p className="text-titulo-secundario uppercase tracking-widest text-sm">Abastecimentos recentes</p>
                        <div>

                        </div>
                    </div>
                <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 pointer-events-none">
                    <button className="flex flex-row justify-center items-center gap-2 bg-destaque w-full max-w-[400px] text-fundo font-bold text-lg rounded-2xl p-4 shadow-[0_0_20px_rgba(57,255,20,0.3)] pointer-events-auto hover:scale-[1.02] transition-transform active:scale-95">
                        <IoAdd className="size-7"/>
                        Adicionar Abastecimento
                    </button>
                </div>
            </div>
        </div>
    )
}