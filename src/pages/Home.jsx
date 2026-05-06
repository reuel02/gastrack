import { BsFuelPumpFill } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { useEffect, useState } from "react";
import ModalAbastecimento from "../components/ModalAbastecimento";
import { supabase } from "../utils/supabase";

function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const mes = meses[data.getUTCMonth()];
    const ano = data.getUTCFullYear();
    const horas = String(data.getUTCHours()).padStart(2, '0');
    const minutos = String(data.getUTCMinutes()).padStart(2, '0');
    
    return `${dia} de ${mes}, ${ano} às ${horas}:${minutos}`;
}

export default function Home() {
    // STATES
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [posto, setPosto] = useState("")
    const [litros, setLitros] = useState(0)
    const [valor, setValor] = useState(0)
    const [data, setData] = useState(new Date())
    const [kmAtual, setKmAtual] = useState(0)
    const [abastecimentos, setAbastecimentos] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        buscarDados()
    }, [])

    async function buscarDados() {
        try {
            const { data: dadosRetornados, error } = await supabase
                .from('abastecimentos')
                .select('*') 
            
            if (error) {
                throw new Error('Erro do Supabase: ' + error.message)
            }

            setAbastecimentos(dadosRetornados)
        } catch (error) {
            alert("Ocorreu um erro: " + error.message)
        }
    }

    async function salvarAbastecimento() {
        setIsSaving(true)
        try {
            // Delay de 1 segundo para mostrar o botão "Salvando..."
            await new Promise(resolve => setTimeout(resolve, 1000))

            const novoKm = Number(kmAtual);
            const novosLitros = Number(litros);
            let consumoCalculado = 0;

            // Se já existirem abastecimentos, pegamos o hodômetro do último para calcular o consumo
            if (abastecimentos.length > 0) {
                // Ordenamos para ter certeza de pegar o maior KM registrado até agora
                const absOrdenados = [...abastecimentos].sort((a, b) => a.km_atual - b.km_atual);
                const ultimoAbs = absOrdenados[absOrdenados.length - 1];
                const kmAnterior = ultimoAbs.km_atual;

                // Só calcula se o KM novo for maior que o anterior e tiver litros
                if (novoKm > kmAnterior && novosLitros > 0) {
                    const distanciaPercorrida = novoKm - kmAnterior;
                    consumoCalculado = Number((distanciaPercorrida / novosLitros).toFixed(1));
                }
            }

            const { data: dadosInseridos, error } = await supabase
                .from('abastecimentos')
                .insert([
                    {
                        posto: posto,
                        litros: novosLitros,
                        valor: Number(valor), 
                        data: data,
                        km_atual: novoKm,
                        consumo_kml: consumoCalculado
                    }
                ])
            
            if (error) {
                throw new Error('Erro ao salvar no Supabase: ' + error.message)
            }

            alert("Abastecimento salvo com sucesso!")
            setModalIsOpen(false)
            buscarDados()

        } catch (error) {
            alert("Ocorreu um erro: " + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    const totalAbastecimentos = abastecimentos.length
    const totalGasto = abastecimentos.reduce((total, abastecimento) => total + abastecimento.valor, 0)

    // Cálculo do consumo médio geral
    let consumoMedioGeral = 0;
    if (abastecimentos.length > 1) {
        // Ordenamos pela quilometragem para garantir os cálculos corretos
        const absOrdenados = [...abastecimentos].sort((a, b) => a.km_atual - b.km_atual);
        
        const primeiroKm = absOrdenados[0].km_atual;
        const ultimoKm = absOrdenados[absOrdenados.length - 1].km_atual;
        const kmTotalRodado = ultimoKm - primeiroKm;
        
        // Ignoramos os litros do primeiro abastecimento, pois eles serviram 
        // para encher o tanque inicial, antes de começarmos a medir a distância.
        const litrosTotalConsumidos = absOrdenados.slice(1).reduce((total, abs) => total + abs.litros, 0);
        
        if (litrosTotalConsumidos > 0) {
            consumoMedioGeral = (kmTotalRodado / litrosTotalConsumidos).toFixed(1);
        }
    }

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
                    
                    {/* Exibindo o Consumo ou os tracinhos de placeholder caso não haja dados suficientes */}
                    <div className="flex items-baseline mb-2 mt-2">
                        {Number(consumoMedioGeral) > 0 ? (
                            <span className="text-titulo-primario text-4xl font-bold">{consumoMedioGeral}</span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-7 bg-destaque rounded-[2px] shadow-[0_0_10px_rgba(57,255,20,0.4)]"></div>
                                <div className="h-2 w-7 bg-destaque rounded-[2px] shadow-[0_0_10px_rgba(57,255,20,0.4)]"></div>
                            </div>
                        )}
                        <span className="text-titulo-secundario text-2xl font-medium ml-1">km/l</span>
                    </div>

                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col flex-1 bg-card-secundario justify-center items-center py-6 px-3 rounded-2xl">
                            <p className="text-titulo-secundario text-xs font-medium mb-2 text-center leading-tight">Total de abastecimentos</p>
                            <p className="text-titulo-primario text-2xl font-bold">{totalAbastecimentos}</p>
                        </div>
                        <div className="flex flex-col flex-1 bg-card-secundario justify-center items-center py-6 px-3 rounded-2xl">
                            <p className="text-titulo-secundario text-xs font-medium mb-2 text-center leading-tight">Total gasto</p>
                            <p className="text-titulo-primario text-2xl font-bold">R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                </div>
                    <div>
                        <p className="text-titulo-secundario uppercase tracking-widest text-sm mb-5">Abastecimentos recentes</p>
                        {abastecimentos.map((abastecimento) => (
                            <div key={abastecimento.id} className="bg-card/40 p-4 border-b border-card-secundario flex flex-col gap-2">
                                    <p className="text-descricao">{formatarData(abastecimento.data)}</p>
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex flex-col">
                                        <p className="text-titulo-secundario">Posto de Gasolina</p>
                                        <h2 className="text-titulo-primario">{abastecimento.posto}</h2>
                                    </div>
                                    <p className="text-destaque bg-destaque/40 rounded-3xl p-2 text-xs">{abastecimento.consumo_kml} km/l</p>
                                </div>
                                <div className="flex flex-row justify-between text-sm">
                                    <p className="text-descricao">Litros</p>
                                    <p className="text-descricao">Valor</p>
                                    <p className="text-descricao">Odômetro</p>
                                </div>
                                <div className="flex flex-row justify-between text-titulo-primario text-lg">
                                    <p>{abastecimento.litros}<span className="text-titulo-secundario text-sm">L</span></p>
                                    <p className="text-destaque">R$ {abastecimento.valor}</p>
                                    <p>{abastecimento.km_atual}<span className="text-titulo-secundario text-sm">km</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 pointer-events-none">
                    <button className="flex flex-row justify-center items-center gap-2 bg-destaque w-full max-w-[400px] text-fundo font-bold text-lg rounded-2xl p-4 shadow-[0_0_20px_rgba(57,255,20,0.3)] pointer-events-auto hover:scale-[1.02] transition-transform active:scale-95"
                    onClick={() => setModalIsOpen(true)}
                    >
                        <IoAdd className="size-7"/>
                        Adicionar Abastecimento
                    </button>
                </div>
            </div>

            {modalIsOpen && (
                <ModalAbastecimento onClose={setModalIsOpen} posto={posto} setPosto={setPosto} litros={litros} setLitros={setLitros} valor={valor} setValor={setValor} data={data} setData={setData} kmAtual={kmAtual} setKmAtual={setKmAtual} salvarAbastecimento={salvarAbastecimento} isSaving={isSaving}/>
            )}
        </div>
    )
}