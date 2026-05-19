export const LoadingState = ({ label = "Loading..." }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300 shadow-2xl shadow-slate-950/20 backdrop-blur">
      {label}
    </div>
  );
};
