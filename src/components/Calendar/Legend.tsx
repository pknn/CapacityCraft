const Legend = () => (
  <div className="mb-2 flex items-center justify-end gap-4">
    <div className="text-sm text-stone-500">Click to toggle working day</div>
    <div className="inline-flex items-center gap-2">
      <div className="size-4 rounded bg-stone-600" />
      <span>Non-working day</span>
    </div>
    <div className="inline-flex items-center gap-2">
      <div className="size-4 rounded bg-stone-300" />
      <span>Working day</span>
    </div>
  </div>
);

export default Legend;
