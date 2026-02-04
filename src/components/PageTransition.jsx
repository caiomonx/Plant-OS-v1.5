import { motion } from 'framer-motion';

const variants = {
    initial: {
        y: '100%', // A nova página começa totalmente fora (em baixo)
        opacity: 1,
        scale: 1,
        zIndex: 20 // Garante que a página que entra fique POR CIMA
    },
    animate: {
        y: '0%',
        opacity: 1,
        scale: 1,
        zIndex: 20,
        transition: {
            duration: 0.5, // Um pouco mais longo para dar tempo de sentir a suavidade
            ease: [0.22, 1, 0.36, 1] // A curva mágica "easeOutQuint" (Estilo iOS)
        }
    },
    exit: {
        y: '-20%', // A página antiga sobe um pouquinho (efeito parallax)
        scale: 0.95, // Encolhe levemente
        opacity: 0.0, // Escurece até sumir
        zIndex: 0, // Fica por baixo
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            // Removemos o "blur" e usamos apenas transformações aceleradas por GPU
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                overflowY: 'auto', // O scroll fica DENTRO da página animada
                overflowX: 'hidden',
                background: '#020617' // bg-slate-950 (Evita piscar branco no fundo)
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
