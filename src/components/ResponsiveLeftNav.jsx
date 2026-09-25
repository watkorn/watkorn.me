import React, { useState, useEffect } from "react";

/**
 * ResponsiveLeftNav
 * - Sticky บน desktop (lg+) คำนวณ headerHeight อัตโนมัติ
 * - Mobile: ปุ่มลอย + drawer
 */
export default function ResponsiveLeftNav({ items = [] }) {
  const [open, setOpen] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  // ตรวจสอบ breakpoint และ header height
  useEffect(() => {
    const updateLayout = () => {
      setIsLg(window.innerWidth >= 1024);
      const hdr = document.querySelector("header");
      setHeaderHeight(hdr ? hdr.offsetHeight : 0);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("load", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("load", updateLayout);
    };
  }, []);

  // ปิด mobile drawer เมื่อเป็น desktop
  useEffect(() => {
    if (isLg) setOpen(false);
  }, [isLg]);

  const scrollToIdWithOffset = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = headerHeight + 12;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="leftnav-container hidden lg:block" aria-hidden={!isLg}>
        <div
          className="leftnav-sticky"
          style={{ top: headerHeight + 12, maxHeight: `calc(100vh - ${headerHeight + 12}px)` }}
        >
          <nav className="leftnav-nav">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToIdWithOffset(item.id)}
                className="leftnav-btn"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile floating button */}
      <button
        className="leftnav-mobile-btn lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      <div
        className={`leftnav-overlay ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        className={`leftnav-drawer ${open ? "open" : "closed"}`}
        style={{ paddingTop: headerHeight }}
      >
        <div className="leftnav-drawer-header">
          <h3 className="text-lg font-semibold">Menu</h3>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="leftnav-drawer-nav">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setOpen(false);
                setTimeout(() => scrollToIdWithOffset(item.id), 220);
              }}
              className="leftnav-btn"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
