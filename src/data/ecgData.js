export const ecgPatterns = {
    // ESTÁGIO 0: Normal (K+ 3.5 - 5.0)
    // Ritmo Sinusal, QRS estreito, T normal
    0: {
        DI: "M 0 50 L 20 50 C 25 45, 30 45, 35 50 L 40 50 L 45 60 L 50 10 L 55 65 L 60 50 L 70 50 C 80 40, 90 40, 100 50 L 120 50",
        DII: "M 0 50 L 20 50 C 25 40, 30 40, 35 50 L 40 50 L 45 60 L 50 5 L 55 65 L 60 50 L 70 50 C 80 35, 90 35, 100 50 L 120 50",
        V1: "M 0 50 L 20 50 C 25 45, 30 45, 35 50 L 40 50 L 45 55 L 50 80 L 55 45 L 60 50 L 70 50 C 80 55, 90 55, 100 50 L 120 50"
    },

    // ESTÁGIO 1: Leve (K+ 5.5 - 6.5)
    // "Peaked T" - Onda T alta e pontiaguda (em tenda), base estreita.
    // DII e V1 mostram melhor essa alteração.
    1: {
        DI: "M 0 50 L 20 50 C 25 45, 30 45, 35 50 L 40 50 L 45 60 L 50 10 L 55 65 L 60 50 L 70 50 L 80 20 L 90 50 L 120 50",
        DII: "M 0 50 L 20 50 C 25 40, 30 40, 35 50 L 40 50 L 45 60 L 50 5 L 55 65 L 60 50 L 70 50 L 85 5 L 100 50 L 120 50", // T gigante aqui
        V1: "M 0 50 L 20 50 C 25 45, 30 45, 35 50 L 40 50 L 45 55 L 50 80 L 55 45 L 60 50 L 70 50 L 85 20 L 100 50 L 120 50"
    },

    // ESTÁGIO 2: Moderado (K+ 6.5 - 7.5)
    // "Wide QRS" - Alargamento do QRS, achatamento da onda P (PR aumenta).
    // A T continua alta.
    2: {
        DI: "M 0 50 L 15 50 C 20 48, 35 48, 40 50 L 45 50 L 50 60 L 60 20 L 70 65 L 75 50 L 85 50 L 95 25 L 105 50 L 130 50",
        DII: "M 0 50 L 15 50 C 20 48, 35 48, 40 50 L 45 50 L 50 60 L 60 15 L 70 65 L 75 50 L 85 50 L 100 10 L 115 50 L 130 50",
        V1: "M 0 50 L 15 50 C 20 48, 35 48, 40 50 L 45 50 L 50 55 L 60 80 L 70 45 L 75 50 L 85 50 L 100 25 L 115 50 L 130 50"
    },

    // ESTÁGIO 3: Severo (K+ 7.5 - 8.5)
    // "No P Wave" - Onda P desaparece. QRS muito alargado e bizarro.
    // Ritmo Juncional ou Idioventricular. Fusão QRS-T começa.
    3: {
        DI: "M 0 50 L 40 50 L 50 65 L 70 30 L 90 65 L 100 50 L 110 40 L 120 50 L 150 50",
        DII: "M 0 50 L 40 50 L 50 70 L 75 20 L 100 70 L 110 50 L 125 30 L 140 50 L 160 50",
        V1: "M 0 50 L 40 50 L 50 60 L 70 85 L 90 60 L 100 50 L 110 40 L 120 50 L 150 50"
    },

    // ESTÁGIO 4: Crítico/Pré-PCR (K+ > 8.5)
    // "Sine Wave" - Onda senoidal. QRS e T se fundem numa onda ondulatória lenta.
    // Iminência de assistolia ou FV.
    4: {
        DI: "M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50",
        DII: "M 0 50 Q 30 5, 60 50 Q 90 95, 120 50 Q 150 5, 180 50 Q 210 95, 240 50",
        V1: "M 0 50 Q 25 80, 50 50 Q 75 20, 100 50 Q 125 80, 150 50 Q 175 20, 200 50"
    }
};
