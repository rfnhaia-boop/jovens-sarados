export function Tau({ className, circle = false }: { className?: string; circle?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Tau — símbolo franciscano"
      fill="none"
      stroke="currentColor"
    >
      {circle && (
        <circle cx="100" cy="100" r="92" strokeWidth="7" />
      )}

      {/* Chama do Espírito Santo */}
      <path
        d="M106 30c-1-4 1-9 5-13c-4 3-6 7-5 11c-2-3-3-7-2-10c-2 5 0 10 3 13c1 1 1 3 0 4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
      />

      {/* Nó / cordão no topo */}
      <path
        d="M98 44c-4 0-7 2-7 5c0 4 4 6 8 5c4-1 6-3 5-6c-1-2-3-4-6-4z"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Tau — contorno orgânico estilo mão livre */}
      {/* Braço horizontal — pontas caem como mangas de hábito */}
      <path
        d="M34 62 C34 56 40 52 50 52 L150 52 C160 52 166 56 166 62
           L166 72 C166 80 158 88 146 94 C138 98 128 100 118 100
           L82 100
           C72 100 62 98 54 94 C42 88 34 80 34 72 Z"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Haste vertical — curva orgânica, arredondada embaixo */}
      <path
        d="M82 100 L82 152 C82 164 88 174 100 178
           C112 174 118 164 118 152 L118 100"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
