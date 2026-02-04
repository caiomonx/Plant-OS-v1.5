import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, TrendingUp } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';

// Mock Data
const historyData = [
    {
        id: 1,
        date: '02 Fev',
        category: 'Distúrbios Hidroeletrolíticos',
        module: 'Distúrbios do Sódio',
        score: 85,
        skills: { anamnese: 90, exameFisico: 80, diagnostico: 85, conduta: 80, prescricao: 90, comunicacao: 85 }
    },
    {
        id: 2,
        date: '07 Fev',
        category: 'Distúrbios Hidroeletrolíticos',
        module: 'Distúrbios do Potássio',
        score: 60,
        skills: { anamnese: 70, exameFisico: 60, diagnostico: 65, conduta: 50, prescricao: 60, comunicacao: 55 }
    },
    {
        id: 3,
        date: '09 Fev',
        category: 'Cardiologia',
        module: 'ECG Básico',
        score: 95,
        skills: { anamnese: 95, exameFisico: 90, diagnostico: 100, conduta: 95, prescricao: 90, comunicacao: 100 }
    },
    {
        id: 4,
        date: '12 Fev',
        category: 'Distúrbios Hidroeletrolíticos',
        module: 'Distúrbios do Sódio',
        score: 92,
        skills: { anamnese: 95, exameFisico: 90, diagnostico: 90, conduta: 95, prescricao: 95, comunicacao: 85 }
    },
];

export default function StatsPage() {
    const navigate = useNavigate();
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [moduleFilter, setModuleFilter] = useState('Todos');

    // Derive unique categories and modules for filters
    const categories = useMemo(() => ['Todas', ...new Set(historyData.map(d => d.category))], []);
    const modules = useMemo(() => {
        let filtered = historyData;
        if (categoryFilter !== 'Todas') {
            filtered = filtered.filter(d => d.category === categoryFilter);
        }
        return ['Todos', ...new Set(filtered.map(d => d.module))];
    }, [categoryFilter]);

    // Filter Data
    const filteredData = useMemo(() => {
        return historyData.filter(item => {
            const matchCategory = categoryFilter === 'Todas' || item.category === categoryFilter;
            const matchModule = moduleFilter === 'Todos' || item.module === moduleFilter;
            return matchCategory && matchModule;
        });
    }, [categoryFilter, moduleFilter]);

    // Calculate Average Skills for Radar Chart
    const skillsData = useMemo(() => {
        if (filteredData.length === 0) return [];

        const skillKeys = ['anamnese', 'exameFisico', 'diagnostico', 'conduta', 'prescricao', 'comunicacao'];
        const totals = skillKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

        filteredData.forEach(item => {
            skillKeys.forEach(key => {
                totals[key] += item.skills[key];
            });
        });

        return skillKeys.map(key => ({
            subject: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(), // Format labels
            A: Math.round(totals[key] / filteredData.length),
            fullMark: 100
        }));
    }, [filteredData]);

    // Summary Metrics
    const averageScore = useMemo(() => {
        if (filteredData.length === 0) return 0;
        return Math.round(filteredData.reduce((acc, curr) => acc + curr.score, 0) / filteredData.length);
    }, [filteredData]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-sm opacity-95">
                    <p className="font-bold border-b border-slate-600 pb-1 mb-1">{label}</p>
                    <p className="text-teal-300 font-semibold">{payload[0].value}% OSCE Score</p>
                    <p className="text-slate-300 text-xs mt-1">{payload[0].payload.module}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/modulos')}
                            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="text-teal-500" size={28} />
                                Desempenho no Plantão
                            </h1>
                            <p className="text-slate-500">Acompanhe sua evolução e métricas detalhadas.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setModuleFilter('Todos'); // Reset module filter on category change
                            }}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <select
                            value={moduleFilter}
                            onChange={(e) => setModuleFilter(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm"
                        >
                            {modules.map(mod => <option key={mod} value={mod}>{mod}</option>)}
                        </select>
                    </div>
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Evolution Chart (Full Width on Mobile, 2/3 on Desktop) */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        Histórico de Notas (OSCE)
                    </h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="score" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={40} activeBar={{ fill: '#0d9488' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skills Radar */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <h2 className="text-lg font-bold text-slate-800 mb-2 w-full text-left">Raio-X de Competências</h2>
                    <div className="h-80 w-full max-w-md">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Média"
                                    dataKey="A"
                                    stroke="#0d9488"
                                    strokeWidth={2}
                                    fill="#14b8a6"
                                    fillOpacity={0.4}
                                />
                                <Tooltip wrapperClassName="text-sm font-semibold text-slate-700" />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center gap-6">
                    <div className="text-center p-6 bg-slate-50 rounded-xl">
                        <div className="flex justify-center mb-2">
                            <Award className="text-amber-500" size={40} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Média Geral</p>
                        <p className="text-4xl font-bold text-slate-900">{averageScore}<span className="text-xl text-slate-400">%</span></p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-slate-500 text-sm">Casos Realizados</span>
                            <span className="font-bold text-slate-900">{filteredData.length}</span>
                        </div>
                        <div className="flex justify-between items-center px-2">
                            <span className="text-slate-500 text-sm">Melhor Desempenho</span>
                            <span className="font-bold text-teal-600">
                                {filteredData.length > 0 ? Math.max(...filteredData.map(d => d.score)) : 0}%
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button disabled className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-lg cursor-not-allowed">
                            Ver Relatório Detalhado
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
