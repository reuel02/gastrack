import { IoMdClose } from "react-icons/io";

export default function ModalAbastecimento({ onClose, posto, setPosto, litros, setLitros, valor, setValor, data, setData, kmAtual, setKmAtual, salvarAbastecimento, isSaving }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-fundo w-full max-w-md rounded-3xl flex flex-col gap-5 p-6 shadow-2xl">
                <div className="flex flex-row justify-between items-center border-b border-borda pb-3">
                    <h2 className="text-titulo-primario text-lg font-bold">Novo Abastecimento</h2>
                    <IoMdClose 
                        className="text-titulo-secundario hover:text-destaque cursor-pointer size-6 transition-colors" 
                        onClick={() => onClose(false)}
                    />
                </div>
                
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-titulo-secundario text-xs font-bold tracking-wider">POSTO</label>
                        <input type="text" placeholder="Nome do posto" className="w-full rounded-xl bg-card border border-borda text-titulo-primario p-3 outline-none focus:border-destaque"
                        value={posto}
                        onChange={(e) => setPosto(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <label className="text-titulo-secundario text-xs font-bold tracking-wider">LITROS</label>
                            <input type="number" placeholder="0.00" className="w-full rounded-xl bg-card border border-borda text-titulo-primario p-3 outline-none focus:border-destaque"
                            value={litros}
                            onChange={(e) => setLitros(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <label className="text-titulo-secundario text-xs font-bold tracking-wider">VALOR (R$)</label>
                            <input type="number" placeholder="0.00" className="w-full rounded-xl bg-card border border-borda text-titulo-primario p-3 outline-none focus:border-destaque"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-titulo-secundario text-xs font-bold tracking-wider">DATA E HORA</label>
                        <input type="datetime-local" className="w-full rounded-xl bg-card border border-borda text-titulo-primario p-3 outline-none focus:border-destaque"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-titulo-secundario text-xs font-bold tracking-wider">KM ATUAL (ODÔMETRO)</label>
                        <input type="number" placeholder="Ex: 15200" className="w-full rounded-xl bg-card border border-borda text-titulo-primario p-3 outline-none focus:border-destaque"
                        value={kmAtual}
                        onChange={(e) => setKmAtual(e.target.value)}
                        />
                    </div>
                </div>
                
                <button 
                    className={`bg-destaque mt-2 w-full text-fundo font-bold text-lg rounded-xl p-4 shadow-[0_0_15px_rgba(57,255,20,0.3)] tracking-widest transition-all ${isSaving ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-[1.02] active:scale-95'}`}
                    onClick={salvarAbastecimento}
                    disabled={isSaving}
                >
                    {isSaving ? "SALVANDO..." : "SALVAR ABASTECIMENTO"}
                </button>
            </div>
        </div>
    )
}