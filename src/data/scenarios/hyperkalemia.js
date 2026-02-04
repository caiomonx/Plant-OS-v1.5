export const scenarioData = {
    initialState: {
        patientName: "João da Silva",
        age: 68,
        weight: "70kg",
        history: "Homem, 68a, dialítico, trazido por parestesia e fraqueza.",
        vitals: {
            hr: 38, // bpm
            bp: "90/60", // mmHg
            rr: 22, // rpm
            sah: 94, // %
            temp: 37.2, // C
            rhythm: "Sinus Bradycardia / Junctional"
        },
        labs: {
            available: false,
            k: 7.2,
            mg: 1.8,
            ph: 7.32,
            creatinina: 1.5
        },
        status: {
            isMonitored: false,
            hasIVAccess: false,
            isStable: false
        },
        timeElapsed: 0
    },
    availableActions: [
        // --- EXAMES ---
        {
            id: "exam_ecg",
            label: "Solicitar ECG",
            type: "Exames",
            icon: "ecg",
            cost: 7,
            requiresIV: false,
            resultLog: "ECG realizado. Traçado disponível para análise."
        },
        {
            id: "exam_labs",
            label: "Solicitar Exames Séricos",
            type: "Exames",
            icon: "syringe",
            cost: 40,
            requiresIV: true,
            triggersLabs: true,
            resultLog: "Coleta de sangue realizada. Amostras enviadas ao laboratório."
        },
        {
            id: "exam_dialysis",
            label: "Solicitar Diálise de Urgência",
            type: "Exames",
            icon: "blood",
            cost: 60,
            requiresIV: false,
            resultLog: "Nefrologia acionada. Equipe preparando equipamento de hemodiálise."
        },

        // --- PROCEDIMENTOS ---
        {
            id: "proc_monitor",
            label: "Monitorizar Paciente",
            type: "Procedimentos",
            icon: "monitor",
            cost: 2,
            requiresIV: false,
            triggersVitals: true,
            resultLog: "Eletrodos posicionados. Monitor multiparamétrico ligado."
        },
        {
            id: "proc_iv_access",
            label: "Estabelecer Acesso Venoso",
            type: "Procedimentos",
            icon: "syringe",
            cost: 7,
            requiresIV: false,
            resultLog: "Acesso venoso periférico calibroso garantido em MSE."
        },
        {
            id: "proc_sonda",
            label: "Sondagem Vesical",
            type: "Procedimentos",
            icon: "urine",
            cost: 12,
            requiresIV: false,
            resultLog: "Sondagem vesical de demora realizada. Drenagem de urina clara."
        },

        // --- MEDICAMENTOS (Drogas) ---
        {
            id: "drug_calcium",
            label: "Gluconato de Cálcio 10% (10ml)",
            type: "Drogas",
            icon: "syringe",
            cost: 5,
            requiresIV: true,
            resultLog: "Infusão de Gluconato de Cálcio iniciada. Estabilização de membrana em curso."
        },
        {
            id: "drug_polarizing",
            label: "Solução Polarizante (Insulina + Glicose)",
            type: "Drogas",
            icon: "syringe",
            cost: 10,
            requiresIV: true,
            resultLog: "Solução Polarizante em infusão IV. Monitorando glicemia capilar."
        },
        {
            id: "drug_magnesium",
            label: "Sulfato de Magnésio",
            type: "Drogas",
            icon: "syringe",
            cost: 3,
            requiresIV: true,
            resultLog: "Sulfato de Magnésio administrado em bólus lento."
        },
        {
            id: "drug_furosemide",
            label: "Furosemida",
            type: "Drogas",
            icon: "syringe",
            cost: 3,
            requiresIV: true,
            resultLog: "Furosemida administrada IV."
        },
        {
            id: "drug_salbutamol",
            label: "Salbutamol (Inalatório)",
            type: "Drogas",
            icon: "wind",
            cost: 15,
            requiresIV: false,
            resultLog: "Nebulização contínua com Salbutamol iniciada."
        },
        {
            id: "drug_sorcal",
            label: "Sorcal (Poliestireno Sulfonato)",
            type: "Drogas",
            icon: "pill",
            cost: 5,
            requiresIV: false,
            resultLog: "Sorcal administrado via oral."
        },
        {
            id: "drug_lokelma",
            label: "Lokelma (Ciclossilicato de Zircônio)",
            type: "Drogas",
            icon: "pill",
            cost: 5,
            requiresIV: false,
            resultLog: "Lokelma administrado e ingerido pelo paciente."
        },

        // --- FLUIDOS ---
        {
            id: "fluid_sf09",
            label: "SF 0,9%",
            type: "Fluidos",
            icon: "water",
            cost: 5,
            requiresIV: true,
            resultLog: "Infusão de SF 0.9% aberta em livre fluxo."
        },
        {
            id: "fluid_sf045",
            label: "SF 0,45%",
            type: "Fluidos",
            icon: "water",
            cost: 5,
            requiresIV: true,
            resultLog: "Infusão de SF 0.45% iniciada."
        },
        {
            id: "fluid_sf20",
            label: "SF 20%",
            type: "Fluidos",
            icon: "water",
            cost: 5,
            requiresIV: true,
            resultLog: "Infusão de Salina Hipertônica 20% iniciada."
        },
        {
            id: "fluid_sg5",
            label: "Soro Glicosado 5%",
            type: "Fluidos",
            icon: "water",
            cost: 5,
            requiresIV: true,
            resultLog: "Soro Glicosado 5% em manutenção."
        },
        {
            id: "fluid_sg50",
            label: "Glicose 50% (Ampola)",
            type: "Fluidos",
            icon: "water",
            cost: 5,
            requiresIV: true,
            resultLog: "Bólus de Glicose 50% administrado IV."
        },
        {
            id: "fluid_ringer",
            label: "Ringer Lactato",
            type: "Fluidos",
            icon: "water",
            cost: 5,
            requiresIV: true,
            resultLog: "Infusão de Ringer Lactato iniciada."
        }
    ]
};
