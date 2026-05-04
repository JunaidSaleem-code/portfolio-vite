import { LuGraduationCap, LuAward } from "react-icons/lu";

const TYPE_ICON = {
  education: LuGraduationCap,
  recognition: LuAward,
};

const Achievements = ({ items = [] }) => {
  const education = items.filter((i) => i.type === "education");
  const recognition = items.filter((i) => i.type === "recognition");

  if (!education.length && !recognition.length) return null;

  return (
    <section className="py-20 px-4" id="achievements">
      <h1 className="heading text-white">
        Education & <span className="text-purple-400">Recognition</span>
      </h1>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
        {education.length > 0 && (
          <Group title="Education" icon={LuGraduationCap} items={education} />
        )}
        {recognition.length > 0 && (
          <Group title="Recognition" icon={LuAward} items={recognition} />
        )}
      </div>
    </section>
  );
};

const Group = ({ title, icon: Icon, items }) => (
  <div>
    <div className="mb-4 flex items-center gap-2 text-purple-300">
      <Icon className="h-5 w-5" />
      <h2 className="text-sm uppercase tracking-widest">{title}</h2>
    </div>
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item._id || item.title}
          className="rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-purple-400/40"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-white">{item.title}</h3>
            {item.period && (
              <span className="shrink-0 text-xs text-zinc-500">{item.period}</span>
            )}
          </div>
          {item.organization && (
            <p className="mt-1 text-sm text-purple-300">{item.organization}</p>
          )}
          {item.description && (
            <p className="mt-3 text-sm text-zinc-400">{item.description}</p>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Achievements;
