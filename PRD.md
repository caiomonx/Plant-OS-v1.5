# PRD - MED-SIM: Simulador de Plantão (Módulo Potássio)

## 1. VISÃO DO PRODUTO
Uma aplicação web progressiva (PWA) de simulação clínica de alta fidelidade ("Serious Game"). O usuário assume o papel de plantonista e deve estabilizar pacientes virtuais em cenários críticos.

A mecânica central é baseada em **Estratégia por Turnos**: o tempo de simulação é estático e só avança quando o usuário toma decisões clínicas. O foco pedagógico é treinar o raciocínio diagnóstico, a priorização de condutas e a gestão de tempo, eliminando a ansiedade motora de jogos em tempo real.

## 2. OBJETIVOS EDUCACIONAIS
1.  **Raciocínio Hipotético-Dedutivo:** Forçar o usuário a buscar dados ativamente (ex: o paciente chega sem monitorização; o usuário deve decidir monitorizar).
2.  **Gestão de Recursos Temporais:** Ensinar o "custo" de cada ação (ex: pedir um exame demora e o paciente piora nesse intervalo).
3.  **Segurança do Paciente:** Fixar protocolos de emergência (ex: Estabilização de membrana na Hipercalemia grave) através de feedback OSCE ao final do caso clínico.

## 3. PERSONAS
* **O Interno de Medicina:** Precisa praticar a ordem das prescrições sem colocar pacientes reais em risco.
* **O Residente R1:** Precisa refinar a agilidade de decisão e diagnóstico diferencial em cenários de "caixa preta".

## 4. JORNADA DO USUÁRIO (GAME LOOP)

### 4.1 Fase 1: O "Blind Start" (Início Cego)
* **Briefing:** O usuário recebe um cartão com a queixa principal. Ex: *"Homem, 68a, dialítico, trazido por parestesia e fraqueza."*
* **Cenário Inicial:**
    * **Ambiente:** Leito de emergência.
    * **Monitor:** **DESLIGADO** (Tela preta/cinza).
    * **Relógio:** `00:00`.
    * **Paciente:** Visível (Avatar estático), mas sem sinais vitais numéricos.
* **Desafio:** O usuário deve reconhecer a necessidade imediata de monitorização ou exame físico.

### 4.2 Fase 2: Turnos e Decisões
O usuário interage através de um menu de condutas. Cada clique representa uma aposta de tempo.

* **Ação:** "Monitorizar Paciente"
    * **Custo:** +2 min.
    * **Resultado:** O monitor liga. Revela FC: 38bpm, PA: 90/60.
* **Ação:** "Solicitar ECG"
    * **Custo:** +5 min.
    * **Resultado:** Popup exibe o traçado (ex: Onda T em Tenda).
* **Ação:** "Administrar Gluconato de Cálcio"
    * **Custo:** +3 min.
    * **Resultado:** "Infusão iniciada". (Internamente: risco de arritmia cai para 0%).

### 4.3 Fase 3: Desfecho e OSCE
O cenário encerra quando:
1.  O usuário clica em "Encerrar Caso / Alta / Internação" 
2.  Quando há um desfecho favorável ou desfavorável (e.g., óbito ou paciente estabilizado completamente).

**Tela de Feedback:**
* **Score:** 0 a 100%.
* **Linha do Tempo:** Gráfico mostrando a evolução do K+ versus as intervenções do usuário.
* **Checklist de Erros:**
    * ✅ Monitorizou em < 2 min.
    * ✅ Identificou alteração no ECG.
    * ❌ Demorou > 15 min para iniciar Cálcio.

## 5. FUNCIONALIDADES CORE

### 5.1 Dashboard de Simulação
* **Relógio Digital:** Exibe o tempo decorrido (`00:00` -> `00:05`).
* **Monitor Multiparamétrico:** Componente reativo que alterna entre estados "Off", "Connecting" e "On".
* **Log de Eventos (Chat):** Feed vertical que narra as ações ("Dr. solicitou acesso venoso...").

### 5.2 Menu de Ações (Categorizado)
* **Exames:** ECG, Solicitar Exames Séricos (eletrólitos, função renal, gasometria, Glicose, Magnésio, Cálcio, Potássio etc), Diálise (Com delay de resultado).
* **Procedimentos:** Monitorização, Acesso Venoso, Sondagem.
* **Drogas:** Gluconato de Cálcio 10% (Ampola de 10ml), Solução Polarizante (Insulina + Glicose), Sulfato de Magnésio, Furosemida, Salbutamol, Sorcal, Lokelma.
* **Fluidos:** Solução Salina (SF 0,9%, SF 0,45%, SF 20%), Solução Glicosada (SG 5%, SG50%), Ringer Lactato.

### 5.3 Simulador Fisiológico (Invisible Engine)
* Algoritmo que roda a cada "turno" para atualizar os parâmetros vitais baseados na fisiopatologia do cenário (ex: Se K+ > 8.0 e sem tratamento -> induz Fibrilação Ventricular).

## 6. REQUISITOS NÃO-FUNCIONAIS
* **Mobile First:** UI projetada para polegares (botões grandes na parte inferior).
* **Zero Latency:** As trocas de turno devem ser instantâneas no frontend.
* **Privacidade:** Não armazena dados de pacientes reais. Apenas logs de performance do aluno.

## 7. INDICADORES DE SUCESSO
* Taxa de conclusão dos cenários ( pontuação alta na tela de feedback).
* Melhora na pontuação média do usuário ao repetir o mesmo cenário.