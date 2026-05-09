import { BsFuelPumpFill } from "react-icons/bs";
import { IoAdd, IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import ModalAbastecimento from "../components/ModalAbastecimento";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

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

function getMesAtualFormatado() {
    const agora = new Date();
    const ano = agora.getUTCFullYear();
    const mes = String(agora.getUTCMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
}

function formatDateForDatetimeLocal(value) {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Home() {
    // STATES
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [posto, setPosto] = useState("")
    const [litros, setLitros] = useState(0)
    const [valor, setValor] = useState(0)
    const [data, setData] = useState(() => formatDateForDatetimeLocal(new Date()))
    const [kmAtual, setKmAtual] = useState(0)
    const [abastecimentos, setAbastecimentos] = useState([])
    const [isSaving, setIsSaving] = useState(false)
    const [mesSelecionado, setMesSelecionado] = useState(getMesAtualFormatado())
    const [deletingId, setDeletingId] = useState(null)

    const navigate = useNavigate()

    const buscarDados = useCallback(async () => {
        try {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError || !session?.user) {
                navigate("/login");
                return;
            }

            const [ano, mes] = mesSelecionado.split("-").map(Number);
            const inicioMes = new Date(Date.UTC(ano, mes - 1, 1, 0, 0, 0));
            const inicioProximoMes = new Date(Date.UTC(ano, mes, 1, 0, 0, 0));

            const { data: dadosRetornados, error } = await supabase
                .from("abastecimentos")
                .select("*")
                .eq("user_id", session.user.id)
                .gte("data", inicioMes.toISOString())
                .lt("data", inicioProximoMes.toISOString())
                .order("data", { ascending: false });

            if (error) {
                throw new Error("Erro do Supabase: " + error.message);
            }

            setAbastecimentos(dadosRetornados ?? []);
        } catch (error) {
            alert("Ocorreu um erro: " + error.message);
        }
    }, [mesSelecionado, navigate]);

    useEffect(() => {
        buscarDados();
    }, [buscarDados]);

    function fecharModal() {
        setModalIsOpen(false);
        setEditingId(null);
        setPosto("");
        setLitros(0);
        setValor(0);
        setData(formatDateForDatetimeLocal(new Date()));
        setKmAtual(0);
    }

    function abrirModalNovo() {
        setEditingId(null);
        setPosto("");
        setLitros(0);
        setValor(0);
        setData(formatDateForDatetimeLocal(new Date()));
        setKmAtual(0);
        setModalIsOpen(true);
    }

    function abrirModalEditar(abastecimento) {
        setEditingId(abastecimento.id);
        setPosto(abastecimento.posto ?? "");
        setLitros(abastecimento.litros ?? 0);
        setValor(abastecimento.valor ?? 0);
        setData(formatDateForDatetimeLocal(abastecimento.data));
        setKmAtual(abastecimento.km_atual ?? 0);
        setModalIsOpen(true);
    }

    async function salvarAbastecimento() {
        setIsSaving(true)
        try {
            // Delay de 1 segundo para mostrar o botão "Salvando..."
            await new Promise(resolve => setTimeout(resolve, 1000))

            const novoKm = Number(kmAtual);
            const novosLitros = Number(litros);
            let consumoCalculado = 0;

            const listaParaCalculo = editingId
                ? abastecimentos.filter((a) => a.id !== editingId)
                : abastecimentos;

            if (listaParaCalculo.length > 0) {
                const absOrdenados = [...listaParaCalculo].sort((a, b) => a.km_atual - b.km_atual);
                const ultimoAbs = absOrdenados[absOrdenados.length - 1];
                const kmAnterior = ultimoAbs.km_atual;

                if (novoKm > kmAnterior && novosLitros > 0) {
                    const distanciaPercorrida = novoKm - kmAnterior;
                    consumoCalculado = Number((distanciaPercorrida / novosLitros).toFixed(1));
                }
            }

            const { data: { session }, error: sessionError } = await supabase.auth.getSession()
            if (sessionError || !session?.user) {
                throw new Error('Sessão expirada. Faça login novamente.')
            }

            const payload = {
                posto,
                litros: novosLitros,
                valor: Number(valor),
                data,
                km_atual: novoKm,
                consumo_kml: consumoCalculado,
            };

            let error;
            if (editingId) {
                const res = await supabase
                    .from("abastecimentos")
                    .update(payload)
                    .eq("id", editingId);
                error = res.error;
            } else {
                const res = await supabase.from("abastecimentos").insert([
                    {
                        ...payload,
                        user_id: session.user.id,
                    },
                ]);
                error = res.error;
            }

            if (error) {
                throw new Error('Erro ao salvar no Supabase: ' + error.message)
            }

            alert(editingId ? "Abastecimento atualizado!" : "Abastecimento salvo com sucesso!")
            fecharModal()
            buscarDados()

        } catch (error) {
            alert("Ocorreu um erro: " + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    async function excluirAbastecimento(id) {
        if (!window.confirm("Excluir este abastecimento? Esta ação não pode ser desfeita.")) {
            return;
        }
        setDeletingId(id);
        try {
            const { error } = await supabase.from("abastecimentos").delete().eq("id", id);

            if (error) {
                throw new Error(error.message);
            }
            await buscarDados();
        } catch (error) {
            alert("Não foi possível excluir: " + error.message);
        } finally {
            setDeletingId(null);
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
        <div className="min-h-screen flex justify-center bg-fundo relative px-4 sm:px-6">
            <div className="w-full max-w-2xl flex flex-col gap-8 sm:gap-10 pb-32">
                <div className="flex flex-row justify-between mt-8 sm:mt-10 items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-titulo-primario text-2xl font-bold">GasTrack</h1>
                        <p className="text-descricao text-sm">Gestão de abastecimentos</p>
                    </div>
                    <div>
                        <BsFuelPumpFill className="text-destaque border rounded-xl p-3 size-12"/>
                    </div>
                </div>
                <div className="flex flex-col gap-6 border border-borda shadow-[inset_0_1px_0_rgba(57,255,20,0.15)] rounded-3xl px-5 sm:px-7 pb-6 sm:pb-7 pt-2 bg-card/50">
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

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
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
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5">
                            <p className="text-titulo-secundario uppercase tracking-widest text-sm">Histórico do mês</p>
                            <div className="w-full sm:w-auto flex flex-col gap-2 bg-card/50 border border-borda rounded-xl px-3 py-2 shadow-[inset_0_1px_0_rgba(57,255,20,0.08)]">
                                <label htmlFor="mes-filtro" className="text-titulo-secundario text-[11px] font-semibold uppercase tracking-wider">
                                    Filtrar por mês
                                </label>
                                <input
                                    id="mes-filtro"
                                    type="month"
                                    value={mesSelecionado}
                                    onChange={(e) => setMesSelecionado(e.target.value)}
                                    className="w-full sm:w-auto bg-card-secundario border border-borda rounded-lg px-3 py-2 text-titulo-primario text-sm font-medium outline-none focus:border-destaque focus:ring-2 focus:ring-destaque/30"
                                />
                            </div>
                        </div>
                        {abastecimentos.length === 0 ? (
                            <p className="text-descricao text-sm py-6 text-center">
                                Nenhum abastecimento neste mês.
                            </p>
                        ) : null}
                        {abastecimentos.map((abastecimento) => (
                            <div key={abastecimento.id} className="bg-card/40 p-4 border-b border-card-secundario flex flex-col gap-2">
                                <div className="flex flex-row justify-between items-start gap-2">
                                    <p className="text-descricao">{formatarData(abastecimento.data)}</p>
                                    <div className="flex shrink-0 items-center gap-0.5">
                                        <button
                                            type="button"
                                            onClick={() => abrirModalEditar(abastecimento)}
                                            disabled={deletingId === abastecimento.id}
                                            className="rounded-lg p-2 text-titulo-secundario hover:text-destaque hover:bg-destaque/10 border border-transparent hover:border-destaque/25 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                                            aria-label="Editar abastecimento"
                                        >
                                            <IoCreateOutline className="size-5" aria-hidden />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => excluirAbastecimento(abastecimento.id)}
                                            disabled={deletingId === abastecimento.id}
                                            className="rounded-lg p-2 text-titulo-secundario hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                                            aria-label="Excluir abastecimento"
                                        >
                                            <IoTrashOutline className="size-5" aria-hidden />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-3">
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
                                <div className="flex flex-row justify-between text-titulo-primario text-base sm:text-lg gap-2">
                                    <p>{abastecimento.litros}<span className="text-titulo-secundario text-sm">L</span></p>
                                    <p className="text-destaque">R$ {abastecimento.valor}</p>
                                    <p>{abastecimento.km_atual}<span className="text-titulo-secundario text-sm">km</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                <div className="fixed bottom-6 sm:bottom-8 left-0 right-0 flex justify-center px-4 sm:px-6 pointer-events-none">
                    <button className="flex flex-row justify-center items-center gap-2 bg-destaque w-full max-w-[420px] text-fundo font-bold text-base sm:text-lg rounded-2xl p-4 shadow-[0_0_20px_rgba(57,255,20,0.3)] pointer-events-auto hover:scale-[1.02] transition-transform active:scale-95"
                    onClick={abrirModalNovo}
                    >
                        <IoAdd className="size-7"/>
                        Adicionar Abastecimento
                    </button>
                </div>
            </div>

            {modalIsOpen && (
                <ModalAbastecimento
                    onClose={fecharModal}
                    modalTitulo={editingId ? "Editar abastecimento" : "Novo abastecimento"}
                    salvarLabel={editingId ? "Salvar alterações" : "Salvar abastecimento"}
                    posto={posto}
                    setPosto={setPosto}
                    litros={litros}
                    setLitros={setLitros}
                    valor={valor}
                    setValor={setValor}
                    data={data}
                    setData={setData}
                    kmAtual={kmAtual}
                    setKmAtual={setKmAtual}
                    salvarAbastecimento={salvarAbastecimento}
                    isSaving={isSaving}
                />
            )}
        </div>
    )
}