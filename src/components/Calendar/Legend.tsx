const Legend = () => (
  <div>
    <div className="flex items-baseline justify-end gap-4 font-mono text-xs font-medium text-stone-500">
      <div className="text-sm text-stone-500">Click to cycle day type</div>
      <span>G - Global</span>
      <span>P - Personal</span>
    </div>
    <div className="mb-2 flex items-center justify-end gap-4">
      <div className="inline-flex items-center gap-2">
        <div className="size-4 rounded bg-stone-300" />
        <span>
          Full Working day{' '}
          <span className="font-mono text-xs text-stone-600">(G&amp;P)</span>
        </span>
      </div>
      <div className="inline-flex items-center gap-2">
        <div className="size-4 rounded bg-stone-500" />
        <span>
          Half Working day{' '}
          <span className="font-mono text-xs text-stone-600">(P)</span>
        </span>
      </div>
      <div className="inline-flex items-center gap-2">
        <div className="size-4 rounded bg-stone-700" />
        <span>
          Off day{' '}
          <span className="font-mono text-xs text-stone-600">(G&amp;P)</span>
        </span>
      </div>
    </div>
  </div>
);

export default Legend;
