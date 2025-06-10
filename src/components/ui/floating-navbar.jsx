// Utility function to combine classes
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const FloatingNav = ({ navItems, className }) => {

  return (
   
      <div
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-10 py-5 items-center justify-center space-x-4 border-sky-950/[0.6] bg-black/[0.6] backdrop-blur-sm border-sky-100",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="!cursor-pointer text-sm">{navItem.name}</span>
          </a>
        ))}
        </div>
  );
};
