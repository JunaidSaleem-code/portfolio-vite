"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PinContainer } from "./ui/3d-pin";
import { FaLocationArrow } from "react-icons/fa";

const RecentProjects = ({ items = [] }) => {
  const [activeTag, setActiveTag] = useState(null);

  const allTags = useMemo(() => {
    const set = new Set();
    items.forEach((p) => (p.tags || []).forEach((t) => t && set.add(t)));
    return Array.from(set);
  }, [items]);

  const filtered = activeTag
    ? items.filter((p) => (p.tags || []).includes(activeTag))
    : items;

  return (
    <div className="py-20" id="projects">
      <h1 className="heading text-zinc-900 dark:text-white">
        A small selection of{" "}
        <span className="text-purple-400">Recent Projects</span>
      </h1>

      {allTags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 px-4">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={
              "rounded-full border px-3 py-1 text-xs transition " +
              (activeTag === null
                ? "border-purple-400 bg-purple-500/20 text-purple-700 dark:text-purple-200"
                : "border-zinc-300 text-zinc-600 hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/30 dark:hover:text-white")
            }
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={
                "rounded-full border px-3 py-1 text-xs transition " +
                (activeTag === tag
                  ? "border-purple-400 bg-purple-500/20 text-purple-700 dark:text-purple-200"
                  : "border-zinc-300 text-zinc-600 hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/30 dark:hover:text-white")
              }
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center p-4 gap-x-24 gap-y-8 mt-10">
        {filtered.map((project) => {
          const { _id, id, title, slug, description, image, techIcons = [], link } = project;
          const detailHref = slug ? `/projects/${slug}` : null;

          const cardInner = (
            <PinContainer title={link} href={link}>
              <div className="relative flex items-center justify-center sm:w-[570px] w-[80vw] overflow-hidden sm:h-[40vh] h-[30vh]  mb-10 border border-white/[0.2]">
                {image && (
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width: 640px) 570px, 80vw"
                    className="object-cover"
                  />
                )}
              </div>
              <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {title}
              </h1>

              <p className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2">
                {description}
              </p>

              <div className="flex items-center justify-center mt-7 mb-3">
                <div className="flex items-center">
                  {techIcons.map((icon, index) => (
                    <div
                      key={`${icon}-${index}`}
                      className="border border-white/[0.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center relative"
                      style={{ transform: `translateX(${5 * index * 2}px)` }}
                    >
                      <Image src={icon} alt="" width={40} height={40} className="p-2" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <p className="flex  lg:text-xl md:text-xs text-sm text-purple-400">
                  {detailHref ? "Read case study" : "Check Live Site"}
                </p>
                <FaLocationArrow className="ms-3" color="#CBACF9" />
              </div>
            </PinContainer>
          );

          return (
            <div
              key={_id || id}
              className="sm:h-[41rem] h-[32rem] lg:min-h-[32.5rem] flex items-center justify-center sm:w-[570px] w-[80vw] text-zinc-900 dark:text-blue-50"
            >
              {detailHref ? <Link href={detailHref}>{cardInner}</Link> : cardInner}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500">No projects match this filter.</p>
        )}
      </div>
    </div>
  );
};

export default RecentProjects;
