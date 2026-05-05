export const abastecimentos = [
  {
    id: "1",
    data: "2026-04-20T08:30:00Z",
    posto: "Posto Shell - Ana Costa",
    kmAtual: 15200,
    litros: 12.0,
    valorTotal: 67.20, // Simulando gasolina a R$ 5,60
    consumoKml: null   // O primeiro registro nunca tem consumo, pois não sabemos o KM anterior
  },
  {
    id: "2",
    data: "2026-05-01T18:45:00Z",
    posto: "Posto Ipiranga - Gonzaga",
    kmAtual: 15560,    // Rodou 360 km
    litros: 10.5,
    valorTotal: 59.85, // Simulando gasolina a R$ 5,70
    consumoKml: 34.28  // (15560 - 15200) / 10.5
  },
  {
    id: "3",
    data: "2026-05-05T09:15:00Z",
    posto: "Posto BR - Av. Praia",
    kmAtual: 15880,    // Rodou 320 km
    litros: 9.8,
    valorTotal: 54.88,
    consumoKml: 32.65
  }
];