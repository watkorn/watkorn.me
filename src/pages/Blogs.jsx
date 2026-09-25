// src/pages/Blogs.jsx
import React from "react";
import PageWrapper from "../components/PageWrapper";
import GroupedIndex from "../components/GroupedIndex";
import { sortedYears } from "../data/blogs";

// ในแต่ละปีแสดงโพสต์ใหม่สุดก่อน
const groups = sortedYears.map(({ year, data }) => ({
  key: String(year),
  label: String(year),
  unit: "post",
  items: [...data].reverse(),
}));

export default function Blogs() {
  return (
    <PageWrapper title="Blogs" description="CTF writeups, notes, and things I broke on purpose.">
      <header className="page-head">
        <h1 className="page-head__title">Blogs</h1>
        <p className="page-head__lede">Writeups, notes, and things I broke on purpose. Spoilers inside, obviously.</p>
      </header>
      <GroupedIndex groups={groups} basePath="/blogs" idPrefix="year" emptyText="No posts yet. The first writeup is loading…" />
    </PageWrapper>
  );
}
