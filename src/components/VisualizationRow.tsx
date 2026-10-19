type VisualizationRowProps = {
  number: string;
  question: string;
  type: string;
  href: string;
};

export default function VisualizationRow({
  number,
  question,
  type,
  href,
}: VisualizationRowProps) {
  return (
    <a
      href={href}
      className="group flex items-start gap-4 border-b border-ink/20 px-3 py-7 text-ink transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-4 md:items-center md:gap-8 md:px-4 md:py-9"
    >
      <span className="pt-1 font-mono text-xs text-ink/60">{number}</span>

      <h2 className="flex-1 text-xl leading-snug font-medium tracking-tight md:text-3xl">
        {question}
      </h2>

      <span className="flex shrink-0 items-center gap-3 pt-1 md:border-l md:border-ink/20 md:py-2 md:pl-8">
        <span className="hidden font-mono text-xs tracking-wider uppercase sm:inline">
          {type}
        </span>

        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      </span>
    </a>
  );
}
